"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Search,
  Users,
  FileHeart,
  HeartPulse,
  ShieldPlus,
  FileSearch,
  BookOpen,
  Pill,
  Receipt,
  FlaskConical,
  CalendarRange,
  Phone,
  ClockCheck,
  FileText,
  ClipboardList,
  Shield,
  GitBranch,
  FolderOpen,
  BarChart2,
  Calendar,
  BookUser,
  Clock,
  Plus,
  ArrowRight,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { NAVIGATION_GROUPS, QUICK_ACTIONS } from "@/lib/constants";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Briefcase,
  Search,
  Users,
  FileHeart,
  HeartPulse,
  ShieldPlus,
  FileSearch,
  BookOpen,
  Pill,
  Receipt,
  FlaskConical,
  CalendarRange,
  Phone,
  ClockCheck,
  FileText,
  ClipboardList,
  Shield,
  GitBranch,
  FolderOpen,
  BarChart2,
  Calendar,
  BookUser,
  Clock,
  Plus,
};

interface CommandItem {
  title: string;
  description?: string;
  href: string;
  icon: string;
  group: string;
}

function buildItems(): CommandItem[] {
  const items: CommandItem[] = [];
  for (const group of NAVIGATION_GROUPS) {
    for (const item of group.items) {
      items.push({
        title: item.title,
        description: item.description,
        href: item.href,
        icon: item.icon ?? group.icon,
        group: group.title,
      });
    }
  }
  for (const action of QUICK_ACTIONS) {
    items.push({
      title: action.label,
      href: action.href,
      icon: action.icon,
      group: "Thao tác nhanh",
    });
  }
  return items;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const allItems = React.useMemo(() => buildItems(), []);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = React.useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [router, onOpenChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        navigate(filtered[selectedIndex].href);
      }
    }
  };

  // Scroll selected item into view
  React.useEffect(() => {
    const el = listRef.current?.querySelector(
      `[data-selected="true"]`
    ) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl border border-border/50">
        <DialogHeader className="sr-only">
          <span>Command Palette</span>
        </DialogHeader>
        <div className="flex items-center border-b border-border/50 px-4 gap-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm toàn hệ thống..."
            className="flex-1 h-12 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
          />
          <button
            onClick={() => onOpenChange(false)}
            className="shrink-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          ref={listRef}
          className="max-h-[320px] overflow-y-auto py-2"
        >
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Không tìm thấy kết quả nào
            </div>
          ) : (
            <div className="px-2">
              {filtered.map((item, index) => {
                const Icon = ICON_MAP[item.icon] ?? Search;
                return (
                  <button
                    key={`${item.href}-${index}`}
                    data-selected={index === selectedIndex}
                    onClick={() => navigate(item.href)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left transition-colors cursor-pointer
                      data-[selected=true]:bg-[#1d9e75]/10 data-[selected=true]:text-[#1d9e75]
                      data-[selected=false]:text-foreground data-[selected=false:hover]:bg-muted/50"
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-70" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {item.group}
                    </span>
                    {index === selectedIndex && (
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
