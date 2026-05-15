"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Command as CommandPrimitive } from "cmdk";
import {
  Search,
  ArrowRight,
  Loader2,
  Sparkles,
  LayoutDashboard,
  CalendarDays,
  Pill,
  ShieldCheck,
  FileHeart,
  Stethoscope,
  FileText,
  Upload,
  Plus,
  Brain,
  Clock,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NAVIGATION_GROUPS, QUICK_ACTIONS } from "@/lib/constants";
import { DOCTORS, getDoctorInitials } from "@/lib/data/doctors";
import { PROTOCOLS, PROTOCOL_STATUS_CONFIG } from "@/lib/data/protocols";
import { COMMAND_DOCUMENTS } from "@/lib/data/command-data";

// ─── Types ───────────────────────────────────────────────────────────────────

type NavResult     = { type: "nav";      title: string; description: string; href: string; icon: string };
type DoctorResult  = { type: "doctor";   id: string; name: string; title: string; specialty: string; hasBhyt: boolean; avatarColor: string; schedule: Record<string, string[]> };
type ProtocolResult = { type: "protocol"; id: string; name: string; icd: string; specialty: string; status: "active" | "new" | "withdrawn" };
type DocumentResult = { type: "document"; id: string; name: string; code: string; typeLabel: string; issuer: string; issuedDate: string };
type ActionResult  = { type: "action";   label: string; href: string; icon: string };

// ─── Fuse instances ──────────────────────────────────────────────────────────

const NAV_ITEMS: NavResult[] = NAVIGATION_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    type: "nav" as const,
    title: item.title,
    description: item.description ?? "",
    href: item.href,
    icon: item.icon ?? group.icon,
  }))
);

const NAV_FUSE = new Fuse(NAV_ITEMS, {
  keys: ["title", "description"],
  threshold: 0.4,
  includeScore: true,
});

const DOCTOR_FUSE = new Fuse(DOCTORS, {
  keys: ["name", "title", "specialty", "department"],
  threshold: 0.4,
  includeScore: true,
});

const PROTOCOL_FUSE = new Fuse(PROTOCOLS, {
  keys: ["name", "icd", "specialty", "tags"],
  threshold: 0.4,
  includeScore: true,
});

const DOCUMENT_FUSE = new Fuse(COMMAND_DOCUMENTS, {
  keys: ["name", "code", "typeLabel", "issuer", "topics", "summary"],
  threshold: 0.4,
  includeScore: true,
});

