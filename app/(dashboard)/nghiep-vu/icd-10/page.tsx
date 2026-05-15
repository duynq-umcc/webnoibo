"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bot, DatabaseSearch, Columns2, ExternalLink, RefreshCw, ChevronDown, ChevronUp, Info, Copy, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";

const IFRAME_TIMEOUT_MS = 4000;

const TAB_META = [
  { value: "chatbot", label: "Chatbot ICD" },
  { value: "tra-cuu", label: "Tra cứu đầy đủ" },
  { value: "song-ngu", label: "Song ngữ VI / EN" },
] as const;

type TabValue = (typeof TAB_META)[number]["value"];

const SOURCE_CARDS = [
  {
    id: "chatbot" as TabValue,
    icon: Bot,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950",
    title: "Chatbot ICD",
    desc: "Hỏi bằng tiếng Việt tự nhiên — AI gợi ý mã ICD phù hợp",
    url: "https://icd.kcb.vn/chatbot/icd-10",
    tags: ["AI chatbot", "Tiếng Việt"],
  },
  {
    id: "tra-cuu" as TabValue,
    icon: DatabaseSearch,
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-50 dark:bg-green-950",
    title: "Tra cứu ICD-10",
    desc: "Toàn bộ danh mục ICD-10, tìm theo mã hoặc tên bệnh",
    url: "https://icd.kcb.vn/icd-10/icd10",
    tags: ["Danh mục đầy đủ", "Tìm mã"],
  },
  {
    id: "song-ngu" as TabValue,
    icon: Columns2,
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-950",
    title: "ICD-10 Song ngữ",
    desc: "Đối chiếu thuật ngữ Việt – Anh cho hồ sơ quốc tế",
    url: "https://icd.kcb.vn/icd-10/icd10-dual",
    tags: ["Việt / Anh", "Quốc tế"],
  },
];

const NGINX_CONFIG = `# Nginx reverse proxy for icd.kcb.vn
# Place in /etc/nginx/conf.d/icd-proxy.conf

server {
    listen 443 ssl;
    server_name icd-internal.your-clinic.local;

    # SSL configuration (use your clinic's cert)
    ssl_certificate     /etc/ssl/certs/clinic.crt;
    ssl_certificate_key /etc/ssl/private/clinic.key;

    location / {
        proxy_pass         https://icd.kcb.vn;
        proxy_set_header   Host            icd.kcb.vn;
        proxy_set_header   X-Real-IP       $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        # Required for some JS apps
        proxy_set_header Accept-Encoding "";

        # Timeouts
        proxy_connect_timeout 30s;
        proxy_read_timeout    60s;

        # Embedding support
        add_header X-Frame-Options "ALLOWALL" always;
        proxy_hide_header X-Frame-Options;
    }
}`;

const ANTHROPIC_SYSTEM_PROMPT = `Bạn là trợ lý chuyên gia về mã ICD-10 (International Classification of Diseases, 10th Revision) của Bộ Y tế Việt Nam.

Nhiệm vụ: Giúp nhân viên y tế tra cứu và xác định đúng mã ICD-10 phù hợp với chẩn đoán lâm sàng.

Nguyên tắc:
1. Khi được hỏi triệu chứng/chẩn đoán, đề xuất mã ICD-10 cùng tên bệnh đầy đủ
2. Ưu tiên mã cụ thể nhất (5 ký tự) khi có thể
3. Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu
4. Nếu không chắc chắn, gợi ý tra cứu thêm tại icd.kcb.vn
5. Mỗi câu trả lời bao gồm: mã ICD-10, tên bệnh (tiếng Việt), ghi chú lâm sàng nếu cần`;

