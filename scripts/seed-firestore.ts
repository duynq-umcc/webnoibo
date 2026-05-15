/**
 * Seed script — populates Firestore with sample data for 4 modules.
 * Run once: npx tsx scripts/seed-firestore.ts
 *
 * Auth: ADC (applicationDefault) — no service account key needed.
 * Idempotent: skips existing documents.
 */

import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const PROJECT_ID = "web-noi-bo-umcc1";

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    projectId: PROJECT_ID,
  });
}

const auth = getAuth();
const db = getFirestore();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function getAdminUid(): Promise<string> {
  const user = await auth.getUserByEmail("admin@phongkham.vn");
  return user.uid;
}

async function docExists(path: string): Promise<boolean> {
  const snap = await db.doc(path).get();
  return snap.exists;
}

async function setIfNotExists(path: string, data: Record<string, unknown>): Promise<boolean> {
  if (await docExists(path)) {
    console.log(`  [SKIP] ${path} — already exists`);
    return false;
  }
  await db.doc(path).set(data);
  console.log(`  [OK]   ${path}`);
  return true;
}

async function batchSetIfNotExists(
  collectionPath: string,
  items: Array<{ id: string; data: Record<string, unknown> }>
): Promise<number> {
  let created = 0;
  for (const item of items) {
    const ok = await setIfNotExists(`${collectionPath}/${item.id}`, item.data);
    if (ok) created++;
  }
  return created;
}

function pad(n: number) { return String(n).padStart(2, "0"); }
function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

