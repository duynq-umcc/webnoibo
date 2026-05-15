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
import { Search, ClipboardList, Copy } from "lucide-react";

export default function ICD10Page() {
  const codes = [
    { code: "A00-B99", chapter: "Bệnh truyền nhiễm và ký sinh trùng" },
    { code: "E10-E14", chapter: "Bệnh nội tiết, dinh dưỡng và chuyển hóa" },
    { code: "I10-I15", chapter: "Bệnh hệ tuần hoàn" },
    { code: "J00-J99", chapter: "Bệnh hệ hô hấp" },
    { code: "K00-K93", chapter: "Bệnh hệ tiêu hóa" },
    { code: "M00-M99", chapter: "Bệnh cơ xương khớp và mô liên kết" },
    { code: "N00-N99", chapter: "Bệnh hệ tiết niệu - sinh dục" },
    { code: "R00-R99", chapter: "Triệu chứng, dấu hiệu và kết quả bất thường" },
  ];

  const subcodes = [
    { code: "I10", name: "Tăng huyết áp nguyên phát (Primary hypertension)" },
    { code: "I11.9", name: "Bệnh tim do tăng huyết áp không suy tim" },
    { code: "E11.9", name: "Đái tháo đường type 2 không biến chứng" },
    { code: "J18.9", name: "Viêm phổi không xác định" },
    { code: "K29.5", name: "Viêm dạ dày mạn tính" },
    { code: "M54.5", name: "Đau thắt lưng thấp (Low back pain)" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ICD-10</h1>
          <p className="text-muted-foreground mt-1">
            Tra cứu mã bệnh theo chuẩn ICD-10 (International Classification of Diseases)
          </p>
        </div>
        <Button variant="outline">
          <ClipboardList className="mr-2 h-4 w-4" />
          Hướng dẫn sử dụng
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm mã ICD-10</CardTitle>
          <CardDescription>Nhập từ khóa để tra cứu mã bệnh</CardDescription>
          <div className="mt-3">
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm theo mã hoặc tên bệnh..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nhóm bệnh chính</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên nhóm bệnh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((c) => (
                  <TableRow key={c.code} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono font-medium text-sm">{c.code}</TableCell>
                    <TableCell className="text-sm">{c.chapter}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mã bệnh thường dùng</CardTitle>
            <CardDescription>Các mã ICD-10 được sử dụng phổ biến tại phòng khám</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5rem]">Mã</TableHead>
                  <TableHead>Tên bệnh</TableHead>
                  <TableHead className="w-[3rem]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subcodes.map((c) => (
                  <TableRow key={c.code}>
                    <TableCell className="font-mono font-medium">{c.code}</TableCell>
                    <TableCell className="text-sm">{c.name}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
