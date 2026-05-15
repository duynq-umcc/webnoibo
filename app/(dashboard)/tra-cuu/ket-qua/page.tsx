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
import { BarChart2, Search, Download, Eye, Calendar, User } from "lucide-react";

export default function KetQuaPage() {
  const results = [
    { id: "KQ001", patient: "Nguyễn Văn E", dob: "15/03/1985", test: "Xét nghiệm máu tổng quát", doctor: "BS. Nguyễn Văn A", date: "14/05/2026", status: "completed", result: "Bình thường" },
    { id: "KQ002", patient: "Trần Thị F", dob: "22/07/1990", test: "Điện tim đồ", doctor: "BS. Trần Thị B", date: "13/05/2026", status: "completed", result: "Có bất thường" },
    { id: "KQ003", patient: "Lê Văn G", dob: "10/11/1978", test: "Siêu âm bụng tổng quát", doctor: "BS. Lê Văn C", date: "12/05/2026", status: "completed", result: "Bình thường" },
    { id: "KQ004", patient: "Phạm Thị H", dob: "05/04/1995", test: "Xét nghiệm đường huyết", doctor: "BS. Phạm Thị D", date: "11/05/2026", status: "processing", result: "Đang xử lý" },
    { id: "KQ005", patient: "Hoàng Văn I", dob: "18/09/1982", test: "X-quang ngực", doctor: "BS. Hoàng Văn E", date: "10/05/2026", status: "completed", result: "Có bất thường" },
    { id: "KQ006", patient: "Vũ Thị K", dob: "30/06/1988", test: "Xét nghiệm lipid máu", doctor: "BS. Nguyễn Văn A", date: "09/05/2026", status: "completed", result: "Bình thường" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kết quả xét nghiệm</h1>
          <p className="text-muted-foreground mt-1">
            Tra cứu kết quả xét nghiệm và chẩn đoán hình ảnh của bệnh nhân
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Hôm nay</div>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Kết quả có trong ngày</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Tuần này</div>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">Tổng kết quả tuần</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Chờ xử lý</div>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Chưa có kết quả</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Tra cứu kết quả
          </CardTitle>
          <CardDescription>
            Nhập mã bệnh nhân, tên hoặc số phiếu để tra cứu
          </CardDescription>
          <div className="mt-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm theo tên, mã BN hoặc số phiếu..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[5rem]">Mã KQ</TableHead>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead className="w-[5rem]">NS</TableHead>
                <TableHead>Loại xét nghiệm</TableHead>
                <TableHead>Bác sĩ chỉ định</TableHead>
                <TableHead className="w-[6rem]">Ngày</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[5rem]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.patient}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.dob}</TableCell>
                  <TableCell className="text-sm">{r.test}</TableCell>
                  <TableCell className="text-xs">{r.doctor}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={r.result === "Bình thường" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {r.result}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={r.status === "completed" ? "default" : "outline"}
                      className="text-xs"
                    >
                      {r.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-3.5 w-3.5" />
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
