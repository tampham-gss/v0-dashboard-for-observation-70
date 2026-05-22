import { MOCK_DATA_ROW_COUNT, seededUnit } from './mock-seed'
import { MONTHS, WEEKS, YEARS, formatNumber, formatPercent } from './report-mock-data'

/** Loại container đồng bộ nhập liệu hiện trường */
export type ContType = 'CONT_20' | 'CONT_40'

export type GlsCompetitorCatalogId =
  | 'VIETSUN'
  | 'VSICO'
  | 'DUONG_BO'
  | 'VIMC'
  | 'TMS'
  | 'XNK'
  | 'VINAFCO'
  | 'HAI_AN'
  | 'KHAC'

export type GlsRegionCode = 'HCM' | 'CLO' | 'HPH'

export type GlsCompetitorPeriodType = 'week' | 'month'

export interface GlsCompetitorObservation {
  id: string
  sourceId: string
  statDate: string
  year: number
  week: string
  month: string
  region: GlsRegionCode
  customer: string
  warehouse: string
  route: string
  contType: ContType | null
  glsVolume: number
  competitorId: GlsCompetitorCatalogId
  competitorName: string
  competitorVolume: number
  recordedBy: string
  recordedAt: string
  dataError?: boolean
}

export interface GlsCompetitorFilters {
  periodType: GlsCompetitorPeriodType
  year: number
  week: string
  month: string
  region: GlsRegionCode | 'all'
  contType: ContType | 'all'
  customer: string | 'all'
  warehouse: string | 'all'
  route: string | 'all'
  competitor: GlsCompetitorCatalogId | 'all'
  recorder: string | 'all'
  keyword: string
  /** Nhóm biểu đồ cột so sánh */
  chartGroupBy: 'day' | 'week' | 'region'
}

export const GLS_REGIONS: { id: GlsRegionCode; label: string }[] = [
  { id: 'HCM', label: 'Hồ Chí Minh' },
  { id: 'CLO', label: 'Cửa Lò' },
  { id: 'HPH', label: 'Hải Phòng' },
]

export const GLS_COMPETITOR_CATALOG: {
  id: GlsCompetitorCatalogId
  label: string
}[] = [
  { id: 'VIETSUN', label: 'VIETSUN' },
  { id: 'VSICO', label: 'VSICO' },
  { id: 'DUONG_BO', label: 'ĐƯỜNG BỘ' },
  { id: 'VIMC', label: 'VIMC' },
  { id: 'TMS', label: 'TMS' },
  { id: 'XNK', label: 'XNK' },
  { id: 'VINAFCO', label: 'VINAFCO' },
  { id: 'HAI_AN', label: 'HẢI AN' },
  { id: 'KHAC', label: 'Khác' },
]

export const CONT_TYPE_OPTIONS: { id: ContType | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả loại cont' },
  { id: 'CONT_20', label: 'Cont 20 ft (CONT_20)' },
  { id: 'CONT_40', label: 'Cont 40 ft (CONT_40)' },
]

const CUSTOMERS = [
  'Vinamilk Logistics',
  'Saigon Port JSC',
  'Hai An Transport',
  'Green Line Depot',
  'Nam Viet Cold Chain',
  'Pacific Container',
  'Maersk Depot VN',
  'CMA CGM HCM',
  'ITC Phu My',
  'Tân Cảng Logistics',
] as const

const WAREHOUSES = ['Kho Bình Dương', 'Kho Đình Vũ', 'Kho Cửa Lò', 'Kho Tân Cảng', 'Kho Long Bình'] as const
const ROUTES = ['HCM–ĐN', 'HPH–HCM', 'CLO–HPH', 'Nội thành HCM', 'Liên vùng Bắc'] as const
const RECORDERS = [
  'Nguyễn Văn A',
  'Trần Thị B',
  'Lê Minh C',
  'Phạm Thu D',
  'Hoàng Quốc E',
  'Võ Thanh F',
  'Đặng Văn G',
  'Bùi Thị H',
] as const

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length]!
}

function weekMeta(week: string) {
  const yy = week.slice(-2)
  const year = 2000 + Number(yy)
  const weekNum = Number(week.match(/\d+/)?.[0] ?? 1)
  const monthNum = Math.min(12, Math.max(1, Math.ceil(weekNum / 4)))
  const month = `${String(monthNum).padStart(2, '0')}/${yy}`
  return { year, monthNum, month, yy }
}

