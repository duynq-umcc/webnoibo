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
import { Pill, Search, Plus, AlertTriangle } from "lucide-react";

export default function ThuocPage() {
  const drugs = [
    { id: "T001", name: "Paracetamol 500mg", generic: "Acetaminophen", form: "Viên nén", unit: "Viên", price: "3,500", stock: 1200, expiry: "12/2027", supplier: "Pharmacia", status: "available" },
    { id: "T002", name: "Amoxicillin 500mg", generic: "Amoxicillin", form: "Viên nang", unit: "Viên", price: "8,200", stock: 45, expiry: "06/2026", supplier: "Sapharco", status: "low" },
    { id: "T003", name: "Metformin 500mg", generic: "Metformin HCl", form: "Viên nén", unit: "Viên", price: "2,800", stock: 3400, expiry: "09/2027", supplier: "Pharmacia", status: "available" },
    { id: "T004", name: "Omeprazole 20mg", generic: "Omeprazole", form: "Viên nang", unit: "Viên", price: "6,100", stock: 890, expiry: "03/2027", supplier: "DKSH", status: "available" },
    { id: "T005", name: "Losartan 50mg", generic: "Losartan potassium", form: "Viên nén", unit: "Viên", price: "9,500", stock: 15, expiry: "02/2026", supplier: "Sapharco", status: "critical" },
    { id: "T006", name: "Ibuprofen 400mg", generic: "Ibuprofen", form: "Viên nén", unit: "Viên", price: "4,200", stock: 2100, expiry: "11/2027", supplier: "Pharmacia", status: "available" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tra cứu thuốc</h1>
          <p className="text-muted-foreground mt-1">
            Tra cứu thông tin thuốc, giá và tồn kho
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm thuốc mới
        </Button>
      </div>

      {/* Warning */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
        <AlertTriangle className="h-4 w-4 text-accent shrink-0" />
        <p className="text-sm">
          <strong>2 thuốc sắp hết hàng:</strong> Amoxicillin 500mg (còn 45 viên), Losartan 50mg (còn 15 viên)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Danh mục thuốc
          </CardTitle>
          <CardDescription>
            Tổng cộng {drugs.length} loại thuốc trong danh mục
          </CardDescription>
          <div className="mt-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm theo tên thuốc, hoạt chất..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[4rem]">Mã</TableHead>
                <TableHead>Tên thuốc</TableHead>
                <TableHead>Hoạt chất</TableHead>
                <TableHead>Dạng bào chế</TableHead>
                <TableHead className="w-[4rem]">Đơn vị</TableHead>
                <TableHead className="w-[5rem]">Giá (VNĐ)</TableHead>
                <TableHead className="w-[4rem]">Tồn kho</TableHead>
                <TableHead className="w-[5rem]">Hạn dùng</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>Tình trạng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drugs.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.generic}</TableCell>
                  <TableCell className="text-sm">{d.form}</TableCell>
                  <TableCell className="text-xs">{d.unit}</TableCell>
                  <TableCell className="font-mono text-sm">{d.price}</TableCell>
                  <TableCell className={`font-mono text-sm ${d.stock < 50 ? "text-accent font-bold" : ""}`}>
                    {d.stock}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.expiry}</TableCell>
                  <TableCell className="text-xs">{d.supplier}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        d.status === "available"
                          ? "default"
                          : d.status === "low"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {d.status === "available" ? "Còn hàng" : d.status === "low" ? "Sắp hết" : "Nguy cơ"}
                    </Badge>
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
