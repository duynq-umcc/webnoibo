"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  FileText,
  AlertTriangle,
  Download,
  Printer,
  Link2,
  Edit3,
  MessageSquare,
  ChevronRight,
  Stethoscope,
  Brain,
  Activity,
  Pill,
  RefreshCw,
  CalendarDays,
  User,
  Shield,
  ScrollText,
  ListChecks,
  X,
  Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Specialty = "noi" | "ngoai" | "san" | "nhi" | "than-kinh" | "da-lieu" | "cap-cuu";
type ProtocolStatus = "active" | "new" | "withdrawn";

interface MedicineRow {
  group: string;
  activeIngredient: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  note?: string;
}

interface DiagnosisStep {
  order: number;
  title: string;
  description: string;
}

interface Protocol {
  id: string;
  name: string;
  icd: string;
  specialty: Specialty;
  specialtyLabel: string;
  status: ProtocolStatus;
  updatedAt: string;
  approver: string;
  version: string;
  // Section 1 — Thông tin chung
  decisionNumber: string;
  issuedDate: string;
  effectiveDate: string;
  expiryDate: string;
  // Section 2 — Định nghĩa
  definition: string;
  classification: string;
  // Section 3 — Chẩn đoán
  diagnosisSteps: DiagnosisStep[];
  // Section 4 — Điều trị
  treatmentNotes: string;
  medicines: MedicineRow[];
  // Section 5 — Cảnh báo
  warnings: string[];
  // Section 6 — Theo dõi
  monitoring: { key: string; value: string }[];
  tags: string[];
  iconColor: string;
  followUpNote: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROTOCOLS: Protocol[] = [
  {
    id: "PD001",
    name: "Phác đồ điều trị Tăng huyết áp vừa và nặng (người lớn)",
    icd: "I10",
    specialty: "noi",
    specialtyLabel: "Nội khoa",
    status: "active",
    updatedAt: "10/05/2026",
    approver: "PGS.TS. Nguyễn Văn A",
    version: "v3.2",
    decisionNumber: "QĐ-BYT-2024/PD001",
    issuedDate: "15/03/2024",
    effectiveDate: "01/04/2024",
    expiryDate: "31/12/2026",
    definition:
      "Tăng huyết áp (THA) được định nghĩa là huyết áp tâm thu (HATT) ≥ 140 mmHg và/hoặc huyết áp tâm trương (HATTr) ≥ 90 mmHg, đo ít nhất 2 lần tại ít nhất 2 lần khám trong điều kiện tiêu chuẩn.",
    classification:
      "• Giai đoạn 1 (THA nhẹ): HATT 140–159 hoặc HATTr 90–99 mmHg\n• Giai đoạn 2 (THA vừa): HATT 160–179 hoặc HATTr 100–109 mmHg\n• Giai đoạn 3 (THA nặng): HATT ≥ 180 hoặc HATTr ≥ 110 mmHg\n• THA tâm trương đơn độc: HATT < 140 và HATTr ≥ 90 mmHg",
    diagnosisSteps: [
      { order: 1, title: "Đo huyết áp chuẩn", description: "Đo HATT và HATTr ở cả hai tay, ít nhất 2 lần cách nhau 1–2 phút. Sử dụng máy đo huyết áp đã được kiểm định." },
      { order: 2, title: "Hỏi bệnh sử", description: "Tiền sử gia đình, bệnh tim mạch, đái tháo đường, bệnh thận, thuốc đang dùng (kể cả thuốc bổ, thảo dược)." },
      { order: 3, title: "Khám lâm sàng toàn thân", description: "Cân nặng, chiều cao, BMI, khám tim phổi, mạch ngoại biên, vùng cổ, bụng." },
      { order: 4, title: "Cận lâm sàng cơ bản", description: "ECG, glucose máu đói, HbA1c, cholesterol toàn phần, LDL, HDL, triglyceride, creatinin, microalbumin niệu, siêu âm tim." },
      { order: 5, title: "Phân nhóm nguy cơ", description: "Sử dụng thang điểm SCORE2 hoặc Framingham để phân nhóm nguy cơ tim mạch." },
    ],
    treatmentNotes:
      "Mục tiêu điều trị: HATT < 140 mmHg (nếu < 65 tuổi); HATT 140–150 mmHg (nếu ≥ 65 tuổi); HATTr < 90 mmHg (đái tháo đường < 80 mmHg). Bắt đầu bằng một thuốc hạ áp, ưu tiên thuốc có tác dụng bảo vệ tim thận.",
    medicines: [
      { group: "Thiamine pyrophosphate antagonist", activeIngredient: "Amlodipine 5mg", dosage: "5–10mg", route: "Uống", frequency: "1 lần/ngày", duration: "Dài hạn", note: "Ưu tiên cho người ≥ 65 tuổi" },
      { group: "ACE inhibitor", activeIngredient: "Enalapril 5mg", dosage: "5–20mg", route: "Uống", frequency: "1–2 lần/ngày", duration: "Dài hạn", note: "Chống chỉ định thai kỳ, hyperkalemia" },
      { group: "ACE inhibitor", activeIngredient: "Lisinopril 10mg", dosage: "10–40mg", route: "Uống", frequency: "1 lần/ngày", duration: "Dài hạn" },
      { group: "Thiazide diuretic", activeIngredient: "Hydrochlorothiazide 25mg", dosage: "12.5–25mg", route: "Uống", frequency: "1 lần/ngày", duration: "Dài hạn", note: "Theo dõi Kali máu" },
      { group: "Beta blocker", activeIngredient: "Metoprolol 50mg", dosage: "50–100mg", route: "Uống", frequency: "2 lần/ngày", duration: "Dài hạn", note: "Chú ý chống chỉ định hen, bloc nhĩ thất" },
      { group: "Kết hợp cố định liều", activeIngredient: "Amlodipine 5mg + Valsartan 80mg", dosage: "1 viên", route: "Uống", frequency: "1 lần/ngày", duration: "Dài hạn", note: "Khi cần kiểm soát huyết áp nhanh" },
    ],
    warnings: [
      "Không ngưng thuốc đột ngột khi đang dùng beta blocker — nguy cơ rebound tachycardia và nhồi máu cơ tim.",
      "Theo dõi chức năng thận và Kali máu trong vòng 2–4 tuần sau khi bắt đầu hoặc tăng liều ACE-I/ARB.",
      "Thận trọng khi kết hợp NSAIDs với thuốc hạ áp — giảm hiệu quả và tăng nguy cơ suy thận cấp.",
      "Phụ nữ mang thai không được dùng ACE-I, ARB — nguy cơ dị tật thai nhi và suy thận sơ sinh.",
    ],
    monitoring: [
      { key: "Huyết áp", value: "Mỗi lần tái khám, tự đo tại nhà 2 lần/ngày" },
      { key: "Nhịp tim", value: "Mỗi lần tái khám" },
      { key: "Chức năng thận (Creatinin, eGFR)", value: "Sau 2–4 tuần khi bắt đầu/thay đổi thuốc, sau đó 3–6 tháng/lần" },
      { key: "Điện giải đồ (K+, Na+)", value: "Sau 2–4 tuần nếu dùng thiazide hoặc furosemide" },
      { key: "Glycemia, HbA1c", value: "3 tháng/lần nếu có đái tháo đường đi kèm" },
      { key: "Lipid máu", value: "6 tháng/lần" },
      { key: "ECG", value: "12 tháng/lần hoặc khi có triệu chứng" },
    ],
    followUpNote: "Tái khám sau 2–4 tuần đầu để đánh giá đáp ứng và điều chỉnh liều. Sau khi ổn định, tái khám 3–6 tháng/lần.",
    tags: ["Tim mạch", "Huyết áp", "Người lớn", "BYT 2024"],
    iconColor: "text-red-500 bg-red-50 dark:bg-red-950/30",
  },
  {
    id: "PD002",
    name: "Phác đồ điều trị Đái tháo đường type 2 — kiểm soát đường huyết ban đầu",
    icd: "E11.9",
    specialty: "noi",
    specialtyLabel: "Nội khoa",
    status: "new",
    updatedAt: "12/05/2026",
    approver: "PGS.TS. Trần Thị B",
    version: "v4.1",
    decisionNumber: "QĐ-BYT-2024/PD002",
    issuedDate: "20/06/2024",
    effectiveDate: "01/07/2024",
    expiryDate: "31/12/2026",
    definition: "Đái tháo đường type 2 (ĐTĐ type 2) là bệnh chuyển hóa mạn tính đặc trưng bởi rối loạn chuyển hóa carbohydrate kèm kháng insulin và/hoặc giảm tiết insulin, dẫn đến tình trạng tăng glucose máu mạn tính.",
    classification: "• Tiền đái tháo đường: HbA1c 5.7–6.4%, Glucose đói 100–125 mg/dL\n• ĐTĐ type 2: HbA1c ≥ 6.5% hoặc Glucose đói ≥ 126 mg/dL hoặc Glucose 2h ≥ 200 mg/dL (OGTT)\n• Biến chứng vi thể/nhỡ: Albumin niệu vi lượng, retinopaty nhẹ\n• Biến chứng vĩ mô: Bệnh tim mạch, đột quỵ, bệnh thận ĐTĐ",
    diagnosisSteps: [
      { order: 1, title: "Xét nghiệm chẩn đoán", description: "HbA1c (bội số 2%), Glucose máu đói, Glucose máu sau ăn 2h (khi cần)." },
      { order: 2, title: "Đánh giá biến chứng", description: "Soi đáy mắt, microalbumin niệu/creatinin niệu, eGFR, ECG, chỉ số ABI." },
      { order: 3, title: "Phân tầng nguy cơ", description: "Đánh giá nguy cơ tim mạch 10 năm theo thang SCORE2-Diabetes." },
    ],
    treatmentNotes: "Mục tiêu: HbA1c < 7% (đa số), < 6.5% (trẻ, người trẻ không có biến chứng), < 8% (người già, có biến chứng nặng). Bắt đầu với Metformin nếu không chống chỉ định. Kết hợp thay đổi lối sống từ đầu.",
    medicines: [
      { group: "Biguanide", activeIngredient: "Metformin 500mg", dosage: "500–2000mg", route: "Uống", frequency: "1–2 lần/ngày", duration: "Dài hạn", note: "Bắt đầu liều thấp, tăng dần" },
      { group: "SGLT2 inhibitor", activeIngredient: "Dapagliflozin 10mg", dosage: "10mg", route: "Uống", frequency: "1 lần/ngày", duration: "Dài hạn", note: "Ưu tiên nếu có bệnh tim mạch hoặc suy tim" },
      { group: "GLP-1 RA", activeIngredient: "Semaglutide", dosage: "0.25–1mg", route: "Tiêm dưới da", frequency: "1 lần/tuần", duration: "Dài hạn", note: "Giảm cân có ý nghĩa, cần theo dõi viêm tụy" },
      { group: "Sulfonylurea", activeIngredient: "Gliclazide 30mg", dosage: "30–120mg", route: "Uống", frequency: "1 lần/ngày sáng", duration: "Dài hạn", note: "Thận trọng hạ đường huyết ở người già" },
      { group: "Insulin", activeIngredient: "Insulin NPH hoặc Premix", dosage: "Theo chỉ định", route: "Tiêm dưới da", frequency: "1–2 lần/ngày", duration: "Khi HbA1c > 9% có triệu chứng", note: "Chuyển đổi khi thất bại với ≥ 2 thuốc uống" },
    ],
    warnings: [
      "Nguy cơ hạ đường huyết khi dùng sulfonylurea hoặc insulin — cần hướng dẫn bệnh nhân nhận biết và xử trí.",
      "SGLT2i có thể gây nhiễm trùng tiết niệu tái phát, ketoacidose ĐTĐ (DKA euglycemic).",
      "Metformin chống chỉ định khi eGFR < 30 mL/min/1.73m² và trong các tình trạng có nguy cơ toan lactic.",
    ],
    monitoring: [
      { key: "HbA1c", value: "3 tháng/lần (cho đến khi đạt mục tiêu), sau đó 6 tháng/lần" },
      { key: "Glucose máu tại nhà", value: "Đói và 2h sau ăn, ghi nhật ký" },
      { key: "Chức năng thận", value: "3 tháng/lần (eGFR, albumin niệu)" },
      { key: "Huyết áp, lipid máu", value: "Mỗi lần tái khám" },
      { key: "Soi đáy mắt", value: "Hàng năm" },
    ],
    followUpNote: "Tái khám mỗi 3 tháng khi chưa đạt HbA1c mục tiêu. Hướng dẫn chế độ ăn ĐTĐ (1800–2000 kcal/ngày) và vận động ≥ 150 phút/tuần.",
    tags: ["Nội tiết", "Đái tháo đường", "Metformin", "BYT 2024"],
    iconColor: "text-orange-500 bg-orange-50 dark:bg-orange-950/30",
  },
  {
    id: "PD003",
    name: "Phác đồ điều trị Hen phế quản ở người lớn",
    icd: "J45.9",
    specialty: "noi",
    specialtyLabel: "Hô hấp",
    status: "active",
    updatedAt: "03/05/2026",
    approver: "TS.BS. Lê Văn C",
    version: "v2.0",
    decisionNumber: "QĐ-BYT-2023/PD003",
    issuedDate: "10/01/2023",
    effectiveDate: "01/02/2023",
    expiryDate: "31/12/2025",
    definition: "Hen phế quản là bệnh viêm mạn tính đường thở với đặc điểm tắc nghẽn phế quản không hồi phục hoàn toàn, biểu hiện khò khè, khó thở, nặng ngực và ho tái phát.",
    classification: "• Hen gián đoạn (I): HATT < 20 phút/lần, ≤ 2 đêm/tuần, FEV1 ≥ 80%, PEF ≥ 80%\n• Hen nhẹ dai dẳng (II): Triệu chứng > 2 đêm/tuần, FEV1 ≥ 80%, PEF 60–80%\n• Hen vừa dai dẳng (III): Triệu chứng hàng ngày, FEV1 60–80%, PEF 40–59%\n• Hen nặng dai dẳng (IV): Triệu chứng liên tục, FEV1 < 60%, PEF < 40%",
    diagnosisSteps: [
      { order: 1, title: "Đánh giá triệu chứng", description: "Hỏi về khò khè, khó thở, nặng ngực, ho (đặc biệt về đêm/nào sáng). Dùng thang điểm ACT (Asthma Control Test)." },
      { order: 2, title: "Đo hô hấp ký", description: "Spirogram: FEV1, FEV1/FVC, test giãn phế quản (cải thiện FEV1 ≥ 12% và ≥ 200mL)." },
      { order: 3, title: "Peak flow meter", description: "PEF theo dõi tại nhà, ghi nhật ký PEF sáng và tối." },
      { order: 4, title: "Xét nghiệm dị ứng", description: "IgE đặc hiệu, test da dị ứng nguyên (nếu cần xác định dị nguyên gây hen)." },
    ],
    treatmentNotes: "Nguyên tắc: Kiểm soát viêm + Kiểm soát triệu chứng. Sử dụng ICS (corticosteroid hít) làm thuốc kiểm soát nền. SABA (Salbutamol) là thuốc cắt cơn cấp.",
    medicines: [
      { group: "SABA — Cắt cơn cấp", activeIngredient: "Salbutamol 100µg", dosage: "1–2 nhát", route: "Hít qua miệng", frequency: "Khi có triệu chứng", duration: "Cấp tính" },
      { group: "ICS/LABA kết hợp", activeIngredient: "Fluticasone/Salmeterol 250/50µg", dosage: "1 lần hít × 2", route: "Hít qua miệng", frequency: "2 lần/ngày", duration: "Dài hạn", note: "Thuốc kiểm soát nền" },
      { group: "ICS/LABA kết hợp", activeIngredient: "Budesonide/Formoterol 160/4.5µg", dosage: "1–2 lần hít", route: "Hít qua miệng", frequency: "2 lần/ngày", duration: "Dài hạn", note: "Dùng cho hen vừa–nặng" },
      { group: "LTRA", activeIngredient: "Montelukast 10mg", dosage: "10mg", route: "Uống", frequency: "1 lần/ngày tối", duration: "Dài hạn", note: "Bổ trợ, đặc biệt hen dị ứng" },
      { group: "Systemic corticosteroid", activeIngredient: "Prednisolone 5mg", dosage: "30–50mg", route: "Uống", frequency: "1 lần/ngày sáng", duration: "5–7 ngày", note: "Khi cơn hen không kiểm soát được bằng SABA" },
    ],
    warnings: [
      "Không dùng đơn thuần beta-2 agonist dài hạn (LABA) mà không có ICS — tăng nguy cơ tử vong.",
      "Sử dụng buồng đệm (spacer) khi hít ICS để giảm tác dụng phụ tại chỗ (nhiễm nấm miệng, khàn tiếng).",
      "Xả miệng sau khi hít steroid để phòng nhiễm nấm Candida.",
    ],
    monitoring: [
      { key: "Triệu chứng lâm sàng", value: "Mỗi lần tái khám (ho, khò khè, khó thở, triệu chứng đêm)" },
      { key: "ACT score", value: "3 tháng/lần" },
      { key: "PEF tại nhà", value: "2 lần/ngày (sáng–tối), ghi nhật ký" },
      { key: "Spirometry / FEV1", value: "6 tháng/lần" },
      { key: "Tác dụng phụ thuốc", value: "Kiểm tra miệng nấm Candida, khàn tiếng" },
    ],
    followUpNote: "Tái khám 1–3 tháng/lần tùy mức độ kiểm soát. Đánh giá kỹ thuật hít thuốc mỗi lần tái khám.",
    tags: ["Hô hấp", "Hen phế quản", "Corticosteroid hít", "GIAI ĐOẠN"],
    iconColor: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    id: "PD004",
    name: "Phác đồ điều trị Viêm phế quản cấp ở trẻ em",
    icd: "J20.9",
    specialty: "nhi",
    specialtyLabel: "Nhi khoa",
    status: "active",
    updatedAt: "28/04/2026",
    approver: "TS.BS. Hoàng Minh D",
    version: "v1.5",
    decisionNumber: "QĐ-BYT-2022/PD004",
    issuedDate: "05/08/2022",
    effectiveDate: "01/09/2022",
    expiryDate: "31/08/2025",
    definition: "Viêm phế quản cấp (VPQC) là tình trạng viêm cấp tính niêm mạc phế quản, chủ yếu ở trẻ dưới 2 tuổi, do virus (RS virus, adenovirus, influenza) gây ra, biểu hiện ho, thở nhanh và ran rít.",
    classification: "• VPQC nhẹ: Tần số thở (TF) < 40 lần/phút, không có co kéo cơ hô hấp\n• VPQC vừa: TF 40–60 lần/phút, có co kéo nhẹ\n• VPQC nặng: TF > 60 lần/phút, thở rút lưng, tím tái, ngừng thở",
    diagnosisSteps: [
      { order: 1, title: "Đánh giá lâm sàng", description: "Mạch, TF, nhiệt độ, đánh giá mức độ khó thở theo thang Silverman–Andersen." },
      { order: 2, title: "Nghe phổi", description: "Ran rít, ran nổ 2 phế trường, giảm thông khí." },
      { order: 3, title: "SpO2 đo kẹp ngón", description: "SpO2 < 92% → bổ sung oxy." },
      { order: 4, title: "X-quang ngực (nếu cần)", description: "Khi nghi ngờ viêm phổi, dị vật đường thở, hoặc không đáp ứng điều trị sau 48h." },
    ],
    treatmentNotes: "Điều trị chủ yếu là hỗ trợ: bù dịch, hạ sốt, thông thoát đường thở. Kháng sinh không được chỉ định trừ khi có bằng chứng nhiễm khuẩn. Salbutamol đường hít có thể thử trên lâm sàng.",
    medicines: [
      { group: "Giãn phế quản (thử nghiệm)", activeIngredient: "Salbutamol nebules 2.5mg", dosage: "2.5mg", route: "Khí dung", frequency: "Mỗi 4–6 giờ nếu có đáp ứng", duration: "3–5 ngày", note: "Chỉ dùng khi có biểu hiện co thắt phế quản" },
      { group: "Hạ sốt", activeIngredient: "Paracetamol 10mg/kg/lần", dosage: "10–15mg/kg", route: "Uống hoặc đặt hậu môn", frequency: "Mỗi 4–6 giờ nếu sốt", duration: "Khi cần" },
      { group: "Lợi tiểu (khi phù phổi)", activeIngredient: "Furosemide 1mg/kg", dosage: "1mg/kg", route: "Tiêm tĩnh mạch chậm", frequency: "1 lần", duration: "1 liều duy nhất", note: "Chỉ khi phù phổi rõ" },
      { group: "Kháng sinh (chỉ khi có chỉ định)", activeIngredient: "Amoxicillin 40mg/kg/ngày", dosage: "40mg/kg", route: "Uống", frequency: "3 lần/ngày", duration: "5–7 ngày", note: "Khi nghi ngờ nhiễm khuẩn thứ phát" },
    ],
    warnings: [
      "Salbutamol khí dung có thể gây tachypnea và nhịp tim nhanh — theo dõi SpO2 và mạch trong quá trình nebule.",
      "Không dùng codein hoặc dextromethorphan cho trẻ dưới 12 tuổi — nguy cơ ức chế hô hấp.",
      "Cần nhập viện ngay nếu TF > 60 lần/phút, SpO2 < 92%, có dấu hiệu mệt mỏi, không bú được, hoặc tím tái.",
    ],
    monitoring: [
      { key: "Tần số thở", value: "Mỗi 1–2 giờ trong 4 giờ đầu" },
      { key: "SpO2", value: "Liên tục trong 4 giờ đầu, sau đó mỗi 2 giờ" },
      { key: "Dấu hiệu hô hấp", value: "Co kéo cơ, thở rút lưng, tiếng thở rít" },
      { key: "Khả năng bú/ăn", value: "Mỗi 2 giờ" },
      { key: "Dấu hiệu mất nước", value: "Mỗi 4 giờ" },
    ],
    followUpNote: "Tái khám sau 48–72 giờ nếu không cải thiện. Hướng dẫn cha mẹ cách nhận biết dấu hiệu nặng cần đến ngay.",
    tags: ["Nhi khoa", "Hô hấp", "Trẻ em", "VPQC"],
    iconColor: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
  },
  {
    id: "PD005",
    name: "Phác đồ điều trị Viêm dạ dày ruột cấp (lỏm) ở trẻ em",
    icd: "A09.0",
    specialty: "nhi",
    specialtyLabel: "Nhi khoa",
    status: "active",
    updatedAt: "15/04/2026",
    approver: "TS.BS. Trần Lan E",
    version: "v2.1",
    decisionNumber: "QĐ-BYT-2023/PD005",
    issuedDate: "12/03/2023",
    effectiveDate: "01/04/2023",
    expiryDate: "31/03/2026",
    definition: "Viêm dạ dày ruột cấp (VDDRC) là hội chứng tiêu chảy cấp tính (≥ 3 lần/phân lỏng/ngày) với hoặc không kèm nôn ói, sốt, đau bụng, do nhiễm trùng (virus, vi khuẩn, ký sinh trùng) hoặc nguyên nhân không nhiễm trùng.",
    classification: "• Không mất nước (Bảng 1 — WHO): Mí mắt bình thường, khát nước bình thường\n• Mất nước nhẹ (Bảng 2): Mí mắt hơi khô, khát nước, nước da tốt\n• Mất nước vừa (Bảng 3): Mí mắt khô, rất khát, nước da kém\n• Mất nước nặng (Bảng 4): Mí mắt rất khô, không uống được, da nặm vé",
    diagnosisSteps: [
      { order: 1, title: "Phân loại mất nước theo WHO", description: "Dùng bảng đánh giá mức độ mất nước của WHO để phân loại và xác định kế hoạch điều trị A/B/C." },
      { order: 2, title: "Cân nặng", description: "Cân trước điều trị để tính lượng dịch bù." },
      { order: 3, title: "Xét nghiệm (nếu cần)", description: "Soi phân tươi (hồng cầu, bạch cầu, ký sinh trùng), cấy phân, xét nghiệm lactose trong phân." },
    ],
    treatmentNotes: "Nguyên tắc cốt lõi: Bù dịch + Cho ăn sớm + Zninc bổ sung. Kháng sinh chỉ khi có chỉ định (choler, dysenteriae, giardia, nhiễm khuẩn huyết).",
    medicines: [
      { group: "ORS — Bù dịch đường uống", activeIngredient: "ORS gói", dosage: "50–100mL/kg trong 4h", route: "Uống chia nhỏ", frequency: "Sau mỗi lần nôn/chairs", duration: "Đến khi hết tiêu chảy" },
      { group: "ORS giảm áp đường ruột", activeIngredient: "ORS low-osmolarity", dosage: "75mL/kg", route: "Uống chia nhỏ", frequency: "Trong 4 giờ đầu", duration: "1 lần duy nhất", note: "Chuẩn WHO 2023" },
      { group: "Kẽm bổ sung", activeIngredient: "Zinc sulfate 20mg", dosage: "< 6 tháng: 10mg; ≥ 6 tháng: 20mg", route: "Uống", frequency: "1 lần/ngày", duration: "10–14 ngày", note: "Giảm duration tiêu chảy và tái phát" },
      { group: "Hạ sốt", activeIngredient: "Paracetamol 10–15mg/kg/lần", dosage: "10–15mg/kg", route: "Uống hoặc đặt hậu môn", frequency: "Mỗi 4–6 giờ", duration: "Khi cần" },
      { group: "Kháng sinh (chỉ khi có chỉ định)", activeIngredient: "Azithromycin 10mg/kg/ngày", dosage: "10mg/kg", route: "Uống", frequency: "1 lần/ngày", duration: "3 ngày", note: "Dysenteriae, cholerae hoặc khi suy giảm miễn dịch" },
    ],
    warnings: [
      "Không dùng thuốc chống nôn (metoclopramide, ondansetron) thường quy — không cải thiện kết quả và có thể gây hội chứng thần kinh ngoại biên.",
      "Không dùng thuốc trị tiêu chảy (loperamide) cho trẻ dưới 5 tuổi — nguy cơ ileus và ngộ độc.",
      "Đánh giá lại mức độ mất nước sau 4 giờ bù dịch bằng ORS.",
    ],
    monitoring: [
      { key: "Tình trạng mất nước", value: "Sau 4 giờ điều trị (Bảng WHO)" },
      { key: "Cân nặng", value: "Mỗi ngày (trẻ nhập viện)" },
      { key: "Đầu ra nước tiểu", value: "Đếm tải, ước lượng thể tích nước tiểu" },
      { key: "Triệu chứng tiêu hóa", value: "Tần số phân, nôn, đau bụng mỗi 8 giờ" },
    ],
    followUpNote: "Tái khám sau 5 ngày hoặc sớm hơn nếu: tiêu chảy không giảm sau 48h, phân có máu, sốt cao không giảm, không uống được ORS.",
    tags: ["Nhi khoa", "Tiêu hóa", "Trẻ em", "ORS", "Zinc"],
    iconColor: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
  },
  {
    id: "PD006",
    name: "Phác đồ điều trị Nhiễm khuẩn huyết (Sepsis) — sớm nhận diện và xử trí",
    icd: "A41.9",
    specialty: "cap-cuu",
    specialtyLabel: "Cấp cứu",
    status: "active",
    updatedAt: "20/04/2026",
    approver: "GS.TS. Phạm Văn F",
    version: "v3.0",
    decisionNumber: "QĐ-BYT-2024/PD006",
    issuedDate: "01/01/2024",
    effectiveDate: "01/01/2024",
    expiryDate: "31/12/2026",
    definition: "Nhiễm khuẩn huyết (Sepsis) là tình trạng rối loạn chức năng cơ quan do đáp ứng viêm toàn thân sai lệch của cơ thể đối với nhiễm trùng, đe dọa tính mạng. Sốc nhiễm khuẩn = sepsis + huyết động không ổn định despite fluid resuscitation.",
    classification: "• Nhiễm khuẩn huyết (Sepsis): Suspected infection + qSOFA ≥ 2 điểm hoặc SOFA ≥ 2 điểm\n• Sốc nhiễm khuẩn: Sepsis + MAP < 65 mmHg despite fluid resuscitation + lactate > 2 mmol/L\n• Sepsis nặng: Sepsis + suy chức năng cơ quan cấp tính",
    diagnosisSteps: [
      { order: 1, title: "Sàng lọc nhanh qSOFA", description: "Thở nhanh ≥ 22 lần/phút, ý thức thay đổi, huyết áp tâm thu ≤ 100 mmHg. Nếu ≥ 2 → nghi sepsis." },
      { order: 2, title: "Xác nhận và phân loại SOFA", description: "Đánh giá 6 cơ quan ( hô hấp, thận, gan, coagulation, thần kinh, tim mạch)." },
      { order: 3, title: "Cấy máu + Xét nghiệm cơ bản", description: "Cấy máu (trước khi dùng kháng sinh), CBC, CRP, PCT, lactat, đông cầu, creatinin, bilirubin, glucose." },
      { order: 4, title: "Tìm nguồn nhiễm trùng", description: "X-quang ngực, siêu âm bụng, CT scan, cấy đờm/máu/nước tiểu tùy lâm sàng." },
    ],
    treatmentNotes: "Hour-1 Bundle: (1) Đo lactat, cấy máu. (2) Trị kháng sinh phổ rộng. (3) 30mL/kg crystalloid nếu hypotension hoặc lactat ≥ 4. (4) Vasopressors nếu MAP < 65 sau khi bù dịch.",
    medicines: [
      { group: "Kháng sinh phổ rộng kinh nghiệm", activeIngredient: "Meropenem 1g", dosage: "1g", route: "Tiêm tĩnh mạch", frequency: "Mỗi 8 giờ", duration: "7–10 ngày", note: "Điều chỉnh sau khi có kết quả cấy" },
      { group: "Kháng sinh phổ rộng kinh nghiệm", activeIngredient: "Vancomycin 15–20mg/kg", dosage: "15–20mg/kg", route: "Tiêm tĩnh mạch", frequency: "Mỗi 8–12 giờ", duration: "Tùy kết quả", note: "Khi nghi nhiễm MRSA" },
      { group: "Dịch truyền", activeIngredient: "Ringer lactat / NaCl 0.9%", dosage: "30mL/kg", route: "Tiêm tĩnh mạch nhanh", frequency: "Trong 1 giờ đầu", duration: "Bù nhanh ban đầu" },
      { group: "Vasoactive", activeIngredient: "Norepinephrine 0.05–3 µg/kg/phút", dosage: "0.05–3 µg/kg/phút", route: "Truyền tĩnh mạch liên tục", frequency: "Liên tục", duration: "Đến khi MAP ≥ 65 mmHg", note: "Thiết lập đường truyền TM trung tâm" },
    ],
    warnings: [
      "Trì hoãn kháng sinh > 3 giờ sau khi nhận diện sepsis có liên quan tăng tỷ lệ tử vong đáng kể.",
      "Sử dụng piperacillin-tazobactam có thể che lấp dấu hiệu nhiễm CPE — cân nhắc meropenem nếu nguy cơ cao.",
      "SiS (Sterile炎症) không phải chỉ định kháng sinh — cần tái đánh giá sau 48–72 giờ.",
    ],
    monitoring: [
      { key: "Huyết động", value: "MAP, nhịp tim, huyết áp mỗi 15–30 phút (ban đầu)" },
      { key: "Lactat máu", value: "Sau 2 giờ điều trị — mục tiêu giảm ≥ 10% mỗi 2h" },
      { key: "Đầu ra nước tiểu", value: "Đặt sonde, duy trì output ≥ 0.5 mL/kg/h" },
      { key: "Chức năng cơ quan", value: "SOFA score mỗi 6 giờ" },
    ],
    followUpNote: "Đánh giá lại kháng sinh trong 48–72 giờ. Rút ngắn kháng sinh nếu không có bằng chứng nhiễm trùng. De-escalate theo kết quả cấy.",
    tags: ["Cấp cứu", "Sepsis", "Kháng sinh", "Người lớn", "BYT 2024"],
    iconColor: "text-red-600 bg-red-100 dark:bg-red-950/40",
  },
  {
    id: "PD007",
    name: "Phác đồ điều trị Viêm khớp dạng thấp",
    icd: "M05.9",
    specialty: "ngoai",
    specialtyLabel: "Ngoại khoa",
    status: "withdrawn",
    updatedAt: "01/05/2026",
    approver: "PGS.TS. Hoàng Văn E",
    version: "v1.0",
    decisionNumber: "QĐ-BYT-2021/PD007",
    issuedDate: "15/06/2021",
    effectiveDate: "01/07/2021",
    expiryDate: "30/06/2024",
    definition: "Viêm khớp dạng thấp (VKDT) là bệnh viêm khớp tự miễn mạn tính, đặc trưng bởi viêm synovium đối xứng nhiều khớp nhỏ, dẫn đến phá hủy sụn và xương nếu không điều trị sớm.",
    classification: "• VKDT dương tính huyết thanh (Seropositive): RF và/hoặc ACPA (+)\n• VKDT âm tính huyết thanh (Seronegative): RF và ACPA (–)\n• VKDT có biến chứng hệ thống: Viêm mạch, viêm phổi gian leo, viêm củng mạc",
    diagnosisSteps: [
      { order: 1, title: "2010 ACR/EULAR criteria", description: "Điểm ≥ 6/10: Số khớp bị tổn, RF/ACPA, CRP/ESR, thời gian triệu chứng." },
      { order: 2, title: "Xét nghiệm", description: "RF, anti-CCP (ACPA), ESR, CRP, ANA, CBC, chức năng gan thận." },
      { order: 3, title: "Hình ảnh học", description: "X-quang khớp bàn tay/bàn chân đối xứng, siêu âm khớm, MRI nếu chẩn đoán không rõ." },
    ],
    treatmentNotes: "Mục tiêu: Điều trị theo mục tiêu (T2T) — remission hoặc low disease activity. Bắt đầu csDMARD (methotrexate) sớm nhất có thể trong vòng 3 tháng từ khi chẩn đoán.",
    medicines: [
      { group: "csDMARD (Thuốc chống thấp cải thiện)", activeIngredient: "Methotrexate 2.5mg", dosage: "7.5–20mg/tuần", route: "Uống hoặc tiêm dưới da", frequency: "1 lần/tuần", duration: "Dài hạn", note: "Bổ sung folic acid 1mg/ngày" },
      { group: "csDMARD bổ trợ", activeIngredient: "Sulfasalazine 500mg", dosage: "500–1000mg", route: "Uống", frequency: "2 lần/ngày", duration: "Dài hạn", note: "Kết hợp khi MTX đơn độc không đủ" },
      { group: "Glucocorticoid cầu nối", activeIngredient: "Prednisolone 5mg", dosage: "≤ 10mg/ngày", route: "Uống", frequency: "1 lần/ngày sáng", duration: "Tối đa 3 tháng, giảm dần", note: "Cầu nối trong khi chờ csDMARD phát huy tác dụng" },
      { group: "NSAID", activeIngredient: "Celecoxib 200mg", dosage: "200mg", route: "Uống", frequency: "1–2 lần/ngày", duration: "Ngắn hạn", note: "Kiểm soát đau, không thay thế DMARD" },
      { group: "bDMARD (khi thất bại csDMARD)", activeIngredient: "Adalimumab 40mg", dosage: "40mg", route: "Tiêm dưới da", frequency: "2 tuần/lần", duration: "Dài hạn", note: "Chỉ sau khi thất bại MTX ≥ 3 tháng" },
    ],
    warnings: [
      "Methotrexate chống chỉ định thai kỳ, cho con bú, suy gan/ thận nặng. Cần theo dõi CBC và chức năng gan mỗi tháng.",
      "Glucocorticoid liều cao kéo dài → loãng xương, đái tháo đường, tăng huyết áp — cần bổ sung calcium + vitamin D.",
      "Sinh thiết khớp khi chẩn đoán không rõ — phân biệt VKDT với gout giả, viêm cột sống dính khớp.",
    ],
    monitoring: [
      { key: "DAS28 (Disease Activity Score)", value: "3 tháng/lần" },
      { key: "Chức năng khớp", value: "Số khớp sưng/đau mỗi lần tái khám" },
      { key: "ESR / CRP", value: "Mỗi lần tái khám" },
      { key: "CBC, chức năng gan thận", value: "Tháng đầu: mỗi 2 tuần; sau đó 3 tháng/lần" },
    ],
    followUpNote: "Tái khám mỗi 1–3 tháng đến khi đạt remission/low disease activity. Hướng dẫn vật lý trị liệu và bảo vệ khớp.",
    tags: ["Cơ xương khớp", "Tự miễn", "Methotrexate", "VKDT"],
    iconColor: "text-teal-500 bg-teal-50 dark:bg-teal-950/30",
  },
  {
    id: "PD008",
    name: "Phác đồ điều trị Động kinh ở người lớn",
    icd: "G40.9",
    specialty: "than-kinh",
    specialtyLabel: "Thần kinh",
    status: "active",
    updatedAt: "05/05/2026",
    approver: "GS.TS. Vũ Thị M",
    version: "v2.3",
    decisionNumber: "QĐ-BYT-2023/PD008",
    issuedDate: "20/09/2023",
    effectiveDate: "01/10/2023",
    expiryDate: "30/09/2026",
    definition: "Động kinh là một nhóm rối loạn thần kinh mạn tính đặc trưng bởi cơn động kinh tái phát do sự phóng điện không kiểm soát của neuron não. Chẩn đoán khi có ≥ 2 cơn khôngprovoked cách nhau ≥ 24 giờ.",
    classification: "• Động kinh cục bộ (Focal): Một bán cầu não, triệu chứng tùy vùng tổn thương\n  – Có ý thức preserved hoặc impaired\n  – Tiến triển thành cơn toàn thể thứ phát\n• Động kinh toàn thể (Generalized): Cả hai bán cầu đồng thời\n  – Cơn tonic-clonic, absence, myoclonic, atonic, tonic, clonic\n• Status epilepticus: Cơn kéo dài ≥ 5 phút hoặc ≥ 2 cơn không hồi phục",
    diagnosisSteps: [
      { order: 1, title: "Đánh giá lâm sàng", description: "Mô tả chi tiết cơn (khởi phát, diễn biến, thời gian, triệu chứng sau cơn). Ghi video nếu có thể." },
      { order: 2, title: "Điện não đồ (EEG)", description: "EEG lúc tỉnh và ngủ. Phát hiện sóng癫痫 đặc trưng. EEG bình thường không loại trừ chẩn đoán." },
      { order: 3, title: "Neuroimaging", description: "MRI não (không có contrast) để loại trừ tổn thương cấu trúc. CT não chỉ trong cấp cứu." },
    ],
    treatmentNotes: "Nguyên tắc: Một thuốc chống động kinh (AED) đầu tiên, tăng liều dần đến liều hiệu quả hoặc liều tối đa dung nạp. Chỉ thêm thuốc thứ 2 khi thất bại với liều đủ của thuốc đầu tiên.",
    medicines: [
      { group: "AED thế hệ mới — Cơn cục bộ", activeIngredient: "Levetiracetam 500mg", dosage: "500–1500mg", route: "Uống", frequency: "2 lần/ngày", duration: "Dài hạn", note: "Ưu tiên đầu tay cho cơn cục bộ" },
      { group: "AED — Cơn toàn thể", activeIngredient: "Valproic acid 200mg", dosage: "500–2000mg", route: "Uống", frequency: "2–3 lần/ngày", duration: "Dài hạn", note: "Hiệu quả rộng nhất, chú ý teratogenicity" },
      { group: "AED — Cơn absence", activeIngredient: "Ethosuximide 250mg", dosage: "500–1500mg", route: "Uống", frequency: "1–2 lần/ngày", duration: "Dài hạn", note: "Chỉ cho cơn absence thuần túy, không cho cơn toàn thể" },
      { group: "AED — Cơn myoclonic", activeIngredient: "Clonazepam 0.5mg", dosage: "0.5–2mg", route: "Uống", frequency: "2–3 lần/ngày", duration: "Dài hạn", note: "Có thể gây dung nạp sau vài tháng" },
      { group: "Status epilepticus", activeIngredient: "Diazepam 10mg", dosage: "10–20mg", route: "Đặt trực tràng / TM chậm", frequency: "1 lần", duration: "Cấp cứu", note: "Có thể lặp lại sau 10–15 phút (tối đa 3 liều)" },
    ],
    warnings: [
      "Valproic acid có tính terat cao — chống chỉ định cho phụ nữ có khả năng mang thai. Ưu tiên levetiracetam hoặc lamotrigine.",
      "Không ngưng thuốc AED đột ngột — nguy cơ status epilepticus rebound.",
      "Tương tác thuốc phổ biến: carbamazepine/phenytoin cảm ứng enzyme CYP — giảm hiệu quả nhiều thuốc đồng thời.",
    ],
    monitoring: [
      { key: "Tần số cơn", value: "Nhật ký cơn, mỗi lần tái khám" },
      { key: "Tác dụng phụ", value: "Chóng mặt, buồn ngủ, rối loạn gan máu, rối loạn máu" },
      { key: "Nồng độ thuốc (Therapeutic drug monitoring)", value: "Khi nghi ngờ độc tính hoặc không đáp ứng" },
      { key: "Chức năng gan thận, CBC", value: "3–6 tháng/lần (tùy thuốc)" },
    ],
    followUpNote: "Tái khám 3 tháng/lần khi ổn định. EEG lại sau 1–2 năm nếu hết cơn. Cân nhắc phẫu thuật nếu động kinh kháng thuốc (thất bại ≥ 2 AED liều đủ).",
    tags: ["Thần kinh", "Động kinh", "AED", "Người lớn"],
    iconColor: "text-violet-500 bg-violet-50 dark:bg-violet-950/30",
  },
  {
    id: "PD009",
    name: "Phác đồ điều trị Zona thần kinh (Herpes zoster)",
    icd: "B02.9",
    specialty: "da-lieu",
    specialtyLabel: "Da liễu",
    status: "active",
    updatedAt: "18/04/2026",
    approver: "TS.BS. Bùi Thị N",
    version: "v1.8",
    decisionNumber: "QĐ-BYT-2022/PD009",
    issuedDate: "30/04/2022",
    effectiveDate: "01/05/2022",
    expiryDate: "30/04/2025",
    definition: "Zona thần kinh (Herpes zoster) là bệnh do virus Varicella-zoster (VZV) tái hoạt động ở hạch thần kinh cảm giác, biểu hiện phát ban dát mụn nước theo đường phân bố dây thần kinh, kèm đau dây thần kinh.",
    classification: "• Zona thân mình (Trunk): 50–60% trường hợp, theo dây thần kinh liên sườn\n• Zona mặt (Cranial): Zona ophthalmic (dây V), Zona otologic (Ramsay Hunt)\n• Zona lan tỏa (Disseminated): > 20 vùng da, đặc biệt ở suy giảm miễn dịch\n• Đau thần kinh sau zona (PHN): Đau kéo dài ≥ 90 ngày sau phát ban",
    diagnosisSteps: [
      { order: 1, title: "Lâm sàng", description: "Đau dây thần kinh + phát ban đặc trưng dọc theo một dây thần kinh cảm giác. Tiền triệu đau có thể xuất hiện 1–5 ngày trước phát ban." },
      { order: 2, title: "Xác định biến chứng mắt", description: "Khám mắt: viêm giác mạc, viêm mống mắt, đau dây V — cần khám chuyên khoa ngay." },
      { order: 3, title: "Đánh giá miễn dịch", description: "CD4, HIV test nếu Zona lan tỏa hoặc tái phát." },
    ],
    treatmentNotes: "Mục tiêu: Rút ngắn thời gian bệnh, giảm biến chứng cấp, phòng ngừa PHN. Bắt đầu kháng virus trong vòng 72 giờ từ khi phát ban. Vaccination là biện pháp phòng ngừa hiệu quả nhất.",
    medicines: [
      { group: "Kháng virus", activeIngredient: "Valacyclovir 500mg", dosage: "1g", route: "Uống", frequency: "3 lần/ngày", duration: "7 ngày (khởi phát < 72h) hoặc 10 ngày nếu muộn hơn", note: "Hiệu quả hơn acyclovir" },
      { group: "Kháng virus", activeIngredient: "Famciclovir 250mg", dosage: "500mg", route: "Uống", frequency: "3 lần/ngày", duration: "7 ngày", note: "Thay thế cho valacyclovir" },
      { group: "Giảm đau cấp", activeIngredient: "Gabapentin 300mg", dosage: "300–900mg", route: "Uống", frequency: "3 lần/ngày", duration: "2–4 tuần", note: "Bắt đầu sớm để phòng PHN" },
      { group: "NSAID / Paracetamol", activeIngredient: "Paracetamol 500mg", dosage: "500–1000mg", route: "Uống", frequency: "Mỗi 4–6 giờ (tối đa 4g/ngày)", duration: "Khi có đau", note: "Đau nhẹ–vừa" },
      { group: "PHN — Thuốc đầu tay", activeIngredient: "Pregabalin 75mg", dosage: "75–150mg", route: "Uống", frequency: "2 lần/ngày", duration: "Tối thiểu 2–3 tháng", note: "Đau thần kinh sau zona (PHN)" },
    ],
    warnings: [
      "Kháng virus valacyclovir/famciclovir cần điều chỉnh liều theo chức năng thận (CrCl < 50 mL/min).",
      "Zona ophthalmic (dây V) có nguy cơ mù lòa cao — cần khám mắt trong 24 giờ và điều trị kháng virus liều cao.",
      "Phân biệt zona lan tỏa với herpes simplex lan rộng (HSV) — HSV tái phát nhiều ở môi và sinh dục.",
    ],
    monitoring: [
      { key: "Tổn thương da", value: "Theo dõi tiến triển phát ban, liền vảy, nhiễm khuẩn thứ phát" },
      { key: "Đau", value: "Thang điểm NRS (0–10) mỗi lần tái khám" },
      { key: "Biến chứng mắt", value: "Khám mắt mỗi tuần (zona V)" },
      { key: "Chức năng thận", value: "Nếu có suy thận nền (CrCl < 50)" },
    ],
    followUpNote: "Tái khám sau 2 tuần để đánh giá liền da và kiểm soát đau. Theo dõi PHN 3 tháng. Tiêm vaccine RZV cho người ≥ 50 tuổi.",
    tags: ["Da liễu", "Virus", "Zona", "Kháng virus", "Người lớn"],
    iconColor: "text-pink-500 bg-pink-50 dark:bg-pink-950/30",
  },
  {
    id: "PD010",
    name: "Phác đồ điều trị Rối loạn tiền đình cấp và mạn tính",
    icd: "H81.9",
    specialty: "than-kinh",
    specialtyLabel: "Thần kinh – Tai mũi họng",
    status: "new",
    updatedAt: "14/05/2026",
    approver: "TS.BS. Lê Hùng P",
    version: "v1.2",
    decisionNumber: "QĐ-BYT-2025/PD010",
    issuedDate: "10/02/2025",
    effectiveDate: "01/03/2025",
    expiryDate: "28/02/2028",
    definition: "Rối loạn tiền đình bao gồm các hội chứng chóng mặt, mất thăng bằng do tổn thương hệ tiền đình (tai trong, dây thần kinh VIII, nhân tiền đình, tiểu não). Nguyên nhân phổ biến: BPPV, vestibular neuritis, Meniere, vestibular migraine.",
    classification: "• Chóng mặt tự nhiên (Vertigo): Cảm giác bản thân hoặc môi trường quay tròn\n• Rối loạn thăng bằng: Bất ổn khi đứng/đi, ngã\n• BPPV (Benign Paroxysmal Positional Vertigo): Cơn ngắn < 1 phút kích hoạt bởi thay đổi tư thế\n• Vestibular neuritis: Chóng mặt liên tục 1–3 ngày, không có giảm thính lực\n• Meniere: Chóng mặt + ù tai + giảm thính lực + chóng mặt cơn kéo dài 20 ph–12h",
    diagnosisSteps: [
      { order: 1, title: "Phân biệt chóng mặt trung ương/ngoại biên", description: "Dix-Hallpike test, HINTS exam (Head-Impulse, Nystagmus, Test of Skew). Dấu hiệu cảnh báo trung ương: đứng không vững, liệt dây thần kinh, dấu hiệu thân não." },
      { order: 2, title: "Dix-Hallpike test", description: "Chẩn đoán BPPV: gây chóng mặt + nystagmus torsional khi đầu ngả sau 30° sang một bên." },
      { order: 3, title: "Thính lực và cân bằng", description: "Đo thính lực, electronystagmography (ENG) nếu có, vestibular evoked myogenic potential (VEMP)." },
    ],
    treatmentNotes: "Điều trị theo nguyên nhân. BPPV: Epley maneuver (nghiệm pháp định vị). Vestibular neuritis: corticosteroid trong 72h đầu. Meniere: chế độ ăn ít muối, thuốc lợi tiểu, betahistine.",
    medicines: [
      { group: "Ức chế tiền đình (cấp)", activeIngredient: "Dimenhydrinate 50mg", dosage: "50mg", route: "Uống hoặc tiêm", frequency: "Mỗi 4–6 giờ", duration: "3–5 ngày (cấp)", note: "Chỉ dùng ngắn hạn" },
      { group: "Ức chế tiền đình (mạn)", activeIngredient: "Betahistine 8mg", dosage: "8–16mg", route: "Uống", frequency: "3 lần/ngày", duration: "Dài hạn", note: "Đặc biệt cho Meniere" },
      { group: "Ức chế viêm (vestibular neuritis)", activeIngredient: "Methylprednisolone 4mg", dosage: "Bắt đầu 100mg/ngày, giảm dần", route: "Uống", frequency: "1 lần/ngày sáng", duration: "22 ngày", note: "Bắt đầu trong 72h" },
      { group: "Chống buồn nôn", activeIngredient: "Metoclopramide 10mg", dosage: "10mg", route: "Uống hoặc tiêm", frequency: "Mỗi 8 giờ", duration: "3–5 ngày", note: "Không dùng dài hạn" },
      { group: "Phòng đau nửa đầu tiền đình", activeIngredient: "Flunarizine 5mg", dosage: "5–10mg", route: "Uống", frequency: "1 lần/ngày tối", duration: "Dài hạn", note: "Vestibular migraine" },
    ],
    warnings: [
      "Chống chỉ định dùng sedatives/hypnotics dài hạn cho chóng mặt — ức chế bù trừ tiền đình và kéo dài thời gian hồi phục.",
      "Cần MRI não nếu có dấu hiệu cảnh báo trung ương (đau đầu dữ dội, sốt, liệt dây thần kinh, rối loạn ý thức).",
      "Metoclopramide có nguy cơ lơ mơ, run rẩy (EPS) — thận trọng ở người già.",
    ],
    monitoring: [
      { key: "Triệu chứng chóng mặt", value: "Thang điểm DHI (Dizziness Handicap Inventory)" },
      { key: "Thăng bằng", value: "Tinmann test, Berg balance scale" },
      { key: "Thính lực", value: "Đo thính lực nếu nghi Meniere (mỗi 6 tháng)" },
      { key: "Tác dụng phụ thuốc", value: "Buồn ngủ, khô miệng (dimenhydrinate, flunarizine)" },
    ],
    followUpNote: "Tái khám sau 2–4 tuần (cấp), 3 tháng (mạn). Giới thiệu vestibular rehabilitation therapy (VRT) cho tất cả bệnh nhân rối loạn tiền đình mạn tính.",
    tags: ["Thần kinh", "Tai mũi họng", "Chóng mặt", "BPPV", "Meniere"],
    iconColor: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
  },
];

const SPECIALTY_CHIPS: { id: string; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "noi", label: "Nội khoa" },
  { id: "ngoai", label: "Ngoại khoa" },
  { id: "nhi", label: "Nhi khoa" },
  { id: "than-kinh", label: "Thần kinh" },
  { id: "da-lieu", label: "Da liễu" },
  { id: "cap-cuu", label: "Cấp cứu" },
];

