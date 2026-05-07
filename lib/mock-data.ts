// Types
export interface KPIData {
  sanLuong: number | null
  doanhThu: number | null
  chiPhi: number | null
  hieuQua: number | null
  hasDoanhThuData: boolean
  hasHieuQuaFormula: boolean
}

export interface RegionData {
  id: string
  name: string
  sanLuong: number
  doanhThu: number | null
  chiPhi: number
  hieuQua: number | null
  trend: 'up' | 'down' | 'stable'
  hasDoanhThuData: boolean
}

export interface HubData {
  id: string
  name: string
  regionId: string
  regionName: string
  sanLuong: number
  doanhThu: number | null
  chiPhi: number
  hieuQua: number | null
  hasDoanhThuData: boolean
}

export interface CustomerData {
  id: string
  name: string
  regionId: string
  sanLuong: number
  doanhThu: number | null
  chiPhi: number
  hieuQua: number | null
  hasDoanhThuData: boolean
}

export interface TimeSeriesData {
  period: string
  sanLuong: number
  doanhThu: number | null
  chiPhi: number
  hieuQua: number | null
}

export interface OrderDetail {
  id: string
  maLenh: string
  ngay: string
  hub: string
  kho: string
  tuyen: string
  khachHang: string
  nhanSu: string
  container: string
  sanLuong: number
  doanhThu: number | null
  chiPhi: number
  trangThai: 'da_chot' | 'cho_duyet' | 'dang_xu_ly'
  csOps: string
}

export type FilterPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year'
export type ViewMode = 'overview' | 'detail'

// Vietnamese regions
export const regions: RegionData[] = [
  { id: 'HN', name: 'Hà Nội', sanLuong: 2450, doanhThu: 1225000000, chiPhi: 892000000, hieuQua: 333000000, trend: 'up', hasDoanhThuData: true },
  { id: 'HCM', name: 'TP. Hồ Chí Minh', sanLuong: 3820, doanhThu: 1910000000, chiPhi: 1456000000, hieuQua: 454000000, trend: 'up', hasDoanhThuData: true },
  { id: 'HP', name: 'Hải Phòng', sanLuong: 1890, doanhThu: 945000000, chiPhi: 756000000, hieuQua: 189000000, trend: 'stable', hasDoanhThuData: true },
  { id: 'DN', name: 'Đà Nẵng', sanLuong: 1250, doanhThu: null, chiPhi: 512000000, hieuQua: null, trend: 'down', hasDoanhThuData: false },
  { id: 'BD', name: 'Bình Dương', sanLuong: 2180, doanhThu: 1090000000, chiPhi: 834000000, hieuQua: 256000000, trend: 'up', hasDoanhThuData: true },
  { id: 'DN2', name: 'Đồng Nai', sanLuong: 1670, doanhThu: 835000000, chiPhi: 678000000, hieuQua: 157000000, trend: 'stable', hasDoanhThuData: true },
  { id: 'QN', name: 'Quảng Ninh', sanLuong: 980, doanhThu: null, chiPhi: 402000000, hieuQua: null, trend: 'down', hasDoanhThuData: false },
  { id: 'CT', name: 'Cần Thơ', sanLuong: 720, doanhThu: 360000000, chiPhi: 312000000, hieuQua: 48000000, trend: 'stable', hasDoanhThuData: true },
]

