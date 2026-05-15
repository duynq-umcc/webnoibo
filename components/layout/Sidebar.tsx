"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Briefcase,
  Search,
  Users,
  FileText,
  Pill,
  Receipt,
  BarChart2,
  Calendar,
  BookUser,
  Clock,
  ChevronLeft,
  ChevronRight,
  Menu,
  LayoutDashboard,
  FileHeart,
  HeartPulse,
  ShieldPlus,
  FileSearch,
  BookOpen,
  FlaskConical,
  CalendarRange,
  LogOut,
  User,
  Settings,
  UserCog,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { NAVIGATION_GROUPS } from "@/lib/constants";
import { ROLE_META } from "@/lib/rbac";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Search,
  Users,
  FileText,
  Pill,
  Receipt,
  BarChart2,
  Calendar,
  BookUser,
  Clock,
  LayoutDashboard,
  FileHeart,
  HeartPulse,
  ShieldPlus,
  FileSearch,
  BookOpen,
  FlaskConical,
  CalendarRange,
};

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}


// ─── Brand logo ─────────────────────────────────────────────────────────────

function ClinicLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/Logo Pk.png"
      alt="Phòng Khám Bệnh Viện ĐHYD 1"
      width={32}
      height={32}
      className={className}
    />
  );
}

// ─── User footer ─────────────────────────────────────────────────────────────

function UserFooter({
  isCollapsed,
  onCollapse,
}: {
  isCollapsed: boolean;
  onCollapse?: () => void;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  const roleMeta = ROLE_META[user.role];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (isCollapsed) {
    return (
      <div className="border-t border-[#1f2937] p-1.5 shrink-0 flex flex-col items-center gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 rounded-md text-[#64748b] hover:bg-[#1f2937] hover:text-red-400 transition-colors"
                aria-label="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
              </button>
            }
          />
          <TooltipContent side="right">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.title}</p>
            <p className="text-xs text-red-400 mt-1">Đăng xuất</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={onCollapse}
                className="flex items-center justify-center w-10 h-10 rounded-md text-[#64748b] hover:bg-[#1f2937] hover:text-white transition-colors"
                aria-label="Mở rộng"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            }
          />
          <TooltipContent side="right">
            <p>Mở rộng sidebar</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="border-t border-[#1f2937] shrink-0">
      {/* User info */}
      <div className="px-3 py-3 flex items-center gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="bg-[#1d9e75] text-white text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate leading-none">
            {user.name}
          </p>
          <p className="text-[10px] text-[#64748b] truncate mt-0.5 leading-none">
            {user.title}
          </p>
          <div className="mt-1">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] h-4 px-1.5 border-0 font-medium",
                roleMeta.color
              )}
            >
              {user.role === "admin" && (
                <ShieldPlus className="h-3 w-3 mr-0.5" />
              )}
              {roleMeta.label}
            </Badge>
          </div>
        </div>
      </div>

      <Separator className="bg-[#1f2937]" />

      {/* Actions */}
      <div className="px-2 py-1.5 flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/settings")}
                className="flex-1 h-8 text-[#64748b] hover:text-white hover:bg-[#1f2937] justify-start px-2"
              >
                <Settings className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs">Cài đặt</span>
              </Button>
            }
          />
          <TooltipContent side="right">
            <p>Cài đặt tài khoản</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex-1 h-8 text-[#64748b] hover:text-red-400 hover:bg-[#1f2937] justify-start px-2"
              >
                <LogOut className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs">Đăng xuất</span>
              </Button>
            }
          />
          <TooltipContent side="right">
            <p>Đăng xuất khỏi hệ thống</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Separator className="bg-[#1f2937]" />

      {/* Theme + collapse */}
      <div className="px-2 py-1.5 flex items-center gap-1">
        <div className="flex-1">
          <ThemeToggle />
        </div>
        {onCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCollapse}
            className="h-8 text-[#64748b] hover:text-white hover:bg-[#1f2937] px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="text-xs">Thu gọn</span>
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── NavContent ───────────────────────────────────────────────────────────────

