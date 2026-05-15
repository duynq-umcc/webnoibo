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
import { Receipt, Search, Plus, CheckCircle2 } from "lucide-react";

export default function GiaDichVuPage() {
  const services = [
    { id: "DV001", name: "Khám tổng quát", category: "Khám bệnh", price: "150,000", bhyt: true, type: "Ngoại trú" },
    { id: "DV002", name: "Khám chuyên khoa Tim mạch", category: "Chuyên khoa", price: "200,000", bhyt: true, type: "Ngoại trú" },
    { id: "DV003", name: "Siêu âm bụng tổng quát", category: "Cận lâm sàng", price: "180,000", bhyt: true, type: "Cận lâm sàng" },
    { id: "DV004", name: "Xét nghiệm máu tổng quát (18 chỉ số)", category: "Xét nghiệm", price: "320,000", bhyt: true, type: "Cận lâm sàng" },
    { id: "DV005", name: "Điện tim đồ (ECG)", category: "Cận lâm sàng", price: "120,000", bhyt: true, type: "Cận lâm sàng" },
    { id: "DV006", name: "Nội soi dạ dày", category: "Chuyên khoa", price: "450,000", bhyt: true, type: "Chuyên sâu" },
    { id: "DV007", name: "Chụp X-quang ngực", category: "Cận lâm sàng", price: "95,000", bhyt: true, type: "Cận lâm sàng" },
    { id: "DV008", name: "Tái khám theo y lệnh", category: "Khám bệnh", price: "80,000", bhyt: true, type: "Ngoại trú" },
    { id: "DV009", name: "Tiêm truyền tĩnh mạch", category: "Điều trị", price: "65,000", bhyt: false, type: "Điều trị" },
    { id: "DV010", name: "Khám sức khỏe định kỳ", category: "Khám bệnh", price: "500,000", bhyt: false, type: "Sức khỏe" },
  ];

  const categories = ["Tất cả", "Khám bệnh", "Chuyên khoa", "Cận lâm sàng", "Xét nghiệm", "Điều trị", "Sức khỏe"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Giá dịch vụ</h1>
          <p className="text-muted-foreground mt-1">
            Bảng giá các dịch vụ y tế tại phòng khám
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Cập nhật giá
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
        <Input placeholder="Tìm kiếm dịch vụ..." className="pl-9" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Danh mục dịch vụ y tế
          </CardTitle>
          <CardDescription>
            Giá được niêm yết theo quy định của Bộ Y tế và Bảo hiểm xã hội
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[4rem]">Mã DV</TableHead>
                <TableHead>Tên dịch vụ</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Loại hình</TableHead>
                <TableHead className="w-[7rem]">Giá (VNĐ)</TableHead>
                <TableHead className="w-[5rem]">BHYT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {s.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.type}</TableCell>
                  <TableCell className="font-mono font-medium">{s.price}</TableCell>
                  <TableCell>
                    {s.bhyt ? (
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
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
