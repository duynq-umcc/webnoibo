"use client";

import { useState, useMemo } from "react";
import AIDocSearch from "@/components/ai-doc-search/AIDocSearch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, Plus } from "lucide-react";
import { BHYT_DOCUMENTS, BHYT_CATEGORIES } from "@/lib/data/bhyt-docs";
import type { DocType } from "@/lib/data/types";

const TAB_FILTERS: Record<string, DocType[]> = {
  "tong-quan": [],
  "luat-nd": ["luat", "nghi-dinh"],
  "thong-tu": ["thong-tu"],
  "trien-khai-pk": ["huong-dan-noi-bo"],
  "thanh-toan-gia": ["nghi-dinh", "thong-tu", "cong-van"],
  "danh-muc": ["thong-tu"],
};

export default function BHYTPage() {
  const [activeTab, setActiveTab] = useState("tong-quan");

  const filteredDocs = useMemo(() => {
    const types = TAB_FILTERS[activeTab] ?? [];
    if (types.length === 0) return BHYT_DOCUMENTS;
    return BHYT_DOCUMENTS.filter((d) => types.includes(d.type));
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between flex-wrap gap-3 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            Văn bản BHYT
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Tra cứu văn bản pháp luật BHYT Việt Nam · {BHYT_DOCUMENTS.length} văn bản
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm văn bản mới
        </Button>
      </div>

      {/* Tab navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 min-h-0 flex flex-col overflow-hidden"
      >
        <TabsList className="shrink-0 justify-start h-auto p-0 bg-transparent gap-0 border-b rounded-none">
          {[
            { value: "tong-quan", label: "Tổng quan" },
            { value: "luat-nd", label: "Luật & Nghị định" },
            { value: "thong-tu", label: "Thông tư" },
            { value: "trien-khai-pk", label: "Triển khai tại PK" },
            { value: "thanh-toan-gia", label: "Thanh toán & giá" },
            { value: "danh-muc", label: "Danh mục" },
          ].map((tab) => (
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
          <div className="h-full -m-px">
            <AIDocSearch
              title="Văn bản BHYT"
              documentType="bhyt"
              categories={BHYT_CATEGORIES}
              documents={filteredDocs}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
