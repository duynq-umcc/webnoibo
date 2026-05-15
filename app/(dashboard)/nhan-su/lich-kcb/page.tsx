"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Upload,
  Stethoscope,
  MapPin,
  Clock,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// ─── Types ───────────────────────────────────────────────────────────────────

type SessionType = "morning" | "afternoon" | "allday";
type SectionType = "cls" | "noi-khoa" | "ngoai-khoa" | "vip";

interface Doctor {
  id: string;
  name: string;
  title: string;
  isBhyt: boolean;
  note?: string;
}

interface DaySchedule {
  morning?: Doctor[];
  afternoon?: Doctor[];
  allday?: Doctor[];
}

interface Schedule {
  id: string;
  room: string;
  floor: string;
  department: string;
  specialty: string;
  section: SectionType;
  schedule: { [day: string]: DaySchedule };
}

interface ScheduleEntry {
  doctor: Doctor;
  session: SessionType;
  room: string;
  floor: string;
  specialty: string;
  section: SectionType;
  department: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const ALL_SCHEDULES: Schedule[] = [
  // CẬN LÂM SÀNG
  {
    id: "CLS001",
    room: "309",
    floor: "Tầng 3",
    department: "Cận lâm sàng",
    specialty: "Siêu âm",
    section: "cls",
    schedule: {
      mon: { morning: [{ id: "BS12", name: "BS. Hoàng Minh T.", title: "ThS.BS", isBhyt: false }] },
      tue: { morning: [{ id: "BS12", name: "BS. Hoàng Minh T.", title: "ThS.BS", isBhyt: false }] },
      wed: { morning: [{ id: "BS12", name: "BS. Hoàng Minh T.", title: "ThS.BS", isBhyt: false }] },
      thu: { morning: [{ id: "BS12", name: "BS. Hoàng Minh T.", title: "ThS.BS", isBhyt: false }] },
      fri: { morning: [{ id: "BS12", name: "BS. Hoàng Minh T.", title: "ThS.BS", isBhyt: false }] },
      sat: { morning: [{ id: "BS12", name: "BS. Hoàng Minh T.", title: "ThS.BS", isBhyt: false }] },
    },
  },
  {
    id: "CLS002",
    room: "310",
    floor: "Tầng 3",
    department: "Cận lâm sàng",
    specialty: "X-quang",
    section: "cls",
    schedule: {
      mon: { morning: [{ id: "BS13", name: "BS. Trần Gia K.", title: "BS", isBhyt: false }] },
      tue: { morning: [{ id: "BS13", name: "BS. Trần Gia K.", title: "BS", isBhyt: false }] },
      wed: { morning: [{ id: "BS13", name: "BS. Trần Gia K.", title: "BS", isBhyt: false }] },
      thu: { morning: [{ id: "BS13", name: "BS. Trần Gia K.", title: "BS", isBhyt: false }] },
      fri: { morning: [{ id: "BS13", name: "BS. Trần Gia K.", title: "BS", isBhyt: false }] },
      sat: { morning: [{ id: "BS13", name: "BS. Trần Gia K.", title: "BS", isBhyt: false }] },
    },
  },
  {
    id: "CLS003",
    room: "311",
    floor: "Tầng 3",
    department: "Cận lâm sàng",
    specialty: "Xét nghiệm",
    section: "cls",
    schedule: {
      mon: { morning: [{ id: "BS14", name: "BS. Nguyễn Lan P.", title: "ThS.BS", isBhyt: false }] },
      tue: { morning: [{ id: "BS14", name: "BS. Nguyễn Lan P.", title: "ThS.BS", isBhyt: false }] },
      wed: { morning: [{ id: "BS14", name: "BS. Nguyễn Lan P.", title: "ThS.BS", isBhyt: false }] },
      thu: { morning: [{ id: "BS14", name: "BS. Nguyễn Lan P.", title: "ThS.BS", isBhyt: false }] },
      fri: { morning: [{ id: "BS14", name: "BS. Nguyễn Lan P.", title: "ThS.BS", isBhyt: false }] },
      sat: { morning: [{ id: "BS14", name: "BS. Nguyễn Lan P.", title: "ThS.BS", isBhyt: false }] },
    },
  },
  // NỘI KHOA
  {
    id: "NK001",
    room: "201",
    floor: "Tầng 2",
    department: "Nội tổng hợp",
    specialty: "Nội tổng hợp",
    section: "noi-khoa",
    schedule: {
      mon: {
        morning: [{ id: "BS01", name: "BS. Nguyễn Văn A", title: "GS.TS", isBhyt: true, note: "Khám BHYT" }],
        afternoon: [{ id: "BS02", name: "BS. Trần Thị B", title: "PGS.TS", isBhyt: true, note: "Khám BHYT" }],
      },
      tue: {
        morning: [{ id: "BS03", name: "BS. Lê Văn C", title: "BS", isBhyt: false }],
        afternoon: [{ id: "BS01", name: "BS. Nguyễn Văn A", title: "GS.TS", isBhyt: true, note: "Khám BHYT" }],
      },
      wed: {
        morning: [{ id: "BS02", name: "BS. Trần Thị B", title: "PGS.TS", isBhyt: true, note: "Khám BHYT" }],
        afternoon: [{ id: "BS03", name: "BS. Lê Văn C", title: "BS", isBhyt: false }],
      },
      thu: {
        morning: [{ id: "BS01", name: "BS. Nguyễn Văn A", title: "GS.TS", isBhyt: true, note: "Khám BHYT" }],
        afternoon: [{ id: "BS02", name: "BS. Trần Thị B", title: "PGS.TS", isBhyt: true, note: "Khám BHYT" }],
      },
      fri: {
        morning: [{ id: "BS03", name: "BS. Lê Văn C", title: "BS", isBhyt: false }],
        afternoon: [{ id: "BS01", name: "BS. Nguyễn Văn A", title: "GS.TS", isBhyt: true, note: "Khám BHYT" }],
      },
      sat: { morning: [{ id: "BS02", name: "BS. Trần Thị B", title: "PGS.TS", isBhyt: false }] },
    },
  },
  {
    id: "NK002",
    room: "202",
    floor: "Tầng 2",
    department: "Tim mạch",
    specialty: "Tim mạch",
    section: "noi-khoa",
    schedule: {
      mon: {
        morning: [{ id: "BS04", name: "BS. Phạm Thị D", title: "TS.BS", isBhyt: false }],
        afternoon: [{ id: "BS04", name: "BS. Phạm Thị D", title: "TS.BS", isBhyt: false }],
      },
      tue: {
        afternoon: [{ id: "BS04", name: "BS. Phạm Thị D", title: "TS.BS", isBhyt: false }],
      },
      wed: {
        morning: [{ id: "BS04", name: "BS. Phạm Thị D", title: "TS.BS", isBhyt: false }],
        afternoon: [{ id: "BS04", name: "BS. Phạm Thị D", title: "TS.BS", isBhyt: false }],
      },
      thu: {
        afternoon: [{ id: "BS04", name: "BS. Phạm Thị D", title: "TS.BS", isBhyt: false }],
      },
      fri: {
        morning: [{ id: "BS04", name: "BS. Phạm Thị D", title: "TS.BS", isBhyt: false }],
        afternoon: [{ id: "BS04", name: "BS. Phạm Thị D", title: "TS.BS", isBhyt: false }],
      },
      sat: {},
    },
  },
  {
    id: "NK003",
    room: "203",
    floor: "Tầng 2",
    department: "Tiêu hóa",
    specialty: "Tiêu hóa",
    section: "noi-khoa",
    schedule: {
      mon: {
        afternoon: [{ id: "BS05", name: "BS. Hoàng Văn E", title: "ThS.BS", isBhyt: true, note: "Khám BHYT" }],
      },
      tue: {
        morning: [{ id: "BS05", name: "BS. Hoàng Văn E", title: "ThS.BS", isBhyt: true, note: "Khám BHYT" }],
      },
      wed: {
        afternoon: [{ id: "BS05", name: "BS. Hoàng Văn E", title: "ThS.BS", isBhyt: true, note: "Khám BHYT" }],
      },
      thu: {
        morning: [{ id: "BS05", name: "BS. Hoàng Văn E", title: "ThS.BS", isBhyt: true, note: "Khám BHYT" }],
      },
      fri: {
        afternoon: [{ id: "BS05", name: "BS. Hoàng Văn E", title: "ThS.BS", isBhyt: true, note: "Khám BHYT" }],
      },
      sat: {},
    },
  },
  {
    id: "NK004",
    room: "204",
    floor: "Tầng 2",
    department: "Hô hấp",
    specialty: "Hô hấp",
    section: "noi-khoa",
    schedule: {
      mon: {},
      tue: {
        morning: [{ id: "BS15", name: "BS. Vũ Thị Q.", title: "ThS.BS", isBhyt: false }],
      },
      wed: {},
      thu: {
        morning: [{ id: "BS15", name: "BS. Vũ Thị Q.", title: "ThS.BS", isBhyt: false }],
      },
      fri: {
        morning: [{ id: "BS15", name: "BS. Vũ Thị Q.", title: "ThS.BS", isBhyt: false }],
      },
      sat: {},
    },
  },
  {
    id: "NK005",
    room: "205",
    floor: "Tầng 2",
    department: "Nội tiết",
    specialty: "Nội tiết – Đái tháo đường",
    section: "noi-khoa",
    schedule: {
      mon: {},
      tue: {},
      wed: {
        morning: [{ id: "BS16", name: "BS. Đặng Minh R.", title: "BS", isBhyt: false }],
      },
      thu: {},
      fri: {
        morning: [{ id: "BS16", name: "BS. Đặng Minh R.", title: "BS", isBhyt: false }],
      },
      sat: {},
    },
  },
  // NGOẠI KHOA
  {
    id: "NGK001",
    room: "207",
    floor: "Tầng 2",
    department: "Ngoại tổng hợp",
    specialty: "Ngoại tổng hợp",
    section: "ngoai-khoa",
    schedule: {
      mon: {
        afternoon: [{ id: "BS06", name: "BS. Đặng Thị H", title: "BS", isBhyt: false }],
      },
      tue: {
        morning: [{ id: "BS06", name: "BS. Đặng Thị H", title: "BS", isBhyt: false }],
      },
      wed: {
        afternoon: [{ id: "BS06", name: "BS. Đặng Thị H", title: "BS", isBhyt: false }],
      },
      thu: {
        morning: [{ id: "BS06", name: "BS. Đặng Thị H", title: "BS", isBhyt: false }],
      },
      fri: {
        afternoon: [{ id: "BS06", name: "BS. Đặng Thị H", title: "BS", isBhyt: false }],
      },
      sat: {},
    },
  },
  {
    id: "NGK002",
    room: "208",
    floor: "Tầng 2",
    department: "Cơ xương khớp",
    specialty: "Cơ xương khớp",
    section: "ngoai-khoa",
    schedule: {
      mon: {},
      tue: {},
      wed: {
        afternoon: [{ id: "BS17", name: "BS. Lý Hùng S.", title: "TS.BS", isBhyt: false }],
      },
      thu: {},
      fri: {
        morning: [{ id: "BS17", name: "BS. Lý Hùng S.", title: "TS.BS", isBhyt: false }],
        afternoon: [{ id: "BS17", name: "BS. Lý Hùng S.", title: "TS.BS", isBhyt: false }],
      },
      sat: {},
    },
  },
  // KHU VIP – THỨ 7
  {
    id: "VIP001",
    room: "601",
    floor: "Tầng 6",
    department: "Khu VIP",
    specialty: "Nội tổng hợp",
    section: "vip",
    schedule: {
      mon: {},
      tue: {},
      wed: {},
      thu: {},
      fri: {},
      sat: {
        morning: [{ id: "BS01", name: "BS. Nguyễn Văn A", title: "GS.TS", isBhyt: false }],
        afternoon: [{ id: "BS01", name: "BS. Nguyễn Văn A", title: "GS.TS", isBhyt: false }],
      },
    },
  },
  {
    id: "VIP002",
    room: "602",
    floor: "Tầng 6",
    department: "Khu VIP",
    specialty: "Tim mạch",
    section: "vip",
    schedule: {
      mon: {},
      tue: {},
      wed: {},
      thu: {},
      fri: {},
      sat: {
        morning: [{ id: "BS04", name: "BS. Phạm Thị D", title: "TS.BS", isBhyt: false }],
        afternoon: [{ id: "BS04", name: "BS. Phạm Thị D", title: "TS.BS", isBhyt: false }],
      },
    },
  },
  {
    id: "VIP003",
    room: "603",
    floor: "Tầng 6",
    department: "Khu VIP",
    specialty: "Cơ xương khớp",
    section: "vip",
    schedule: {
      mon: {},
      tue: {},
      wed: {},
      thu: {},
      fri: {},
      sat: {
        morning: [{ id: "BS17", name: "BS. Lý Hùng S.", title: "TS.BS", isBhyt: false }],
        afternoon: [{ id: "BS17", name: "BS. Lý Hùng S.", title: "TS.BS", isBhyt: false }],
      },
    },
  },
  {
    id: "VIP004",
    room: "604",
    floor: "Tầng 6",
    department: "Khu VIP",
    specialty: "Tai Mũi Họng",
    section: "vip",
    schedule: {
      mon: {},
      tue: {},
      wed: {},
      thu: {},
      fri: {},
      sat: {
        morning: [{ id: "BS18", name: "BS. Phan Thanh T.", title: "ThS.BS", isBhyt: false }],
        afternoon: [{ id: "BS18", name: "BS. Phan Thanh T.", title: "ThS.BS", isBhyt: false }],
      },
    },
  },
];

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat"] as const;
const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7"];
const DATE_LABELS = ["11/05", "12/05", "13/05", "14/05", "15/05", "16/05"];
const SECTIONS: { id: SectionType; label: string }[] = [
  { id: "cls", label: "Cận lâm sàng" },
  { id: "noi-khoa", label: "Nội khoa" },
  { id: "ngoai-khoa", label: "Ngoại khoa" },
  { id: "vip", label: "Khu VIP T.7" },
];

const SECTION_COLORS: Record<SectionType, string> = {
  cls: "border-blue-300 bg-blue-50 dark:bg-blue-950/20",
  "noi-khoa": "border-green-300 bg-green-50 dark:bg-green-950/20",
  "ngoai-khoa": "border-orange-300 bg-orange-50 dark:bg-orange-950/20",
  vip: "border-purple-300 bg-purple-50 dark:bg-purple-950/20",
};

const SECTION_HEAD_COLORS: Record<SectionType, string> = {
  cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "noi-khoa": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "ngoai-khoa": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  vip: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

const SESSION_COLORS: Record<SessionType, string> = {
  morning: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
  afternoon: "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300",
  allday: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
};

const SESSION_LABELS: Record<SessionType, string> = {
  morning: "Sáng",
  afternoon: "Chiều",
  allday: "Cả ngày",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .replace(/^BS\.\s*/, "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LichKCBPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(["all"]));
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<ScheduleEntry | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("week");

  const debouncedSearch = useDebounce(searchQuery, 300);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (f === "all") return new Set(["all"]);
      next.delete("all");
      if (next.has(f)) {
        next.delete(f);
        if (next.size === 0) return new Set(["all"]);
      } else {
        next.add(f);
      }
      return next;
    });
  };

