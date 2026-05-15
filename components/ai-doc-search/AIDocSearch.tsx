"use client";

import {
  useState,
  useCallback,
  type SetStateAction,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Search,
  Sparkles,
  FileText,
  Download,
  Eye,
  X,
  ChevronDown,
  ChevronRight,
  Scale,
  ScrollText,
  Mail,
  BookOpen,
  Loader2,
  CheckSquare,
  Square,
  Circle,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Info,
} from "lucide-react";
import type {
  Document,
  DocType,
  DocStatus,
  Category,
} from "@/lib/data/types";
import {
  DOC_TYPE_CONFIG,
  DOC_STATUS_CONFIG,
} from "@/lib/data/types";

// ─── Doc Type Icon Map ────────────────────────────────────────────────────────

function DocTypeIcon({ type, className }: { type: DocType; className?: string }) {
  const iconClass = DOC_TYPE_CONFIG[type]?.icon ?? "file-text";
  switch (iconClass) {
    case "scale": return <Scale className={cn("h-4 w-4", className)} />;
    case "scroll": return <ScrollText className={cn("h-4 w-4", className)} />;
    case "mail": return <Mail className={cn("h-4 w-4", className)} />;
    case "book-open": return <BookOpen className={cn("h-4 w-4", className)} />;
    default: return <FileText className={cn("h-4 w-4", className)} />;
  }
}

// ─── Sidebar Filter ────────────────────────────────────────────────────────────

interface SidebarFilterProps {
  categories: Category[];
  selectedTopics: Set<string>;
  selectedTypes: Set<DocType>;
  selectedStatus: DocStatus | "all";
  onTopicsChange: (s: SetStateAction<Set<string>>) => void;
  onTypesChange: (s: SetStateAction<Set<DocType>>) => void;
  onStatusChange: (s: DocStatus | "all") => void;
  docCounts: Record<string, number>;
  typeCounts: Record<DocType, number>;
}