// Hubs
export const hubs: HubData[] = [
  { id: 'HN-01', name: 'Hub Nội Bài', regionId: 'HN', regionName: 'Hà Nội', sanLuong: 1280, doanhThu: 640000000, chiPhi: 468000000, hieuQua: 172000000, hasDoanhThuData: true },
  { id: 'HN-02', name: 'Hub Long Biên', regionId: 'HN', regionName: 'Hà Nội', sanLuong: 1170, doanhThu: 585000000, chiPhi: 424000000, hieuQua: 161000000, hasDoanhThuData: true },
  { id: 'HCM-01', name: 'Hub Cát Lái', regionId: 'HCM', regionName: 'TP. Hồ Chí Minh', sanLuong: 2150, doanhThu: 1075000000, chiPhi: 824000000, hieuQua: 251000000, hasDoanhThuData: true },
  { id: 'HCM-02', name: 'Hub Tân Cảng', regionId: 'HCM', regionName: 'TP. Hồ Chí Minh', sanLuong: 1670, doanhThu: 835000000, chiPhi: 632000000, hieuQua: 203000000, hasDoanhThuData: true },
  { id: 'HP-01', name: 'Hub Đình Vũ', regionId: 'HP', regionName: 'Hải Phòng', sanLuong: 1120, doanhThu: 560000000, chiPhi: 448000000, hieuQua: 112000000, hasDoanhThuData: true },
  { id: 'HP-02', name: 'Hub Lạch Huyện', regionId: 'HP', regionName: 'Hải Phòng', sanLuong: 770, doanhThu: 385000000, chiPhi: 308000000, hieuQua: 77000000, hasDoanhThuData: true },
  { id: 'DN-01', name: 'Hub Tiên Sa', regionId: 'DN', regionName: 'Đà Nẵng', sanLuong: 780, doanhThu: null, chiPhi: 312000000, hieuQua: null, hasDoanhThuData: false },
  { id: 'DN-02', name: 'Hub Liên Chiểu', regionId: 'DN', regionName: 'Đà Nẵng', sanLuong: 470, doanhThu: null, chiPhi: 200000000, hieuQua: null, hasDoanhThuData: false },
  { id: 'BD-01', name: 'Hub Sóng Thần', regionId: 'BD', regionName: 'Bình Dương', sanLuong: 1380, doanhThu: 690000000, chiPhi: 528000000, hieuQua: 162000000, hasDoanhThuData: true },
  { id: 'BD-02', name: 'Hub VSIP', regionId: 'BD', regionName: 'Bình Dương', sanLuong: 800, doanhThu: 400000000, chiPhi: 306000000, hieuQua: 94000000, hasDoanhThuData: true },
]

// Customers
export const customers: CustomerData[] = [
  { id: 'KH001', name: 'Công ty TNHH Samsung Electronics VN', regionId: 'HN', sanLuong: 820, doanhThu: 410000000, chiPhi: 298000000, hieuQua: 112000000, hasDoanhThuData: true },
  { id: 'KH002', name: 'Công ty CP Vinamilk', regionId: 'HCM', sanLuong: 650, doanhThu: 325000000, chiPhi: 248000000, hieuQua: 77000000, hasDoanhThuData: true },
  { id: 'KH003', name: 'Tập đoàn FPT', regionId: 'HN', sanLuong: 480, doanhThu: null, chiPhi: 184000000, hieuQua: null, hasDoanhThuData: false },
  { id: 'KH004', name: 'Công ty TNHH Intel Products VN', regionId: 'HCM', sanLuong: 920, doanhThu: 460000000, chiPhi: 356000000, hieuQua: 104000000, hasDoanhThuData: true },
  { id: 'KH005', name: 'Công ty CP Thaco', regionId: 'DN', sanLuong: 380, doanhThu: null, chiPhi: 156000000, hieuQua: null, hasDoanhThuData: false },
  { id: 'KH006', name: 'Công ty TNHH LG Display VN', regionId: 'HP', sanLuong: 710, doanhThu: 355000000, chiPhi: 276000000, hieuQua: 79000000, hasDoanhThuData: true },
  { id: 'KH007', name: 'Công ty CP Hòa Phát', regionId: 'HP', sanLuong: 560, doanhThu: 280000000, chiPhi: 218000000, hieuQua: 62000000, hasDoanhThuData: true },
  { id: 'KH008', name: 'Tổng Công ty Tân Cảng Sài Gòn', regionId: 'HCM', sanLuong: 1240, doanhThu: 620000000, chiPhi: 478000000, hieuQua: 142000000, hasDoanhThuData: true },
  { id: 'KH009', name: 'Công ty TNHH Jabil VN', regionId: 'BD', sanLuong: 590, doanhThu: 295000000, chiPhi: 228000000, hieuQua: 67000000, hasDoanhThuData: true },
  { id: 'KH010', name: 'Công ty CP Gemadept', regionId: 'HCM', sanLuong: 870, doanhThu: 435000000, chiPhi: 336000000, hieuQua: 99000000, hasDoanhThuData: true },
]

