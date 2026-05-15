export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  department: string;
  hasBhyt: boolean;
  avatarColor: string;
  schedule: {
    mon?: ("sáng" | "chiều" | "cả ngày")[];
    tue?: ("sáng" | "chiều" | "cả ngày")[];
    wed?: ("sáng" | "chiều" | "cả ngày")[];
    thu?: ("sáng" | "chiều" | "cả ngày")[];
    fri?: ("sáng" | "chiều" | "cả ngày")[];
    sat?: ("sáng" | "chiều" | "cả ngày")[];
  };
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-teal-500",
];

export const DOCTORS: Doctor[] = [
  {
    id: "BS01",
    name: "Nguyễn Văn A",
    title: "GS.TS",
    specialty: "Nội tổng hợp",
    department: "Nội tổng hợp",
    hasBhyt: true,
    avatarColor: AVATAR_COLORS[0],
    schedule: {
      mon: ["sáng"],
      tue: ["chiều"],
      wed: ["sáng"],
      thu: ["sáng", "chiều"],
      fri: ["chiều"],
      sat: ["sáng"],
    },
  },
  {
    id: "BS02",
    name: "Trần Thị B",
    title: "PGS.TS",
    specialty: "Nội tổng hợp",
    department: "Nội tổng hợp",
    hasBhyt: true,
    avatarColor: AVATAR_COLORS[1],
    schedule: {
      mon: ["chiều"],
      wed: ["sáng"],
      thu: ["chiều"],
      fri: ["sáng"],
      sat: ["sáng"],
    },
  },
  {
    id: "BS03",
    name: "Lê Văn C",
    title: "BS",
    specialty: "Nội tổng hợp",
    department: "Nội tổng hợp",
    hasBhyt: false,
    avatarColor: AVATAR_COLORS[2],
    schedule: {
      tue: ["sáng"],
      wed: ["chiều"],
      fri: ["sáng"],
    },
  },
  {
    id: "BS04",
    name: "Phạm Thị D",
    title: "TS.BS",
    specialty: "Tim mạch",
    department: "Tim mạch",
    hasBhyt: false,
    avatarColor: AVATAR_COLORS[3],
    schedule: {
      mon: ["sáng", "chiều"],
      tue: ["chiều"],
      wed: ["sáng", "chiều"],
      thu: ["chiều"],
      fri: ["sáng", "chiều"],
    },
  },
  {
    id: "BS05",
    name: "Hoàng Văn E",
    title: "ThS.BS",
    specialty: "Tiêu hóa",
    department: "Tiêu hóa",
    hasBhyt: true,
    avatarColor: AVATAR_COLORS[4],
    schedule: {
      mon: ["chiều"],
      tue: ["sáng"],
      wed: ["chiều"],
      thu: ["sáng"],
      fri: ["chiều"],
    },
  },
  {
    id: "BS06",
    name: "Đặng Thị H",
    title: "BS",
    specialty: "Ngoại tổng hợp",
    department: "Ngoại tổng hợp",
    hasBhyt: false,
    avatarColor: AVATAR_COLORS[5],
    schedule: {
      mon: ["chiều"],
      tue: ["sáng"],
      wed: ["chiều"],
      thu: ["sáng"],
      fri: ["chiều"],
    },
  },
  {
    id: "BS12",
    name: "Hoàng Minh T.",
    title: "ThS.BS",
    specialty: "Siêu âm",
    department: "Cận lâm sàng",
    hasBhyt: false,
    avatarColor: AVATAR_COLORS[6],
    schedule: {
      mon: ["sáng"],
      tue: ["sáng"],
      wed: ["sáng"],
      thu: ["sáng"],
      fri: ["sáng"],
      sat: ["sáng"],
    },
  },
  {
    id: "BS13",
    name: "Trần Gia K.",
    title: "BS",
    specialty: "X-quang",
    department: "Cận lâm sàng",
    hasBhyt: false,
    avatarColor: AVATAR_COLORS[7],
    schedule: {
      mon: ["sáng"],
      tue: ["sáng"],
      wed: ["sáng"],
      thu: ["sáng"],
      fri: ["sáng"],
      sat: ["sáng"],
    },
  },
  {
    id: "BS14",
    name: "Nguyễn Lan P.",
    title: "ThS.BS",
    specialty: "Xét nghiệm",
    department: "Cận lâm sàng",
    hasBhyt: false,
    avatarColor: AVATAR_COLORS[0],
    schedule: {
      mon: ["sáng"],
      tue: ["sáng"],
      wed: ["sáng"],
      thu: ["sáng"],
      fri: ["sáng"],
      sat: ["sáng"],
    },
  },
  {
    id: "BS15",
    name: "Vũ Thị Q.",
    title: "ThS.BS",
    specialty: "Hô hấp",
    department: "Hô hấp",
    hasBhyt: false,
    avatarColor: AVATAR_COLORS[1],
    schedule: {
      tue: ["sáng"],
      thu: ["sáng"],
      fri: ["sáng"],
    },
  },
  {
    id: "BS16",
    name: "Đặng Minh R.",
    title: "BS",
    specialty: "Nội tiết – Đái tháo đường",
    department: "Nội tiết",
    hasBhyt: false,
    avatarColor: AVATAR_COLORS[2],
    schedule: {
      wed: ["sáng"],
      fri: ["sáng"],
    },
  },
  {
    id: "BS17",
    name: "Lý Hùng S.",
    title: "TS.BS",
    specialty: "Cơ xương khớp",
    department: "Cơ xương khớp",
    hasBhyt: false,
    avatarColor: AVATAR_COLORS[3],
    schedule: {
      wed: ["chiều"],
      fri: ["sáng", "chiều"],
    },
  },
  {
    id: "BS18",
    name: "Phan Thanh T.",
    title: "ThS.BS",
    specialty: "Tai Mũi Họng",
    department: "Khu VIP",
    hasBhyt: false,
    avatarColor: AVATAR_COLORS[4],
    schedule: {
      sat: ["sáng", "chiều"],
    },
  },
];

export function getDoctorInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
