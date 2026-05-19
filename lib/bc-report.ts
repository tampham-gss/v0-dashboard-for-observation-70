/**
 * BC tuần / BC tháng là nguồn dữ liệu; SL và CP là hai nhóm chỉ tiêu trên cùng grain (kỳ × chi nhánh).
 */
import {
  cpRecords,
  filterCPRecords,
  filterSLRecords,
  slRecords,
  type CPRecord,
  type PeriodType,
  type ReportFilters,
  type SLRecord,
} from './report-mock-data'

export type BcSourceSheet = 'BC tuần' | 'BC tháng'

export function bcSourceSheetForPeriod(periodType: PeriodType): BcSourceSheet {
  return periodType === 'week' ? 'BC tuần' : 'BC tháng'
}

/** Một dòng báo cáo BC = SL + CP cùng khóa kỳ/chi nhánh. */
export interface BcReportRow {
  id: string
  sourceSheet: BcSourceSheet
  sl: SLRecord
  cp: CPRecord | null
}

function bcRowKey(sl: SLRecord): string {
  const period = sl.periodType === 'week' ? sl.week : sl.month
  return `${sl.periodType}|${sl.year}|${period}|${sl.branch}`
}

function findCpForSl(sl: SLRecord): CPRecord | undefined {
  return cpRecords.find(
    (c) =>
      c.periodType === sl.periodType &&
      c.year === sl.year &&
      c.branch === sl.branch &&
      (sl.periodType === 'week' ? c.week === sl.week : c.month === sl.month),
  )
}

/** Toàn bộ dòng BC (mock ghép từ SL + CP — tương đương sheet BC tuần/tháng). */
export function buildBcReportRows(): BcReportRow[] {
  return slRecords.map((sl) => ({
    id: `bc-${bcRowKey(sl)}`,
    sourceSheet: bcSourceSheetForPeriod(sl.periodType),
    sl,
    cp: findCpForSl(sl) ?? null,
  }))
}

export const bcReportRows = buildBcReportRows()

export function filterBcReportRows(
  filters: ReportFilters,
  rows = bcReportRows,
): BcReportRow[] {
  const slIds = new Set(filterSLRecords(filters).map((r) => r.id))
  const cpIds = new Set(filterCPRecords(filters).map((r) => r.id))
  const source = bcSourceSheetForPeriod(filters.periodType)

  return rows.filter((row) => {
    if (row.sourceSheet !== source) return false
    if (!slIds.has(row.sl.id)) return false
    if (row.cp && !cpIds.has(row.cp.id)) return false
    if (!row.cp && filters.status !== 'all') {
      const cpOnlyStatuses = [
        'Trong định mức',
        'Vượt định mức',
        'Dữ liệu bất thường',
        'Thiếu dữ liệu',
      ] as const
      if (cpOnlyStatuses.includes(filters.status as (typeof cpOnlyStatuses)[number])) {
        return false
      }
    }
    return true
  })
}

/** Dữ liệu đã lọc theo bộ lọc — SL/CP đồng bộ từ cùng BC. */
export function getBcScopedData(filters: ReportFilters) {
  const bcRows = filterBcReportRows(filters)
  const slRows = bcRows.map((r) => r.sl)
  const cpRows = bcRows.map((r) => r.cp).filter((c): c is CPRecord => c != null)
  return {
    bcRows,
    slRows,
    cpRows,
    sourceSheet: bcSourceSheetForPeriod(filters.periodType),
  }
}

/** Lọc dòng BC theo loại sheet (tuần hoặc tháng), giữ các filter khác. */
export function filterBcRowsForPeriodType(
  filters: ReportFilters,
  periodType: PeriodType,
  rows = bcReportRows,
): BcReportRow[] {
  return filterBcReportRows({ ...filters, periodType }, rows)
}
