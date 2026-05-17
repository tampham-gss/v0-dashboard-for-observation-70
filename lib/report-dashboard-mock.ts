import {
  BRANCHES,
  cpRecords,
  filterCPRecords,
  filterSLRecords,
  formatCurrency,
  formatNumber,
  formatPercent,
  periodLabel,
  slCompareRatio,
  slRecords,
  TARGET_CP_PER_CONT,
  type BranchCode,
  type CPRecord,
  type PeriodType,
  type ReportFilters,
  type SLRecord,
} from './report-mock-data'

export const WAREHOUSES = ['Kho A1', 'Kho A2', 'Kho B1', 'Kho C1', 'Kho D1'] as const
export const ROUTES = ['Tuyến GN-01', 'Tuyến GN-02', 'Tuyến LX-01', 'Tuyến Ven-01', 'Tuyến GLS-02'] as const
export const STAFF_LIST = [
  'Nguyễn Văn An',
  'Trần Thị Bình',
  'Lê Văn Cường',
  'Phạm Văn Dũng',
  'Hoàng Văn Em',
] as const
export const OPS_CS_LIST = ['Trần Thị Bình', 'Phạm Văn Dũng', 'Ngô Thị Giang', 'Vũ Thị Hương'] as const

export type UserRole = 'admin' | 'manager' | 'ops' | 'accountant'

export function canViewFinancial(role: UserRole): boolean {
  return role === 'admin' || role === 'manager' || role === 'accountant'
}

export function canExport(role: UserRole): boolean {
  return role === 'admin' || role === 'manager'
}

export interface OperationalRow {
  id: string
  periodType: PeriodType
  year: number
  week?: string
  month?: string
  region: BranchCode
  warehouse: string
  route: string
  staff: string
  opsCs: string
  sanLuong: number
  soDon: number
  soChuyen: number
  chiPhiVanHanh: number
  tangCa: number
  hoTro: number
  doanhThu: number | null
  hasDoanhThu: boolean
}

export interface DashboardKpis {
  sanLuong: {
    total: number
    soDon: number
    soChuyen: number
    growthPct: number | null
  }
  doanhThu: {
    total: number | null
    avg: number | null
    growthPct: number | null
    missing: boolean
  }
  chiPhi: {
    total: number
    vanHanh: number
    tangCa: number
    hoTro: number
  }
  hieuQua: {
    tyLe: number | null
    chiPhiPerSl: number | null
    doanhThuPerChiPhi: number | null
    configured: boolean
  }
}

export interface TrendPoint {
  label: string
  sanLuong: number
  chiPhi: number
  doanhThu: number | null
  hieuQua: number | null
}

export interface ComparisonPoint {
  name: string
  sanLuong: number
  chiPhi: number
}

export interface EfficiencyRow {
  id: string
  period: string
  region: BranchCode
  route: string
  warehouse: string
  staff: string
  sanLuong: number
  doanhThu: number | null
  chiPhi: number
  tyLeHieuQua: number | null
  hasDoanhThu: boolean
  anomaly: boolean
}

export interface HeatmapCell {
  region: BranchCode
  period: string
  score: number
}

function findCp(sl: SLRecord): CPRecord | undefined {
  return cpRecords.find(
    (c) =>
      c.periodType === sl.periodType &&
      c.year === sl.year &&
      c.branch === sl.branch &&
      (sl.periodType === 'week' ? c.week === sl.week : c.month === sl.month),
  )
}

function buildOperationalRows(): OperationalRow[] {
  const rows: OperationalRow[] = []
  let seq = 0
  const wh = [...WAREHOUSES]
  const rt = [...ROUTES]
  const st = [...STAFF_LIST]
  const ops = [...OPS_CS_LIST]

  for (const sl of slRecords) {
    const cp = findCp(sl)
    const parts = 3
    for (let p = 0; p < parts; p++) {
      const share = 1 / parts
      const hasRev = sl.branch !== 'DAN' && p === 0
      rows.push({
        id: `op-${++seq}`,
        periodType: sl.periodType,
        year: sl.year,
        week: sl.week,
        month: sl.month,
        region: sl.branch,
        warehouse: wh[(seq + p) % wh.length],
        route: rt[(seq + p) % rt.length],
        staff: st[(seq + p) % st.length],
        opsCs: ops[(seq + p) % ops.length],
        sanLuong: Math.round(sl.slContTH * share),
        soDon: Math.round((sl.slKhoTH / 10) * share),
        soChuyen: Math.round((sl.slContLX / 5 + 1) * share),
        chiPhiVanHanh: Math.round((cp?.tongCPGNGLS ?? 0) * share),
        tangCa: Math.round((cp?.tongCPLaiXeKD ?? 0) * 0.15 * share),
        hoTro: Math.round((cp?.tongCPVendor ?? 0) * 0.1 * share),
        doanhThu: hasRev ? Math.round(sl.slContTH * share * 850_000) : null,
        hasDoanhThu: hasRev,
      })
    }
  }
  return rows
}