const STATUS_CONFIG: Record<ProtocolStatus, { label: string; className: string; dot: string }> = {
  active: { label: "Đang áp dụng", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30", dot: "bg-emerald-500" },
  new: { label: "Mới cập nhật", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30", dot: "bg-blue-500" },
  withdrawn: { label: "Đã thu hồi", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/30", dot: "bg-red-500" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").slice(-2).map((n) => n[0]).join("").toUpperCase();
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PhacDoPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(["all"]));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const filteredProtocols = useMemo(() => {
    return PROTOCOLS.filter((p) => {
      const q = debouncedSearch.toLowerCase();
      if (q) {
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.icd.toLowerCase().includes(q) ||
          p.specialtyLabel.toLowerCase().includes(q) ||
          p.medicines.some((m) => m.activeIngredient.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (activeFilters.has("all")) return true;
      return activeFilters.has(p.specialty);
    });
  }, [debouncedSearch, activeFilters]);

  const selectedProtocol = useMemo(
    () => PROTOCOLS.find((p) => p.id === selectedId) ?? null,
    [selectedId]
  );

  // Auto-select first on initial load
  useEffect(() => {
    if (!selectedId && filteredProtocols.length > 0) {
      setSelectedId(filteredProtocols[0].id);
    }
  }, [filteredProtocols, selectedId]);

  const handleAI = useCallback(async () => {
    if (!selectedProtocol) return;
    setAiLoading(true);
    setAiResponse(null);
    setAiError(null);
    try {
      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Bạn là trợ lý y khoa chuyên nghiệp. Hãy giải thích ngắn gọn (200 từ) phác đồ điều trị "${selectedProtocol.name}" (ICD-10: ${selectedProtocol.icd}) cho bệnh nhân hiểu, bao gồm: định nghĩa bệnh, thuốc điều trị chính, và lời khuyên quan trọng khi dùng thuốc.`,
            },
          ],
          max_tokens: 400,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAiResponse(data.content ?? data.message?.content ?? "Phản hồi không đúng định dạng.");
    } catch {
      setAiError("Không thể kết nối AI. Vui lòng thử lại sau.");
    } finally {
      setAiLoading(false);
    }
  }, [selectedProtocol]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between flex-wrap gap-3 pb-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phác đồ điều trị</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Theo chuẩn BYT TT 21/2017 · {PROTOCOLS.length} phác đồ · Cập nhật: {PROTOCOLS[0]?.updatedAt}
          </p>
        </div>
        {isAdmin && (
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Tạo phác đồ mới
          </Button>
        )}
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* ── LEFT PANEL ── */}
        <div className="w-[380px] shrink-0 flex flex-col border rounded-xl overflow-hidden bg-card">
          {/* Search */}
          <div className="p-3 border-b bg-card/80 backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm bệnh, mã ICD, thuốc..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SPECIALTY_CHIPS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => toggleFilter(f.id)}
                  className={`
                    rounded-full px-2.5 py-0.5 text-xs font-medium transition-all border
                    ${activeFilters.has(f.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/60 text-muted-foreground border-transparent hover:bg-muted"
                    }
                  `}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              {filteredProtocols.length} phác đồ
              {debouncedSearch && ` · tìm: "${debouncedSearch}"`}
            </div>
          </div>

          {/* Protocol list */}
          <div
            ref={scrollRef as React.RefObject<HTMLDivElement>}
            className="flex-1 overflow-y-auto scrollbar-thin"
          >
            <div className="p-2 space-y-1.5">
              {filteredProtocols.length === 0 && (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  Không tìm thấy phác đồ phù hợp.
                </div>
              )}
              {filteredProtocols.map((p) => {
                const sc = STATUS_CONFIG[p.status];
                const isSelected = p.id === selectedId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`
                      w-full text-left rounded-lg border p-3 transition-all
                      ${isSelected
                        ? "border-2 border-blue-500 bg-blue-50/60 dark:bg-blue-950/20 ring-1 ring-blue-300 dark:ring-blue-700"
                        : "border-border hover:border-primary/40 hover:bg-muted/40"
                      }
                    `}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-2.5">
                      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${p.iconColor}`}>
                        <Stethoscope className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm leading-tight line-clamp-2">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant="outline" className="text-[10px] h-4 font-mono px-1">
                            {p.icd}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{p.specialtyLabel}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <ChevronRight className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] rounded-full px-1.5 py-0.5 bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {p.tags.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{p.tags.length - 3}</span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                      <div className="text-[10px] text-muted-foreground">
                        {p.updatedAt} · v{p.version}
                      </div>
                      <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${sc.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 min-w-0 flex flex-col">
          {selectedProtocol ? (
            <div className="flex-1 border rounded-xl overflow-hidden bg-card flex flex-col">
              {/* Sticky header */}
              <div className="shrink-0 px-6 py-4 border-b bg-card/80 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold leading-tight">{selectedProtocol.name}</h2>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STATUS_CONFIG[selectedProtocol.status].className}`}
                      >
                        {STATUS_CONFIG[selectedProtocol.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                      <span className="font-mono bg-muted px-1.5 rounded text-xs">{selectedProtocol.icd}</span>
                      <span>{selectedProtocol.specialtyLabel}</span>
                      <span>·</span>
                      <span>{selectedProtocol.version}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      <Printer className="mr-1.5 h-3.5 w-3.5" />
                      In
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Link2 className="mr-1.5 h-3.5 w-3.5" />
                      Link
                    </Button>
                    {isAdmin && (
                      <Button variant="outline" size="sm">
                        <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                        Sửa
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="p-6 space-y-6">

                  {/* Section 1 — Thông tin chung */}
                  <div>
                    <SectionHeading icon={ScrollText} title="1. Thông tin chung" />
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <tbody>
                          {[
                            ["Mã ICD-10", selectedProtocol.icd],
                            ["Chuyên khoa", selectedProtocol.specialtyLabel],
                            ["Số quyết định", selectedProtocol.decisionNumber],
                            ["Ngày ban hành", selectedProtocol.issuedDate],
                            ["Ngày có hiệu lực", selectedProtocol.effectiveDate],
                            ["Ngày hết hiệu lực", selectedProtocol.expiryDate],
                            ["Người ký duyệt", selectedProtocol.approver],
                            ["Phiên bản", selectedProtocol.version],
                          ].map(([key, value], i, arr) => (
                            <tr key={key} className={i < arr.length - 1 ? "border-b border-border/60" : ""}>
                              <td className="px-4 py-2.5 text-muted-foreground font-medium w-40 bg-muted/30">{key}</td>
                              <td className="px-4 py-2.5 font-medium">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 2 — Định nghĩa & Phân loại */}
                  <div>
                    <SectionHeading icon={FileText} title="2. Định nghĩa & Phân loại" />
                    <div className="space-y-3">
                      <div className="rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 p-4">
                        <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1.5 uppercase tracking-wide">Định nghĩa</div>
                        <div className="text-sm leading-relaxed">{selectedProtocol.definition}</div>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <div className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Phân loại</div>
                        <div className="text-sm leading-relaxed whitespace-pre-line">
                          {selectedProtocol.classification}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 — Chẩn đoán */}
                  <div>
                    <SectionHeading icon={ListChecks} title="3. Chẩn đoán" />
                    <div className="space-y-3">
                      {selectedProtocol.diagnosisSteps.map((step) => (
                        <div key={step.order} className="flex gap-3">
                          <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center mt-0.5">
                            {step.order}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{step.title}</div>
                            <div className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                              {step.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4 — Điều trị */}
                  <div>
                    <SectionHeading icon={Pill} title="4. Điều trị" />
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {selectedProtocol.treatmentNotes}
                    </p>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/60 border-b">
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground w-44">Nhóm thuốc</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Hoạt chất</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground w-28">Liều khởi đầu</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground w-20">Đường dùng</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground w-28">Tần suất</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground w-20">Thời gian</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Ghi chú</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProtocol.medicines.map((m, i) => (
                            <tr key={i} className={i > 0 ? "border-t border-border/60" : ""}>
                              <td className="px-3 py-2.5 text-xs text-muted-foreground align-top">{m.group}</td>
                              <td className="px-3 py-2.5 font-medium text-xs align-top">{m.activeIngredient}</td>
                              <td className="px-3 py-2.5 font-mono text-xs align-top">{m.dosage}</td>
                              <td className="px-3 py-2.5 text-xs align-top">{m.route}</td>
                              <td className="px-3 py-2.5 text-xs align-top">{m.frequency}</td>
                              <td className="px-3 py-2.5 text-xs align-top">{m.duration}</td>
                              <td className="px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400 align-top">
                                {m.note ?? "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 5 — Cảnh báo */}
                  <div>
                    <SectionHeading icon={AlertTriangle} title="5. Cảnh báo quan trọng" />
                    <div className="space-y-2">
                      {selectedProtocol.warnings.map((w, i) => (
                        <div
                          key={i}
                          className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20 p-3"
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <div className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{w}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 6 — Theo dõi & Tái khám */}
                  <div>
                    <SectionHeading icon={Activity} title="6. Theo dõi & Tái khám" />
                    <div className="space-y-2">
                      {selectedProtocol.monitoring.map((m, i) => (
                        <div key={i} className="flex gap-4 rounded-lg border bg-muted/20 p-3">
                          <div className="w-40 shrink-0 text-sm font-medium text-muted-foreground">{m.key}</div>
                          <div className="text-sm flex-1">{m.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800/40 dark:bg-blue-950/20 p-3">
                      <div className="flex gap-2 items-start">
                        <CalendarDays className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-300">
                          <span className="font-semibold">Tái khám: </span>
                          {selectedProtocol.followUpNote}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Assistant */}
                  <div className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.02] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm">Hỏi AI về phác đồ này</h3>
                    </div>

                    {aiLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        AI đang xử lý...
                      </div>
                    )}

                    {aiResponse && (
                      <div className="rounded-lg bg-background border p-4 text-sm leading-relaxed mb-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex gap-2 items-start">
                          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <p className="text-foreground whitespace-pre-line">{aiResponse}</p>
                        </div>
                      </div>
                    )}

                    {aiError && (
                      <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 p-3 text-sm text-red-700 dark:text-red-400 mb-3">
                        <AlertTriangle className="h-3.5 w-3.5 inline mr-1" />
                        {aiError}
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAI}
                      disabled={aiLoading}
                      className="gap-1.5"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Giải thích phác đồ bằng ngôn ngữ đơn giản
                    </Button>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center border rounded-xl bg-muted/10">
              <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Chọn phác đồ để xem chi tiết</h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Nhấn vào một phác đồ bên trái để xem thông tin chi tiết theo chuẩn BYT TT 21/2017
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
