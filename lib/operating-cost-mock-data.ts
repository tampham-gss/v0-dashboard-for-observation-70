import { formatAppDateRange } from './date-format'
import { MOCK_DATA_ROW_COUNT, seededUnit } from './mock-seed'
import {
  MONTHS,
  WEEKS,
  YEARS,
  formatCurrency,
  formatNumber,
  formatPercent,
  type BranchCode,
} from './report-mock-data'

/** Kỳ báo cáo — tham chiếu BC tuần/tháng + BC ngày */
export type OpCostPeriodType = 'day' | 'week' | 'month'

export type OpCostRegionCode = BranchCode

export type OpCostLockStatus = 'tam_tinh' | 'da_khoa' | 'can_kiem_tra'

export type OpCostDataSource = 'BC ngày' | 'BC tuần' | 'BC tháng' | 'Điều động/chấm công'

/** Bản ghi chi phí vận hành theo lệnh/ngày (grain BC ngày + tổng hợp tuần/tháng) */
export interface OperatingCostRecord {
  id: string
  periodType: OpCostPeriodType
  year: number
  week?: string
  month?: string
  statDate: string
  region: OpCostRegionCode
  hub: string
  delivererName: string
  customer: string
  warehouse: string
  route: string
  opsCs: string
  slCont: number
  km: number
  luong: number
  tienAnTrua: number
  tienTangCa: number
  tienAnTangCa: number
  tienPhongTro22h: number
  tienXangVeXe: number
  /** CPPS theo chuyến — luôn trống */
  cppsChuyen: null
  /** Bồi dưỡng/phát sinh khác — null = chưa có nguồn */
  boiDuongPhatSinh: number | null
  tongChiPhi: number
  lockStatus: OpCostLockStatus
  dataSource: OpCostDataSource
  regionRuleNote: string
  dataError?: boolean
}

export interface OperatingCostFilters {
  periodType: OpCostPeriodType
  year: number
  week: string
  month: string
  dateFrom: string
  dateTo: string
  region: OpCostRegionCode | 'all'
  hub: string | 'all'
  customer: string | 'all'
  warehouse: string | 'all'
  route: string | 'all'
  deliverer: string | 'all'
  opsCs: string | 'all'
  lockStatus: OpCostLockStatus | 'all'
  keyword: string
  /** Ẩn cột tiền nếu không có quyền tài chính */
  canViewAmounts: boolean
  chartGroupBy: 'day' | 'week' | 'region'
}

export const OP_COST_REGIONS: { id: OpCostRegionCode; label: string; rule: string }[] = [
  { id: 'HCM', label: 'Hồ Chí Minh', rule: 'Chi phí theo số km thực tế' },
  { id: 'HPH', label: 'Hải Phòng', rule: 'Barem tiền xe khách theo tỉnh' },
  { id: 'CLO', label: 'Cửa Lò', rule: 'Đi nhờ xe container; ngoại lệ mới phát sinh phí' },
  { id: 'DAN', label: 'Đà Nẵng', rule: 'Khoán theo loại công hàng' },
  { id: 'GLS', label: 'GLS Hub', rule: 'Theo quy tắc Hub được cấu hình' },
]

const DELIVERERS = [
  'Nguyễn Văn A',
  'Trần Thị B',
  'Lê Minh C',
  'Phạm Thu D',
  'Hoàng Quốc E',
  'Võ Thanh F',
] as const

const CUSTOMERS = [
  'Vinamilk Logistics',
  'Saigon Port JSC',
  'Hai An Transport',
  'Green Line Depot',
  'Pacific Container',
] as const

const WAREHOUSES = ['Kho Bình Dương', 'Kho Đình Vũ', 'Kho Cửa Lò', 'Kho Tân Cảng', 'Kho Long Bình'] as const
const ROUTES = ['HCM–ĐN', 'HPH–HCM', 'CLO–HPH', 'Nội thành HCM', 'Liên vùng Bắc'] as const
const OPS_CS = ['CS Nguyễn', 'CS Trần', 'CS Lê', 'OPS Minh'] as const
const HUBS = ['Hub HCM', 'Hub HPH', 'Hub CLO', 'Hub ĐN'] as const

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length]!
}

function sumCostParts(r: Omit<OperatingCostRecord, 'tongChiPhi' | 'cppsChuyen'> & { cppsChuyen: null }): number {
  const extra = r.boiDuongPhatSinh ?? 0
  return (
    r.luong +
    r.tienAnTrua +
    r.tienTangCa +
    r.tienAnTangCa +
    r.tienPhongTro22h +
    r.tienXangVeXe +
    extra
  )
}

