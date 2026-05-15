import type { Category, Document } from "./types";

export const POLICY_CATEGORIES: Category[] = [
  { id: "all", label: "Tất cả" },
  { id: "khám-bệnh", label: "Khám bệnh" },
  { id: "cấp-thuốc", label: "Cấp thuốc" },
  { id: "xét-nghiệm", label: "Xét nghiệm" },
  { id: "chẩn-đoán", label: "Chẩn đoán hình ảnh" },
  { id: "nội-trú", label: "Nội trú" },
  { id: "vệ-sinh", label: "Vệ sinh an toàn" },
  { id: "hành-chính", label: "Hành chính y tế" },
];

export const POLICY_DOCUMENTS: Document[] = [
  {
    id: "QT-KB-001",
    type: "huong-dan-noi-bo",
    typeLabel: "Hướng dẫn nội bộ",
    name: "Quy trình tiếp nhận và khám bệnh ngoại trú",
    code: "QD/PK-QT-2025/001",
    issuedDate: "05/01/2025",
    effectiveDate: "10/01/2025",
    expiryDate: "31/12/2026",
    issuer: "Phòng khám",
    status: "moi",
    topics: ["Khám bệnh", "Quy trình nội bộ", "Cập nhật 2025"],
    summary: "Quy trình 8 bước tiếp nhận, khám bệnh và hoàn tất hồ sơ cho bệnh nhân ngoại trú tại phòng khám.",
    content: `Bước 1: Tiếp nhận bệnh nhân tại quầy
- Kiểm tra thẻ BHYT / CCCD
- Cập nhật thông tin trên phần mềm KCB
- Hướng dẫn phòng khám

Bước 2: Đo sinh hiệu
- Cân nặng, chiều cao, BMI
- Huyết áp, mạch, nhiệt độ
- SpO2 (nếu có chỉ định)

Bước 3: Chờ khám theo thứ tự
- Sắp xếp thứ tự ưu tiên: cấp cứu, người già, phụ nữ mang thai, trẻ em

Bước 4: Khám lâm sàng
- Bác sĩ khám theo quy trình chuyên môn
- Ghi chép đầy đủ vào hồ sơ bệnh án

Bước 5: Chỉ định cận lâm sàng
- Kê đơn, chỉ định xét nghiệm, CHIA nếu có

Bước 6: Thực hiện dịch vụ
- Xét nghiệm, CHIA, thủ thuật

Bước 7: Bác sĩ kết luận và tư vấn
- Chẩn đoán, phác đồ điều trị
- Tư vấn cho bệnh nhân

Bước 8: Thanh toán và nhận thuốc
- Quầy thu ngân: xuất hóa đơn, biên lai
- Nhận thuốc tại quầy dược`,
    citations: [],
  },
  {
    id: "QT-CT-001",
    type: "huong-dan-noi-bo",
    typeLabel: "Hướng dẫn nội bộ",
    name: "Quy trình kê đơn thuốc và cấp phát thuốc",
    code: "QD/PK-QT-2025/002",
    issuedDate: "10/01/2025",
    effectiveDate: "15/01/2025",
    expiryDate: "31/12/2026",
    issuer: "Phòng khám",
    status: "moi",
    topics: ["Cấp thuốc", "Quy trình nội bộ", "Cập nhật 2025"],
    summary: "Quy trình kê đơn, kiểm tra đơn thuốc, cấp phát và tư vấn sử dụng thuốc cho bệnh nhân.",
    content: `1. Kê đơn thuốc: Bác sĩ kê đơn điện tử trên phần mềm KCB theo danh mục BHYT, ghi rõ hoạt chất, liều dùng, đường dùng, thời gian.
2. Kiểm tra đơn: Dược sĩ kiểm tra tương tác thuốc, liều lượng, chống chỉ định.
3. Cấp phát: Dược sĩ cấp thuốc, đối chiếu đơn với thuốc xuất.
4. Tư vấn: Giải thích cách dùng, thời gian dùng, tác dụng phụ cần theo dõi.
5. Ghi nhận: Cập nhật số lượng thuốc xuất vào phần mềm quản lý tồn kho.`,
    citations: ["TT-14-2024"],
  },
  {
    id: "QT-XN-001",
    type: "huong-dan-noi-bo",
    typeLabel: "Hướng dẫn nội bộ",
    name: "Quy trình lấy mẫu và xử lý xét nghiệm",
    code: "QD/PK-QT-2025/003",
    issuedDate: "15/01/2025",
    effectiveDate: "20/01/2025",
    expiryDate: "31/12/2026",
    issuer: "Phòng khám",
    status: "con-hieu-luc",
    topics: ["Xét nghiệm", "Quy trình nội bộ", "Cập nhật 2025"],
    summary: "Quy trình chuẩn lấy mẫu, bảo quản, vận chuyển và trả kết quả xét nghiệm.",
    content: `1. Chuẩn bị: Kiểm tra chỉ định, chuẩn bị dụng cụ, thông báo cho bệnh nhân (nhịn ăn nếu cần).
2. Lấy mẫu: Thực hiện đúng kỹ thuật, ghi nhãn ngay sau khi lấy.
3. Bảo quản: Máu toàn phần 2-8°C, một số xét nghiệm đông huyết tương ngay.
4. Vận chuyển: Gửi mẫu đến lab trong 2 giờ, bảo quản đúng nhiệt độ.
5. Trả kết quả: Đối chiếu, rà soát, in kết quả và bàn giao cho bác sĩ chỉ định.`,
    citations: [],
  },
  {
    id: "QT-CDHA-001",
    type: "huong-dan-noi-bo",
    typeLabel: "Hướng dẫn nội bộ",
    name: "Quy trình chẩn đoán hình ảnh — Siêu âm và X-quang",
    code: "QD/PK-QT-2025/004",
    issuedDate: "20/01/2025",
    effectiveDate: "25/01/2025",
    expiryDate: "31/12/2026",
    issuer: "Phòng khám",
    status: "con-hieu-luc",
    topics: ["Chẩn đoán", "Quy trình nội bộ", "Cập nhật 2025"],
    summary: "Quy trình thực hiện siêu âm, X-quang tại phòng khám và gửi kết quả CHIA cho bệnh nhân.",
    content: `Siêu âm:
1. Bác sĩ CHIA nhận chỉ định, kiểm tra máy và gel siêu âm.
2. Hướng dẫn tư thế bệnh nhân phù hợp.
3. Thực hiện siêu âm theo protocol chuẩn.
4. Đọc kết quả, mô tả hình ảnh, kết luận.
5. Lưu hình ảnh vào hệ thống PACS.

X-quang:
1. Kỹ thuật viên chuẩn bị máy X-quang.
2. Hướng dẫn bệnh nhân tư thế, bảo vệ tia X (ápron, che gonadal).
3. Chụp theo đúng projection quy định.
4. Đọc phim, viết kết luận.
5. Lưu trữ phim kỹ thuật số.`,
    citations: [],
  },
  {
    id: "TT-BYTTCB-2019",
    type: "thong-tu",
    typeLabel: "Thông tư",
    name: "Thông tư quy định về kiểm soát nhiễm khuẩn trong cơ sở khám bệnh, chữa bệnh",
    code: "TT 16/2019/TT-BYT",
    issuedDate: "10/07/2019",
    effectiveDate: "01/01/2020",
    expiryDate: "31/12/2026",
    issuer: "Bộ Y tế",
    status: "con-hieu-luc",
    topics: ["Vệ sinh", "Kiểm soát nhiễm khuẩn", "Cập nhật 2025"],
    summary: "Quy định các biện pháp kiểm soát nhiễm khuẩn, rửa tay, khử khuẩn, xử lý chất thải trong cơ sở KCB.",
    content: `Điều 5. Rửa tay ngoại khoa: 6 bước theo WHO, sử dụng nước sạch và xà phòng hoặc dung dịch cồn.
Điều 8. Khử khuẩn dụng cụ: Ngâm trong dung dịch khử khuẩn đúng nồng độ, thời gian theo hướng dẫn nhà sản xuất.
Điều 12. Xử lý chất thải y tế: Phân loại ngay tại nơi phát sinh, rác thải lây nhiễm cho vào thùng vàng, rác thải thông thường cho vào thùng đen.`,
    citations: [],
  },
  {
    id: "TT-KCB-2015",
    type: "thong-tu",
    typeLabel: "Thông tư",
    name: "Thông tư quy định chuyên môn kỹ thuật trong khám bệnh, chữa bệnh",
    code: "TT 39/2015/TT-BYT",
    issuedDate: "16/11/2015",
    effectiveDate: "01/01/2016",
    expiryDate: "31/12/2026",
    issuer: "Bộ Y tế",
    status: "con-hieu-luc",
    topics: ["Khám bệnh", "Chuyên môn", "Cập nhật 2025"],
    summary: "Quy định điều kiện, nội dung và quy trình khám bệnh, chữa bệnh tại các cơ sở KCB.",
    content: `Điều 3. Điều kiện khám bệnh: Cơ sở KCB phải có đủ trang thiết bị, nhân lực theo quy định.
Điều 7. Quy trình khám bệnh: Hỏi bệnh → Khám lâm sàng → Chỉ định cận lâm sàng → Kết luận chẩn đoán → Phác đồ điều trị.
Điều 12. Hồ sơ bệnh án: Ghi nhận đầy đủ thông tin theo mẫu quy định, lưu trữ tối thiểu 10 năm.`,
    citations: [],
  },
  {
    id: "HD-HC-001",
    type: "huong-dan-noi-bo",
    typeLabel: "Hướng dẫn nội bộ",
    name: "Quy trình lưu trữ và quản lý hồ sơ bệnh án",
    code: "QD/PK-HD-2025/005",
    issuedDate: "25/01/2025",
    effectiveDate: "01/02/2025",
    expiryDate: "31/12/2026",
    issuer: "Phòng khám",
    status: "moi",
    topics: ["Hành chính", "Quản lý hồ sơ", "Cập nhật 2025"],
    summary: "Hướng dẫn lưu trữ hồ sơ bệnh án điện tử và giấy, thời hạn lưu trữ, quyền truy cập.",
    content: `1. Hồ sơ điện tử: Lưu trên server nội bộ, backup hàng ngày, mã hóa dữ liệu.
2. Hồ sơ giấy: Lưu trong tủ hồ sơ có khóa, sắp xếp theo mã bệnh nhân, theo thứ tự thời gian.
3. Thời hạn lưu trữ: Hồ sơ KCB tối thiểu 10 năm theo TT 39/2015.
4. Quyền truy cập: Chỉ bác sĩ điều trị, quản lý phòng khám và cơ quan chức năng được truy cập.
5. Tiêu hủy: Sau 10 năm, hồ sơ được tiêu hủy theo quy trình có biên bản.`,
    citations: ["TT-KCB-2015"],
  },
  {
    id: "QT-NT-001",
    type: "huong-dan-noi-bo",
    typeLabel: "Hướng dẫn nội bộ",
    name: "Quy trình tiếp nhận bệnh nhân nội trú",
    code: "QD/PK-QT-2025/006",
    issuedDate: "28/01/2025",
    effectiveDate: "01/02/2025",
    expiryDate: "31/12/2026",
    issuer: "Phòng khám",
    status: "con-hieu-luc",
    topics: ["Nội trú", "Quy trình nội bộ", "Cập nhật 2025"],
    summary: "Quy trình tiếp nhận, nhập viện và quản lý bệnh nhân nội trú tại phòng khám.",
    content: `1. Tiếp nhận yêu cầu nhập viện từ bác sĩ KCB ban đầu.
2. Kiểm tra giường trống, xác nhận đủ điều kiện nội trú.
3. Nhập thông tin bệnh nhân vào sổ nội trú.
4. Giao giường, nội y, vật dụng cho bệnh nhân.
5. Bác sĩ giao nhiệm vụ điều trị cho điều dưỡng trực.
6. Theo dõi và ghi nhận diễn biến bệnh nhân hàng ngày.
7. Chuẩn bị hồ sơ ra viện khi đủ điều kiện.`,
    citations: ["QT-KB-001"],
  },
];
