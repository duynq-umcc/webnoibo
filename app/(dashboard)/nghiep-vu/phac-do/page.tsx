import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, FileText, MoreHorizontal } from "lucide-react";

export default function PhacDoPage() {
  const protocols = [
    { id: "PD001", name: "Phác đồ điều trị tăng huyết áp vừa", icd: "I10", doctor: "BS. Nguyễn Văn A", updated: "10/05/2026", status: "active" },
    { id: "PD002", name: "Phác đồ điều trị đái tháo đường type 2", icd: "E11", doctor: "BS. Trần Thị B", updated: "08/05/2026", status: "active" },
    { id: "PD003", name: "Phác đồ điều trị viêm phế quản cấp", icd: "J20.9", doctor: "BS. Lê Văn C", updated: "05/05/2026", status: "draft" },
    { id: "PD004", name: "Phác đồ điều trị viêm dạ dày", icd: "K29.5", doctor: "BS. Phạm Thị D", updated: "03/05/2026", status: "active" },
    { id: "PD005", name: "Phác đồ điều trị viêm khớp dạng thấp", icd: "M05.9", doctor: "BS. Hoàng Văn E", updated: "01/05/2026", status: "archived" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phác đồ điều trị</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và tra cứu phác đồ điều trị cho bệnh nhân
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo phác đồ mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Danh sách phác đồ
          </CardTitle>
          <CardDescription>
            Tổng cộng {protocols.length} phác đồ điều trị
          </CardDescription>
          <div className="mt-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm phác đồ..." className="pl-9 max-w-xs" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[5rem]">Mã PD</TableHead>
                <TableHead>Tên phác đồ</TableHead>
                <TableHead className="w-[5rem]">ICD-10</TableHead>
                <TableHead>Bác sĩ phụ trách</TableHead>
                <TableHead className="w-[6rem]">Cập nhật</TableHead>
                <TableHead className="w-[5rem]">Trạng thái</TableHead>
                <TableHead className="w-[3rem]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocols.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">{p.icd}</TableCell>
                  <TableCell>{p.doctor}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{p.updated}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === "active"
                          ? "default"
                          : p.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {p.status === "active" ? "Hoạt động" : p.status === "draft" ? "Nháp" : "Lưu trữ"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
