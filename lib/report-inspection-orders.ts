import {
  REPORT_DELIVERERS,
  REPORT_OPS_CS,
  REPORT_ROUTES,
  REPORT_WAREHOUSES,
} from './report-filter-options'
import type { BranchCode } from './report-constants'
import type { CPRecord, PeriodType, ReportFilters, SLRecord } from './report-mock-data'

export type InspectionOrderStatus = 'da_chot' | 'cho_duyet' | 'dang_xu_ly'

export interface InspectionOrder {
  id: string
  maLenh: string
  ngay: string
  branch: BranchCode
  kho: string
  tuyen: string
  nhanSu: string
  opsCs: string
  slCont: number
  tongChiPhi: number
  trangThai: InspectionOrderStatus
  periodType: PeriodType
  year: number
  week?: string
  month?: string
}
const STATUSES: InspectionOrderStatus[] = ['da_chot', 'cho_duyet', 'dang_xu_ly']

function hashId(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return Math.abs(h)
}

function statusLabel(s: InspectionOrderStatus): string {
  switch (s) {
    case 'da_chot':
      return 'Đã chốt'
    case 'cho_duyet':
      return 'Chờ duyệt'
    default:
      return 'Đang xử lý'
  }
}

export { statusLabel as inspectionOrderStatusLabel }

/** Sinh lệnh kiểm đếm từ grain SL/CP đang lọc (một kỳ). */
export function buildInspectionOrdersForScope(
  filters: ReportFilters,
  slRows: SLRecord[],
  cpRows: CPRecord[],
): InspectionOrder[] {
  const cpByBranch = new Map(cpRows.map((c) => [c.branch, c]))
  const orders: InspectionOrder[] = []

  for (const sl of slRows) {
    const cp = cpByBranch.get(sl.branch)
    const orderCount = 3 + (hashId(sl.id) % 4)
    const period =
      sl.periodType === 'week' ? sl.week : sl.month
    const yy = String(sl.year).slice(-2)
    const monthPart = sl.periodType === 'month' ? sl.month?.slice(0, 2) ?? '04' : '04'
    const dayBase = 1 + (hashId(sl.branch) % 20)

    for (let i = 0; i < orderCount; i++) {
      const h = hashId(`${sl.id}-${i}`)
      const slCont = Math.max(1, Math.round(sl.slContTH / orderCount) + (h % 3))
      const chiPhi = cp
        ? Math.round(cp.tongChiPhi / orderCount)
        : Math.round(slCont * 140_000)
      const day = String(Math.min(28, dayBase + (i % 7))).padStart(2, '0')

      orders.push({
        id: `lenh-${sl.id}-${i}`,
        maLenh: `KD-${sl.branch}-${yy}${monthPart}${day}-${String(i + 1).padStart(3, '0')}`,
        ngay: `${sl.year}-${monthPart}-${day}`,
        branch: sl.branch,
        kho: REPORT_WAREHOUSES[h % REPORT_WAREHOUSES.length]!,
        tuyen: REPORT_ROUTES[(h + i) % REPORT_ROUTES.length]!,
        nhanSu: REPORT_DELIVERERS[h % REPORT_DELIVERERS.length]!,
        opsCs: REPORT_OPS_CS[(h + i) % REPORT_OPS_CS.length]!,
        slCont,
        tongChiPhi: chiPhi,
        trangThai: STATUSES[h % STATUSES.length]!,
        periodType: sl.periodType,
        year: sl.year,
        week: sl.week,
        month: sl.month,
      })
    }
  }

  const kw = filters.keyword.trim().toLowerCase()
  return orders.filter((o) => {
    if (filters.branch !== 'all' && o.branch !== filters.branch) return false
    if (filters.warehouse !== 'all' && o.kho !== filters.warehouse) return false
    if (filters.route !== 'all' && o.tuyen !== filters.route) return false
    if (filters.staff !== 'all' && o.nhanSu !== filters.staff) return false
    if (filters.opsCs !== 'all' && o.opsCs !== filters.opsCs) return false
    if (!kw) return true
    const text = `${o.maLenh} ${o.branch} ${o.kho} ${o.tuyen} ${o.nhanSu} ${o.opsCs} ${statusLabel(o.trangThai)}`
    return text.toLowerCase().includes(kw)
  })
}
