export interface Protocol {
  id: string;
  name: string;
  icd: string;
  specialty: string;
  status: "active" | "new" | "withdrawn";
  updatedAt: string;
  tags: string[];
}

export const PROTOCOLS: Protocol[] = [
  { id: "PD001", name: "Phác đồ điều trị Tăng huyết áp vừa và nặng (người lớn)", icd: "I10", specialty: "Nội khoa", status: "active", updatedAt: "10/05/2026", tags: ["Tim mạch", "Huyết áp", "Người lớn"] },
  { id: "PD002", name: "Phác đồ điều trị Đái tháo đường type 2 — kiểm soát đường huyết ban đầu", icd: "E11.9", specialty: "Nội khoa", status: "new", updatedAt: "12/05/2026", tags: ["Nội tiết", "Đái tháo đường", "Metformin"] },
  { id: "PD003", name: "Phác đồ điều trị Hen phế quản ở người lớn", icd: "J45.9", specialty: "Hô hấp", status: "active", updatedAt: "03/05/2026", tags: ["Hô hấp", "Hen phế quản", "Corticosteroid hít"] },
  { id: "PD004", name: "Phác đồ điều trị Viêm phế quản cấp ở trẻ em", icd: "J20.9", specialty: "Nhi khoa", status: "active", updatedAt: "28/04/2026", tags: ["Nhi khoa", "Hô hấp", "Trẻ em"] },
  { id: "PD005", name: "Phác đồ điều trị Viêm dạ dày ruột cấp (lỏm) ở trẻ em", icd: "A09.0", specialty: "Nhi khoa", status: "active", updatedAt: "15/04/2026", tags: ["Nhi khoa", "Tiêu hóa", "Trẻ em"] },
  { id: "PD006", name: "Phác đồ điều trị Nhiễm khuẩn huyết (Sepsis) — sớm nhận diện và xử trí", icd: "A41.9", specialty: "Cấp cứu", status: "active", updatedAt: "20/04/2026", tags: ["Cấp cứu", "Sepsis", "Kháng sinh"] },
  { id: "PD007", name: "Phác đồ điều trị Viêm khớp dạng thấp", icd: "M05.9", specialty: "Ngoại khoa", status: "withdrawn", updatedAt: "01/05/2026", tags: ["Cơ xương khớp", "Tự miễn", "Methotrexate"] },
  { id: "PD008", name: "Phác đồ điều trị Động kinh ở người lớn", icd: "G40.9", specialty: "Thần kinh", status: "active", updatedAt: "05/05/2026", tags: ["Thần kinh", "Động kinh", "AED"] },
  { id: "PD009", name: "Phác đồ điều trị Zona thần kinh (Herpes zoster)", icd: "B02.9", specialty: "Da liễu", status: "active", updatedAt: "18/04/2026", tags: ["Da liễu", "Virus", "Zona"] },
  { id: "PD010", name: "Phác đồ điều trị Rối loạn tiền đình cấp và mạn tính", icd: "H81.9", specialty: "Thần kinh – Tai mũi họng", status: "new", updatedAt: "14/05/2026", tags: ["Thần kinh", "Chóng mặt", "BPPV"] },
];

export const PROTOCOL_STATUS_CONFIG: Record<Protocol["status"], { label: string; dot: string }> = {
  active: { label: "Đang áp dụng", dot: "bg-emerald-500" },
  new: { label: "Mới cập nhật", dot: "bg-blue-500" },
  withdrawn: { label: "Đã thu hồi", dot: "bg-red-500" },
};
