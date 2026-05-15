import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GitBranch, Search, Plus, FileText, ChevronRight, ExternalLink } from "lucide-react";

export default function QuyTrinhPage() {
  const processes = [
    {
      id: "QT001",
      name: "Quy trình tiếp nhận bệnh nhân mới",
      category: "Tiếp nhận",
      steps: 6,
      updated: "05/01/2026",
      status: "active",
    },
    {
      id: "QT002",
      name: "Quy trình khám bệnh ngoại trú",
      category: "Khám bệnh",
      steps: 8,
      updated: "12/02/2026",
      status: "active",
    },
    {
      id: "QT003",
      name: "Quy trình cấp đơn thuốc",
      category: "Dược",
      steps: 5,
      updated: "20/03/2026",
      status: "active",
    },
    {
      id: "QT004",
      name: "Quy trình xuất viện cho bệnh nhân nội trú",
      category: "Nội trú",
      steps: 10,
      updated: "15/04/2026",
      status: "draft",
    },
    {
      id: "QT005",
      name: "Quy trình thanh toán BHYT",
      category: "Tài chính",
      steps: 7,
      updated: "28/04/2026",
      status: "active",
    },
    {
      id: "QT006",
      name: "Quy trình lấy mẫu xét nghiệm",
      category: "Xét nghiệm",
      steps: 4,
      updated: "01/05/2026",
      status: "active",
    },
  ];

  const categories = ["Tất cả", "Tiếp nhận", "Khám bệnh", "Dược", "Nội trú", "Tài chính", "Xét nghiệm"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quy trình</h1>
          <p className="text-muted-foreground mt-1">
            Tra cứu và quản lý các quy trình khám chữa bệnh
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo quy trình mới
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={cat === "Tất cả" ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm kiếm quy trình..." className="pl-9" />
      </div>

      <div className="grid gap-4">
        {processes.map((proc) => (
          <Card key={proc.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                  <GitBranch className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{proc.id}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {proc.category}
                    </Badge>
                    <Badge
                      variant={proc.status === "active" ? "default" : "outline"}
                      className="text-[10px]"
                    >
                      {proc.status === "active" ? "Hoạt động" : "Nháp"}
                    </Badge>
                  </div>
                  <h3 className="font-medium mt-0.5">{proc.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {proc.steps} bước · Cập nhật: {proc.updated}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