function weekMeta(week: string) {
  const yy = week.slice(-2)
  const year = 2000 + Number(yy)
  const weekNum = Number(week.match(/\d+/)?.[0] ?? 1)
  const monthNum = Math.min(12, Math.max(1, Math.ceil(weekNum / 4)))
  const month = `${String(monthNum).padStart(2, '0')}/${yy}`
  return { year, monthNum, month, yy }
}

function buildRecord(index: number): OperatingCostRecord {
  const u = (s: number) => seededUnit(index, s)
  const regions: OpCostRegionCode[] = ['HCM', 'HPH', 'CLO', 'DAN', 'GLS']
  const week = WEEKS[index % WEEKS.length]!
  const { year, monthNum, month, yy } = weekMeta(week)
  const day = (index % 28) + 1
  const statDate = `20${yy}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const region = pick(regions, index + Math.floor(u(1) * 5))
  const regionMeta = OP_COST_REGIONS.find((x) => x.id === region)!
  const slCont = Math.round(8 + u(2) * 35)
  const kmRaw =
    region === 'CLO' && u(3) < 0.35
      ? 0
      : Math.round(20 + u(4) * 120)
  const luong = Math.round(1_000_000 + u(5) * 900_000)
  const tienAnTrua = Math.round(45_000 + u(6) * 25_000)
  const tienTangCa = u(7) > 0.82 ? Math.round(120_000 + u(8) * 120_000) : 0
  const tienAnTangCa = tienTangCa > 0 ? Math.round(35_000 + u(9) * 20_000) : 0
  const tienPhongTro22h = u(10) > 0.9 ? Math.round(200_000 + u(11) * 150_000) : 0
  const tienXangVeXe =
    region === 'HPH'
      ? Math.round(250_000 + u(12) * 200_000)
      : region === 'CLO'
        ? kmRaw > 0
          ? Math.round(100_000 + u(13) * 100_000)
          : 0
        : Math.round(kmRaw * (3_800 + u(14) * 1_200))
  const boiDuongPhatSinh = u(15) > 0.75 ? Math.round(80_000 + u(16) * 200_000) : null
  const hasError = index % 401 === 0
  const lockRoll = u(17)
  const lockStatus: OpCostLockStatus =
    lockRoll > 0.88 ? 'da_khoa' : lockRoll > 0.78 ? 'can_kiem_tra' : 'tam_tinh'

  const base = {
    id: `OP-${index}`,
    periodType: 'day' as const,
    year,
    week,
    month,
    statDate,
    region,
    hub: pick(HUBS, index + region.charCodeAt(0)),
    delivererName: pick(DELIVERERS, index),
    customer: pick(CUSTOMERS, index + Math.floor(u(18) * 10)),
    warehouse: pick(WAREHOUSES, index + region.length),
    route: pick(ROUTES, index),
    opsCs: pick(OPS_CS, index % OPS_CS.length),
    slCont,
    km: hasError ? -10 : kmRaw,
    luong: hasError ? -1 : luong,
    tienAnTrua,
    tienTangCa,
    tienAnTangCa,
    tienPhongTro22h,
    tienXangVeXe,
    cppsChuyen: null as null,
    boiDuongPhatSinh,
    lockStatus,
    dataSource: 'BC ngày' as OpCostDataSource,
    regionRuleNote: regionMeta.rule,
    dataError: hasError,
  }

  return {
    ...base,
    tongChiPhi: hasError ? 0 : sumCostParts(base),
  }
}

function pinDefaultWeekSamples(rows: OperatingCostRecord[]) {
  const regions: OpCostRegionCode[] = ['HCM', 'HPH', 'CLO', 'DAN', 'GLS']
  regions.forEach((region, idx) => {
    if (idx >= rows.length) return
    const regionMeta = OP_COST_REGIONS.find((x) => x.id === region)!
    const day = 8 + idx
    const km = region === 'CLO' ? 0 : 55 + idx * 12
    const base = {
      ...rows[idx]!,
      week: 'Tuần 15/26',
      year: 2026,
      month: '04/26',
      statDate: `2026-04-${String(day).padStart(2, '0')}`,
      region,
      hub: pick(HUBS, idx),
      delivererName: pick(DELIVERERS, idx),
      customer: pick(CUSTOMERS, idx),
      slCont: 18 + idx * 4,
      km,
      luong: 1_350_000 + idx * 90_000,
      tienAnTrua: 55_000,
      tienTangCa: idx === 2 ? 200_000 : 0,
      tienAnTangCa: idx === 2 ? 45_000 : 0,
      tienPhongTro22h: idx === 4 ? 280_000 : 0,
      tienXangVeXe: region === 'HPH' ? 340_000 : km * 4_200,
      boiDuongPhatSinh: idx % 2 === 0 ? 150_000 : null,
      lockStatus: (idx === 0 ? 'da_khoa' : 'tam_tinh') as OpCostLockStatus,
      regionRuleNote: regionMeta.rule,
      dataError: false,
    }
    rows[idx] = { ...base, tongChiPhi: sumCostParts(base) }
  })
}

function buildRecords(count: number): OperatingCostRecord[] {
  const rows = Array.from({ length: count }, (_, i) => buildRecord(i))
  pinDefaultWeekSamples(rows)
  return rows
}

export const operatingCostRecords: OperatingCostRecord[] = buildRecords(MOCK_DATA_ROW_COUNT)

export const OP_COST_DELIVERERS = [...new Set(operatingCostRecords.map((r) => r.delivererName))].sort()
export const OP_COST_CUSTOMERS = [...new Set(operatingCostRecords.map((r) => r.customer))].sort()
export const OP_COST_WAREHOUSES = [...new Set(operatingCostRecords.map((r) => r.warehouse))].sort()
export const OP_COST_ROUTES = [...new Set(operatingCostRecords.map((r) => r.route))].sort()
export const OP_COST_OPS_CS = [...new Set(operatingCostRecords.map((r) => r.opsCs))].sort()
export const OP_COST_HUBS = [...new Set(operatingCostRecords.map((r) => r.hub))].sort()

export const DEFAULT_OPERATING_COST_FILTERS: OperatingCostFilters = {
  periodType: 'week',
  year: 2026,
  week: 'Tuần 15/26',
  month: '04/26',
  dateFrom: '2026-04-01',
  dateTo: '2026-04-30',
  region: 'all',
  hub: 'all',
  customer: 'all',
  warehouse: 'all',
  route: 'all',
  deliverer: 'all',
  opsCs: 'all',
  lockStatus: 'all',
  keyword: '',
  canViewAmounts: true,
  chartGroupBy: 'day',
}

export function opCostRegionLabel(code: OpCostRegionCode): string {
  return OP_COST_REGIONS.find((r) => r.id === code)?.label ?? code
}

export function opCostLockStatusLabel(s: OpCostLockStatus): string {
  if (s === 'da_khoa') return 'Đã khóa'
  if (s === 'can_kiem_tra') return 'Cần kiểm tra'
  return 'Tạm tính'
}

export function appliedOperatingCostCaption(filters: OperatingCostFilters): string {
  const region = filters.region === 'all' ? 'Tất cả khu vực' : opCostRegionLabel(filters.region)
  const period =
    filters.periodType === 'day'
      ? formatAppDateRange(filters.dateFrom, filters.dateTo)
      : filters.periodType === 'week'
        ? `${filters.week} · ${filters.year}`
        : `Tháng ${filters.month} · ${filters.year}`
  return `${period} · ${region}`
}

function inDateRange(date: string, from: string, to: string): boolean {
  return date >= from && date <= to
}

function matchesKeyword(row: OperatingCostRecord, keyword: string): boolean {
  const k = keyword.trim().toLowerCase()
  if (!k) return true
  const blob = [
    row.delivererName,
    row.customer,
    row.warehouse,
    row.route,
    row.hub,
    row.opsCs,
    row.id,
  ]
    .join(' ')
    .toLowerCase()
  return blob.includes(k)
}

export function filterOperatingCostRecords(
  filters: OperatingCostFilters,
  rows = operatingCostRecords,
): OperatingCostRecord[] {
  return rows.filter((r) => {
    if (r.year !== filters.year) return false
    if (filters.periodType === 'week' && r.week !== filters.week) return false
    if (filters.periodType === 'month' && r.month !== filters.month) return false
    if (filters.periodType === 'day' && !inDateRange(r.statDate, filters.dateFrom, filters.dateTo)) {
      return false
    }
    if (filters.region !== 'all' && r.region !== filters.region) return false
    if (filters.hub !== 'all' && r.hub !== filters.hub) return false
    if (filters.customer !== 'all' && r.customer !== filters.customer) return false
    if (filters.warehouse !== 'all' && r.warehouse !== filters.warehouse) return false
    if (filters.route !== 'all' && r.route !== filters.route) return false
    if (filters.deliverer !== 'all' && r.delivererName !== filters.deliverer) return false
    if (filters.opsCs !== 'all' && r.opsCs !== filters.opsCs) return false
    if (filters.lockStatus !== 'all' && r.lockStatus !== filters.lockStatus) return false
    if (!matchesKeyword(r, filters.keyword)) return false
    return true
  })
}

export function formatOpCostAmount(
  value: number | null | undefined,
  canView: boolean,
): string {
  if (!canView) return '***'
  if (value == null || Number.isNaN(value)) return '—'
  return formatCurrency(value)
}

export { MOCK_DATA_ROW_COUNT } from './mock-seed'
export { YEARS, WEEKS, MONTHS, formatNumber, formatPercent, formatCurrency }
