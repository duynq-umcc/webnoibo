"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, LogOut, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_META } from "@/lib/rbac";

interface TopbarProps {
  sidebarCollapsed?: boolean;
  onOpenCommandPalette?: () => void;
}

export function Topbar({
  sidebarCollapsed = false,
  onOpenCommandPalette,
}: TopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const mockNotifications = 3;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const roleMeta = user ? ROLE_META[user.role] : null;

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex items-center h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 gap-4 transition-all duration-300",
        sidebarCollapsed ? "md:pl-[4rem]" : "md:pl-[15rem]"
      )}
    >
      {/* Center: Search — full width */}
      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="flex-1 max-w-2xl mx-auto flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-muted/50 hover:bg-muted transition-colors text-sm text-muted-foreground cursor-text"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Tìm kiếm toàn hệ thống...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/60 bg-muted/60 px-1.5 font-mono text-[10px] text-muted-foreground">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                )}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {mockNotifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center leading-none">
                    {mockNotifications}
                  </span>
                )}
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-normal">
              Thông báo
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 cursor-pointer py-3">
              <span className="font-medium text-sm">Lịch khám hôm nay</span>
              <span className="text-xs text-muted-foreground">
                Bạn có 12 lịch khám cho hôm nay
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 cursor-pointer py-3">
              <span className="font-medium text-sm">Bệnh nhân cần xác nhận</span>
              <span className="text-xs text-muted-foreground">
                3 yêu cầu chờ xác nhận từ BHYT
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 cursor-pointer py-3">
              <span className="font-medium text-sm">Báo cáo tuần này</span>
              <span className="text-xs text-muted-foreground">
                Đã có 5 báo cáo mới cần xem
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-2 h-9 px-2 rounded-md hover:bg-muted transition-colors"
                aria-label="User menu"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-[#1d9e75] text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-medium leading-none">
                    {user?.name ?? "Đang tải..."}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                    {user?.title ?? user?.email ?? ""}
                  </span>
                </div>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name ?? "—"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email ?? "—"}
                </p>
                {roleMeta && (
                  <Badge
                    variant="secondary"
                    className={cn("w-fit mt-1 text-xs", roleMeta.color)}
                  >
                    {roleMeta.label}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Đổi mật khẩu
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
