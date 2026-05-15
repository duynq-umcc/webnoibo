import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookUser, Search, Plus, Phone, Mail, Building2 } from "lucide-react";

export default function DanhBaPage() {
  const staff = [
    { id: "NS001", name: "BS. Nguyễn Văn A", role: "Bác sĩ", department: "Nội tổng hợp", phone: "0901 234 567", email: "nvana@pk-dhyduong1.edu.vn", status: "active" },
    { id: "NS002", name: "BS. Trần Thị B", role: "Bác sĩ", department: "Nội tổng hợp", phone: "0902 345 678", email: "ttb@pk-dhyduong1.edu.vn", status: "active" },
    { id: "NS003", name: "BS. Lê Văn C", role: "Bác sĩ", department: "Tim mạch", phone: "0903 456 789", email: "lvc@pk-dhyduong1.edu.vn", status: "active" },
    { id: "NS004", name: "BS. Phạm Thị D", role: "Bác sĩ", department: "Tiêu hóa", phone: "0904 567 890", email: "ptd@pk-dhyduong1.edu.vn", status: "active" },
    { id: "NS005", name: "BS. Hoàng Văn E", role: "Bác sĩ", department: "Cơ xương khớp", phone: "0905 678 901", email: "hve@pk-dhyduong1.edu.vn", status: "active" },
    { id: "NS006", name: "ĐD. Ngô Thị F", role: "Điều dưỡng", department: "Nội tổng hợp", phone: "0912 345 678", email: "ntf@pk-dhyduong1.edu.vn", status: "active" },
    { id: "NS007", name: "NV. Vũ Văn G", role: "Nhân viên", department: "Hành chính", phone: "0923 456 789", email: "vvg@pk-dhyduong1.edu.vn", status: "active" },
    { id: "NS008", name: "BS. Đặng Thị H", role: "Bác sĩ", department: "Nội tổng hợp", phone: "0934 567 890", email: "dth@pk-dhyduong1.edu.vn", status: "leave" },
  ];

  const departments = ["Tất cả", "Nội tổng hợp", "Tim mạch", "Tiêu hóa", "Cơ xương khớp", "Hành chính"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Danh bạ nhân viên</h1>
          <p className="text-muted-foreground mt-1">
            Tra cứu thông tin liên lạc của nhân viên phòng khám
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhân viên
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {departments.map((dept) => (
          <Button
            key={dept}
            variant={dept === "Tất cả" ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            {dept}
          </Button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm theo tên, số điện thoại..." className="pl-9" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookUser className="h-5 w-5" />
            Nhân viên ({staff.length})
          </CardTitle>
          <CardDescription>
            Tổng cộng {staff.filter((s) => s.status === "active").length} nhân viên đang làm việc
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Chức vụ</TableHead>
                <TableHead>Khoa/Phòng</TableHead>
                <TableHead>Điện thoại</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {s.name
                            .split(" ")
                            .map((n) => n[n.length - 1])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{s.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{s.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {s.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      {s.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {s.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {s.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={s.status === "active" ? "default" : "outline"}
                      className="text-xs"
                    >
                      {s.status === "active" ? "Đang làm" : "Nghỉ phép"}
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
