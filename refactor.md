# CONTEXT
Bạn là expert UI/UX developer và React TypeScript developer.

Tôi đã có sẵn một prototype UI được generate từ FSD ban đầu cho chức năng:
"STT 70 - Quan sát sản lượng, doanh thu, hiệu quả".

Tuy nhiên, tại thời điểm generate UI cũ, chưa có file Excel thực tế và chưa có lưu ý mới từ khách hàng.

Bây giờ tôi đã có thêm:
1. File Excel báo cáo thực tế, gồm các sheet:
   - Báo cáo tuần
   - Báo cáo tháng
   - SL
   - CP

2. Lưu ý mới từ khách hàng:
   - Không phân tích theo tiêu chí Khách hàng
   - Không phân tích theo tiêu chí Hub
   - Chỉ làm ở sheet "Báo cáo tuần" và "Báo cáo tháng"
   - Kết quả cần thể hiện theo 2 nhóm đầu ra:
     - "SL" = Sản lượng
     - "CP" = Chi phí

# TASK
Hãy refactor lại UI hiện tại theo đúng nghiệp vụ mới.

Giữ lại những phần UI có thể tái sử dụng như:
- Layout tổng thể
- Sidebar
- Header
- Card component
- Table component
- Filter component
- Modal/Drawer detail nếu có
- Style tổng thể

Nhưng cần loại bỏ hoặc chỉnh sửa các phần không còn phù hợp với yêu cầu mới.

# IMPORTANT BUSINESS OVERRIDE
Yêu cầu mới của khách hàng được ưu tiên hơn FSD ban đầu.

Mặc dù FSD ban đầu có nhắc đến phân tích theo:
- Khách hàng
- Hub
- Doanh thu
- Hiệu quả

Nhưng prototype refactor lần này cần áp dụng các nguyên tắc sau:

## Không được hiển thị
- Không có filter Khách hàng
- Không có filter Hub
- Không có bảng xếp hạng Khách hàng
- Không có bảng xếp hạng Hub
- Không có drill-down theo Khách hàng
- Không có drill-down theo Hub
- Không có chart/phân tích theo Khách hàng hoặc Hub

## Cần hiển thị
- Dữ liệu theo kỳ Tuần hoặc Tháng
- Dữ liệu theo Chi nhánh
- Nhóm Sản lượng - SL
- Nhóm Chi phí - CP
- Trạng thái dữ liệu
- Các summary card đơn giản
- Bảng dữ liệu chi tiết
- Modal/Drawer xem chi tiết từng dòng

# TARGET SCREEN
Refactor UI thành một màn hình chính:

## Tên màn hình
"Báo cáo sản lượng & chi phí kiểm đếm"

## Breadcrumb
Kiểm đếm > Báo cáo > Sản lượng & Chi phí

## Notice trên đầu màn hình
Hiển thị một alert/notice rõ ràng:

"Không phân tích theo Khách hàng và Hub theo yêu cầu khách hàng. Dữ liệu được tổng hợp từ Báo cáo tuần / Báo cáo tháng và thể hiện theo SL / CP."

# NAVIGATION
Sidebar chỉ cần có mục:

Kiểm đếm
  - Báo cáo
    - Sản lượng & Chi phí

Nếu UI cũ đang có nhiều menu liên quan đến Khách hàng, Hub hoặc Hiệu quả chi tiết thì hãy loại bỏ hoặc ẩn khỏi prototype.

# FILTER SECTION
Refactor bộ lọc thành các trường sau:

1. Loại kỳ
   - Tuần
   - Tháng

2. Năm
   - 2025
   - 2026

3. Tuần
   - Chỉ hiển thị khi Loại kỳ = Tuần
   - Ví dụ: Tuần 01/26, Tuần 02/26, ..., Tuần 15/26

4. Tháng
   - Chỉ hiển thị khi Loại kỳ = Tháng
   - Ví dụ: 01/26, 02/26, 03/26, 04/26