const ACTION_FUSE = new Fuse(QUICK_ACTIONS, {
  keys: ["label"],
  threshold: 0.4,
  includeScore: true,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  CalendarDays,
  Pill,
  ShieldCheck,
  FileHeart,
  Stethoscope,
  FileText,
  Search,
  Upload,
  Plus,
  Brain,
  Clock,
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const RECENT_KEY = "cp_recent_searches";

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  try {
    const prev = getRecentSearches();
    const filtered = prev.filter((s) => s !== query);
    const next = [query, ...filtered].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {}
}

function getDoctorTodaySchedule(schedule: Record<string, string[]>): string {
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat"] as const;
  const today = dayKeys[new Date().getDay() - 1]; // mon=0, tue=1...
  if (!today) return "";
  const sessions = schedule[today] ?? [];
  if (sessions.length === 0) return "Hôm nay: Nghỉ";
  const label = sessions.map((s) => (s === "sáng" ? "Sáng" : s === "chiều" ? "Chiều" : "Cả ngày")).join(", ");
  return `Hôm nay: ${label}`;
}

// ─── AI Fallback ─────────────────────────────────────────────────────────────

interface AIResult {
  content: string;
}

async function askAI(query: string, signal: AbortSignal): Promise<AIResult> {
  const res = await fetch("/api/anthropic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `Bạn là trợ lý y khoa tại Phòng khám Bệnh viện Đại học Y Dược 1. Hãy trả lời câu hỏi sau một cách ngắn gọn, chính xác (150-200 từ):\n\n"${query}"\n\nNếu câu hỏi liên quan đến bệnh lý, thuốc, phác đồ, hay quy trình — hãy trả lời chi tiết. Nếu không rõ, nói rõ bạn không có đủ thông tin.`,
        },
      ],
      max_tokens: 300,
    }),
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return { content: data.content ?? "" };
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 200);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiResult, setAiResult] = React.useState<string | null>(null);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const abortRef = React.useRef<AbortController | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load recent searches on open
  React.useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setAiResult(null);
      setAiError(null);
      setAiLoading(false);
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Abort AI request on new search
  React.useEffect(() => {
    abortRef.current?.abort();
    setAiLoading(false);
    setAiResult(null);
    setAiError(null);
  }, [query]);

  const navigate = React.useCallback(
    (href: string, label?: string) => {
      if (label && debouncedQuery.trim()) {
        saveRecentSearch(debouncedQuery.trim());
        setRecentSearches(getRecentSearches());
      }
      onOpenChange(false);
      router.push(href);
    },
    [router, onOpenChange, debouncedQuery]
  );

  // ── Search results ──────────────────────────────────────────────────────────

  const searchResults = React.useMemo<{
    nav: NavResult[];
    doctors: DoctorResult[];
    protocols: ProtocolResult[];
    documents: DocumentResult[];
    actions: ActionResult[];
    hasResults: boolean;
  }>(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      return { nav: [], doctors: [], protocols: [], documents: [], actions: [], hasResults: false };
    }

    const nav = NAV_FUSE.search(q).slice(0, 4).map((r) => r.item);
    const doctors = DOCTOR_FUSE.search(q).slice(0, 4).map((r) => ({
      type: "doctor" as const,
      id: r.item.id,
      name: r.item.name,
      title: r.item.title,
      specialty: r.item.specialty,
      hasBhyt: r.item.hasBhyt,
      avatarColor: r.item.avatarColor,
      schedule: r.item.schedule,
    }));
    const protocols = PROTOCOL_FUSE.search(q).slice(0, 4).map((r) => ({
      type: "protocol" as const,
      id: r.item.id,
      name: r.item.name,
      icd: r.item.icd,
      specialty: r.item.specialty,
      status: r.item.status,
    }));
    const documents = DOCUMENT_FUSE.search(q).slice(0, 4).map((r) => ({
      type: "document" as const,
      id: r.item.id,
      name: r.item.name,
      code: r.item.code,
      typeLabel: r.item.typeLabel,
      issuer: r.item.issuer,
      issuedDate: r.item.issuedDate,
    }));
    const actions = ACTION_FUSE.search(q).slice(0, 2).map((r) => ({
      type: "action" as const,
      label: r.item.label,
      href: r.item.href,
      icon: r.item.icon,
    }));

    const hasResults = nav.length + doctors.length + protocols.length + documents.length + actions.length > 0;

    return { nav, doctors, protocols, documents, actions, hasResults };
  }, [debouncedQuery]);

  const hasQuery = debouncedQuery.trim().length > 0;
  const showRecent = !hasQuery && recentSearches.length > 0;
  const showAIFallback = hasQuery && !searchResults.hasResults && !aiLoading && !aiResult;

  const handleAI = React.useCallback(async () => {
    abortRef.current = new AbortController();
    setAiLoading(true);
    setAiError(null);
    try {
      const result = await askAI(debouncedQuery, abortRef.current.signal);
      setAiResult(result.content);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setAiError("Không thể kết nối AI. Vui lòng thử lại.");
    } finally {
      setAiLoading(false);
    }
  }, [debouncedQuery]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden p-0 shadow-2xl border border-border/50 w-full max-w-xl"
        showCloseButton={false}
      >
        <Command shouldFilter={false}>
          {/* Search Input */}
          <div className="flex items-center px-4 gap-3 border-b border-border/50">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandPrimitive.Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={query}
              onValueChange={setQuery}
              placeholder="Tìm chức năng, bác sĩ, phác đồ, văn bản..."
              className="flex-1 h-12 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="shrink-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* List */}
          <CommandList>
            {/* Recent Searches */}
            {showRecent && (
              <CommandGroup heading="Tìm kiếm gần đây">
                {recentSearches.map((s, i) => (
                  <CommandItem
                    key={i}
                    value={s}
                    onSelect={() => {
                      setQuery(s);
                    }}
                  >
                    <Clock className="h-4 w-4 shrink-0 opacity-70" />
                    <span className="flex-1 truncate">{s}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Navigation — shown when no query or matches */}
            {(searchResults.nav.length > 0 || !hasQuery) && !showRecent && (
              <CommandGroup heading="Điều hướng nhanh">
                {(hasQuery ? searchResults.nav : NAV_ITEMS.slice(0, 8)).map((item) => {
                  const nav = item as { type: "nav"; title: string; description: string; href: string; icon: string };
                  const Icon = ICON_MAP[nav.icon] ?? LayoutDashboard;
                  return (
                    <CommandItem
                      key={nav.href}
                      value={`nav ${nav.title} ${nav.description}`}
                      onSelect={() => navigate(nav.href, nav.title)}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-70" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{nav.title}</div>
                        {nav.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {nav.description}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 group-data-[selected=true]:opacity-70" />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {/* Doctors */}
            {searchResults.doctors.length > 0 && (
              <CommandGroup heading="Bác sĩ">
                {searchResults.doctors.map((doc) => (
                  <CommandItem
                    key={doc.id}
                    value={`doctor ${doc.name} ${doc.specialty}`}
                    onSelect={() => navigate("/nhan-su/lich-kcb", doc.name)}
                  >
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className={`text-xs font-semibold text-white ${doc.avatarColor}`}>
                        {getDoctorInitials(doc.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-medium text-sm">{doc.name}</span>
                        {doc.hasBhyt && (
                          <Badge className="text-[9px] h-4 px-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-0 shrink-0">
                            BHYT
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {doc.specialty}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {getDoctorTodaySchedule(doc.schedule)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Protocols */}
            {searchResults.protocols.length > 0 && (
              <CommandGroup heading="Phác đồ">
                {searchResults.protocols.map((p) => {
                  const sc = PROTOCOL_STATUS_CONFIG[p.status];
                  return (
                    <CommandItem
                      key={p.id}
                      value={`protocol ${p.name} ${p.icd} ${p.specialty}`}
                      onSelect={() => navigate("/nghiep-vu/phac-do", p.name)}
                    >
                      <FileHeart className="h-4 w-4 shrink-0 opacity-70" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm">{p.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-mono bg-muted px-1 rounded">{p.icd}</span>
                          <span className="text-xs text-muted-foreground">{p.specialty}</span>
                        </div>
                      </div>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sc.dot}`} />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {/* Documents */}
            {searchResults.documents.length > 0 && (
              <CommandGroup heading="Văn bản">
                {searchResults.documents.map((doc) => (
                  <CommandItem
                    key={doc.id}
                    value={`doc ${doc.name} ${doc.code} ${doc.issuer}`}
                    onSelect={() => navigate("/nghiep-vu/bhyt", doc.name)}
                  >
                    <FileText className="h-4 w-4 shrink-0 opacity-70" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs rounded px-1.5 py-0.5 bg-muted text-muted-foreground shrink-0">
                          {doc.typeLabel}
                        </span>
                        <span className="truncate text-sm">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono text-muted-foreground">{doc.code}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground truncate">{doc.issuedDate}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Actions */}
            {searchResults.actions.length > 0 && (
              <CommandGroup heading="Hành động">
                {searchResults.actions.map((a) => {
                  const act = a as { type: "action"; label: string; href: string; icon: string };
                  const Icon = ICON_MAP[act.icon] ?? Sparkles;
                  return (
                    <CommandItem
                      key={act.href}
                      value={`action ${act.label}`}
                      onSelect={() => navigate(act.href, act.label)}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-70" />
                      <span className="flex-1 truncate text-sm">{act.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 group-data-[selected=true]:opacity-70" />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {/* Empty state */}
            {hasQuery && !searchResults.hasResults && (
              <CommandEmpty className="py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    Không tìm thấy kết quả cho "{debouncedQuery}"
                  </div>

                  {/* AI Fallback Button */}
                  {showAIFallback && (
                    <div className="w-full max-w-xs">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAI}
                        className="w-full gap-2 border-dashed"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        Hỏi AI: "{debouncedQuery}"
                      </Button>
                    </div>
                  )}

                  {/* AI Loading */}
                  {aiLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      AI đang xử lý...
                    </div>
                  )}

                  {/* AI Result */}
                  {aiResult && (
                    <div className="w-full max-w-xs rounded-lg border bg-muted/30 p-3 text-xs text-foreground leading-relaxed text-left">
                      <div className="flex items-center gap-1.5 mb-2 text-primary font-medium">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI trả lời:
                      </div>
                      <p className="whitespace-pre-line">{aiResult}</p>
                    </div>
                  )}

                  {/* AI Error */}
                  {aiError && (
                    <div className="text-xs text-red-500">{aiError}</div>
                  )}
                </div>
              </CommandEmpty>
            )}
          </CommandList>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-border/50 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
              điều hướng
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
              chọn
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px]">esc</kbd>
              đóng
            </span>
            {recentSearches.length > 0 && (
              <button
                onClick={() => {
                  clearRecentSearches();
                  setRecentSearches([]);
                }}
                className="ml-auto text-[10px] hover:text-foreground transition-colors"
              >
                Xóa lịch sử
              </button>
            )}
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
