"use client";

import * as React from "react";
import Link from "next/link";
import { QUICK_ACTIONS } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Search, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Plus,
  Search,
  Calendar,
};

export function QuickActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <span className="text-xs text-muted-foreground font-medium hidden sm:block">
        Thao tác nhanh:
      </span>
      {QUICK_ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          {iconMap[action.icon] &&
            React.createElement(iconMap[action.icon], {
              className: "h-3.5 w-3.5",
            })}
          <span className="ml-1.5 text-xs">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
