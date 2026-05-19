import type { ReportSectionTabId } from '@/components/report/report-section-tabs'
import {
  bcWeekOptionsForMonth,
  monthsForYear,
  type CPStatus,
  type FilterStatus,
  type ReportFilters,
  type SLStatus,
} from './report-mock-data'

export type FilterFieldKey =
  | 'periodType'
  | 'year'
  | 'periodValue'
  | 'week'
  | 'month'
  | 'branch'
  | 'status'
  | 'keyword'

const SL_STATUSES: SLStatus[] = ['Đạt kế hoạch', 'Gần đạt', 'Chưa đạt', 'Cần kiểm tra']
const CP_STATUSES: CPStatus[] = [
  'Trong định mức',
  'Vượt định mức',
  'Cần kiểm tra',
  'Dữ liệu bất thường',
  'Thiếu dữ liệu',
]

const OVERVIEW_STATUSES: FilterStatus[] = [
  'all',
  ...SL_STATUSES,
  ...CP_STATUSES,
]

/** Bộ lọc bám Excel BC: kỳ, chi nhánh, trạng thái, từ khóa. */
export const DEFAULT_FILTER_FIELD_KEYS: FilterFieldKey[] = [
  'periodType',
  'year',
  'periodValue',
  'branch',
  'status',
  'keyword',
]

const TAB_FIELDS: Record<ReportSectionTabId, FilterFieldKey[]> = {
  overview: DEFAULT_FILTER_FIELD_KEYS,
  bcWeek: ['year', 'month', 'week', 'branch', 'status', 'keyword'],
  bcMonth: ['year', 'month', 'branch', 'status', 'keyword'],
  sl: DEFAULT_FILTER_FIELD_KEYS,
  cp: DEFAULT_FILTER_FIELD_KEYS,
}

const TAB_LABELS: Record<ReportSectionTabId, string> = {
  overview: 'Tổng quan',
  bcWeek: 'BC tuần',
  bcMonth: 'BC tháng',
  sl: 'Sản lượng',
  cp: 'Chi phí',
}

const TAB_SEARCH_PLACEHOLDER: Record<ReportSectionTabId, string> = {
  overview: 'Tìm theo kỳ báo cáo hoặc chi nhánh…',
  bcWeek: 'Tìm theo tháng, tuần hoặc chi nhánh…',
  bcMonth: 'Tìm theo tháng hoặc chi nhánh…',
  sl: 'Tìm theo kỳ báo cáo hoặc chi nhánh…',
  cp: 'Tìm theo kỳ báo cáo hoặc chi nhánh…',
}

export function getFilterFieldsForTab(tab: ReportSectionTabId): FilterFieldKey[] {
  return TAB_FIELDS[tab]
}

export function getFilterPanelTitle(tab: ReportSectionTabId): string {
  return `Bộ lọc · ${TAB_LABELS[tab]}`
}

export function getSearchPlaceholder(tab: ReportSectionTabId): string {
  return TAB_SEARCH_PLACEHOLDER[tab]
}

export function getStatusOptionsForTab(
  tab: ReportSectionTabId,
): { id: FilterStatus; label: string }[] {
  const all = { id: 'all' as const, label: 'Tất cả' }
  switch (tab) {
    case 'sl':
      return [all, ...SL_STATUSES.map((s) => ({ id: s, label: s }))]
    case 'cp':
      return [all, ...CP_STATUSES.map((s) => ({ id: s, label: s }))]
    case 'overview':
    case 'bcWeek':
    case 'bcMonth':
      return OVERVIEW_STATUSES.map((id) =>
        id === 'all' ? all : { id, label: id },
      )
    default:
      return []
  }
}

export function isSlStatus(status: FilterStatus): status is SLStatus {
  return status === 'all' || SL_STATUSES.includes(status as SLStatus)
}

export function isCpStatus(status: FilterStatus): status is CPStatus {
  return status === 'all' || CP_STATUSES.includes(status as CPStatus)
}

export function sanitizeFiltersForTab(filters: ReportFilters, tab: ReportSectionTabId): ReportFilters {
  const resetStatus = { ...filters, status: 'all' as FilterStatus }

  if (tab === 'sl' && filters.status !== 'all' && !SL_STATUSES.includes(filters.status as SLStatus)) {
    return resetStatus
  }
  if (tab === 'cp' && filters.status !== 'all' && !CP_STATUSES.includes(filters.status as CPStatus)) {
    return resetStatus
  }
  if (
    (tab === 'overview' || tab === 'bcWeek' || tab === 'bcMonth') &&
    filters.status !== 'all' &&
    !OVERVIEW_STATUSES.includes(filters.status)
  ) {
    return resetStatus
  }

  return filters
}

/** Đồng bộ periodType và kỳ khi đổi tab (BC tuần / BC tháng). */
export function syncFiltersForTab(filters: ReportFilters, tab: ReportSectionTabId): ReportFilters {
  let next = sanitizeFiltersForTab(filters, tab)

  if (tab === 'bcWeek') {
    const months = monthsForYear(next.year)
    const month = months.includes(next.month) ? next.month : (months[0] ?? next.month)
    const weeks = bcWeekOptionsForMonth(next.year, month)
    const week = weeks.includes(next.week) ? next.week : (weeks[0] ?? next.week)
    next = { ...next, periodType: 'week', month, week }
  }

  if (tab === 'bcMonth') {
    const months = monthsForYear(next.year)
    const month = months.includes(next.month) ? next.month : (months[0] ?? next.month)
    next = { ...next, periodType: 'month', month }
  }

  return next
}

/** Khi đổi năm trên tab BC — giữ tuần/tháng hợp lệ với năm. */
export function patchYearForBcTab(
  filters: ReportFilters,
  year: number,
  tab: ReportSectionTabId,
): Partial<ReportFilters> {
  const patch: Partial<ReportFilters> = { year }

  if (tab === 'bcWeek') {
    const months = monthsForYear(year)
    const month = months.includes(filters.month) ? filters.month : (months[0] ?? filters.month)
    patch.month = month
    const weeks = bcWeekOptionsForMonth(year, month)
    if (!weeks.includes(filters.week)) {
      patch.week = weeks[0] ?? filters.week
    }
  }

  if (tab === 'bcMonth') {
    const months = monthsForYear(year)
    if (!months.includes(filters.month)) {
      patch.month = months[0] ?? filters.month
    }
  }

  return patch
}

/** Khi đổi tháng trên tab BC tuần — giữ tuần trong 4 tuần của tháng. */
export function patchMonthForBcWeek(
  filters: ReportFilters,
  month: string,
): Partial<ReportFilters> {
  const weeks = bcWeekOptionsForMonth(filters.year, month)
  return {
    month,
    week: weeks.includes(filters.week) ? filters.week : (weeks[0] ?? filters.week),
  }
}
