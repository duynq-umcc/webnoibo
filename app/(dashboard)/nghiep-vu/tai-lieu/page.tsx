import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FolderOpen, Search, Plus, FileText, Download, Eye, MoreHorizontal } from "lucide-react";

export default function TaiLieuPage() {
  const documents = [
    { id: "TL001", name: "Sổ tay quy trình khám bệnh 2026", category: "Quy trình", size: "2.4 MB", updated: "10/05/2026", type: "PDF" },
    { id: "TL002", name: "Danh mục thuốc lõi BHYT", category: "Dược", size: "1.1 MB", updated: "05/05/2026", type: "XLSX" },
    { id: "TL003", name: "Hướng dẫn sử dụng phần mềm HIS", category: "CNTT", size: "5.8 MB", updated: "01/05/2026", type: "PDF" },
    { id: "TL004", name: "Bảng giá dịch vụ y tế", category: "Tài chính", size: "890 KB", updated: "15/04/2026", type: "PDF" },
    { id: "TL005", name: "Quy định về an toàn sinh học", category: "An toàn", size: "1.6 MB", updated: "20/03/2026", type: "DOCX" },
    { id: "TL006", name: "Mẫu đơn xin khám bệnh", category: "Biểu mẫu", size: "245 KB", updated: "01/03/2026", type: "DOCX" },
    { id: "TL007", name: "Khung chương trình đào tạo nội bộ", category: "Nhân sự", size: "3.2 MB", updated: "15/02/2026", type: "PDF" },
    { id: "TL008", name: "Hướng dẫn chẩn đoán ICD-10", category: "Y khoa", size: "8.5 MB", updated: "01/01/2026", type: "PDF" },
  ];

  const categories = ["Tất cả", "Quy trình", "Dược", "CNTT", "Tài chính", "An toàn", "Biểu mẫu", "Nhân sự", "Y khoa"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tài liệu</h1>
          <p className="text-muted-foreground mt-1">
            Thư viện tài liệu nội bộ của phòng khám
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tải lên tài liệu
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
        <Input placeholder="Tìm kiếm tài liệu..." className="pl-9" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{doc.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <Badge variant="secondary" className="text-[10px]">
                  {doc.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {doc.type}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Button variant="ghost" size="sm" className="h-7 text-xs flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Xem
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Tải
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                Cập nhật: {doc.updated}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
