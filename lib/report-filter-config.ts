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

const TAB_FIELDS: Record<ReportSectionTabId, FilterFieldKey[]> = {
  overview: [
    'dateFrom',
    'dateTo',
    'periodType',
    'year',
    'periodValue',
    'branch',
    'warehouse',
    'route',
    'staff',
    'opsCs',
    'keyword',
  ],
  sl: [
    'dateFrom',
    'dateTo',
    'periodType',
    'year',
    'periodValue',
    'branch',
    'warehouse',
    'route',
    'staff',
    'status',
    'keyword',
  ],
  cp: [
    'dateFrom',
    'dateTo',
    'periodType',
    'year',
    'periodValue',
    'branch',
    'warehouse',
    'route',
    'staff',
    'status',
    'keyword',
  ],
  efficiency: [
    'dateFrom',
    'dateTo',
    'periodType',
    'year',
    'periodValue',
    'branch',
    'warehouse',
    'route',
    'staff',
    'status',
    'keyword',
  ],
}

const TAB_LABELS: Record<ReportSectionTabId, string> = {
  overview: 'Tổng quan',
  sl: 'Sản lượng',
  cp: 'Chi phí',
  efficiency: 'Hiệu quả',
}

const TAB_SEARCH_PLACEHOLDER: Record<ReportSectionTabId, string> = {
  overview: 'Kỳ, khu vực, kho, tuyến, nhân sự…',
  sl: 'Kỳ, khu vực, kho, tuyến, nhân sự…',
  cp: 'Kỳ, khu vực, chi nhánh…',
  efficiency: 'Kỳ, khu vực, nhân sự…',
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

export function isEfficiencyStatus(
  status: FilterStatus,
): status is EfficiencyFilterStatus | 'all' {
  return status === 'all' || status === 'has_revenue' || status === 'no_revenue' || status === 'anomaly'
}

export function sanitizeFiltersForTab(filters: ReportFilters, tab: ReportSectionTabId): ReportFilters {
  const next = { ...filters, status: 'all' as FilterStatus }

  if (tab === 'sl' && filters.status !== 'all' && !SL_STATUSES.includes(filters.status as SLStatus)) {
    return next
  }
  if (tab === 'cp' && filters.status !== 'all' && !CP_STATUSES.includes(filters.status as CPStatus)) {
    return next
  }
  if (
    tab === 'efficiency' &&
    filters.status !== 'all' &&
    filters.status !== 'has_revenue' &&
    filters.status !== 'no_revenue' &&
    filters.status !== 'anomaly'
  ) {
    return next
  }

  if (tab === 'overview') {
    return { ...filters, status: 'all' }
  }

  return filters
}