// Time series data for trends
export const monthlyTrend: TimeSeriesData[] = [
  { period: 'T01/2026', sanLuong: 12450, doanhThu: 6225000000, chiPhi: 4802000000, hieuQua: 1423000000 },
  { period: 'T02/2026', sanLuong: 11890, doanhThu: 5945000000, chiPhi: 4612000000, hieuQua: 1333000000 },
  { period: 'T03/2026', sanLuong: 13200, doanhThu: 6600000000, chiPhi: 5104000000, hieuQua: 1496000000 },
  { period: 'T04/2026', sanLuong: 14500, doanhThu: 7250000000, chiPhi: 5598000000, hieuQua: 1652000000 },
  { period: 'T05/2026', sanLuong: 14960, doanhThu: 7480000000, chiPhi: 5842000000, hieuQua: 1638000000 },
]

export const weeklyTrend: TimeSeriesData[] = [
  { period: 'Tuần 14', sanLuong: 3420, doanhThu: 1710000000, chiPhi: 1324000000, hieuQua: 386000000 },
  { period: 'Tuần 15', sanLuong: 3580, doanhThu: 1790000000, chiPhi: 1386000000, hieuQua: 404000000 },
  { period: 'Tuần 16', sanLuong: 3890, doanhThu: 1945000000, chiPhi: 1502000000, hieuQua: 443000000 },
  { period: 'Tuần 17', sanLuong: 4070, doanhThu: 2035000000, chiPhi: 1630000000, hieuQua: 405000000 },
]

// Order details for drill-down
export const orderDetails: OrderDetail[] = [
  { id: 'LD001', maLenh: 'KD-2026-04-0001', ngay: '28/04/2026', hub: 'Hub Cát Lái', kho: 'Kho A1', tuyen: 'Tuyến Cát Lái - Q9', khachHang: 'Samsung Electronics VN', nhanSu: 'Nguyễn Văn An', container: 'MSKU1234567', sanLuong: 2, doanhThu: 1200000, chiPhi: 850000, trangThai: 'da_chot', csOps: 'Trần Thị Bình' },
  { id: 'LD002', maLenh: 'KD-2026-04-0002', ngay: '28/04/2026', hub: 'Hub Cát Lái', kho: 'Kho A2', tuyen: 'Tuyến Cát Lái - Thủ Đức', khachHang: 'Intel Products VN', nhanSu: 'Lê Văn Cường', container: 'TCLU9876543', sanLuong: 3, doanhThu: 1800000, chiPhi: 1280000, trangThai: 'da_chot', csOps: 'Phạm Văn Dũng' },
  { id: 'LD003', maLenh: 'KD-2026-04-0003', ngay: '29/04/2026', hub: 'Hub Tân Cảng', kho: 'Kho B1', tuyen: 'Tuyến Tân Cảng - Q7', khachHang: 'Vinamilk', nhanSu: 'Hoàng Văn Em', container: 'OOLU5678901', sanLuong: 1, doanhThu: 600000, chiPhi: 420000, trangThai: 'cho_duyet', csOps: 'Ngô Thị Giang' },
  { id: 'LD004', maLenh: 'KD-2026-04-0004', ngay: '29/04/2026', hub: 'Hub Nội Bài', kho: 'Kho C1', tuyen: 'Tuyến Nội Bài - Đông Anh', khachHang: 'FPT', nhanSu: 'Đỗ Văn Hải', container: 'CMAU2345678', sanLuong: 2, doanhThu: null, chiPhi: 780000, trangThai: 'dang_xu_ly', csOps: 'Vũ Thị Hương' },
  { id: 'LD005', maLenh: 'KD-2026-04-0005', ngay: '30/04/2026', hub: 'Hub Đình Vũ', kho: 'Kho D1', tuyen: 'Tuyến Đình Vũ - Hải An', khachHang: 'LG Display VN', nhanSu: 'Bùi Văn Khang', container: 'HLCU8901234', sanLuong: 4, doanhThu: 2400000, chiPhi: 1720000, trangThai: 'da_chot', csOps: 'Trương Văn Lâm' },
  { id: 'LD006', maLenh: 'KD-2026-04-0006', ngay: '30/04/2026', hub: 'Hub Sóng Thần', kho: 'Kho E1', tuyen: 'Tuyến Sóng Thần - Dĩ An', khachHang: 'Jabil VN', nhanSu: 'Phan Văn Minh', container: 'EISU3456789', sanLuong: 2, doanhThu: 1200000, chiPhi: 860000, trangThai: 'da_chot', csOps: 'Lý Thị Ngọc' },
  { id: 'LD007', maLenh: 'KD-2026-04-0007', ngay: '01/05/2026', hub: 'Hub Tiên Sa', kho: 'Kho F1', tuyen: 'Tuyến Tiên Sa - Liên Chiểu', khachHang: 'Thaco', nhanSu: 'Trần Văn Phú', container: 'MAEU6789012', sanLuong: 3, doanhThu: null, chiPhi: 1050000, trangThai: 'dang_xu_ly', csOps: 'Đinh Văn Quang' },
  { id: 'LD008', maLenh: 'KD-2026-04-0008', ngay: '01/05/2026', hub: 'Hub Long Biên', kho: 'Kho G1', tuyen: 'Tuyến Long Biên - Gia Lâm', khachHang: 'Samsung Electronics VN', nhanSu: 'Ngô Văn Sơn', container: 'YMLU7890123', sanLuong: 2, doanhThu: 1200000, chiPhi: 840000, trangThai: 'cho_duyet', csOps: 'Hà Thị Tâm' },
  { id: 'LD009', maLenh: 'KD-2026-04-0009', ngay: '02/05/2026', hub: 'Hub Cát Lái', kho: 'Kho A1', tuyen: 'Tuyến Cát Lái - Q2', khachHang: 'Tân Cảng Sài Gòn', nhanSu: 'Lê Văn Uy', container: 'COSCO1234567', sanLuong: 5, doanhThu: 3000000, chiPhi: 2150000, trangThai: 'da_chot', csOps: 'Trần Thị Bình' },
  { id: 'LD010', maLenh: 'KD-2026-04-0010', ngay: '02/05/2026', hub: 'Hub VSIP', kho: 'Kho H1', tuyen: 'Tuyến VSIP - Thuận An', khachHang: 'Jabil VN', nhanSu: 'Phạm Văn Vinh', container: 'OOCL8901234', sanLuong: 2, doanhThu: 1200000, chiPhi: 880000, trangThai: 'da_chot', csOps: 'Nguyễn Thị Xuân' },
]