function SidebarFilter({
  categories,
  selectedTopics,
  selectedTypes,
  selectedStatus,
  onTopicsChange,
  onTypesChange,
  onStatusChange,
  docCounts,
  typeCounts,
}: SidebarFilterProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["topics", "type", "status"]));

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTopic = (id: string) => {
    if (id === "all") {
      onTopicsChange(new Set(["all"]));
      return;
    }
    onTopicsChange((prev) => {
      const next = new Set(prev);
      next.delete("all");
      if (next.has(id)) {
        next.delete(id);
        if (next.size === 0) return new Set(["all"]);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleType = (t: DocType) => {
    onTypesChange((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const allTypes: DocType[] = ["luat", "nghi-dinh", "thong-tu", "cong-van", "huong-dan-noi-bo"];

  return (
    <div className="w-[200px] shrink-0 border-r bg-card/50 overflow-y-auto scrollbar-thin">
      <div className="p-3">
        {/* Topics Accordion */}
        <FilterGroup
          id="topics"
          label="Chủ đề"
          badge={selectedTopics.size > 1 || !selectedTopics.has("all") ? selectedTopics.size : undefined}
          open={openGroups.has("topics")}
          onToggle={() => toggleGroup("topics")}
        >
          <div className="space-y-0.5">
            {categories.map((cat) => {
              const isSelected =
                cat.id === "all"
                  ? selectedTopics.has("all")
                  : selectedTopics.has(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleTopic(cat.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="truncate">{cat.label}</span>
                  {docCounts[cat.id] > 0 && (
                    <span className="ml-1 text-[10px] bg-muted px-1 rounded-full">
                      {docCounts[cat.id]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {/* Doc Types */}
        <FilterGroup
          id="type"
          label="Loại văn bản"
          badge={selectedTypes.size > 0 ? selectedTypes.size : undefined}
          open={openGroups.has("type")}
          onToggle={() => toggleGroup("type")}
        >
          <div className="space-y-0.5">
            {allTypes.map((t) => {
              const cfg = DOC_TYPE_CONFIG[t];
              const isSelected = selectedTypes.has(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {isSelected ? (
                    <CheckSquare className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <Square className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="truncate">{cfg.label}</span>
                  {typeCounts[t] > 0 && (
                    <span className="ml-auto text-[10px] bg-muted px-1 rounded-full">
                      {typeCounts[t]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {/* Status */}
        <FilterGroup
          id="status"
          label="Hiệu lực"
          badge={selectedStatus !== "all" ? 1 : undefined}
          open={openGroups.has("status")}
          onToggle={() => toggleGroup("status")}
        >
          <div className="space-y-0.5">
            {([
              "all",
              "con-hieu-luc",
              "moi",
              "het-hieu-luc",
            ] as const).map((s) => {
              const isSelected = selectedStatus === s;
              const label =
                s === "all"
                  ? "Tất cả"
                  : DOC_STATUS_CONFIG[s as DocStatus].label;
              return (
                <button
                  key={s}
                  onClick={() => onStatusChange(s as DocStatus | "all")}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Circle
                    className={cn(
                      "h-3 w-3 shrink-0",
                      s === "all"
                        ? "fill-none stroke-current"
                        : DOC_STATUS_CONFIG[s as DocStatus].dot + " fill-current"
                    )}
                  />
                  {label}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      </div>
    </div>
  );
}

function FilterGroup({
  id,
  label,
  badge,
  open,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  badge?: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>{label}</span>
        <div className="flex items-center gap-1">
          {badge !== undefined && (
            <span className="h-4 min-w-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold px-1 flex items-center justify-center">
              {badge}
            </span>
          )}
          {open ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </div>
      </button>
      {open && <div className="px-1">{children}</div>}
    </div>
  );
}

// ─── AI Answer Card ────────────────────────────────────────────────────────────

interface AIAnswerCardProps {
  query: string;
  streamedText: string;
  loading: boolean;
  error: string | null;
  citations: Document[];
  onCitationClick: (id: string) => void;
}

function AIAnswerCard({
  streamedText,
  loading,
  error,
  citations,
  onCitationClick,
}: AIAnswerCardProps) {
  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.03] to-primary/[0.01] p-5 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-semibold text-sm">Trợ lý AI tóm tắt</h3>
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground ml-auto" />}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 p-3 mb-3">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {streamedText && (
        <div className="rounded-lg bg-background/80 border p-4 text-sm leading-relaxed mb-3 animate-in fade-in">
          <StreamingMarkdown text={streamedText} />
        </div>
      )}

      {!loading && !error && !streamedText && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
          <Info className="h-4 w-4" />
          <span>Nhập câu hỏi và nhấn tìm kiếm để được AI tóm tắt</span>
        </div>
      )}

      {citations.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-xs text-muted-foreground py-1">Trích dẫn:</span>
          {citations.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onCitationClick(doc.id)}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-muted hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/30 transition-all"
            >
              <FileText className="h-3 w-3" />
              {doc.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StreamingMarkdown({ text }: { text: string }) {
  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-headings:text-base prose-li:my-0"
      dangerouslySetInnerHTML={{
        __html: text
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/\n/g, "<br/>"),
      }}
    />
  );
}

// ─── Document Card ─────────────────────────────────────────────────────────────

interface DocumentCardProps {
  doc: Document;
  searchQuery: string;
  onPreview: (doc: Document) => void;
  isHighlighted?: boolean;
}

function DocumentCard({ doc, searchQuery, onPreview, isHighlighted }: DocumentCardProps) {
  const cfg = DOC_TYPE_CONFIG[doc.type];
  const sc = DOC_STATUS_CONFIG[doc.status];

  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;
    const q = searchQuery.trim().toLowerCase();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 dark:bg-yellow-800/40 rounded px-0.5">
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div
      id={`doc-${doc.id}`}
      className={cn(
        "group rounded-xl border bg-card p-4 transition-all",
        isHighlighted
          ? "border-2 border-blue-400 bg-blue-50/30 dark:bg-blue-950/10 shadow-md shadow-blue-400/10"
          : "hover:border-primary/30 hover:bg-muted/20 cursor-pointer"
      )}
      onClick={() => onPreview(doc)}
    >
      <div className="flex items-start gap-3">
        <div className={cn("shrink-0 w-9 h-9 rounded-lg flex items-center justify-center", cfg.bgColor)}>
          <span className={cn("font-bold text-sm", cfg.color)}>
            <DocTypeIcon type={doc.type} className={cn(cfg.color, "h-4 w-4")} />
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                {highlightText(doc.name)}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-[10px] h-4 font-mono px-1.5">
                  {doc.code}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {doc.issuedDate}
                </span>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => { e.stopPropagation(); onPreview(doc); }}
                title="Xem nhanh"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => e.stopPropagation()}
                title="Tải xuống"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Summary excerpt */}
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {highlightText(doc.summary)}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge
              variant="outline"
              className={cn("text-[10px] h-4", cfg.color.split(" ").map((c) => c.replace("text-", "border-")).join(" "))}
            >
              {cfg.label}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-[10px] h-4", sc.className)}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full mr-1", sc.dot)} />
              {sc.label}
            </Badge>
            {doc.topics.slice(0, 2).map((t) => (
              <Badge key={t} variant="outline" className="text-[10px] h-4 text-muted-foreground">
                {t}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
            <span className="text-[10px] text-muted-foreground">{doc.issuer}</span>
            <span className="text-[10px] text-muted-foreground">Hiệu lực: {doc.effectiveDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Document Preview Sheet ─────────────────────────────────────────────────────

function DocumentPreviewSheet({
  doc,
  open,
  onClose,
}: {
  doc: Document | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!doc) return null;
  const cfg = DOC_TYPE_CONFIG[doc.type];
  const sc = DOC_STATUS_CONFIG[doc.status];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[500px] max-w-full p-0 flex flex-col">
        <SheetHeader className="p-5 pb-4 border-b shrink-0">
          <div className="flex items-start gap-3">
            <div className={cn("shrink-0 w-9 h-9 rounded-lg flex items-center justify-center", cfg.bgColor)}>
              <DocTypeIcon type={doc.type} className={cn(cfg.color, "h-4 w-4")} />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base font-bold leading-snug text-left">
                {doc.name}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant="outline" className="text-[10px] h-4 font-mono">
                  {doc.code}
                </Badge>
                <Badge variant="outline" className={cn("text-[10px] h-4", sc.className)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full mr-1", sc.dot)} />
                  {sc.label}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Ngày ban hành", doc.issuedDate],
                ["Hiệu lực", doc.effectiveDate],
                ["Hết hạn", doc.expiryDate ?? "—"],
                ["Đơn vị ban hành", doc.issuer],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-muted/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{k}</div>
                  <div className="text-sm font-medium mt-0.5">{v}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tóm tắt</div>
              <p className="text-sm leading-relaxed text-muted-foreground">{doc.summary}</p>
            </div>

            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Chủ đề</div>
              <div className="flex flex-wrap gap-1">
                {doc.topics.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nội dung</div>
              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-line">{doc.content}</p>
              </div>
            </div>

            {doc.citations && doc.citations.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Văn bản liên quan
                </div>
                <div className="space-y-1.5">
                  {doc.citations.map((c) => (
                    <div key={c} className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="font-mono text-xs text-muted-foreground">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => window.print()}>
            <Eye className="h-4 w-4 mr-1.5" />
            In văn bản
          </Button>
          <Button variant="default" size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-1.5" />
            Tải xuống
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Stats Cards ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

function StatCard({ label, value, color, bgColor }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-md", bgColor, color)}>
          {value}
        </span>
      </div>
      <div className={cn("text-2xl font-bold mt-1", color)}>{value}</div>
    </div>
  );
}

// ─── Main AIDocSearch Component ────────────────────────────────────────────────

interface AIDocSearchProps {
  title: string;
  documentType: "bhyt" | "policy";
  categories: Category[];
  documents: Document[];
}

export default function AIDocSearch({
  title,
  documentType,
  categories,
  documents,
}: AIDocSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [aiMode, setAiMode] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set(["all"]));
  const [selectedTypes, setSelectedTypes] = useState<Set<DocType>>(new Set());
  const [selectedStatus, setSelectedStatus] = useState<DocStatus | "all">("all");
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [highlightedDocId, setHighlightedDocId] = useState<string | null>(null);
  const aiAbortRef = useRef<AbortController | null>(null!);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Count utilities
  const docCounts = useMemo(() => {
    const counts: Record<string, number> = { all: documents.length };
    for (const cat of categories) {
      if (cat.id !== "all") {
        counts[cat.id] = documents.filter((d) => d.topics.includes(cat.label)).length;
      }
    }
    return counts;
  }, [documents, categories]);

  const typeCounts = useMemo(() => {
    const counts = {} as Record<DocType, number>;
    for (const d of documents) {
      counts[d.type] = (counts[d.type] ?? 0) + 1;
    }
    return counts;
  }, [documents]);

  // Filter documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const q = debouncedQuery.toLowerCase();
      if (q) {
        const matches =
          doc.name.toLowerCase().includes(q) ||
          doc.code.toLowerCase().includes(q) ||
          doc.summary.toLowerCase().includes(q) ||
          doc.topics.some((t) => t.toLowerCase().includes(q)) ||
          doc.issuer.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (!selectedTopics.has("all") && !selectedTopics.has(doc.topics[0])) {
        return false;
      }
      if (selectedTypes.size > 0 && !selectedTypes.has(doc.type)) {
        return false;
      }
      if (selectedStatus !== "all" && doc.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [documents, debouncedQuery, selectedTopics, selectedTypes, selectedStatus]);

  // Stats for BHYT
  const stats = useMemo(() => {
    if (documentType !== "bhyt") return null;
    const docs = documents;
    const luat_nd = docs.filter((d) => d.type === "luat" || d.type === "nghi-dinh").length;
    const thong_tu = docs.filter((d) => d.type === "thong-tu").length;
    const cong_van_qd = docs.filter((d) => d.type === "cong-van").length;
    const hdnb = docs.filter((d) => d.type === "huong-dan-noi-bo").length;
    return [
      { label: "Luật & Nghị định", value: luat_nd, color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-900/40" },
      { label: "Thông tư", value: thong_tu, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/40" },
      { label: "Công văn & QĐ", value: cong_van_qd, color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900/40" },
      { label: "Hướng dẫn nội bộ", value: hdnb, color: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-100 dark:bg-gray-800" },
    ];
  }, [documents, documentType]);

  // Handle AI search
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    if (!aiMode) {
      // Normal search — just update debounced query
      return;
    }

    // AI mode
    if (aiAbortRef.current) {
      aiAbortRef.current.abort();
    }
    aiAbortRef.current = new AbortController();

    setAiLoading(true);
    setAiError(null);
    setStreamedText("");

    try {
      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `${searchQuery} — Tra cứu trong danh sách văn bản ${documentType === "bhyt" ? "BHYT và chính sách y tế" : "quy trình và hướng dẫn nội bộ"} Việt Nam. Các văn bản có trong hệ thống:\n${filteredDocs.map((d) => `[doc:${d.id}] ${d.code} — ${d.name}: ${d.summary}`).join("\n")}\n\nTrả lời câu hỏi trên, đánh dấu các văn bản được trích dẫn bằng [doc:ID]. Trả lời ngắn gọn 200-300 từ.`,
            },
          ],
          max_tokens: 600,
        }),
        signal: aiAbortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Lỗi API: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

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
            if (raw === "[DONE]" || raw === "") continue;
            try {
              const event = JSON.parse(raw);
              if (event.type === "text" && event.text) {
                setStreamedText((prev) => prev + event.text);
              }
              if (event.error) {
                setAiError(event.error);
              }
            } catch {
              // skip
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setAiError("Không thể kết nối AI. Vui lòng thử lại.");
    } finally {
      setAiLoading(false);
    }
  }, [searchQuery, aiMode, filteredDocs, documentType]);

  // Extract cited doc IDs from streamed text
  const citedDocs = useMemo(() => {
    if (!streamedText) return [];
    const ids: string[] = [];
    const matches = streamedText.matchAll(/\[doc:([^\]]+)\]/g);
    for (const m of matches) {
      const id = m[1];
      if (!ids.includes(id)) {
        const doc = documents.find((d) => d.id === id);
        if (doc) ids.push(id);
      }
    }
    return ids.map((id) => documents.find((d) => d.id === id)!).filter(Boolean);
  }, [streamedText, documents]);

  const handleCitationClick = (id: string) => {
    const el = document.getElementById(`doc-${id}`);
    if (el) {
      setHighlightedDocId(id);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-blue-400");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-blue-400");
        setHighlightedDocId(null);
      }, 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex h-full min-h-0">
      {/* Sidebar */}
      <SidebarFilter
        categories={categories}
        selectedTopics={selectedTopics}
        selectedTypes={selectedTypes}
        selectedStatus={selectedStatus}
        onTopicsChange={setSelectedTopics}
        onTypesChange={setSelectedTypes}
        onStatusChange={setSelectedStatus}
        docCounts={docCounts}
        typeCounts={typeCounts}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top stats (BHYT only) */}
        {stats && (
          <div className="grid grid-cols-4 gap-3 px-5 pt-5 pb-3 shrink-0">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        )}

        {/* Scrollable area */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin px-5 pb-5">
          {/* Search bar */}
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm py-3 -mx-px px-px">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder={
                    aiMode
                      ? "Hỏi AI về văn bản pháp luật y tế..."
                      : "Tìm theo từ khóa, số hiệu văn bản..."
                  }
                  className="pl-10 pr-20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStreamedText("");
                      setAiError(null);
                    }}
                    className="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* AI Toggle */}
              <Button
                variant={aiMode ? "default" : "outline"}
                size="sm"
                onClick={() => setAiMode((v) => !v)}
                className={cn(
                  "gap-1.5 shrink-0 transition-all",
                  aiMode && "bg-primary/10 text-primary border-primary/30"
                )}
              >
                <Sparkles className="h-4 w-4" />
                AI
              </Button>

              <Button
                size="sm"
                onClick={handleSearch}
                disabled={!searchQuery.trim() || aiLoading}
                className="shrink-0 gap-1.5"
              >
                {aiLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Tìm kiếm
              </Button>
            </div>

            {/* Active filter chips */}
            {(selectedTypes.size > 0 || selectedStatus !== "all" || (!selectedTopics.has("all"))) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedTypes.size > 0 && Array.from(selectedTypes).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTypes((prev) => {
                      const next = new Set(prev);
                      next.delete(t);
                      return next;
                    })}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs bg-muted hover:bg-red-50 dark:hover:bg-red-950/20 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    {DOC_TYPE_CONFIG[t].label}
                    <X className="h-2.5 w-2.5" />
                  </button>
                ))}
                {selectedStatus !== "all" && (
                  <button
                    onClick={() => setSelectedStatus("all")}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs bg-muted hover:bg-red-50 dark:hover:bg-red-950/20 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    {DOC_STATUS_CONFIG[selectedStatus].label}
                    <X className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* AI Answer Card */}
          {(aiMode || streamedText || aiLoading || aiError) && (
            <AIAnswerCard
              query={searchQuery}
              streamedText={streamedText}
              loading={aiLoading}
              error={aiError}
              citations={citedDocs}
              onCitationClick={handleCitationClick}
            />
          )}

          {/* Result count */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              {filteredDocs.length} văn bản
              {debouncedQuery && ` · tìm: "${debouncedQuery}"`}
            </p>
          </div>

          {/* Document Cards */}
          {filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <h3 className="font-semibold mb-1">Không tìm thấy văn bản</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Thử thay đổi từ khóa hoặc bỏ bớt bộ lọc
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  searchQuery={debouncedQuery}
                  onPreview={setPreviewDoc}
                  isHighlighted={doc.id === highlightedDocId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Sheet */}
      <DocumentPreviewSheet
        doc={previewDoc}
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}
