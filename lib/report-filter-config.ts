import type { ReportSectionTabId } from '@/components/report/report-section-tabs'
import type { CPStatus, FilterStatus, ReportFilters, SLStatus } from './report-mock-data'

export type FilterFieldKey =
  | 'dateFrom'
  | 'dateTo'
  | 'periodType'
  | 'year'
  | 'periodValue'
  | 'branch'
  | 'warehouse'
  | 'route'
  | 'staff'
  | 'opsCs'
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

export type EfficiencyFilterStatus = 'has_revenue' | 'no_revenue' | 'anomaly'

/** Bộ lọc mặc định: kỳ, khu vực, kho, tuyến, nhân sự giao nhận, trạng thái, CS/OPS phụ trách. */
export const DEFAULT_FILTER_FIELD_KEYS: FilterFieldKey[] = [
  'periodType',
  'year',
  'periodValue',
  'branch',
  'warehouse',
  'route',
  'staff',
  'status',
  'opsCs',
]

const TAB_FIELDS: Record<ReportSectionTabId, FilterFieldKey[]> = {
  overview: DEFAULT_FILTER_FIELD_KEYS,
  sl: DEFAULT_FILTER_FIELD_KEYS,
  cp: DEFAULT_FILTER_FIELD_KEYS,
  efficiency: DEFAULT_FILTER_FIELD_KEYS,
}

const TAB_LABELS: Record<ReportSectionTabId, string> = {
  overview: 'Tổng quan',
  sl: 'Sản lượng',
  cp: 'Chi phí',
  efficiency: 'Hiệu quả',
}

const TAB_SEARCH_PLACEHOLDER: Record<ReportSectionTabId, string> = {
  overview: 'Kỳ, khu vực, kho, tuyến, nhân sự giao nhận…',
  sl: 'Kỳ, khu vực, kho, tuyến, nhân sự giao nhận…',
  cp: 'Kỳ, khu vực, kho, tuyến, nhân sự giao nhận…',
  efficiency: 'Kỳ, khu vực, kho, tuyến, nhân sự giao nhận…',
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
    case 'efficiency':
    case 'overview':
      return [
        all,
        { id: 'has_revenue' as FilterStatus, label: 'Có doanh thu' },
        { id: 'no_revenue' as FilterStatus, label: 'Chưa có doanh thu' },
        { id: 'anomaly' as FilterStatus, label: 'Dữ liệu bất thường' },
      ]
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

export function isOperationalFilterStatus(
  status: FilterStatus,
): status is EfficiencyFilterStatus | 'all' {
  return status === 'all' || status === 'has_revenue' || status === 'no_revenue' || status === 'anomaly'
}

export function isEfficiencyStatus(status: FilterStatus): status is EfficiencyFilterStatus | 'all' {
  return isOperationalFilterStatus(status)
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
    (tab === 'efficiency' || tab === 'overview') &&
    filters.status !== 'all' &&
    !isOperationalFilterStatus(filters.status)
  ) {
    return resetStatus
  }

  return filters
}
