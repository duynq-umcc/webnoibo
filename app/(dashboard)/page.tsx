"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { CLINIC_INFO } from "@/lib/constants";
import {
  CalendarRange,
  Pill,
  FileText,
  Clock,
  Activity,
} from "lucide-react";

const stats = [
  { title: "Lịch khám hôm nay", value: "24", change: "+3 so với hôm qua", icon: CalendarRange, color: "text-blue-500 bg-blue-500/10", trend: "up" },
  { title: "Bệnh nhân đang khám", value: "8", change: "Đang trong quá trình", icon: Activity, color: "text-green-500 bg-green-500/10", trend: "neutral" },
  { title: "Phác đồ đang áp dụng", value: "156", change: "+12 tuần này", icon: FileText, color: "text-purple-500 bg-purple-500/10", trend: "up" },
  { title: "Thuốc trong kho", value: "1,240", change: "Còn 3 ngày dự trữ", icon: Pill, color: "text-orange-500 bg-orange-500/10", trend: "neutral" },
];

const recentActivity = [
  { id: 1, action: "Hoàn thành khám bệnh", user: "BS. Nguyễn Văn A", patient: "Trần Thị H — Mã BN: BN00123", time: "10 phút trước", type: "success" as const },
  { id: 2, action: "Kê đơn thuốc", user: "BS. Trần Thị B", patient: "Lê Văn C — Mã BN: BN00124", time: "25 phút trước", type: "success" as const },
  { id: 3, action: "Cập nhật phác đồ", user: "BS. Lê Văn C", patient: "Phác đồ PD002 — ĐTĐ Type 2", time: "1 giờ trước", type: "info" as const },
  { id: 4, action: "Xác nhận BHYT", user: "NV. Phạm Thị D", patient: "Hoàng Văn E — Mã BN: BN00125", time: "2 giờ trước", type: "info" as const },
  { id: 5, action: "Bệnh nhân chờ xếp lịch", user: "NV. Nguyễn Văn E", patient: "4 bệnh nhân chờ xếp lịch", time: "3 giờ trước", type: "warning" as const },
];

const upcomingAppointments = [
  { time: "14:00", patient: "Trần Thị H", reason: "Tái khám tăng huyết áp", doctor: "BS. Nguyễn Văn A" },
  { time: "14:30", patient: "Lê Văn C", reason: "Khám định kỳ đái tháo đường", doctor: "BS. Trần Thị B" },
  { time: "15:00", patient: "Phạm Thị K", reason: "Triệu chứng ho, sốt 3 ngày", doctor: "BS. Lê Văn C" },
  { time: "15:30", patient: "Hoàng Văn E", reason: "Tái khám sau 1 tuần", doctor: "BS. Nguyễn Văn A" },
  { time: "16:00", patient: "Vũ Thị M", reason: "Khám tổng quát", doctor: "BS. Trần Thị B" },
];

export default function RootPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Xin chào, {user?.name?.split(" ").pop() ?? user?.email?.split("@")[0] ?? "Quản trị viên"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {CLINIC_INFO.name} — {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={stat.color + " p-2 rounded-lg"}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content: Activity + Appointments */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription>5 hoạt động mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div
                  className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    item.type === "success"
                      ? "bg-green-500"
                      : item.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.patient}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              Lịch khám sắp tới
            </CardTitle>
            <CardDescription>Hôm nay, {upcomingAppointments.length} lịch hẹn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.map((apt, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="text-center shrink-0 w-12">
                  <div className="text-sm font-bold text-primary">{apt.time}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{apt.patient}</p>
                  <p className="text-xs text-muted-foreground truncate">{apt.reason}</p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0 hidden sm:flex">
                  {apt.doctor}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