function NavContent({
  isCollapsed,
  collapsedGroups,
  onToggleGroup,
  onCollapse,
}: {
  isCollapsed: boolean;
  collapsedGroups: Record<string, boolean>;
  onToggleGroup: (title: string) => void;
  onCollapse?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-sidebar-border shrink-0 bg-[#111827]",
          isCollapsed ? "justify-center" : "gap-3"
        )}
      >
        <ClinicLogo className="w-8 h-8 shrink-0" />
        {!isCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-[#38bdf8] tracking-wide leading-tight">
              BỆNH VIỆN ĐẠI HỌC Y DƯỢC
            </span>
            <span className="text-[10px] text-[#94a3b8] leading-tight mt-0.5">
              Phòng Khám Bệnh Viện ĐHYD 1
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4 px-2">
        <TooltipProvider delay={0}>
          {NAVIGATION_GROUPS.map((group, groupIdx) => {
            const isGroupCollapsed = collapsedGroups[group.title] ?? false;

            return (
              <div key={group.title} className="mb-4">
                {/* Group Header */}
                <button
                  onClick={() => {
                    if (group.collapsible) {
                      onToggleGroup(group.title);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 mb-2 w-full text-left",
                    isCollapsed && "justify-center",
                    group.collapsible && "cursor-pointer hover:opacity-80"
                  )}
                >
                  {React.createElement(iconMap[group.icon] || Briefcase, {
                    className: "h-4 w-4 text-[#64748b] shrink-0",
                  })}
                  {!isCollapsed && (
                    <>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b] flex-1">
                        {group.title}
                      </span>
                      {group.collapsible && (
                        <ChevronRight
                          className={cn(
                            "h-3.5 w-3.5 text-[#64748b] transition-transform duration-200 shrink-0",
                            !isGroupCollapsed && "rotate-90"
                          )}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Items */}
                {(!isGroupCollapsed || isCollapsed) &&
                  group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                    const itemContent = (
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          isActive
                            ? "border-l-[3px] border-[#1d9e75] bg-[#1d9e75]/10 text-[#1d9e75] font-semibold"
                            : "text-[#94a3b8] hover:bg-[#1f2937] hover:text-white border-l-[3px] border-transparent",
                          isCollapsed && "justify-center px-2"
                        )}
                      >
                        {React.createElement(
                          iconMap[item.icon ?? ""] || iconMap[group.icon] || FileText,
                          {
                            className: cn(
                              "h-4 w-4 shrink-0",
                              isActive ? "text-[#1d9e75]" : ""
                            ),
                          }
                        )}
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                        {!isCollapsed && item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-[10px] h-5 px-1.5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    );

                    if (isCollapsed) {
                      return (
                        <Tooltip key={item.href}>
                          <TooltipTrigger
                            render={
                              <Link
                                href={item.href}
                                className={cn(
                                  "flex items-center justify-center px-2 py-2 rounded-md text-sm transition-colors mb-0.5",
                                  isActive
                                    ? "border-l-[3px] border-[#1d9e75] bg-[#1d9e75]/10 text-[#1d9e75]"
                                    : "text-[#94a3b8] hover:bg-[#1f2937] hover:text-white border-l-[3px] border-transparent"
                                )}
                              >
                                {React.createElement(
                                  iconMap[item.icon ?? ""] ||
                                    iconMap[group.icon] ||
                                    FileText,
                                  { className: "h-4 w-4 shrink-0" }
                                )}
                              </Link>
                            }
                          />
                          <TooltipContent
                            side="right"
                            className="flex flex-col gap-1 max-w-[200px]"
                          >
                            <span className="font-medium">{item.title}</span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                    return (
                      <Link key={item.href} href={item.href} className="block mb-0.5">
                        {itemContent}
                      </Link>
                    );
                  })}
                {groupIdx < NAVIGATION_GROUPS.length - 1 && !isGroupCollapsed && (
                  <Separator className="mt-4" />
                )}
              </div>
            );
          })}
        </TooltipProvider>
      </ScrollArea>

      {/* User Footer */}
      <UserFooter isCollapsed={isCollapsed} onCollapse={onCollapse} />
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function Sidebar({
  isCollapsed,
  onToggle,
  mobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  const [internalMobileOpen, setInternalMobileOpen] = React.useState(false);
  const [collapsedGroups, setCollapsedGroups] = React.useState<
    Record<string, boolean>
  >({});

  const mobileSheetOpen = onMobileOpenChange ? mobileOpen! : internalMobileOpen;
  const setMobileSheetOpen = onMobileOpenChange
    ? onMobileOpenChange!
    : setInternalMobileOpen;

  const handleToggleGroup = (title: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-[#1f2937] h-screen sticky top-0 transition-all duration-300 shrink-0 bg-[#111827]",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        <NavContent
          isCollapsed={isCollapsed}
          collapsedGroups={collapsedGroups}
          onToggleGroup={handleToggleGroup}
          onCollapse={onToggle}
        />
      </aside>

      {/* Mobile Sheet Drawer */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent
          side="left"
          className="w-60 p-0 bg-[#111827] border-[#1f2937] [&>button]:hidden"
        >
          <NavContent
            isCollapsed={false}
            collapsedGroups={collapsedGroups}
            onToggleGroup={handleToggleGroup}
          />
        </SheetContent>
      </Sheet>

      {/* Mobile Menu Button */}
      <MobileMenuButton onClick={() => setMobileSheetOpen(true)} />
    </>
  );
}

function MobileMenuButton({
  onClick,
}: {
  onClick: React.ComponentProps<typeof Button>["onClick"];
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed bottom-4 left-4 z-40 shadow-lg bg-[#111827] text-white hover:bg-[#1f2937]"
      onClick={onClick}
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
