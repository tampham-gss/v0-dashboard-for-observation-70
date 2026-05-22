import {
  BRANCHES,
  TARGET_CP_PER_CONT,
  computeSLStatus,
  slCompareRatio,
  type BranchCode,
  type CPRecord,
  type CPStatus,
  type PeriodType,
  type ReportFilters,
  type SLRecord,
  type SLStatus,
  weeksForYear,
  monthsForYear,
} from './report-mock-data'

export interface TrendPoint {
  period: string
  slContTH: number
  tongChiPhi: number
  cpTBPerCont: number | null
}

export interface BranchRankingRow {
  branch: BranchCode
  slContTH: number
  slContKH: number
  thKhRatio: number | null
  tongChiPhi: number
  cpTBPerCont: number | null
  overTargetCp: boolean
  needsReview: boolean
  slStatus: SLStatus
  cpStatus: CPStatus | null
}

export interface BranchComparePoint {
  branch: BranchCode
  slContTH: number
  cpTBPerCont: number | null
  needsReview: boolean
}

function matchesKeyword(text: string, keyword: string): boolean {
  const k = keyword.trim().toLowerCase()
  if (!k) return true
  return text.toLowerCase().includes(k)
}

function periodKey(r: { periodType: PeriodType; week?: string; month?: string }): string {
  return r.periodType === 'week' ? (r.week ?? '—') : (r.month ?? '—')
}

/** Lọc SL theo năm + loại kỳ (không khóa một tuần/tháng) — dùng xu hướng. */
export function filterSLYearScope(filters: ReportFilters, rows: SLRecord[]): SLRecord[] {
  return rows.filter((r) => {
    if (r.periodType !== filters.periodType) return false
    if (r.year !== filters.year) return false
    if (filters.branch !== 'all' && r.branch !== filters.branch) return false
    if (
      filters.status !== 'all' &&
      (filters.status === 'Đạt kế hoạch' ||
        filters.status === 'Gần đạt' ||
        filters.status === 'Chưa đạt' ||
        filters.status === 'Cần kiểm tra') &&
      r.status !== filters.status
    ) {
      return false
    }
    const label = `${periodKey(r)} ${r.branch}`
    if (!matchesKeyword(label, filters.keyword)) return false
    return true
  })
}

export function filterCPYearScope(filters: ReportFilters, rows: CPRecord[]): CPRecord[] {
  return rows.filter((r) => {
    if (r.periodType !== filters.periodType) return false
    if (r.year !== filters.year) return false
    if (filters.branch !== 'all' && r.branch !== filters.branch) return false
    if (
      filters.status !== 'all' &&
      (filters.status === 'Trong định mức' ||
        filters.status === 'Vượt định mức' ||
        filters.status === 'Cần kiểm tra' ||
        filters.status === 'Dữ liệu bất thường' ||
        filters.status === 'Thiếu dữ liệu') &&
      r.status !== filters.status
    ) {
      return false
    }
    const label = `${periodKey(r)} ${r.branch}`
    if (!matchesKeyword(label, filters.keyword)) return false
    return true
  })
}

const PERIOD_ORDER: Record<PeriodType, (year: number) => string[]> = {
  week: weeksForYear,
  month: monthsForYear,
}