export default function ICD10Page() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabValue>("chatbot");
  const [selectedCard, setSelectedCard] = useState<TabValue>("chatbot");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [showProxyTip, setShowProxyTip] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const iframeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeCard = SOURCE_CARDS.find((c) => c.id === activeTab) ?? SOURCE_CARDS[0];

  const logAudit = useCallback(
    async (tab: TabValue) => {
      if (!user?.uid) return;
      try {
        await addDoc(collection(db, "auditLogs"), {
          action: "view_icd",
          resource: "icd-10",
          tab: tab,
          uid: user.uid,
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Failed to write audit log:", err);
      }
    },
    [user?.uid]
  );

  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
    setSelectedCard(tab);
    setIframeLoaded(false);
    setIframeError(false);
    logAudit(tab);
  };

  const handleCardSelect = (id: TabValue) => {
    setActiveTab(id);
    setSelectedCard(id);
    setIframeLoaded(false);
    setIframeError(false);
    logAudit(id);
  };

  useEffect(() => {
    if (iframeTimerRef.current) clearTimeout(iframeTimerRef.current);
    setIframeLoaded(false);
    setIframeError(false);

    iframeTimerRef.current = setTimeout(() => {
      if (!iframeLoaded) {
        setIframeError(true);
      }
    }, IFRAME_TIMEOUT_MS);

    return () => {
      if (iframeTimerRef.current) clearTimeout(iframeTimerRef.current);
    };
  }, [activeTab]);

  const handleIframeLoad = () => {
    if (iframeTimerRef.current) clearTimeout(iframeTimerRef.current);
    setIframeLoaded(true);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  const handleOpenExternal = () => {
    window.open(activeCard.url, "_blank", "noopener,noreferrer");
  };

  const handleAiQuery = async () => {
    if (!aiQuery.trim() || aiLoading) return;
    const userMsg = { role: "user" as const, content: aiQuery.trim() };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiQuery("");
    setAiLoading(true);

    try {
      const messages = [...aiMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, max_tokens: 600, system: ANTHROPIC_SYSTEM_PROMPT }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      setAiMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const assistantIdx = (await new Promise<number>((resolve) => {
        setAiMessages((prev) => {
          resolve(prev.length - 1);
          return prev;
        });
      }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.slice(6);
            if (raw === "[DONE]") continue;
            try {
              const event = JSON.parse(raw);
              if (event.type === "text" && event.text) {
                fullText += event.text;
                setAiMessages((prev) => {
                  const updated = [...prev];
                  if (updated[assistantIdx]) {
                    updated[assistantIdx] = { role: "assistant", content: fullText };
                  }
                  return updated;
                });
              }
            } catch {
              // skip
            }
          }
        }
      }
    } catch (err) {
      setAiMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Xin lỗi, đã xảy ra lỗi khi truy vấn AI. Vui lòng thử lại." },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(NGINX_CONFIG).then(() => {
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2000);
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* MODULE HEADER */}
      <div className="shrink-0 flex items-center justify-between flex-wrap gap-3 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Tra cứu ICD-10
            <Badge
              variant="outline"
              className="text-xs font-normal border-primary/40 text-primary bg-primary/5"
            >
              Bộ Y tế
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Mã bệnh quốc tế ICD-10 — {TAB_META.length} nguồn tra cứu
          </p>
        </div>
        <Button variant="outline" onClick={handleOpenExternal}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Mở icd.kcb.vn
        </Button>
      </div>

      {/* TAB NAVIGATION */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => handleTabChange(v as TabValue)}
        className="flex-1 min-h-0 flex flex-col overflow-hidden"
      >
        <TabsList className="shrink-0 justify-start h-auto p-0 bg-transparent gap-0 border-b rounded-none">
          {TAB_META.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2.5 text-sm font-medium data-[state=active]:text-primary"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          value={activeTab}
          className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden"
        >
          <div className="h-full -m-px flex flex-col gap-4">
            {/* SOURCE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SOURCE_CARDS.map((card) => {
                const Icon = card.icon;
                const isSelected = selectedCard === card.id;
                return (
                  <Card
                    key={card.id}
                    onClick={() => handleCardSelect(card.id)}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-sm",
                      isSelected && "border-2 border-primary ring-1 ring-primary/20"
                    )}
                  >
                    <div className="px-4 flex items-start gap-3">
                      <div
                        className={cn(
                          "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
                          card.iconBg
                        )}
                      >
                        <Icon className={cn("h-4 w-4", card.iconColor)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm leading-snug">{card.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {card.desc}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {card.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 font-normal"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* IFRAME VIEWER */}
            <div className="flex-1 min-h-0 rounded-xl border bg-background overflow-hidden relative">
              {!iframeError ? (
                <>
                  <iframe
                    ref={iframeRef}
                    src={activeCard.url}
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    title={activeCard.title}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    loading="lazy"
                  />
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Đang tải {activeCard.title}...
                      </div>
                    </div>
                  )}
                </>
              ) : null}

              {/* LAUNCH ZONE — shown when iframe fails */}
              {iframeError && (
                <div className="h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center",
                      activeCard.iconBg
                    )}
                  >
                    {(() => {
                      const Icon = activeCard.icon;
                      return <Icon className={cn("h-6 w-6", activeCard.iconColor)} />;
                    })()}
                  </div>
                  <div>
                    <p className="font-semibold text-base">{activeCard.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{activeCard.desc}</p>
                  </div>
                  <code className="text-xs bg-muted px-3 py-1.5 rounded-md font-mono text-muted-foreground">
                    {activeCard.url}
                  </code>
                  <Button onClick={handleOpenExternal}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Mở tab mới
                  </Button>
                </div>
              )}
            </div>

            {/* AI INTERNAL QUERY (shown in launch zone) */}
            {iframeError && (
              <div className="shrink-0 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Hỏi AI nội bộ</p>
                </div>

                {/* Chat messages */}
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto mb-3">
                  {aiMessages.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      Nhập câu hỏi về mã ICD-10 để được hỗ trợ tìm mã phù hợp
                    </p>
                  )}
                  {aiMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground ml-8"
                          : "bg-muted mr-8"
                      )}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm mr-8 flex items-center gap-2 text-muted-foreground">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Đang suy nghĩ...
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAiQuery()}
                    placeholder="VD: Tăng huyết áp, đái tháo đường type 2..."
                    className="flex-1 text-sm h-8 px-3 rounded-md border bg-background"
                    disabled={aiLoading}
                  />
                  <Button size="sm" onClick={handleAiQuery} disabled={aiLoading || !aiQuery.trim()}>
                    Gửi
                  </Button>
                </div>
              </div>
            )}

            {/* PROXY TIP — collapsible */}
            <details
              className="shrink-0 rounded-xl border overflow-hidden"
              open={showProxyTip}
              onToggle={(e) => setShowProxyTip((e.target as HTMLDetailsElement).open)}
            >
              <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none text-sm font-medium hover:bg-muted/50 list-none">
                <Info className="h-4 w-4 text-muted-foreground" />
                Hướng dẫn IT — Cấu hình Nginx reverse proxy
                {showProxyTip ? (
                  <ChevronUp className="h-4 w-4 ml-auto text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
                )}
              </summary>
              <div className="px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Cấu hình Nginx để nhúng trực tiếp icd.kcb.vn trong iframe mà không bị X-Frame-Options block.
                </p>
                <div className="relative rounded-lg bg-muted overflow-hidden">
                  <pre className="text-xs font-mono p-4 overflow-x-auto text-foreground/80 leading-relaxed">
                    {NGINX_CONFIG}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-7"
                    onClick={handleCopyConfig}
                  >
                    {copiedConfig ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </details>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