export const operationalRows = buildOperationalRows()

function matchesKeyword(text: string, keyword: string): boolean {
  const k = keyword.trim().toLowerCase()
  if (!k) return true
  return text.toLowerCase().includes(k)
}

export function filterOperationalRows(
  filters: ReportFilters,
  rows = operationalRows,
): OperationalRow[] {
  return rows.filter((r) => {
    if (r.periodType !== filters.periodType) return false
    if (r.year !== filters.year) return false
    if (filters.periodType === 'week' && r.week !== filters.week) return false
    if (filters.periodType === 'month' && r.month !== filters.month) return false
    if (filters.branch !== 'all' && r.region !== filters.branch) return false
    if (filters.warehouse !== 'all' && r.warehouse !== filters.warehouse) return false
    if (filters.route !== 'all' && r.route !== filters.route) return false
    if (filters.staff !== 'all' && r.staff !== filters.staff) return false
    if (filters.opsCs !== 'all' && r.opsCs !== filters.opsCs) return false
    if (filters.status === 'has_revenue' && !r.hasDoanhThu) return false
    if (filters.status === 'no_revenue' && r.hasDoanhThu) return false
    if (filters.status === 'anomaly') {
      const totalCost = r.chiPhiVanHanh + r.tangCa + r.hoTro
      const badCost = totalCost < 0
      const badEfficiency = r.hasDoanhThu && r.hieuQua != null && r.hieuQua < 0
      if (!badCost && !badEfficiency) return false
    }
    const label = `${periodLabel(r)} ${r.region} ${r.warehouse} ${r.route} ${r.staff}`
    if (!matchesKeyword(label, filters.keyword)) return false
    return true
  })
}

export function computeDashboardKpis(
  opRows: OperationalRow[],
  slRows: SLRecord[],
  cpRows: CPRecord[],
  efficiencyConfigured: boolean,
): DashboardKpis {
  const totalSl = opRows.reduce((s, r) => s + r.sanLuong, 0)
  const soDon = opRows.reduce((s, r) => s + r.soDon, 0)
  const soChuyen = opRows.reduce((s, r) => s + r.soChuyen, 0)
  const revRows = opRows.filter((r) => r.hasDoanhThu && r.doanhThu != null)
  const totalRev = revRows.length ? revRows.reduce((s, r) => s + (r.doanhThu ?? 0), 0) : null
  const vanHanh = opRows.reduce((s, r) => s + r.chiPhiVanHanh, 0)
  const tangCa = opRows.reduce((s, r) => s + r.tangCa, 0)
  const hoTro = opRows.reduce((s, r) => s + r.hoTro, 0)
  const totalCp = cpRows.reduce((s, r) => s + r.tongChiPhi, 0) || vanHanh + tangCa + hoTro
  const missingRev = revRows.length === 0
  const totalContKH = slRows.reduce((s, r) => s + r.slContKH, 0)
  const totalContTH = slRows.reduce((s, r) => s + r.slContTH, 0)
  const thKh = slCompareRatio(totalContKH, totalContTH)

  return {
    sanLuong: {
      total: totalSl,
      soDon,
      soChuyen,
      growthPct: thKh != null ? thKh - 100 : null,
    },
    doanhThu: {
      total: totalRev,
      avg: totalRev != null && totalSl > 0 ? totalRev / totalSl : null,
      growthPct: null,
      missing: missingRev,
    },
    chiPhi: {
      total: totalCp,
      vanHanh,
      tangCa,
      hoTro,
    },
    hieuQua: {
      tyLe: efficiencyConfigured && totalRev != null && totalCp > 0 ? (totalRev / totalCp) * 100 : null,
      chiPhiPerSl: totalSl > 0 ? totalCp / totalSl : null,
      doanhThuPerChiPhi:
        efficiencyConfigured && totalRev != null && totalCp > 0 ? totalRev / totalCp : null,
      configured: efficiencyConfigured,
    },
  }
}

