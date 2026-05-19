import type { ReportSectionTabId } from '@/components/report/report-section-tabs'
import type { CPStatus, FilterStatus, ReportFilters, SLStatus } from './report-mock-data'

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
  bc: ['year', 'week', 'month', 'branch', 'status', 'keyword'],
  sl: DEFAULT_FILTER_FIELD_KEYS,
  cp: DEFAULT_FILTER_FIELD_KEYS,
}

const TAB_LABELS: Record<ReportSectionTabId, string> = {
  overview: 'Tổng quan',
  bc: 'BC tuần/tháng',
  sl: 'Sản lượng',
  cp: 'Chi phí',
}

const TAB_SEARCH_PLACEHOLDER: Record<ReportSectionTabId, string> = {
  overview: 'Tìm theo kỳ báo cáo hoặc chi nhánh…',
  bc: 'Tìm theo kỳ báo cáo hoặc chi nhánh…',
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
    case 'bc':
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
    (tab === 'overview' || tab === 'bc') &&
    filters.status !== 'all' &&
    !OVERVIEW_STATUSES.includes(filters.status)
  ) {
    return resetStatus
  }

  return filters
}
