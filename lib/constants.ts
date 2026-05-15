import type { NavGroup, ClinicInfo, QuickAction } from "./types";

export const CLINIC_INFO: ClinicInfo = {
  name: "Phòng Khám Bệnh Viện Đại Học Y Dược 1",
  shortName: "PK BV ĐHYD 1",
  address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
  phone: "(028) 1234 5678",
  email: "contact@pk-dhyduong1.edu.vn",
  website: "https://pk-dhyduong1.edu.vn",
};

export const NAVIGATION_GROUPS: NavGroup[] = [
  {
    title: "TRANG CHỦ",
    icon: "LayoutDashboard",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: "LayoutDashboard",
        description: "Tổng quan hệ thống",
      },
    ],
  },
  {
    title: "NGHIỆP VỤ",
    icon: "Briefcase",
    collapsible: true,
    items: [
      {
        title: "Phác đồ điều trị",
        href: "/nghiep-vu/phac-do",
        icon: "FileHeart",
        description: "Quản lý phác đồ điều trị cho bệnh nhân",
      },
      {
        title: "ICD-10",
        href: "/nghiep-vu/icd-10",
        icon: "HeartPulse",
        description: "Mã bệnh theo chuẩn ICD-10",
      },
      {
        title: "BHYT",
        href: "/nghiep-vu/bhyt",
        icon: "ShieldPlus",
        description: "Quản lý bảo hiểm y tế",
      },
      {
        title: "Quy trình & Quy định",
        href: "/nghiep-vu/quy-trinh",
        icon: "FileSearch",
        description: "Các quy trình và quy định khám chữa bệnh",
      },
      {
        title: "Tài liệu tham khảo",
        href: "/nghiep-vu/tai-lieu",
        icon: "BookOpen",
        description: "Thư viện tài liệu nội bộ",
      },
    ],
  },
  {
    title: "TRA CỨU",
    icon: "Search",
    items: [
      {
        title: "Danh mục thuốc",
        href: "/tra-cuu/thuoc",
        icon: "Pill",
        description: "Tra cứu thông tin thuốc",
      },
      {
        title: "Giá dịch vụ",
        href: "/tra-cuu/gia-dich-vu",
        icon: "Receipt",
        description: "Bảng giá các dịch vụ y tế",
      },
      {
        title: "Kết quả & CLS",
        href: "/tra-cuu/ket-qua",
        icon: "FlaskConical",
        description: "Tra cứu kết quả cận lâm sàng",
      },
    ],
  },
  {
    title: "NHÂN SỰ",
    icon: "Users",
    items: [
      {
        title: "Lịch khám bệnh",
        href: "/nhan-su/lich-kcb",
        icon: "CalendarRange",
        description: "Lịch hẹn khám chữa bệnh",
      },
      {
        title: "Danh bạ nội bộ",
        href: "/nhan-su/danh-ba",
        icon: "BookUser",
        description: "Danh bạ nhân viên",
      },
      {
        title: "Chấm công",
        href: "/nhan-su/cham-cong",
        icon: "Clock",
        description: "Bảng chấm công nhân viên",
      },
    ],
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { label: "Tạo phác đồ", href: "/nghiep-vu/phac-do", icon: "Plus" },
  { label: "Tra cứu BN", href: "/tra-cuu/ket-qua", icon: "Search" },
  { label: "Lịch khám", href: "/nhan-su/lich-kcb", icon: "Calendar" },
];