// ---------------------------------------------------------------------------
// 1. seedContacts — update 20 users with phone/mobile/room/floor
// ---------------------------------------------------------------------------
async function seedContacts(): Promise<void> {
  console.log(`\n[1/4] seedContacts — updating users with phone/mobile/room/floor`);

  const STAFF_DATA = [
    { id: "NS001", displayName: "BS. Nguyễn Văn A", email: "nvana@phongkham.vn", role: "doctor", title: "Bác sĩ chuyên khoa I", department: "Nội tổng hợp", phone: "0901 234 567", mobile: "0901 234 567", room: "P.201", floor: "2" },
    { id: "NS002", displayName: "BS. Trần Thị B", email: "ttb@phongkham.vn", role: "doctor", title: "Bác sĩ chuyên khoa II", department: "Nội tổng hợp", phone: "0902 345 678", mobile: "0902 345 678", room: "P.202", floor: "2" },
    { id: "NS003", displayName: "BS. Lê Văn C", email: "lvc@phongkham.vn", role: "doctor", title: "Bác sĩ chuyên khoa I", department: "Tim mạch", phone: "0903 456 789", mobile: "0903 456 789", room: "P.301", floor: "3" },
    { id: "NS004", displayName: "BS. Phạm Thị D", email: "ptd@phongkham.vn", role: "doctor", title: "Bác sĩ chuyên khoa II", department: "Tiêu hóa", phone: "0904 567 890", mobile: "0904 567 890", room: "P.302", floor: "3" },
    { id: "NS005", displayName: "BS. Hoàng Văn E", email: "hve@phongkham.vn", role: "doctor", title: "Thạc sĩ", department: "Cơ xương khớp", phone: "0905 678 901", mobile: "0905 678 901", room: "P.303", floor: "3" },
    { id: "NS006", displayName: "ĐD. Ngô Thị F", email: "ntf@phongkham.vn", role: "nurse", title: "Điều dưỡng trưởng", department: "Nội tổng hợp", phone: "0912 345 678", mobile: "0912 345 678", room: "P.204", floor: "2" },
    { id: "NS007", displayName: "NV. Vũ Văn G", email: "vvg@phongkham.vn", role: "reception", title: "Nhân viên lễ tân", department: "Hành chính", phone: "0923 456 789", mobile: "0923 456 789", room: "T.101", floor: "1" },
    { id: "NS008", displayName: "BS. Đặng Thị H", email: "dth@phongkham.vn", role: "doctor", title: "Bác sĩ", department: "Nội tổng hợp", phone: "0934 567 890", mobile: "0934 567 890", room: "P.205", floor: "2" },
    { id: "NS009", displayName: "BS. Bùi Minh I", email: "bmi@phongkham.vn", role: "doctor", title: "Bác sĩ chuyên khoa I", department: "Thần kinh", phone: "0945 678 901", mobile: "0945 678 901", room: "P.304", floor: "3" },
    { id: "NS010", displayName: "BS. Nguyễn Thị J", email: "ntj@phongkham.vn", role: "doctor", title: "Bác sĩ chuyên khoa II", department: "Da liễu", phone: "0956 789 012", mobile: "0956 789 012", room: "P.305", floor: "3" },
    { id: "NS011", displayName: "ĐD. Lê Thị K", email: "ltk@phongkham.vn", role: "nurse", title: "Điều dưỡng", department: "Tim mạch", phone: "0967 890 123", mobile: "0967 890 123", room: "P.306", floor: "3" },
    { id: "NS012", displayName: "NV. Trịnh Văn L", email: "tvl@phongkham.vn", role: "pharmacist", title: "Dược sĩ", department: "Dược", phone: "0978 901 234", mobile: "0978 901 234", room: "T.102", floor: "1" },
    { id: "NS013", displayName: "BS. Vũ Thị M", email: "vtm@phongkham.vn", role: "doctor", title: "Bác sĩ chuyên khoa I", department: "Hô hấp", phone: "0989 012 345", mobile: "0989 012 345", room: "P.401", floor: "4" },
    { id: "NS014", displayName: "ĐD. Đặng Văn N", email: "dvn@phongkham.vn", role: "nurse", title: "Điều dưỡng", department: "Hô hấp", phone: "0890 123 456", mobile: "0890 123 456", room: "P.402", floor: "4" },
    { id: "NS015", displayName: "NV. Hoàng Thị O", email: "hto@phongkham.vn", role: "accountant", title: "Kế toán viên", department: "Tài chính", phone: "0801 234 567", mobile: "0801 234 567", room: "T.201", floor: "2" },
    { id: "NS016", displayName: "BS. Lý Văn P", email: "lvp@phongkham.vn", role: "doctor", title: "Bác sĩ chuyên khoa II", department: "Nội tiết", phone: "0812 345 678", mobile: "0812 345 678", room: "P.403", floor: "4" },
    { id: "NS017", displayName: "NV. Phạm Thị Q", email: "ptq@phongkham.vn", role: "hr", title: "Nhân sự", department: "Hành chính", phone: "0823 456 789", mobile: "0823 456 789", room: "T.202", floor: "2" },
    { id: "NS018", displayName: "ĐD. Cao Văn R", email: "cvr@phongkham.vn", role: "nurse", title: "Điều dưỡng", department: "Cấp cứu", phone: "0834 567 890", mobile: "0834 567 890", room: "T.103", floor: "1" },
    { id: "NS019", displayName: "BS. Trịnh Thị S", email: "tts@phongkham.vn", role: "doctor", title: "Bác sĩ chuyên khoa I", department: "Truyền nhiễm", phone: "0845 678 901", mobile: "0845 678 901", room: "P.404", floor: "4" },
    { id: "NS020", displayName: "NV. Mai Văn T", email: "mvt@phongkham.vn", role: "reception", title: "Nhân viên hỗ trợ", department: "Hành chính", phone: "0856 789 012", mobile: "0856 789 012", room: "T.104", floor: "1" },
  ];

  for (const staff of STAFF_DATA) {
    const path = `users/${staff.id}`;
    const exists = await docExists(path);
    if (exists) {
      // Merge: update only the new fields
      await db.doc(path).update({
        phone: staff.phone,
        mobile: staff.mobile,
        room: staff.room,
        floor: staff.floor,
      });
      console.log(`  [MERGE] ${path}`);
    } else {
      await db.doc(path).set({
        displayName: staff.displayName,
        email: staff.email,
        role: staff.role,
        title: staff.title,
        department: staff.department,
        phone: staff.phone,
        mobile: staff.mobile,
        room: staff.room,
        floor: staff.floor,
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log(`  [CREATE] ${path}`);
    }
  }
  console.log(`  Done.`);
}

// ---------------------------------------------------------------------------
// 2. seedAttendance — 20 attendance records for admin UID, May 2026
// ---------------------------------------------------------------------------
async function seedAttendance(adminUid: string): Promise<void> {
  console.log(`\n[2/4] seedAttendance — attendance records for ${adminUid}`);

  const YEAR = 2026;
  const MONTH = 5; // May
  const totalDays = daysInMonth(YEAR, MONTH);

  const WORK_START = 7 * 60 + 30; // 07:30
  const WORK_END = 17 * 60 + 30;   // 17:30
  const LUNCH_START = 12 * 60;      // 12:00
  const LUNCH_END = 13 * 60;        // 13:00

  function workMinutes(checkIn: number, checkOut: number): number {
    let mins = checkOut - checkIn;
    if (checkIn < LUNCH_START && checkOut > LUNCH_END) mins -= 60;
    return Math.max(0, mins);
  }

  function fmtMins(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m.toString().padStart(2, "0")}m`;
  }

  const TYPES: Array<"present" | "late" | "early" | "absent"> = [
    "present", "present", "present", "late", "present",
    "present", "early", "present", "absent", "present",
    "present", "late", "present", "early", "present",
    "present", "absent", "present", "late", "present",
  ];

  let created = 0;
  for (let day = 1; day <= totalDays && day <= 20; day++) {
    const dateStr = `${YEAR}-${pad(MONTH)}-${pad(day)}`;
    const docId = `${YEAR}-${pad(MONTH)}-${pad(day)}`;
    const path = `attendance/${adminUid}/records/${docId}`;

    if (await docExists(path)) {
      console.log(`  [SKIP] ${path}`);
      continue;
    }

    const type = TYPES[day - 1];
    let checkIn: string | null = null;
    let checkOut: string | null = null;
    let workMinutes_total = 0;
    let note: string | null = null;

    if (type === "present") {
      const ciH = 7, ciM = 30 + Math.floor(Math.random() * 20);
      checkIn = `${pad(ciH + Math.floor(ciM / 60))}:${pad(ciM % 60)}`;
      const coH = 17, coM = 10 + Math.floor(Math.random() * 25);
      checkOut = `${pad(coH)}:${pad(coM)}`;
      const ciTotal = ciH * 60 + ciM;
      const coTotal = coH * 60 + coM;
      workMinutes_total = workMinutes(ciTotal, coTotal);
    } else if (type === "late") {
      const ciH = 8, ciM = 5 + Math.floor(Math.random() * 25);
      checkIn = `${pad(ciH)}:${pad(ciM)}`;
      const coH = 17, coM = 15 + Math.floor(Math.random() * 15);
      checkOut = `${pad(coH)}:${pad(coM)}`;
      const ciTotal = ciH * 60 + ciM;
      const coTotal = coH * 60 + coM;
      workMinutes_total = workMinutes(ciTotal, coTotal);
      note = "Đi muộn";
    } else if (type === "early") {
      const ciH = 7, ciM = 25 + Math.floor(Math.random() * 10);
      checkIn = `${pad(ciH)}:${pad(ciM)}`;
      const coH = 16, coM = 30 + Math.floor(Math.random() * 30);
      checkOut = `${pad(coH)}:${pad(coM)}`;
      const ciTotal = ciH * 60 + ciM;
      const coTotal = coH * 60 + coM;
      workMinutes_total = workMinutes(ciTotal, coTotal);
      note = "Về sớm";
    } else {
      // absent
      note = "Nghỉ phép";
    }

    const record = {
      date: dateStr,
      checkIn,
      checkOut,
      workMinutes: workMinutes_total,
      workHours: workMinutes_total > 0 ? fmtMins(workMinutes_total) : null,
      status: type,
      note,
      createdAt: FieldValue.serverTimestamp(),
    };

    await db.doc(path).set(record);
    console.log(`  [OK]   ${path} — ${type}`);
    created++;
  }
  console.log(`  Created ${created} records.`);
}

// ---------------------------------------------------------------------------
// 3. seedReferences — 15 reference documents
// ---------------------------------------------------------------------------
async function seedReferences(): Promise<void> {
  console.log(`\n[3/4] seedReferences — 15 reference documents`);

  const REFERENCES = [
    {
      id: "REF001",
      data: {
        title: "Hướng dẫn chẩn đoán và điều trị bệnh tăng huyết áp",
        category: "protocol",
        type: "document",
        description: "Quy trình chuẩn Bộ Y tế về chẩn đoán, phân loại và điều trị tăng huyết áp nguyên phát và thứ phát ở người trưởng thành.",
        externalUrl: null,
        fileUrl: null,
        issuer: "Bộ Y tế",
        issuedDate: "2023-06-15",
        tags: ["tăng huyết áp", "tim mạch", "Bộ Y tế"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF002",
      data: {
        title: "Phác đồ điều trị đái tháo đường type 2",
        category: "protocol",
        type: "document",
        description: "Hướng dẫn phác đồ điều trị đái tháo đường type 2 cho bác sĩ cơ sở tuyến huyện, bao gồm liệu pháp dùng thuốc và theo dõi.",
        externalUrl: null,
        fileUrl: null,
        issuer: "Bộ Y tế",
        issuedDate: "2023-03-20",
        tags: ["đái tháo đường", "nội tiết", "Bộ Y tế"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF003",
      data: {
        title: "Video: Kỹ thuật đo huyết áp đúng cách",
        category: "training",
        type: "video",
        description: "Hướng dẫn thực hành đo huyết áp tại phòng khám theo tiêu chuẩn Bộ Y tế — dành cho điều dưỡng và nhân viên y tế.",
        externalUrl: "https://www.youtube.com/watch?v=example",
        fileUrl: null,
        issuer: "Trung tâm Đào tạo Y khoa",
        issuedDate: "2024-01-10",
        tags: ["đo huyết áp", "kỹ thuật", "video", "đào tạo"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF004",
      data: {
        title: "Danh mục thuốc BHYT chi trả 2024",
        category: "insurance",
        type: "document",
        description: "Danh mục thuốc thuộc phạm vi thanh toán của Quỹ Bảo hiểm y tế theo Quyết định số 2454/QĐ-BYT năm 2024.",
        externalUrl: null,
        fileUrl: null,
        issuer: "Bảo hiểm Xã hội Việt Nam",
        issuedDate: "2024-01-01",
        tags: ["BHYT", "danh mục thuốc", "thanh toán"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF005",
      data: {
        title: "Quy trình khám bệnh BHYT — Cơ sở ngoại trú",
        category: "process",
        type: "document",
        description: "Hướng dẫn quy trình tiếp nhận, khám chữa bệnh BHYT ngoại trú tại phòng khám đa khoa theo Thông tư 39/2018/TT-BYT.",
        externalUrl: null,
        fileUrl: null,
        issuer: "Bộ Y tế",
        issuedDate: "2022-09-05",
        tags: ["BHYT", "quy trình", "ngoại trú"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF006",
      data: {
        title: "Bảng giá dịch vụ y tế 2024",
        category: "pricing",
        type: "link",
        description: "Bảng giá dịch vụ khám chữa bệnh không BHYT áp dụng tại phòng khám — theo Thông tư 14/2020/TT-BYT.",
        externalUrl: "https://example.com/bang-gia-2024",
        fileUrl: null,
        issuer: "Phòng khám",
        issuedDate: "2024-01-01",
        tags: ["giá dịch vụ", "BHYT", "bảng giá"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF007",
      data: {
        title: "Hướng dẫn phòng chống bệnh truyền nhiễm tại cơ sở y tế",
        category: "infection",
        type: "document",
        description: "Quy trình vệ sinh khử khuẩn, phòng ngừa lây nhiễm bệnh truyền nhiễm tại các cơ sở khám chữa bệnh ngoại trú.",
        externalUrl: null,
        fileUrl: null,
        issuer: "Bộ Y tế",
        issuedDate: "2023-11-20",
        tags: ["khử khuẩn", "phòng chống", "truyền nhiễm"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF008",
      data: {
        title: "Video: Hướng dẫn sử dụng máy đo đường huyết",
        category: "training",
        type: "video",
        description: "Hướng dẫn bệnh nhân sử dụng đúng cáng máy đo đường huyết cá nhân — cách lấy mẫu, hiệu chuẩn và đọc kết quả.",
        externalUrl: "https://www.youtube.com/watch?v=example2",
        fileUrl: null,
        issuer: "Hội Tiểu đường Việt Nam",
        issuedDate: "2024-02-15",
        tags: ["đường huyết", "video", "hướng dẫn bệnh nhân"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF009",
      data: {
        title: "Tiêu chuẩn chẩn đoán bệnh Alzheimer",
        category: "protocol",
        type: "document",
        description: "Hướng dẫn chẩn đoán suy giảm nhận thức và bệnh Alzheimer theo tiêu chuẩn quốc tế ICD-10 và DSM-5.",
        externalUrl: null,
        fileUrl: null,
        issuer: "Bộ Y tế",
        issuedDate: "2022-06-01",
        tags: ["Alzheimer", "thần kinh", "chẩn đoán"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF010",
      data: {
        title: "Quy trình cấp giấy chứng nhận nghỉ việc hưởng BHXH",
        category: "process",
        type: "document",
        description: "Hướng dẫn quy trình cấp giấy xác nhận nghỉ việc hưởng bảo hiểm xã hội cho người lao động theo quy định hiện hành.",
        externalUrl: null,
        fileUrl: null,
        issuer: "Bảo hiểm Xã hội Việt Nam",
        issuedDate: "2023-04-10",
        tags: ["BHXH", "giấy nghỉ việc", "quy trình"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF011",
      data: {
        title: "Phác đồ điều trị viêm phổi mắc phải cộng đồng",
        category: "protocol",
        type: "document",
        description: "Hướng dẫn chẩn đoán sớm và phác đồ kháng sinh kinh nghiệm điều trị viêm phổi mắc phải cộng đồng ở người lớn.",
        externalUrl: null,
        fileUrl: null,
        issuer: "Bộ Y tế",
        issuedDate: "2023-08-12",
        tags: ["viêm phổi", "hô hấp", "kháng sinh"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF012",
      data: {
        title: "Cổng thông tin Bộ Y tế",
        category: "external",
        type: "link",
        description: "Liên kết đến cổng thông tin điện tử của Bộ Y tế Việt Nam — cập nhật văn bản pháp luật, quy chuẩn và hướng dẫn chuyên môn.",
        externalUrl: "https://moh.gov.vn",
        fileUrl: null,
        issuer: "Bộ Y tế",
        issuedDate: "2020-01-01",
        tags: ["Bộ Y tế", "liên kết", "văn bản pháp luật"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF013",
      data: {
        title: "Video: Quy trình vô khuẩn dụng cụ y tế",
        category: "training",
        type: "video",
        description: "Hướng dẫn quy trình vô khuẩn và tiệt khuẩn dụng cụ y tế tại phòng khám — dành cho nhân viên y tế.",
        externalUrl: "https://www.youtube.com/watch?v=example3",
        fileUrl: null,
        issuer: "Trung tâm Kiểm soát bệnh tật",
        issuedDate: "2023-12-01",
        tags: ["vô khuẩn", "tiệt khuẩn", "video", "y tế"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF014",
      data: {
        title: "Quy chế chuyên môn khám chữa bệnh",
        category: "internal",
        type: "document",
        description: "Quy chế chuyên môn nội bộ của phòng khám về quy trình tiếp nhận, khám bệnh, kê đơn và lưu trữ hồ sơ y khoa.",
        externalUrl: null,
        fileUrl: null,
        issuer: "Phòng khám",
        issuedDate: "2024-01-15",
        tags: ["nội bộ", "quy chế", "chuyên môn"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: "REF015",
      data: {
        title: "Hướng dẫn tra cứu mã ICD-10 trên hệ thống KCB",
        category: "training",
        type: "link",
        description: "Video và hướng dẫn chi tiết cách tra cứu và chọn đúng mã ICD-10 khi kê đơn, lập hồ sơ bệnh án điện tử.",
        externalUrl: "https://icd.kcb.vn",
        fileUrl: null,
        issuer: "Cổng KCB quốc gia",
        issuedDate: "2024-03-01",
        tags: ["ICD-10", "tra cứu", "hướng dẫn", "hồ sơ bệnh án"],
        createdAt: FieldValue.serverTimestamp(),
      },
    },
  ];

  await batchSetIfNotExists("references", REFERENCES);
}

// ---------------------------------------------------------------------------
// 4. seedICDHistory — 10 ICD search history records
// ---------------------------------------------------------------------------
async function seedICDHistory(): Promise<void> {
  console.log(`\n[4/4] seedICDHistory — 10 search history records`);

  const now = Date.now();
  const HOUR = 3600 * 1000;
  const DAY = 24 * HOUR;

  const SEARCHES = [
    { id: "HIST001", data: { icdCode: "I10", icdName: "Tăng huyết áp nguyên phát (Essential (primary) hypertension)", category: "tim-mach", searchedAt: new Date(now - 1 * HOUR).toISOString() } },
    { id: "HIST002", data: { icdCode: "E11", icdName: "Đái tháo đường type 2 (Type 2 diabetes mellitus)", category: "noi-tiet", searchedAt: new Date(now - 3 * HOUR).toISOString() } },
    { id: "HIST003", data: { icdCode: "E11.9", icdName: "Đái tháo đường type 2 không biến chứng (Type 2 diabetes mellitus without complications)", category: "noi-tiet", searchedAt: new Date(now - 5 * HOUR).toISOString() } },
    { id: "HIST004", data: { icdCode: "A97", icdName: "Sốt xuất huyết (Dengue)", category: "truyen-nhiem", searchedAt: new Date(now - 8 * HOUR).toISOString() } },
    { id: "HIST005", data: { icdCode: "K35", icdName: "Viêm ruột thừa cấp (Acute appendicitis)", category: "tieu-hoa", searchedAt: new Date(now - 1 * DAY).toISOString() } },
    { id: "HIST006", data: { icdCode: "I63", icdName: "Tai biến mạch não não (Cerebral infarction)", category: "than-kinh", searchedAt: new Date(now - 1.5 * DAY).toISOString() } },
    { id: "HIST007", data: { icdCode: "J18", icdName: "Viêm phổi, tác nhân không xác định (Pneumonia, unspecified organism)", category: "ho-hap", searchedAt: new Date(now - 2 * DAY).toISOString() } },
    { id: "HIST008", data: { icdCode: "J18.9", icdName: "Viêm phổi không xác định (Unspecified pneumonia)", category: "ho-hap", searchedAt: new Date(now - 2.1 * DAY).toISOString() } },
    { id: "HIST009", data: { icdCode: "M54.5", icdName: "Đau lưng dưới (Low back pain)", category: "co-xuong-khop", searchedAt: new Date(now - 3 * DAY).toISOString() } },
    { id: "HIST010", data: { icdCode: "K29.5", icdName: "Viêm dạ dày mạn (Chronic gastritis)", category: "tieu-hoa", searchedAt: new Date(now - 4 * DAY).toISOString() } },
  ];

  await batchSetIfNotExists("icdSearchHistory", SEARCHES);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\n========================================`);
  console.log(`  Firestore Seed — web-noi-bo-umcc1`);
  console.log(`  Auth: ADC (applicationDefault)`);
  console.log(`========================================\n`);

  try {
    // Get admin UID first (needed for attendance)
    console.log(`[*] Resolving admin UID...`);
    const adminUid = await getAdminUid();
    console.log(`    admin@phongkham.vn → ${adminUid}\n`);

    await seedContacts();
    await seedAttendance(adminUid);
    await seedReferences();
    await seedICDHistory();

    console.log(`\n========================================`);
    console.log(`  All done.`);
    console.log(`========================================\n`);
  } catch (err) {
    console.error(`\n[FATAL]`, err);
    process.exit(1);
  }
}

main();
