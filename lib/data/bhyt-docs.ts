import type { Category, Document } from "./types";

export const BHYT_CATEGORIES: Category[] = [
  { id: "all", label: "Tất cả" },
  { id: "luat-bhyt", label: "Luật BHYT" },
  { id: "thanh-toan", label: "Thanh toán BHYT" },
  { id: "gia-dv", label: "Giá dịch vụ" },
  { id: "danh-muc", label: "Danh mục BHYT" },
  { id: "tai-kham", label: "Tái khám & KCB ban đầu" },
  { id: "chi-tra", label: "Chi trả & Quyền lợi" },
  { id: "bien-lai", label: "Hóa đơn & Biên lai" },
];

export const BHYT_DOCUMENTS: Document[] = [
  {
    id: "L-BHYT-2014",
    type: "luat",
    typeLabel: "Luật",
    name: "Luật Bảo hiểm y tế sửa đổi, bổ sung",
    code: "Luật số 46/2014/QH13",
    issuedDate: "13/06/2014",
    effectiveDate: "01/01/2015",
    expiryDate: "31/12/2026",
    issuer: "Quốc hội Việt Nam",
    status: "con-hieu-luc",
    topics: ["Luật BHYT", "Cơ bản", "Cập nhật 2025"],
    summary: "Luật quy định về bảo hiểm y tế, bao gồm đối tượng tham gia, mức đóng, quyền lợi, tổ chức thực hiện và quản lý quỹ BHYT.",
    content: `Điều 2. Đối tượng tham gia bảo hiểm y tế
1. Nhóm do người lao động và người sử dụng lao động đóng.
2. Nhóm do tổ chức bảo hiểm xã hội đóng.
3. Nhóm do tổ chức, cá nhân khác đóng.
4. Nhóm do Nhà nước, ngân sách đóng, hỗ trợ đóng.

Điều 22. Mức đóng bảo hiểm y tế
1. Người tham gia BHYT theo nhóm 1, 2, 3 quy định tại Điều 2 của Luật này có mức đóng bằng 4,5% tiền lương, thu nhập, thu nhập...`,
    citations: ["NĐ 146/2018/NĐ-CP", "TT 09/2025/TT-BYT"],
  },
  {
    id: "ND-146-2018",
    type: "nghi-dinh",
    typeLabel: "Nghị định",
    name: "Nghị định quy định mức lương cơ sở đối với cán bộ, công chức, viên chức và lực lượng vũ trang",
    code: "NĐ 146/2018/NĐ-CP",
    issuedDate: "17/10/2018",
    effectiveDate: "01/07/2019",
    expiryDate: "31/12/2026",
    issuer: "Chính phủ",
    status: "con-hieu-luc",
    topics: ["Thanh toán BHYT", "Lương cơ sở", "Cập nhật 2025"],
    summary: "Quy định mức lương cơ sở, chế độ phụ cấp, hoạt động phí và chi phí quản lý để tính mức đóng BHYT.",
    content: `Nghị định này quy định mức lương cơ sở đối với cán bộ, công chức, viên chức và lực lượng vũ trang, mức chế độ phụ cấp, hoạt động phí và chi phí quản lý để làm căn cứ tính mức đóng, mức hưởng và quản lý quỹ BHYT.`,
    citations: ["Luật BHYT 2014", "TT 09/2025/TT-BYT"],
  },
  {
    id: "TT-09-2025",
    type: "thong-tu",
    typeLabel: "Thông tư",
    name: "Thông tư quy định danh mục và tỷ lệ thanh toán một số dịch vụ y tế mới",
    code: "TT 09/2025/TT-BYT",
    issuedDate: "15/03/2025",
    effectiveDate: "01/04/2025",
    expiryDate: "31/12/2026",
    issuer: "Bộ Y tế",
    status: "moi",
    topics: ["Thanh toán BHYT", "Danh mục", "Cập nhật 2025", "Tháng 4/2025"],
    summary: "Cập nhật danh mục và tỷ lệ thanh toán cho 1,247 dịch vụ y tế mới được đưa vào danh mục BHYT từ 01/04/2025.",
    content: `Thông tư này quy định danh mục và tỷ lệ thanh toán một số dịch vụ y tế thuộc phạm vi được hưởng của người tham gia bảo hiểm y tế.
Điều 3. Tỷ lệ thanh toán: 80% - 100% tùy theo đối tượng và cơ sở KCB.`,
    citations: ["L-BHYT-2014", "NĐ-146-2018"],
  },
  {
    id: "TT-14-2024",
    type: "thong-tu",
    typeLabel: "Thông tư",
    name: "Thông tư danh mục thuốc BHYT ban hành kèm theo",
    code: "TT 20/2024/TT-BYT",
    issuedDate: "30/08/2024",
    effectiveDate: "01/10/2024",
    expiryDate: "31/12/2026",
    issuer: "Bộ Y tế",
    status: "con-hieu-luc",
    topics: ["Danh mục BHYT", "Thuốc BHYT", "Cập nhật 2025"],
    summary: "Danh mục thuốc BHYT gồm 1,892 hoạt chất, 5,400+ biệt dược, được chia thành 6 nhóm A, B, C, D, E, G.",
    content: `Danh mục thuốc BHYT bao gồm 6 nhóm:
- Nhóm A: Thuốc generic, tỷ lệ thanh toán 100%
- Nhóm B: Thuốc generic thông thường, tỷ lệ thanh toán 100%
- Nhóm C: Thuốc generic khác, tỷ lệ thanh toán theo quy định
- Nhóm D: Thuốc biệt dược gốc, tỷ lệ thanh toán có giới hạn
- Nhóm E: Thuốc ưu tiên sử dụng tại tuyến y tế cơ sở
- Nhóm G: Thuốc điều trị ung thư, tăng huyết áp, đái tháo đường...`,
    citations: ["L-BHYT-2014"],
  },
  {
    id: "TT-39-2022",
    type: "thong-tu",
    typeLabel: "Thông tư",
    name: "Thông tư quy định về khám bệnh, chữa bệnh nhân trú; chuyển tuyến khám bệnh, chữa bệnh BHYT; thông tin liên quan đến việc khám bệnh, chữa bệnh",
    code: "TT 39/2022/TT-BYT",
    issuedDate: "30/12/2022",
    effectiveDate: "01/01/2023",
    expiryDate: "31/12/2026",
    issuer: "Bộ Y tế",
    status: "con-hieu-luc",
    topics: ["Tái khám", "KCB ban đầu", "Chuyển tuyến", "Cập nhật 2025"],
    summary: "Quy định chi tiết về khám bệnh, chữa bệnh nhân trú, chuyển tuyến, thông tin trong lĩnh vực BHYT.",
    content: `Điều 8. Đăng ký khám bệnh, chữa bệnh ban đầu
Người tham gia BHYT được đăng ký khám bệnh, chữa bệnh ban đầu tại một trong các cơ sở khám bệnh, chữa bệnh BHYT theo quy định.
Điều 15. Chuyển tuyến khám bệnh, chữa bệnh BHYT
Việc chuyển tuyến chỉ được thực hiện khi cơ sở KCB không đủ điều kiện về kỹ thuật, năng lực chuyên môn để điều trị.`,
    citations: ["L-BHYT-2014", "NĐ-146-2018"],
  },
  {
    id: "CV-3847-2024",
    type: "cong-van",
    typeLabel: "Công văn",
    name: "Công văn hướng dẫn thanh toán chi phí KCB theo yêu cầu năm 2024",
    code: "CV 3847/BTC-CST",
    issuedDate: "20/07/2024",
    effectiveDate: "01/08/2024",
    issuer: "Bộ Tài chính",
    status: "con-hieu-luc",
    topics: ["Thanh toán BHYT", "Chi phí KCB", "Cập nhật 2025"],
    summary: "Hướng dẫn thanh toán chi phí khám bệnh, chữa bệnh BHYT đối với các dịch vụ kỹ thuật theo yêu cầu.",
    content: `Công văn hướng dẫn thanh toán chi phí KCB BHYT trong trường hợp người bệnh có yêu cầu sử dụng dịch vụ kỹ thuật vượt tiêu chuẩn. Chênh lệch chi phí do người bệnh tự chi trả theo quy định.`,
    citations: ["TT-09-2025", "L-BHYT-2014"],
  },
  {
    id: "HD-PK-001",
    type: "huong-dan-noi-bo",
    typeLabel: "Hướng dẫn nội bộ",
    name: "Quy trình đăng ký KCB ban đầu và chuyển tuyến tại PK",
    code: "QD/PK-HD-2025/001",
    issuedDate: "10/01/2025",
    effectiveDate: "15/01/2025",
    expiryDate: "31/12/2026",
    issuer: "Phòng khám",
    status: "moi",
    topics: ["Triển khai tại PK", "Quy trình nội bộ", "Cập nhật 2025"],
    summary: "Hướng dẫn quy trình đăng ký KCB ban đầu, cập nhật thông tin thẻ BHYT và chuyển tuyến cho bệnh nhân.",
    content: `1. Đăng ký KCB ban đầu: Bệnh nhân mang thẻ BHYT đến quầy tiếp nhận → Nhân viên kiểm tra thông tin trên cổng GIAM SAT (website: baohiemxahoi.gov.vn) → Xác nhận đúng thông tin → Mời bệnh nhân vào khám.
2. Cập nhật thẻ: Dùng phần mềm KCB hoặc tra cứu tại baohiemxahoi.gov.vn.
3. Chuyển tuyến: Chỉ khi vượt quá năng lực chuyên môn, lãnh đạo ký duyệt, mã chuyển tuyến đúng quy định.`,
    citations: ["TT-39-2022"],
  },
  {
    id: "HD-PK-002",
    type: "huong-dan-noi-bo",
    typeLabel: "Hướng dẫn nội bộ",
    name: "Quy trình lập hồ sơ thanh toán BHYT hàng tháng",
    code: "QD/PK-HD-2025/002",
    issuedDate: "15/01/2025",
    effectiveDate: "20/01/2025",
    expiryDate: "31/12/2026",
    issuer: "Phòng khám",
    status: "moi",
    topics: ["Thanh toán BHYT", "Quy trình nội bộ", "Cập nhật 2025"],
    summary: "Quy trình lập hồ sơ, tổng hợp chi phí KCB BHYT hàng tháng gửi BHXH quận/huyện.",
    content: `Hồ sơ thanh toán BHYT hàng tháng bao gồm:
- Danh sách F0: chi tiết từng lần KCB
- Tổng hợp chi phí theo mã dịch vụ
- Chứng từ gốc (biên lai, hóa đơn)
- Bảng kê chi phí KCB theo mẫu quy định
Deadline: Gửi BHXH trước ngày 15 hàng tháng.`,
    citations: ["TT-09-2025", "TT-39-2022"],
  },
  {
    id: "HD-PK-003",
    type: "huong-dan-noi-bo",
    typeLabel: "Hướng dẫn nội bộ",
    name: "Hướng dẫn tra cứu và xử lý lỗi thẻ BHYT",
    code: "QD/PK-HD-2025/003",
    issuedDate: "20/01/2025",
    effectiveDate: "01/02/2025",
    expiryDate: "31/12/2026",
    issuer: "Phòng khám",
    status: "con-hieu-luc",
    topics: ["Quy trình nội bộ", "Tra cứu BHYT", "Cập nhật 2025"],
    summary: "Cách tra cứu thông tin thẻ BHYT trên cổng GIAM SAT, xử lý các lỗi thường gặp và liên hệ hỗ trợ.",
    content: `Tra cứu thẻ BHYT: Truy cập https://baohiemxahoi.gov.vn → Tra cứu thẻ BHYT → Nhập mã số BHXH hoặc số CMND.
Các lỗi thường gặp:
- Lỗi 01: Thẻ chưa đến hạn sử dụng → Tiếp tục KCB bình thường
- Lỗi 02: Thẻ hết hạn → Yêu cầu cấp lại hoặc gia hạn
- Lỗi 03: Thông tin sai → Liên hệ BHXH để cập nhật`,
    citations: ["L-BHYT-2014"],
  },
  {
    id: "DM-GIA-2025",
    type: "thong-tu",
    typeLabel: "Thông tư",
    name: "Thông tư quy định giá dịch vụ khám bệnh, chữa bệnh năm 2025",
    code: "TT 21/2024/TT-BYT",
    issuedDate: "01/11/2024",
    effectiveDate: "01/01/2025",
    expiryDate: "31/12/2026",
    issuer: "Bộ Y tế",
    status: "con-hieu-luc",
    topics: ["Giá dịch vụ", "Thanh toán BHYT", "Cập nhật 2025", "Tháng 1/2025"],
    summary: "Bảng giá dịch vụ khám bệnh, chữa bệnh mới áp dụng từ 01/01/2025, cập nhật giá cho 2,847 dịch vụ.",
    content: `Giá khám bệnh:
- Khám bệnh tại cơ sở y tế tuyến huyện: 30,000 đồng/lần
- Khám bệnh tại PK đa khoa: 50,000 đồng/lần (BHYT chi trả 80% = 40,000 đ)
Giá dịch vụ kỹ thuật: Theo danh mục kèm theo Thông tư, mức giá tối đa quy định tại Phụ lục ban hành kèm theo.`,
    citations: ["TT-09-2025", "L-BHYT-2014"],
  },
  {
    id: "DM-DUOC-2025",
    type: "thong-tu",
    typeLabel: "Thông tư",
    name: "Thông tư ban hành danh mục vật tư y tế BHYT năm 2025",
    code: "TT 04/2025/TT-BYT",
    issuedDate: "20/01/2025",
    effectiveDate: "01/02/2025",
    expiryDate: "31/12/2026",
    issuer: "Bộ Y tế",
    status: "moi",
    topics: ["Danh mục BHYT", "Vật tư y tế", "Cập nhật 2025"],
    summary: "Danh mục vật tư y tế BHYT gồm 1,234 mặt hàng, tỷ lệ thanh toán theo quy định tại Thông tư 04/2025.",
    content: `Danh mục vật tư y tế BHYT bao gồm:
- Vật tư tiêu hao (bông, băng, gạc, găng tay...)
- Vật tư phẫu thuật (bộ dụng cụ, vật liệu thay thế...)
- Vật tư chẩn đoán (bộ test nhanh, que thử...)
Tỷ lệ thanh toán: 80% - 100% tùy loại vật tư.`,
    citations: ["TT-14-2024", "L-BHYT-2014"],
  },
  {
    id: "CV-QLCL-2025",
    type: "cong-van",
    typeLabel: "Công văn",
    name: "Công văn về kiểm tra chất lượng giám định BHYT năm 2025",
    code: "CV 1856/BHXH-QLCL",
    issuedDate: "10/04/2025",
    effectiveDate: "01/05/2025",
    issuer: "BHXH Việt Nam",
    status: "moi",
    topics: ["Thanh toán BHYT", "Giám định", "Cập nhật 2025"],
    summary: "Hướng dẫn quy trình giám định, kiểm tra chất lượng chi trả BHYT và xử lý truy thu năm 2025.",
    content: `Năm 2025, BHXH tăng cường giám định chất lượng chi trả BHYT tại các cơ sở KCB. Các nội dung giám định chính:
- Tính hợp lệ của hồ sơ thanh toán
- Đúng quyền lợi, đúng tỷ lệ chi trả
- Đúng mã chẩn đoán ICD-10
- Đúng chỉ định dịch vụ kỹ thuật`,
    citations: ["TT-09-2025", "TT-39-2022"],
  },
];