5. Chi nhánh
   - Tất cả
   - HCM
   - HPH
   - CLO
   - DAN
   - GLS

6. Trạng thái
   - Tất cả
   - Đạt kế hoạch
   - Gần đạt
   - Chưa đạt
   - Trong định mức
   - Vượt định mức
   - Cần kiểm tra
   - Dữ liệu bất thường

7. Từ khóa
   - Tìm theo kỳ báo cáo hoặc chi nhánh

## Không được có trong filter
- Khách hàng
- Hub

# MAIN TABS
Refactor màn hình thành 3 tab:

1. Tổng quan
2. Sản lượng - SL
3. Chi phí - CP

Không cần chart.

# TAB 1: TỔNG QUAN

## Summary Cards
Hiển thị các card sau:

1. Tổng SL cont KH
   - Tổng sản lượng container kế hoạch

2. Tổng SL cont TH
   - Tổng sản lượng container thực hiện

3. Tỷ lệ TH/KH
   - Tổng SL cont TH / Tổng SL cont KH

4. Tổng cont GLS
   - Tổng SL cont GLS

5. Tổng chi phí
   - Tổng chi phí từ nhóm CP

6. CP TB/Cont
   - Tổng chi phí / Tổng container thực hiện

7. Doanh thu
   - Hiển thị: "Chưa có dữ liệu"
   - Không tự tính doanh thu

8. Hiệu quả
   - Hiển thị: "Chưa cấu hình"
   - Không tự tính hiệu quả

## Business note
Hiển thị note nhỏ:

"Doanh thu và hiệu quả chưa được tính do chưa có nguồn doanh thu chính thức hoặc công thức AMR phê duyệt."

# TAB 2: SẢN LƯỢNG - SL

Tab này thể hiện dữ liệu đầu ra tương ứng sheet "SL".

## Summary Cards cho SL
Hiển thị các card:

1. Tổng cont kế hoạch
2. Tổng cont thực hiện
3. Tỷ lệ hoàn thành
4. Cont GLS
5. Tỷ lệ GLS/SL
6. Cont Lái xe
7. Cont Vendor
8. Năng suất BQ/người

## Bảng dữ liệu SL
Các cột bắt buộc:

- Tuần/Tháng
- Chi nhánh
- NS Giao nhận
- SL cont KH
- SL cont TH
- So sánh TH/KH
- SL cont GLS
- Tỷ lệ GLS/SL
- NS BQ/Người
- SL cont Lái xe
- Tỷ lệ LX/SL
- SL cont Vendor
- Tỷ lệ Vendor/SL
- Trạng thái
- Thao tác

## Action buttons
- Tìm kiếm
- Làm mới
- Xuất Excel
- Xem chi tiết

## Trạng thái SL
Áp dụng rule:

- Nếu TH/KH >= 100%:
  - Trạng thái: "Đạt kế hoạch"
  - Color: success

- Nếu TH/KH >= 90% và < 100%:
  - Trạng thái: "Gần đạt"
  - Color: warning

- Nếu TH/KH < 90%:
  - Trạng thái: "Chưa đạt"
  - Color: danger

- Nếu thiếu dữ liệu SL cont KH hoặc SL cont TH:
  - Trạng thái: "Cần kiểm tra"
  - Color: warning

# TAB 3: CHI PHÍ - CP

Tab này thể hiện dữ liệu đầu ra tương ứng sheet "CP".

## Summary Cards cho CP
Hiển thị các card:

1. Tổng CP GLS
2. Tổng CP Lái xe
3. Tổng CP Vendor
4. Tổng chi phí
5. CP TB/Cont
6. Target CP/Cont

Giá trị target mặc định:
150.000đ / cont

## Bảng dữ liệu CP
Các cột bắt buộc:

- Tuần/Tháng
- Chi nhánh
- Nhân công
- CP GN GLS/cont
- Tổng CP GN GLS
- Cont GLS KĐ
- Tổng CP Lái xe KĐ
- Cont lái xe KĐ
- Tổng CP Vendor
- Cont Vendor KĐ
- Tổng chi phí
- CP TB/Cont
- Trạng thái
- Thao tác

## Action buttons
- Tìm kiếm
- Làm mới
- Xuất Excel
- Xem chi tiết

## Trạng thái CP
Áp dụng rule:

- Nếu CP TB/Cont <= Target CP/Cont:
  - Trạng thái: "Trong định mức"
  - Color: success

- Nếu CP TB/Cont > Target CP/Cont:
  - Trạng thái: "Vượt định mức"
  - Color: danger

- Nếu Tổng chi phí = 0 nhưng có sản lượng:
  - Trạng thái: "Cần kiểm tra"
  - Color: warning

- Nếu Tổng chi phí < 0 hoặc CP TB/Cont < 0:
  - Trạng thái: "Dữ liệu bất thường"
  - Color: danger

- Nếu thiếu số lượng cont nhưng có chi phí:
  - Trạng thái: "Thiếu dữ liệu"
  - Color: warning

# DETAIL MODAL / DRAWER

Khi người dùng click "Xem chi tiết" ở bảng SL, mở modal/drawer:

## Chi tiết sản lượng
Hiển thị:

### Thông tin kỳ báo cáo
- Kỳ
- Năm
- Chi nhánh

### Kế hoạch
- SL kho KH
- SL cont KH

### Thực hiện
- SL kho TH
- SL cont TH
- So sánh TH/KH

### Cơ cấu thực hiện
- SL cont GLS
- Tỷ lệ GLS/SL
- SL cont Lái xe
- Tỷ lệ LX/SL
- SL cont Vendor
- Tỷ lệ Vendor/SL

### Nhân sự
- NS giao nhận
- Năng suất BQ/người

Khi người dùng click "Xem chi tiết" ở bảng CP, mở modal/drawer:

## Chi tiết chi phí
Hiển thị:

### Thông tin kỳ báo cáo
- Kỳ
- Tháng
- Ngày
- Chi nhánh
- Nhân công

### Chi phí GLS
- CP GN GLS/cont
- Tổng CP GN GLS
- Số lượng cont GN GLS KĐ

### Chi phí Lái xe
- Tổng CP Lái xe KĐ
- Số lượng cont lái xe KĐ

### Chi phí Vendor
- Tổng CP Vendor
- Số lượng cont Vendor KĐ

### Tổng hợp
- Tổng chi phí
- CP TB/Cont
- Target CP/Cont
- Trạng thái so với target

# MOCK DATA REQUIREMENT
Refactor hoặc thay mock data cũ bằng mock data mới đúng nghiệp vụ Excel.

Tạo tối thiểu:

## SL records
Ít nhất 10 dòng, gồm các chi nhánh:
- HCM
- HPH
- CLO
- DAN
- GLS

Dữ liệu phải có đủ trạng thái:
- Đạt kế hoạch
- Gần đạt
- Chưa đạt
- Cần kiểm tra

Các trường dữ liệu SL cần có:
- periodType
- year
- week
- month
- branch
- nsGiaoNhan
- slKhoKH
- slContKH
- slKhoTH
- slContTH
- slKhoGLS
- slContGLS
- slKhoLX
- slContLX
- slKhoVendor
- slContVendor

## CP records
Ít nhất 10 dòng, gồm các chi nhánh:
- HCM
- HPH
- CLO
- DAN
- GLS

Dữ liệu phải có đủ trạng thái:
- Trong định mức
- Vượt định mức
- Cần kiểm tra
- Dữ liệu bất thường
- Thiếu dữ liệu

Các trường dữ liệu CP cần có:
- periodType
- year
- week
- month
- date
- branch
- nhanCong
- cpGNGLSPerCont
- tongCPGNGLS
- contGNGLSKD
- tongCPLaiXeKD
- contLaiXeKD
- tongCPVendor
- contVendorKD
- tongChiPhi
- cpTBPerCont