const TREND_LABELS_WEEK = ['Tuần 08/26', 'Tuần 09/26', 'Tuần 10/26', 'Tuần 11/26', 'Tuần 12/26', 'Tuần 13/26', 'Tuần 14/26', 'Tuần 15/26']
const TREND_LABELS_MONTH = ['01/26', '02/26', '03/26', '04/26', '05/26', '06/26', '07/26', '08/26']

export function buildTrendSeries(filters: ReportFilters, opRows: OperationalRow[]): TrendPoint[] {
  const labels = filters.periodType === 'week' ? TREND_LABELS_WEEK : TREND_LABELS_MONTH
  const baseSl = opRows.reduce((s, r) => s + r.sanLuong, 0) || 1200
  const baseCp = opRows.reduce((s, r) => s + r.chiPhiVanHanh + r.tangCa + r.hoTro, 0) || 180_000_000
  const hasRev = opRows.some((r) => r.hasDoanhThu)

  return labels.map((label, i) => {
    const factor = 0.82 + i * 0.025
    return {
      label,
      sanLuong: Math.round(baseSl * factor * (0.9 + (i % 3) * 0.05)),
      chiPhi: Math.round(baseCp * factor),
      doanhThu: hasRev ? Math.round(baseSl * factor * 920_000) : null,
      hieuQua: hasRev ? Math.round(95 + i * 1.2) : null,
    }
  })
}

export type ComparisonDimension = 'region' | 'warehouse' | 'route' | 'staff'

export function buildComparisonSeries(
  opRows: OperationalRow[],
  dimension: ComparisonDimension,
): ComparisonPoint[] {
  const map = new Map<string, { sanLuong: number; chiPhi: number }>()
  for (const r of opRows) {
    const key =
      dimension === 'region'
        ? r.region
        : dimension === 'warehouse'
          ? r.warehouse
          : dimension === 'route'
            ? r.route
            : r.staff
    const cur = map.get(key) ?? { sanLuong: 0, chiPhi: 0 }
    cur.sanLuong += r.sanLuong
    cur.chiPhi += r.chiPhiVanHanh + r.tangCa + r.hoTro
    map.set(key, cur)
  }
  return [...map.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.sanLuong - a.sanLuong)
    .slice(0, 8)
}

export function buildEfficiencyRows(opRows: OperationalRow[]): EfficiencyRow[] {
  return opRows.map((r) => {
    const chiPhi = r.chiPhiVanHanh + r.tangCa + r.hoTro
    const tyLe =
      r.hasDoanhThu && r.doanhThu != null && chiPhi > 0 ? (r.doanhThu / chiPhi) * 100 : null
    return {
      id: r.id,
      period: periodLabel(r),
      region: r.region,
      route: r.route,
      warehouse: r.warehouse,
      staff: r.staff,
      sanLuong: r.sanLuong,
      doanhThu: r.doanhThu,
      chiPhi,
      tyLeHieuQua: tyLe,
      hasDoanhThu: r.hasDoanhThu,
      anomaly: chiPhi < 0 || (r.doanhThu != null && r.doanhThu < 0),
    }
  })
}

export function buildEfficiencyHeatmap(opRows: OperationalRow[]): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  for (const region of BRANCHES) {
    const subset = opRows.filter((r) => r.region === region)
    if (!subset.length) continue
    const rev = subset.filter((r) => r.hasDoanhThu).reduce((s, r) => s + (r.doanhThu ?? 0), 0)
    const cp = subset.reduce((s, r) => s + r.chiPhiVanHanh + r.tangCa + r.hoTro, 0)
    const sl = subset.reduce((s, r) => s + r.sanLuong, 0)
    const score = rev > 0 && cp > 0 ? Math.min(100, Math.round((rev / cp) * 10)) : sl > 0 && cp > 0 ? Math.round(100 - cp / sl / 1000) : 50
    cells.push({
      region,
      period: periodLabel(subset[0]),
      score: Math.max(0, Math.min(100, score)),
    })
  }
  return cells
}

export function getScopedData(filters: ReportFilters) {
  const slRows = filterSLRecords(filters)
  const cpRows = filterCPRecords(filters)
  const opRows = filterOperationalRows(filters)
  return { slRows, cpRows, opRows }
}

export { formatCurrency, formatNumber, formatPercent }