  const handleCellClick = useCallback(
    (doctor: Doctor, session: SessionType, sched: Schedule) => {
      setSelectedEntry({
        doctor,
        session,
        room: sched.room,
        floor: sched.floor,
        specialty: sched.specialty,
        section: sched.section,
        department: sched.department,
      });
      setSheetOpen(true);
    },
    []
  );

  const handleUploadXlsx = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // Basic parse simulation — real impl would use xlsx library
      const reader = new FileReader();
      reader.onload = () => {
        // In production: parse with xlsx library
        alert(`Đã tải file: ${file.name}\nTính năng parse .xlsx cần thư viện xlsx.`);
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    []
  );

  // Flatten schedules into rows per section
  const filteredSchedules = useMemo(() => {
    return ALL_SCHEDULES.filter((s) => {
      // filter by search
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const hasDoctor = Object.values(s.schedule).some((day) =>
          [...(day.morning ?? []), ...(day.afternoon ?? []), ...(day.allday ?? [])].some(
            (d) =>
              d.name.toLowerCase().includes(q) ||
              d.id.toLowerCase().includes(q) ||
              s.specialty.toLowerCase().includes(q)
          )
        );
        if (!hasDoctor) return false;
      }

      // filter by active chips
      if (activeFilters.has("all")) return true;

      const hasBhyt = Object.values(s.schedule).some((day) =>
        [...(day.morning ?? []), ...(day.afternoon ?? []), ...(day.allday ?? [])].some(
          (d) => d.isBhyt
        )
      );
      const hasMorning = Object.values(s.schedule).some((day) =>
        (day.morning?.length ?? 0) > 0
      );
      const hasAfternoon = Object.values(s.schedule).some((day) =>
        (day.afternoon?.length ?? 0) > 0
      );
      const matchesSection =
        activeFilters.has(s.section) ||
        (activeFilters.has("noi-khoa") && s.section === "noi-khoa") ||
        (activeFilters.has("cls") && s.section === "cls") ||
        (activeFilters.has("ngoai-khoa") && s.section === "ngoai-khoa") ||
        (activeFilters.has("vip") && s.section === "vip");

      if (activeFilters.has("bhyt") && !hasBhyt) return false;
      if (activeFilters.has("sang") && !hasMorning) return false;
      if (activeFilters.has("chieu") && !hasAfternoon) return false;
      return true;
    });
  }, [debouncedSearch, activeFilters]);

  // Group by section
  const sectionsData = useMemo(() => {
    const grouped: Record<SectionType, Schedule[]> = {
      cls: [],
      "noi-khoa": [],
      "ngoai-khoa": [],
      vip: [],
    };
    filteredSchedules.forEach((s) => {
      grouped[s.section].push(s);
    });
    return grouped;
  }, [filteredSchedules]);

  // Doctor view data
  const doctorCards = useMemo(() => {
    const map = new Map<string, { doctor: Doctor; days: { day: string; sessions: SessionType[] }[] }>();
    ALL_SCHEDULES.forEach((s) => {
      DAYS.forEach((day) => {
        const daySched = s.schedule[day];
        const sessions: SessionType[] = [];
        if ((daySched.morning?.length ?? 0) > 0) sessions.push("morning");
        if ((daySched.afternoon?.length ?? 0) > 0) sessions.push("afternoon");
        if ((daySched.allday?.length ?? 0) > 0) sessions.push("allday");

        daySched.morning?.forEach((d) => {
          if (!map.has(d.id)) {
            map.set(d.id, { doctor: d, days: [] });
          }
          const existing = map.get(d.id)!;
          if (!existing.days.find((x) => x.day === day)) {
            existing.days.push({ day, sessions });
          } else {
            const entry = existing.days.find((x) => x.day === day)!;
            sessions.forEach((sess) => {
              if (!entry.sessions.includes(sess)) entry.sessions.push(sess);
            });
          }
        });
        daySched.afternoon?.forEach((d) => {
          if (!map.has(d.id)) {
            map.set(d.id, { doctor: d, days: [] });
          }
          const existing = map.get(d.id)!;
          if (!existing.days.find((x) => x.day === day)) {
            existing.days.push({ day, sessions });
          } else {
            const entry = existing.days.find((x) => x.day === day)!;
            sessions.forEach((sess) => {
              if (!entry.sessions.includes(sess)) entry.sessions.push(sess);
            });
          }
        });
        daySched.allday?.forEach((d) => {
          if (!map.has(d.id)) {
            map.set(d.id, { doctor: d, days: [] });
          }
          const existing = map.get(d.id)!;
          if (!existing.days.find((x) => x.day === day)) {
            existing.days.push({ day, sessions });
          }
        });
      });
    });

    let docs = Array.from(map.values());

    // Filter by search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.doctor.name.toLowerCase().includes(q) ||
          d.doctor.id.toLowerCase().includes(q)
      );
    }

    // Filter by BHYT
    if (activeFilters.has("bhyt")) {
      docs = docs.filter((d) => d.doctor.isBhyt);
    }

    return docs.sort((a, b) => a.doctor.name.localeCompare(b.doctor.name));
  }, [debouncedSearch, activeFilters]);

  // Room view data
  const roomCards = useMemo(() => {
    let rooms = ALL_SCHEDULES.map((s) => ({
      room: s.room,
      floor: s.floor,
      department: s.department,
      specialty: s.specialty,
      section: s.section,
      doctors: new Map<string, { doctor: Doctor; sessions: SessionType[]; days: string[] }>(),
    }));

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      rooms = rooms.filter(
        (r) =>
          r.room.includes(q) ||
          r.specialty.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }

    if (activeFilters.has("bhyt")) {
      rooms = rooms.filter((r) =>
        DAYS.some((day) => {
          const ds = r.department === "Cận lâm sàng"
            ? ALL_SCHEDULES.find((s) => s.room === r.room)?.schedule[day]
            : ALL_SCHEDULES.find((s) => s.room === r.room)?.schedule[day];
          return (
            [...(ds?.morning ?? [])].some((d) => d.isBhyt) ||
            [...(ds?.afternoon ?? [])].some((d) => d.isBhyt)
          );
        })
      );
    }

    return rooms;
  }, [debouncedSearch, activeFilters]);

  const todayIndex = 4; // 15/05/2026 = T6 (index 4 in our static week)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch khám chữa bệnh</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Tuần 11 – 16/05/2026 · Phòng khám ĐHYD số 1
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {isAdmin && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button variant="outline" onClick={handleUploadXlsx}>
                <Upload className="mr-2 h-4 w-4" />
                Upload .xlsx
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Week navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentWeekOffset((p) => p - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-1">
          {DATE_LABELS.map((d, i) => (
            <Badge
              key={d}
              variant={i === todayIndex ? "default" : "secondary"}
              className="text-xs"
            >
              {d}
            </Badge>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentWeekOffset((p) => p + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Badge variant="outline" className="text-xs ml-auto">
          <Calendar className="mr-1 h-3 w-3" />
          Tuần {11 + currentWeekOffset}
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm bác sĩ, chuyên khoa, phòng..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "Tất cả" },
            { id: "bhyt", label: "BHYT" },
            { id: "sang", label: "Sáng" },
            { id: "chieu", label: "Chiều" },
            { id: "cls", label: "Cận lâm sàng" },
            { id: "noi-khoa", label: "Nội khoa" },
            { id: "ngoai-khoa", label: "Ngoại khoa" },
            { id: "vip", label: "VIP T.7" },
          ].map((f) => (
            <Button
              key={f.id}
              variant={activeFilters.has(f.id) ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2.5"
              onClick={() => toggleFilter(f.id)}
            >
              {f.id === "bhyt" && <ShieldCheck className="mr-1 h-3 w-3" />}
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="week">Lịch tuần</TabsTrigger>
          <TabsTrigger value="doctor">Theo bác sĩ</TabsTrigger>
          <TabsTrigger value="room">Theo phòng</TabsTrigger>
        </TabsList>

        {/* ── VIEW 1: LỊCH TUẦN ── */}
        <TabsContent value="week" className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            {/* Sticky header */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Day header row */}
                <div className="grid grid-cols-[160px_repeat(6,1fr)] sticky top-0 z-10 bg-background border-b">
                  <div className="p-2 font-semibold text-sm bg-muted/50 border-r" />
                  {DAYS.map((day, i) => (
                    <div
                      key={day}
                      className={`
                        p-2 text-center border-r last:border-r-0
                        ${i === todayIndex ? "bg-blue-50 dark:bg-blue-950/30" : ""}
                        ${i === 5 ? "bg-gray-50 dark:bg-muted/30" : ""}
                      `}
                    >
                      <div className={`text-sm font-bold ${i === todayIndex ? "text-blue-600 dark:text-blue-400" : ""}`}>
                        {DAY_LABELS[i]}
                      </div>
                      <div className="text-xs text-muted-foreground">{DATE_LABELS[i]}</div>
                    </div>
                  ))}
                </div>

                {/* Sections */}
                {SECTIONS.map((section) => {
                  const rows = sectionsData[section.id];
                  if (rows.length === 0) return null;
                  return (
                    <div key={section.id}>
                      {/* Section header */}
                      <div className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${SECTION_HEAD_COLORS[section.id]}`}>
                        {section.label}
                      </div>

                      {/* Room rows */}
                      {rows.map((sched) => (
                        <div
                          key={sched.id}
                          className={`grid grid-cols-[160px_repeat(6,1fr)] border-t ${SECTION_COLORS[section.id].split(" ")[0]}`}
                        >
                          {/* Room label */}
                          <div className="p-2 border-r flex flex-col justify-center">
                            <div className="text-sm font-medium">{sched.room}</div>
                            <div className="text-xs text-muted-foreground">{sched.floor}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{sched.specialty}</div>
                          </div>

                          {/* Day cells */}
                          {DAYS.map((day, di) => {
                            const daySched = sched.schedule[day] ?? {};
                            const morning = daySched.morning ?? [];
                            const afternoon = daySched.afternoon ?? [];
                            const allday = daySched.allday ?? [];
                            const allDocs = [...morning, ...afternoon, ...allday];

                            return (
                              <div
                                key={day}
                                className={`
                                  p-1.5 border-r last:border-r-0 flex flex-col gap-1 min-h-[72px]
                                  ${di === todayIndex ? "bg-blue-50/50 dark:bg-blue-950/10" : ""}
                                  ${di === 5 ? "bg-gray-50/50 dark:bg-muted/10" : ""}
                                `}
                              >
                                {/* Morning */}
                                {morning.map((doc) => (
                                  <button
                                    key={doc.id}
                                    onClick={() => handleCellClick(doc, "morning", sched)}
                                    className="w-full text-left bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 rounded px-1.5 py-0.5 transition-colors cursor-pointer"
                                  >
                                    <div className="text-xs font-medium leading-tight truncate">
                                      {doc.name.replace(/^BS\.\s*/, "")}
                                    </div>
                                    <div className="flex items-center gap-0.5 mt-0.5">
                                      <Badge className="text-[10px] h-4 px-1 bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-200 border-0">
                                        Sáng
                                      </Badge>
                                      {doc.isBhyt && (
                                        <Badge className="text-[10px] h-4 px-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-0">
                                          BHYT
                                        </Badge>
                                      )}
                                    </div>
                                  </button>
                                ))}

                                {/* Afternoon */}
                                {afternoon.map((doc) => (
                                  <button
                                    key={doc.id}
                                    onClick={() => handleCellClick(doc, "afternoon", sched)}
                                    className="w-full text-left bg-green-100 hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-900/60 rounded px-1.5 py-0.5 transition-colors cursor-pointer"
                                  >
                                    <div className="text-xs font-medium leading-tight truncate">
                                      {doc.name.replace(/^BS\.\s*/, "")}
                                    </div>
                                    <div className="flex items-center gap-0.5 mt-0.5">
                                      <Badge className="text-[10px] h-4 px-1 bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-200 border-0">
                                        Chiều
                                      </Badge>
                                      {doc.isBhyt && (
                                        <Badge className="text-[10px] h-4 px-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-0">
                                          BHYT
                                        </Badge>
                                      )}
                                    </div>
                                  </button>
                                ))}

                                {/* All day */}
                                {allday.map((doc) => (
                                  <button
                                    key={doc.id}
                                    onClick={() => handleCellClick(doc, "allday", sched)}
                                    className="w-full text-left bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 rounded px-1.5 py-0.5 transition-colors cursor-pointer"
                                  >
                                    <div className="text-xs font-medium leading-tight truncate">
                                      {doc.name.replace(/^BS\.\s*/, "")}
                                    </div>
                                    <div className="flex items-center gap-0.5 mt-0.5">
                                      <Badge className="text-[10px] h-4 px-1 bg-purple-200 text-purple-700 dark:bg-purple-800 dark:text-purple-200 border-0">
                                        Cả ngày
                                      </Badge>
                                    </div>
                                  </button>
                                ))}

                                {allDocs.length === 0 && (
                                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground/40">
                                    —
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-800" />
              <span>Sáng</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-green-200 dark:bg-green-800" />
              <span>Chiều</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-200 dark:bg-purple-800" />
              <span>Cả ngày</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-yellow-100 dark:bg-yellow-900/40" />
              <span>BHYT</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-300" />
              <span>Hôm nay</span>
            </div>
          </div>
        </TabsContent>

        {/* ── VIEW 2: THEO BÁC SĨ ── */}
        <TabsContent value="doctor">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {doctorCards.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Không tìm thấy bác sĩ phù hợp.
              </div>
            )}
            {doctorCards.map(({ doctor, days }) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="text-sm bg-primary text-primary-foreground font-semibold">
                        {getInitials(doctor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-sm leading-tight">
                          {doctor.name.replace(/^BS\.\s*/, "")}
                        </span>
                        {doctor.isBhyt && (
                          <Badge className="text-[10px] h-4 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-0">
                            BHYT
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{doctor.title}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  {/* Day pills */}
                  <div className="grid grid-cols-6 gap-1 mt-2">
                    {DAYS.map((day, i) => {
                      const dayInfo = days.find((d) => d.day === day);
                      const hasSchedule = !!dayInfo;
                      const isWeekend = i === 5;
                      const isToday = i === todayIndex;

                      return (
                        <div
                          key={day}
                          className={`
                            flex flex-col items-center rounded-md py-1.5 text-xs
                            ${hasSchedule
                              ? isWeekend
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : "bg-muted text-muted-foreground"
                            }
                            ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}
                          `}
                        >
                          <span className="font-semibold">{DAY_LABELS[i]}</span>
                          <span className="text-[10px] opacity-70">{DATE_LABELS[i].split("/")[0]}</span>
                          {hasSchedule && (
                            <div className="flex gap-0.5 mt-0.5">
                              {dayInfo.sessions.includes("morning") && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              )}
                              {dayInfo.sessions.includes("afternoon") && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              )}
                              {dayInfo.sessions.includes("allday") && (
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── VIEW 3: THEO PHÒNG ── */}
        <TabsContent value="room">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {roomCards.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Không tìm thấy phòng phù hợp.
              </div>
            )}
            {roomCards.map((room) => (
              <Card key={room.room} className="overflow-hidden">
                <div className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${SECTION_HEAD_COLORS[room.section]}`}>
                  {room.department}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold font-mono">{room.room}</span>
                        <Badge variant="secondary" className="text-xs">{room.floor}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{room.specialty}</div>
                    </div>
                    <Stethoscope className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  {/* Show doctors who work in this room */}
                  {(() => {
                    const doctorsInRoom: { doctor: Doctor; sessions: SessionType[]; days: string[] }[] = [];
                    DAYS.forEach((day) => {
                      const daySched = ALL_SCHEDULES.find(
                        (s) => s.room === room.room
                      )?.schedule[day];
                      if (!daySched) return;
                      const allDocs = [
                        ...(daySched.morning ?? []),
                        ...(daySched.afternoon ?? []),
                        ...(daySched.allday ?? []),
                      ];
                      allDocs.forEach((doc) => {
                        const existing = doctorsInRoom.find((d) => d.doctor.id === doc.id);
                        if (existing) {
                          if (!existing.days.includes(day)) existing.days.push(day);
                        } else {
                          const sessions: SessionType[] = [];
                          if ((daySched.morning ?? []).some((d) => d.id === doc.id)) sessions.push("morning");
                          if ((daySched.afternoon ?? []).some((d) => d.id === doc.id)) sessions.push("afternoon");
                          if ((daySched.allday ?? []).some((d) => d.id === doc.id)) sessions.push("allday");
                          doctorsInRoom.push({ doctor: doc, sessions, days: [day] });
                        }
                      });
                    });

                    if (doctorsInRoom.length === 0) {
                      return <div className="text-xs text-muted-foreground">Chưa có lịch.</div>;
                    }

                    return (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {doctorsInRoom.map(({ doctor, sessions, days: docDays }) => (
                          <div
                            key={doctor.id}
                            className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"
                          >
                            <span className="font-medium">
                              {doctor.name.replace(/^BS\.\s*/, "")}
                            </span>
                            <div className="flex gap-0.5">
                              {sessions.includes("morning") && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5" />
                              )}
                              {sessions.includes("afternoon") && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-0.5" />
                              )}
                              {sessions.includes("allday") && (
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-0.5" />
                              )}
                            </div>
                            {doctor.isBhyt && (
                              <Badge className="text-[9px] h-3.5 px-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-0 ml-0.5">
                                BHYT
                              </Badge>
                            )}
                            <span className="text-[10px] text-muted-foreground ml-1">
                              {docDays.length}d
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ── DETAIL DRAWER ── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[360px] sm:max-w-[360px]">
          {selectedEntry ? (
            <>
              <SheetHeader className="pr-8">
                <SheetTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Thông tin lịch khám
                </SheetTitle>
                <SheetDescription>
                  Chi tiết ca trực của bác sĩ
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4 px-1">
                {/* Doctor name & title */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-base bg-primary text-primary-foreground font-semibold">
                      {getInitials(selectedEntry.doctor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-base">
                      {selectedEntry.doctor.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEntry.doctor.title}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={SESSION_COLORS[selectedEntry.session]}>
                    <Clock className="mr-1 h-3 w-3" />
                    {SESSION_LABELS[selectedEntry.session]}
                  </Badge>
                  {selectedEntry.doctor.isBhyt && (
                    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-0">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Khám BHYT
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {SECTIONS.find((s) => s.id === selectedEntry.section)?.label ?? selectedEntry.section}
                  </Badge>
                </div>

                {/* Details */}
                <div className="rounded-lg border bg-card p-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <div className="font-medium">{selectedEntry.room}</div>
                      <div className="text-muted-foreground text-xs">{selectedEntry.floor}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Stethoscope className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <div className="font-medium">{selectedEntry.specialty}</div>
                      <div className="text-muted-foreground text-xs">{selectedEntry.department}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <div className="font-medium">
                        Tuần 11 – 16/05/2026
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {selectedEntry.session === "morning"
                          ? "07:30 – 11:30"
                          : selectedEntry.session === "afternoon"
                          ? "13:30 – 17:00"
                          : "07:30 – 17:00"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note */}
                {selectedEntry.doctor.note && (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800/30 dark:bg-yellow-900/10 p-3">
                    <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-1">
                      Ghi chú đặc biệt
                    </div>
                    <div className="text-sm text-yellow-800 dark:text-yellow-300">
                      {selectedEntry.doctor.note}
                    </div>
                  </div>
                )}

                {/* Action */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={() => setSheetOpen(false)}>
                    Đóng
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Xem chi tiết BS
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <SheetHeader>
                <SheetTitle>Chi tiết lịch khám</SheetTitle>
              </SheetHeader>
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Chọn một ca khám để xem chi tiết
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
