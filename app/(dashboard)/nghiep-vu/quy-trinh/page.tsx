"use client";

import AIDocSearch from "@/components/ai-doc-search/AIDocSearch";
import { Button } from "@/components/ui/button";
import { GitBranch, Plus } from "lucide-react";
import { POLICY_DOCUMENTS, POLICY_CATEGORIES } from "@/lib/data/policy-docs";

export default function QuyTrinhPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between flex-wrap gap-3 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GitBranch className="h-7 w-7 text-primary" />
            Quy trình & Hướng dẫn
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Tra cứu quy trình khám chữa bệnh và hướng dẫn nội bộ · {POLICY_DOCUMENTS.length} văn bản
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo quy trình mới
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <AIDocSearch
          title="Quy trình & Hướng dẫn"
          documentType="policy"
          categories={POLICY_CATEGORIES}
          documents={POLICY_DOCUMENTS}
        />
      </div>
    </div>
  );
}