// Helper functions
export function formatCurrency(value: number | null): string {
  if (value === null) return 'Chưa có dữ liệu'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
}

export function formatNumber(value: number | null): string {
  if (value === null) return 'Chưa có dữ liệu'
  return new Intl.NumberFormat('vi-VN').format(value)
}

export function getStatusLabel(status: OrderDetail['trangThai']): string {
  const labels: Record<OrderDetail['trangThai'], string> = {
    da_chot: 'Đã chốt',
    cho_duyet: 'Chờ duyệt',
    dang_xu_ly: 'Đang xử lý',
  }
  return labels[status]
}

export function getStatusVariant(status: OrderDetail['trangThai']): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<OrderDetail['trangThai'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    da_chot: 'default',
    cho_duyet: 'secondary',
    dang_xu_ly: 'outline',
  }
  return variants[status]
}

// Calculate total KPIs
export function calculateTotalKPI(): KPIData {
  const totalSanLuong = regions.reduce((sum, r) => sum + r.sanLuong, 0)
  const regionsWithRevenue = regions.filter(r => r.hasDoanhThuData)
  const totalDoanhThu = regionsWithRevenue.reduce((sum, r) => sum + (r.doanhThu || 0), 0)
  const totalChiPhi = regions.reduce((sum, r) => sum + r.chiPhi, 0)
  
  const hasAllDoanhThu = regions.every(r => r.hasDoanhThuData)
  const hieuQua = hasAllDoanhThu ? totalDoanhThu - totalChiPhi : null
  
  return {
    sanLuong: totalSanLuong,
    doanhThu: hasAllDoanhThu ? totalDoanhThu : null,
    chiPhi: totalChiPhi,
    hieuQua,
    hasDoanhThuData: hasAllDoanhThu,
    hasHieuQuaFormula: true,
  }
}