# HEROUI VERSION 3 REQUIREMENT
Bắt buộc dùng HeroUI Version 3 làm UI library chính.

Sử dụng HeroUI v3 components khi phù hợp:
- Button
- Card
- CardBody / CardHeader
- Chip
- Input
- Select
- SelectItem
- Table
- TableHeader
- TableColumn
- TableBody
- TableRow
- TableCell
- Tabs
- Tab
- Modal
- ModalContent
- ModalHeader
- ModalBody
- ModalFooter
- Skeleton
- Divider
- Tooltip nếu cần

Status badge bắt buộc dùng HeroUI `Chip`.

Map màu trạng thái:
- success:
  - Đạt kế hoạch
  - Trong định mức
  - Có dữ liệu

- warning:
  - Gần đạt
  - Cần kiểm tra
  - Thiếu dữ liệu
  - Chưa cấu hình
  - Chưa có dữ liệu

- danger:
  - Chưa đạt
  - Vượt định mức
  - Dữ liệu bất thường

- primary:
  - Trạng thái trung tính
  - Thông tin kỳ báo cáo

Không thay thế HeroUI component bằng div custom nếu HeroUI đã có component tương ứng.
Tailwind chỉ dùng cho layout, spacing, responsive, sizing và minor styling.

# UX REQUIREMENTS
- Giao diện web, chuyên nghiệp, phù hợp dashboard quản lý kiểm đếm/logistics.
- Không cần biểu đồ/chart.
- Ưu tiên card summary + table + modal chi tiết.
- Có empty state khi filter không có dữ liệu.
- Có loading skeleton cho table.
- Có nút Export Excel nhưng chỉ cần mô phỏng hành vi, không cần xuất file thật.
- Có thông báo khi click Export: "Đã mô phỏng xuất dữ liệu theo bộ lọc hiện tại."
- Có responsive layout cho desktop web.

# VALIDATION / DATA RULES
- Không tự tính doanh thu.
- Không tự tính hiệu quả.
- Nếu thiếu nguồn doanh thu, hiển thị "Chưa có dữ liệu doanh thu".
- Nếu thiếu công thức hiệu quả, hiển thị "Chưa cấu hình công thức".
- Không hard-code công thức hiệu quả như Doanh thu - Chi phí hoặc Doanh thu / Chi phí.
- Chi phí âm phải được đánh dấu là dữ liệu bất thường.
- Dữ liệu chi phí bằng 0 nhưng có sản lượng phải được đánh dấu cần kiểm tra.

# REFACTOR INSTRUCTIONS
Khi refactor code hiện tại:

1. Giữ layout tổng thể nếu hợp lý.
2. Loại bỏ mọi logic/filter/table/card liên quan Khách hàng và Hub.
3. Loại bỏ hoặc vô hiệu hóa các chart không cần thiết.
4. Thay các KPI cũ bằng KPI mới theo SL và CP.
5. Thay mock data cũ bằng mock data mới theo cấu trúc Excel.
6. Tách logic tính summary ra helper function nếu cần.
7. Tách logic tính trạng thái SL và CP ra helper function.
8. Đảm bảo default screen khi load là:
   "Báo cáo sản lượng & chi phí kiểm đếm"
9. Đảm bảo tab mặc định là:
   "Tổng quan"
10. Đảm bảo code TypeScript không lỗi type.

# EXPECTED OUTPUT
Refactor lại UI hiện tại và trả về code hoàn chỉnh.

Nếu có thể, giữ trong một file React TypeScript duy nhất.
Nếu cần tách component, hãy tách rõ:
- Layout
- FilterPanel
- SummaryCard
- OverviewTab
- SLTab
- CPTab
- DetailModal
- Helper functions
- Mock data

Return code only.