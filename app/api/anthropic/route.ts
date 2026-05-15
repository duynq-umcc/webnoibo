import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `Bạn là trợ lý chuyên gia về văn bản pháp luật y tế Việt Nam. Bạn có kiến thức chuyên sâu về:
- Luật BHYT và các nghị định, thông tư hướng dẫn
- Quy trình khám chữa bệnh BHYT
- Thanh toán và giá dịch vụ y tế
- Danh mục thuốc, vật tư y tế BHYT chi trả
- Quy chế chuyên môn và quy trình nội bộ

Nguyên tắc trả lời:
1. Luôn dẫn nguồn văn bản cụ thể (số hiệu, ngày ban hành, điều khoản) khi có thể
2. Trả lời bằng tiếng Việt, ngắn gọn và chính xác
3. Nếu không chắc chắn, hãy nói rõ và gợi ý tra cứu văn bản gốc
4. Khi trả lời, đánh dấu các đoạn liên quan đến văn bản cụ thể bằng citation format: [doc:ID]
5. Ưu tiên thông tin cập nhật nhất (2024-2026)`;

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages, max_tokens = 800 } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens,
            system: SYSTEM_PROMPT,
            messages,
            stream: true,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `API error: ${response.status}`, detail: error })}\n\n`));
          controller.close();
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const raw = line.slice(6);
              if (raw === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }
              try {
                const event = JSON.parse(raw);
                if (event.type === "content_block_delta") {
                  const text = event.delta?.text ?? "";
                  if (text) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text })}\n\n`));
                  }
                } else if (event.type === "content_block_start") {
                  const blockType = event.content_block?.type ?? "text";
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "block_start", blockType })}\n\n`));
                } else if (event.type === "message_delta" || event.type === "message_stop") {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: event.type })}\n\n`));
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }

        if (buffer) {
          if (buffer.startsWith("data: ")) {
            const raw = buffer.slice(6);
            if (raw !== "[DONE]") {
              try {
                const event = JSON.parse(raw);
                if (event.type === "content_block_delta") {
                  const text = event.delta?.text ?? "";
                  if (text) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text })}\n\n`));
                  }
                }
              } catch {
                // skip
              }
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
