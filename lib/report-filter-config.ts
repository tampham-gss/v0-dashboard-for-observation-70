import type { ReportSectionTabId } from '@/components/report/report-section-tabs'
import {
  monthsForYear,
  type CPStatus,
  type FilterStatus,
  type ReportFilters,
  type SLStatus,
} from './report-mock-data'

export type FilterFieldKey =
  | 'periodType'
  | 'year'
  | 'week'
  | 'month'
  | 'branch'
  | 'warehouse'
  | 'route'
  | 'staff'
  | 'opsCs'
  | 'status'
  | 'keyword'

/** Kỳ, khu vực, kho, tuyến, giao nhận, CS/OPS (không Hub / Khách hàng). */
const REPORT_MAIN_FILTER_FIELD_KEYS: FilterFieldKey[] = [
  'periodType',
  'year',
  'month',
  'branch',
  'warehouse',
  'route',
  'staff',
  'opsCs',
  'status',
]

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

/** Bộ lọc BC tuần/tháng: kỳ theo tháng, chi nhánh, trạng thái. */
const BC_TAB_FILTER_FIELD_KEYS: FilterFieldKey[] = [
  'year',
  'month',
  'branch',
  'status',
]

const TAB_FIELDS: Record<ReportSectionTabId, FilterFieldKey[]> = {
  overview: REPORT_MAIN_FILTER_FIELD_KEYS,
  bcWeek: BC_TAB_FILTER_FIELD_KEYS,
  bcMonth: BC_TAB_FILTER_FIELD_KEYS,
  sl: REPORT_MAIN_FILTER_FIELD_KEYS,
  cp: REPORT_MAIN_FILTER_FIELD_KEYS,
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
  bcWeek: 'Tìm theo tháng hoặc chi nhánh…',
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
    next = { ...next, periodType: 'week', month, bcWeekByMonth: true }
  }

  if (tab === 'bcMonth') {
    const months = monthsForYear(next.year)
    const month = months.includes(next.month) ? next.month : (months[0] ?? next.month)
    next = { ...next, periodType: 'month', month, bcWeekByMonth: false }
  }

  if (tab === 'overview' || tab === 'sl' || tab === 'cp') {
    const months = monthsForYear(next.year)
    const month = months.includes(next.month) ? next.month : (months[0] ?? next.month)
    next = {
      ...next,
      month,
      bcWeekByMonth: next.periodType === 'week',
    }
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
    patch.month = months.includes(filters.month) ? filters.month : (months[0] ?? filters.month)
    patch.bcWeekByMonth = true
  }

  if (tab === 'bcMonth' || tab === 'overview' || tab === 'sl' || tab === 'cp') {
    const months = monthsForYear(year)
    if (!months.includes(filters.month)) {
      patch.month = months[0] ?? filters.month
    }
  }

  return patch
}

/** Khi đổi tháng trên tab BC tuần. */
export function patchMonthForBcWeek(month: string): Partial<ReportFilters> {
  return { month }
}