function buildObservation(index: number): GlsCompetitorObservation {
  const u = (s: number) => seededUnit(index, s)
  const catalog = GLS_COMPETITOR_CATALOG
  const regions: GlsRegionCode[] = ['HCM', 'HPH', 'CLO']

  const week = WEEKS[index % WEEKS.length]!
  const { year, monthNum, month, yy } = weekMeta(week)
  const day = (index % 28) + 1
  const statDate = `20${yy}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const sourceId = `SRC-${year}-${Math.floor(index / 2.3)}`
  const region = pick(regions, index + Math.floor(u(1) * 3))
  const contRoll = Math.floor(u(2) * 11)
  const contType: ContType | null =
    contRoll === 10 ? null : contRoll % 2 === 0 ? 'CONT_20' : 'CONT_40'
  const glsBase = Math.round(25 + u(3) * 180)
  const cat = catalog[Math.floor(u(4) * catalog.length)]!
  const compVol = Math.max(0, Math.round(glsBase * (0.1 + u(5) * 0.4)))
  const hasError = index % 317 === 0

  return {
    id: `OBS-${index}`,
    sourceId,
    statDate,
    year,
    week,
    month,
    region,
    customer: pick(CUSTOMERS, index + Math.floor(u(6) * 20)),
    warehouse: pick(WAREHOUSES, index + region.charCodeAt(0)),
    route: pick(ROUTES, index),
    contType,
    glsVolume: glsBase,
    competitorId: cat.id,
    competitorName: cat.label,
    competitorVolume: hasError ? -5 : compVol,
    recordedBy: pick(RECORDERS, index + Math.floor(u(7) * 10)),
    recordedAt: `${statDate}T${String(8 + (index % 9)).padStart(2, '0')}:${String(10 + (index % 40)).padStart(2, '0')}:00`,
    dataError: hasError,
  }
}

/** Ghi đè mẫu cho bộ lọc mặc định Tuần 15/26 */
function pinDefaultWeekSamples(rows: GlsCompetitorObservation[]) {
  const regions: GlsRegionCode[] = ['HCM', 'HPH', 'CLO']
  regions.forEach((region, idx) => {
    for (let c = 0; c < 3; c++) {
      const i = idx * 3 + c
      if (i >= rows.length) return
      const cat = GLS_COMPETITOR_CATALOG[c % GLS_COMPETITOR_CATALOG.length]!
      const glsBase = 80 + idx * 25
      rows[i] = {
        ...rows[i]!,
        week: 'Tuần 15/26',
        year: 2026,
        month: '04/26',
        statDate: `2026-04-${String(10 + idx).padStart(2, '0')}`,
        region,
        sourceId: `SRC-PIN-15-${idx}`,
        contType: c === 2 ? null : c === 0 ? 'CONT_20' : 'CONT_40',
        glsVolume: glsBase,
        competitorId: cat.id,
        competitorName: cat.label,
        competitorVolume: Math.round(glsBase * (0.2 + c * 0.1)),
        dataError: false,
      }
    }
  })
}

function buildMockObservations(count: number): GlsCompetitorObservation[] {
  const rows = Array.from({ length: count }, (_, i) => buildObservation(i))
  pinDefaultWeekSamples(rows)
  return rows
}

export const glsCompetitorObservations: GlsCompetitorObservation[] =
  buildMockObservations(MOCK_DATA_ROW_COUNT)

export const GLS_CUSTOMERS = [...new Set(glsCompetitorObservations.map((r) => r.customer))].sort()
export const GLS_WAREHOUSES = [...new Set(glsCompetitorObservations.map((r) => r.warehouse))].sort()
export const GLS_ROUTES = [...new Set(glsCompetitorObservations.map((r) => r.route))].sort()
export const GLS_RECORDERS = [...new Set(glsCompetitorObservations.map((r) => r.recordedBy))].sort()

export const DEFAULT_GLS_COMPETITOR_FILTERS: GlsCompetitorFilters = {
  periodType: 'week',
  year: 2026,
  week: 'Tuần 15/26',
  month: '04/26',
  region: 'all',
  contType: 'all',
  customer: 'all',
  warehouse: 'all',
  route: 'all',
  competitor: 'all',
  recorder: 'all',
  keyword: '',
  chartGroupBy: 'day',
}

export function glsRegionLabel(code: GlsRegionCode): string {
  return GLS_REGIONS.find((r) => r.id === code)?.label ?? code
}

export function contTypeLabel(t: ContType | null): string {
  if (t === 'CONT_20') return 'CONT_20'
  if (t === 'CONT_40') return 'CONT_40'
  return 'Chưa gán loại cont'
}

export function appliedGlsCompetitorCaption(filters: GlsCompetitorFilters): string {
  const region =
    filters.region === 'all' ? 'Tất cả khu vực' : glsRegionLabel(filters.region)
  const cont =
    filters.contType === 'all'
      ? 'Tất cả loại cont'
      : filters.contType === 'CONT_20'
        ? 'CONT_20'
        : 'CONT_40'
  const period =
    filters.periodType === 'week'
      ? `${filters.week} · ${filters.year}`
      : `Tháng ${filters.month} · ${filters.year}`
  return `${period} · ${region} · ${cont}`
}

function matchesKeyword(row: GlsCompetitorObservation, keyword: string): boolean {
  const k = keyword.trim().toLowerCase()
  if (!k) return true
  const blob = [
    row.customer,
    row.warehouse,
    row.route,
    row.competitorName,
    row.recordedBy,
    row.sourceId,
  ]
    .join(' ')
    .toLowerCase()
  return blob.includes(k)
}

export function filterGlsCompetitorObservations(
  filters: GlsCompetitorFilters,
  rows = glsCompetitorObservations,
): GlsCompetitorObservation[] {
  return rows.filter((r) => {
    if (r.year !== filters.year) return false
    if (filters.periodType === 'week' && r.week !== filters.week) return false
    if (filters.periodType === 'month' && r.month !== filters.month) return false
    if (filters.region !== 'all' && r.region !== filters.region) return false
    if (filters.contType !== 'all' && r.contType !== filters.contType) return false
    if (filters.customer !== 'all' && r.customer !== filters.customer) return false
    if (filters.warehouse !== 'all' && r.warehouse !== filters.warehouse) return false
    if (filters.route !== 'all' && r.route !== filters.route) return false
    if (filters.competitor !== 'all' && r.competitorId !== filters.competitor) return false
    if (filters.recorder !== 'all' && r.recordedBy !== filters.recorder) return false
    if (!matchesKeyword(r, filters.keyword)) return false
    return true
  })
}

/** Bản ghi có loại cont hợp lệ — dùng cho tỷ lệ thị phần */
export function rowsForRatioCalc(rows: GlsCompetitorObservation[]): GlsCompetitorObservation[] {
  return rows.filter((r) => r.contType === 'CONT_20' || r.contType === 'CONT_40')
}

export function formatGlsSharePercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return formatPercent(value)
}

export { MOCK_DATA_ROW_COUNT } from './mock-seed'
export { YEARS, WEEKS, MONTHS, formatNumber, formatPercent }
