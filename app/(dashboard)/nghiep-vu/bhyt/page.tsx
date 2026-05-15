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
import { Shield, Search, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function BHYTPage() {
  const patients = [
    { mabhyt: "DN1 1234 5678", name: "Nguyễn Văn E", dob: "15/03/1985", expire: "31/12/2026", hospital: "PK BV ĐHYD 1", status: "active", level: "BHYT quyền lợi mức 2" },
    { mabhyt: "HCM 9876 5432", name: "Trần Thị F", dob: "22/07/1990", expire: "31/12/2026", hospital: "Bệnh viện Quân y 175", status: "active", level: "BHYT quyền lợi mức 1" },
    { mabhyt: "DN2 4567 8901", name: "Lê Văn G", dob: "10/11/1978", expire: "30/06/2026", hospital: "Bệnh viện Nhi Đồng 2", status: "expiring", level: "BHYT quyền lợi mức 3" },
    { mabhyt: "HCM 3456 7890", name: "Phạm Thị H", dob: "05/04/1995", expire: "31/12/2026", hospital: "PK BV ĐHYD 1", status: "active", level: "BHYT quyền lợi mức 2" },
    { mabhyt: "DN1 6789 0123", name: "Hoàng Văn I", dob: "18/09/1982", expire: "15/02/2026", hospital: "Bệnh viện Chợ Rẫy", status: "expired", level: "BHYT quyền lợi mức 1" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">BHYT</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin bảo hiểm y tế của bệnh nhân
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm BHYT mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Tổng thẻ BHYT", value: "1,247", icon: Shield, color: "text-primary" },
          { label: "Còn hiệu lực", value: "1,189", icon: CheckCircle2, color: "text-secondary" },
          { label: "Sắp hết hạn", value: "38", icon: Clock, color: "text-yellow-500" },
          { label: "Hết hạn", value: "20", icon: XCircle, color: "text-accent" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <div className="text-2xl font-bold mt-1">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bệnh nhân BHYT</CardTitle>
          <CardDescription>
            <div className="relative mt-2 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm theo mã BHYT hoặc tên bệnh nhân..." className="pl-9" />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã BHYT</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead className="w-[5rem]">Ngày sinh</TableHead>
                <TableHead className="w-[6rem]">Hết hạn</TableHead>
                <TableHead>Nơi đăng ký KB</TableHead>
                <TableHead>Mức quyền lợi</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.mabhyt}>
                  <TableCell className="font-mono text-xs">{p.mabhyt}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{p.dob}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{p.expire}</TableCell>
                  <TableCell className="text-sm">{p.hospital}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {p.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === "active"
                          ? "default"
                          : p.status === "expiring"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {p.status === "active" ? "Còn hiệu lực" : p.status === "expiring" ? "Sắp hết" : "Hết hạn"}
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