export function buildTrendSeries(
  filters: ReportFilters,
  slRows: SLRecord[],
  cpRows: CPRecord[],
): TrendPoint[] {
  const slScoped = filterSLYearScope(filters, slRows)
  const cpScoped = filterCPYearScope(filters, cpRows)
  const order = PERIOD_ORDER[filters.periodType](filters.year)

  const slByPeriod = new Map<string, number>()
  const cpByPeriod = new Map<string, { chiPhi: number; cont: number }>()

  for (const r of slScoped) {
    const key = periodKey(r)
    slByPeriod.set(key, (slByPeriod.get(key) ?? 0) + r.slContTH)
  }

  for (const r of cpScoped) {
    const key = periodKey(r)
    const cur = cpByPeriod.get(key) ?? { chiPhi: 0, cont: 0 }
    cur.chiPhi += r.tongChiPhi
    cur.cont += r.contGNGLSKD + r.contLaiXeKD + r.contVendorKD
    cpByPeriod.set(key, cur)
  }

  const keysInData = new Set([...slByPeriod.keys(), ...cpByPeriod.keys()])
  const sortedKeys = order.filter((p) => keysInData.has(p))
  const extra = [...keysInData].filter((k) => !sortedKeys.includes(k)).sort()

  return [...sortedKeys, ...extra].map((period) => {
    const cp = cpByPeriod.get(period)
    const sl = slByPeriod.get(period) ?? 0
    const chiPhi = cp?.chiPhi ?? 0
    const cpTB = cp && cp.cont > 0 ? chiPhi / cp.cont : null
    return { period, slContTH: sl, tongChiPhi: chiPhi, cpTBPerCont: cpTB }
  })
}

export function buildBranchRanking(
  slRows: SLRecord[],
  cpRows: CPRecord[],
): BranchRankingRow[] {
  const slByBranch = new Map<BranchCode, SLRecord[]>()
  for (const r of slRows) {
    const list = slByBranch.get(r.branch) ?? []
    list.push(r)
    slByBranch.set(r.branch, list)
  }

  const cpByBranch = new Map<BranchCode, CPRecord[]>()
  for (const r of cpRows) {
    const list = cpByBranch.get(r.branch) ?? []
    list.push(r)
    cpByBranch.set(r.branch, list)
  }

  const rows: BranchRankingRow[] = BRANCHES.map((branch) => {
    const slList = slByBranch.get(branch) ?? []
    const cpList = cpByBranch.get(branch) ?? []

    const slContKH = slList.reduce((s, r) => s + r.slContKH, 0)
    const slContTH = slList.reduce((s, r) => s + r.slContTH, 0)
    const tongChiPhi = cpList.reduce((s, r) => s + r.tongChiPhi, 0)
    const contTotal = cpList.reduce(
      (s, r) => s + r.contGNGLSKD + r.contLaiXeKD + r.contVendorKD,
      0,
    )
    const cpTB = contTotal > 0 ? tongChiPhi / contTotal : null

    const slStatus =
      slList.length === 0
        ? ('Cần kiểm tra' as const)
        : slList.length === 1
          ? slList[0]!.status
          : computeSLStatus(slContKH, slContTH)

    const cpStatus = cpList.length === 1 ? cpList[0]!.status : cpList[0]?.status ?? null

    return {
      branch,
      slContTH,
      slContKH,
      thKhRatio: slCompareRatio(slContKH, slContTH),
      tongChiPhi,
      cpTBPerCont: cpTB,
      overTargetCp: cpTB != null && cpTB > TARGET_CP_PER_CONT,
      needsReview: false,
      slStatus,
      cpStatus: cpList.length > 0 ? cpStatus : null,
    }
  })

  const filtered = rows
    .filter((r) => r.slContTH > 0 || r.tongChiPhi > 0)
    .sort((a, b) => b.slContTH - a.slContTH)

  const slValues = filtered.map((r) => r.slContTH)
  const p75 = slValues.length
    ? [...slValues].sort((a, b) => a - b)[Math.floor(slValues.length * 0.75)]!
    : 0

  return filtered.map((r) => ({
    ...r,
    needsReview: r.slContTH >= p75 && r.overTargetCp,
  }))
}

export function buildBranchCompare(slRows: SLRecord[], cpRows: CPRecord[]): BranchComparePoint[] {
  const ranking = buildBranchRanking(slRows, cpRows)
  if (ranking.length === 0) return []

  const slValues = ranking.map((r) => r.slContTH)
  const p75 = slValues.sort((a, b) => a - b)[Math.floor(slValues.length * 0.75)] ?? 0

  return ranking.map((r) => ({
    branch: r.branch,
    slContTH: r.slContTH,
    cpTBPerCont: r.cpTBPerCont,
    needsReview: r.slContTH >= p75 && r.overTargetCp,
  }))
}
