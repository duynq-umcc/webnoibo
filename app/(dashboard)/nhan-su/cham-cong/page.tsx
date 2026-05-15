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
import { Clock, Search, CheckCircle2, XCircle, AlertCircle, Download } from "lucide-react";

export default function ChamCongPage() {
  const records = [
    { id: "CC001", name: "BS. Nguyễn Văn A", role: "Bác sĩ", date: "15/05/2026", checkIn: "07:45", checkOut: "17:30", workHours: "9h 45m", status: "present" },
    { id: "CC002", name: "BS. Trần Thị B", role: "Bác sĩ", date: "15/05/2026", checkIn: "07:50", checkOut: "17:15", workHours: "9h 25m", status: "present" },
    { id: "CC003", name: "BS. Lê Văn C", role: "Bác sĩ", date: "15/05/2026", checkIn: "08:05", checkOut: "—", workHours: "Đang làm", status: "working" },
    { id: "CC004", name: "ĐD. Ngô Thị F", role: "Điều dưỡng", date: "15/05/2026", checkIn: "07:30", checkOut: "17:00", workHours: "9h 30m", status: "present" },
    { id: "CC005", name: "NV. Vũ Văn G", role: "Nhân viên", date: "15/05/2026", checkIn: "—", checkOut: "—", workHours: "Nghỉ phép", status: "absent" },
    { id: "CC006", name: "ĐD. Trần Thị H", role: "Điều dưỡng", date: "15/05/2026", checkIn: "07:48", checkOut: "17:20", workHours: "9h 32m", status: "present" },
    { id: "CC007", name: "BS. Phạm Thị D", role: "Bác sĩ", date: "15/05/2026", checkIn: "08:30", checkOut: "17:10", workHours: "8h 40m", status: "late" },
    { id: "CC008", name: "NV. Lê Văn I", role: "Nhân viên", date: "15/05/2026", checkIn: "07:55", checkOut: "17:25", workHours: "9h 30m", status: "present" },
  ];

  const statusConfig = {
    present: { label: "Có mặt", variant: "default" as const, icon: CheckCircle2, color: "text-secondary" },
    working: { label: "Đang làm", variant: "secondary" as const, icon: Clock, color: "text-primary" },
    absent: { label: "Nghỉ phép", variant: "outline" as const, icon: XCircle, color: "text-muted-foreground" },
    late: { label: "Đi muộn", variant: "secondary" as const, icon: AlertCircle, color: "text-yellow-500" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chấm công</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi giờ làm việc của nhân viên phòng khám
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button>
            Chấm công hôm nay
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Tổng nhân viên", value: "24", icon: Clock, color: "text-primary" },
          { label: "Có mặt", value: "18", icon: CheckCircle2, color: "text-secondary" },
          { label: "Vắng mặt", value: "2", icon: XCircle, color: "text-accent" },
          { label: "Đi muộn", value: "3", icon: AlertCircle, color: "text-yellow-500" },
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

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm theo tên nhân viên..." className="pl-9" />
        </div>
        <div className="flex gap-2 items-center">
          <Input type="date" className="w-auto" defaultValue="2026-05-15" />
          <Badge variant="secondary">Ngày 15/05/2026</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Bảng chấm công
          </CardTitle>
          <CardDescription>
            Giờ làm việc: 07:30 — 17:30 (nghỉ trưa 12:00 — 13:00)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Chức vụ</TableHead>
                <TableHead className="w-[5rem]">Ngày</TableHead>
                <TableHead className="w-[4rem]">Giờ vào</TableHead>
                <TableHead className="w-[5rem]">Giờ ra</TableHead>
                <TableHead className="w-[5rem]">Tổng giờ</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => {
                const cfg = statusConfig[r.status as keyof typeof statusConfig];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-sm">{r.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {r.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                    <TableCell className={`font-mono text-sm ${r.checkIn === "—" ? "text-muted-foreground" : ""}`}>
                      {r.checkIn}
                    </TableCell>
                    <TableCell className={`font-mono text-sm ${r.checkOut === "—" ? "text-muted-foreground" : ""}`}>
                      {r.checkOut}
                    </TableCell>
                    <TableCell className="text-sm font-medium">{r.workHours}</TableCell>
                    <TableCell>
                      <Badge variant={cfg.variant} className="text-xs gap-1">
                        <cfg.icon className={`h-3 w-3 ${cfg.color}`} />
                        {cfg.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
