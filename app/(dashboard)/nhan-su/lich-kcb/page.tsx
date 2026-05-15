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
import { Calendar, Search, Plus, Clock, MapPin, User } from "lucide-react";

export default function LichKCBPage() {
  const appointments = [
    { id: "LC001", time: "08:00", patient: "Nguyễn Văn E", dob: "15/03/1985", reason: "Tái khám tăng huyết áp", doctor: "BS. Nguyễn Văn A", room: "P. 201", status: "confirmed" },
    { id: "LC002", time: "08:30", patient: "Trần Thị F", dob: "22/07/1990", reason: "Khám tổng quát", doctor: "BS. Trần Thị B", room: "P. 202", status: "confirmed" },
    { id: "LC003", time: "09:00", patient: "Lê Văn G", dob: "10/11/1978", reason: "Tái khám đái tháo đường", doctor: "BS. Nguyễn Văn A", room: "P. 201", status: "waiting" },
    { id: "LC004", time: "09:30", patient: "Phạm Thị H", dob: "05/04/1995", reason: "Khám chuyên khoa Tim mạch", doctor: "BS. Lê Văn C", room: "P. 203", status: "confirmed" },
    { id: "LC005", time: "10:00", patient: "Hoàng Văn I", dob: "18/09/1982", reason: "Xét nghiệm máu", doctor: "BS. Trần Thị B", room: "P. 202", status: "cancelled" },
    { id: "LC006", time: "10:30", patient: "Vũ Thị K", dob: "30/06/1988", reason: "Tái khám viêm dạ dày", doctor: "BS. Phạm Thị D", room: "P. 204", status: "confirmed" },
    { id: "LC007", time: "11:00", patient: "Đặng Văn L", dob: "12/01/1975", reason: "Siêu âm bụng", doctor: "BS. Hoàng Văn E", room: "P. 205", status: "confirmed" },
    { id: "LC008", time: "11:30", patient: "Bùi Thị M", dob: "08/05/1992", reason: "Khám tổng quát", doctor: "BS. Nguyễn Văn A", room: "P. 201", status: "waiting" },
  ];

  const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch khám chữa bệnh</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý lịch hẹn và lịch khám của bệnh nhân
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Đặt lịch mới
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm theo tên bệnh nhân, bác sĩ..." className="pl-9" />
        </div>
        <div className="flex gap-2 items-center">
          <Input type="date" className="w-auto" defaultValue="2026-05-15" />
          <Badge variant="secondary">Hôm nay · 15/05/2026</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Tổng lịch hẹn</div>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Đã xác nhận</div>
            <div className="text-2xl font-bold text-secondary">18</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Đang chờ</div>
            <div className="text-2xl font-bold text-yellow-500">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Đã hủy</div>
            <div className="text-2xl font-bold text-accent">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Danh sách lịch khám hôm nay
          </CardTitle>
          <CardDescription>
            Ngày 15/05/2026 — 24 lịch hẹn
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[4rem]">Giờ</TableHead>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead className="w-[5rem]">NS</TableHead>
                <TableHead>Lý do khám</TableHead>
                <TableHead>Bác sĩ</TableHead>
                <TableHead className="w-[4rem]">Phòng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[3rem]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-mono font-medium">{apt.time}</TableCell>
                  <TableCell className="font-medium">{apt.patient}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{apt.dob}</TableCell>
                  <TableCell className="text-sm">{apt.reason}</TableCell>
                  <TableCell className="text-xs">{apt.doctor}</TableCell>
                  <TableCell className="font-mono text-xs">{apt.room}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        apt.status === "confirmed"
                          ? "default"
                          : apt.status === "waiting"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {apt.status === "confirmed" ? "Đã xác nhận" : apt.status === "waiting" ? "Đang chờ" : "Đã hủy"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Clock className="h-3.5 w-3.5" />
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
