import type { Document } from "./types";

export interface CommandDocument {
  id: string;
  type: Document["type"];
  typeLabel: string;
  name: string;
  code: string;
  issuedDate: string;
  issuer: string;
  topics: string[];
  summary: string;
}

export const COMMAND_DOCUMENTS: CommandDocument[] = [
  // BHYT Documents
  { id: "BHYT01", type: "luat", typeLabel: "Luật", name: "Luật Bảo hiểm y tế", code: "25/2008/QH12", issuedDate: "14/11/2008", issuer: "Quốc hội Việt Nam", topics: ["BHYT", "bảo hiểm", "quyền lợi"], summary: "Luật quy định về BHYT, quyền và nghĩa vụ của người tham gia BHYT" },
  { id: "BHYT02", type: "nghi-dinh", typeLabel: "Nghị định", name: "Nghị định quy định chi tiết Luật BHYT", code: "146/2018/NĐ-CP", issuedDate: "17/10/2018", issuer: "Chính phủ", topics: ["BHYT", "chi tiết", "thực hiện"], summary: "Hướng dẫn chi tiết về thực hiện Luật BHYT" },
  { id: "BHYT03", type: "thong-tu", typeLabel: "Thông tư", name: "Thông tư quy định quỹ BHYT", code: "06/2011/TT-BYT", issuedDate: "25/01/2011", issuer: "Bộ Y tế", topics: ["BHYT", "quỹ", "tài chính"], summary: "Quy định về quỹ BHYT, mức đóng và phương thức đóng" },
  { id: "BHYT04", type: "cong-van", typeLabel: "Công văn", name: "Công văn về danh mục thuốc BHYT", code: "4210/BYT-BH", issuedDate: "15/06/2020", issuer: "Bộ Y tế", topics: ["BHYT", "thuốc", "danh mục"], summary: "Danh mục thuốc được Quỹ BHYT chi trả" },
  { id: "BHYT05", type: "cong-van", typeLabel: "Công văn", name: "Công văn về giá dịch vụ y tế BHYT", code: "890/BYT-BH", issuedDate: "20/03/2023", issuer: "Bộ Y tế", topics: ["BHYT", "giá", "dịch vụ"], summary: "Quy định giá dịch vụ khám chữa bệnh BHYT" },
  // Policy Documents
  { id: "QT01", type: "thong-tu", typeLabel: "Thông tư", name: "Quy trình khám chữa bệnh tại cơ sở y tế", code: "TT-BYT-2019/4237", issuedDate: "12/11/2019", issuer: "Bộ Y tế", topics: ["quy trình", "khám bệnh", "cơ sở y tế"], summary: "Hướng dẫn quy trình khám chữa bệnh tại cơ sở y tế công lập và tư nhân" },
  { id: "QT02", type: "thong-tu", typeLabel: "Thông tư", name: "Quy định hồ sơ bệnh án điện tử", code: "TT-BYT-2018/3189", issuedDate: "20/07/2018", issuer: "Bộ Y tế", topics: ["bệnh án", "điện tử", "hồ sơ"], summary: "Quy định về hồ sơ bệnh án điện tử và mã hóa thông tin y tế" },
  { id: "QT03", type: "nghi-dinh", typeLabel: "Nghị định", name: "Nghị định về xử phạt vi phạm hành chính trong y tế", code: "117/2020/NĐ-CP", issuedDate: "15/09/2020", issuer: "Chính phủ", topics: ["xử phạt", "vi phạm", "hành chính"], summary: "Quy định về xử phạt vi phạm hành chính trong lĩnh vực y tế" },
  { id: "QT04", type: "cong-van", typeLabel: "Hướng dẫn nội bộ", name: "Quy trình tiếp nhận và phân loại bệnh nhân (Triage)", code: "QT-NB-001/2024", issuedDate: "15/01/2024", issuer: "Phòng khám", topics: ["triage", "phân loại", "cấp cứu"], summary: "Quy trình tiếp nhận, phân loại bệnh nhân tại quầy tiếp tân" },
  { id: "QT05", type: "cong-van", typeLabel: "Hướng dẫn nội bộ", name: "Quy trình cấp phát thuốc tại quầy dược", code: "QT-NB-002/2024", issuedDate: "20/01/2024", issuer: "Phòng khám", topics: ["thuốc", "cấp phát", "dược"], summary: "Quy trình cấp phát thuốc cho bệnh nhân nội trú và ngoại trú" },
];
