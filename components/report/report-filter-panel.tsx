'use client'

import { Button, Card } from '@heroui/react'
import {
  BRANCHES,
  MONTHS,
  WEEKS,
  YEARS,
  type BranchCode,
  type PeriodType,
  type ReportFilters,
} from '@/lib/report-mock-data'
import { OPS_CS_LIST, ROUTES, STAFF_LIST, WAREHOUSES } from '@/lib/report-dashboard-mock'
import {
  getFilterFieldsForTab,
  getFilterPanelTitle,
  getSearchPlaceholder,
  getStatusOptionsForTab,
} from '@/lib/report-filter-config'
import type { ReportSectionTabId } from '@/components/report/report-section-tabs'
import { FilterSelect } from './filter-select'
import { FilterDateInput, FilterField, FilterKeywordSearch } from './filter-fields'

const PERIOD_OPTIONS: { id: PeriodType; label: string }[] = [
  { id: 'week', label: 'Tuần' },
  { id: 'month', label: 'Tháng' },
]

const YEAR_OPTIONS = YEARS.map((y) => ({ id: String(y), label: String(y) }))
const WEEK_OPTIONS = WEEKS.map((w) => ({ id: w, label: w }))
const MONTH_OPTIONS = MONTHS.map((m) => ({ id: m, label: m }))
const REGION_OPTIONS: { id: BranchCode | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  ...BRANCHES.map((b) => ({ id: b, label: b })),
]
const ALL_OPTION = { id: 'all' as const, label: 'Tất cả' }
const WAREHOUSE_OPTIONS = [ALL_OPTION, ...WAREHOUSES.map((w) => ({ id: w, label: w }))]
const ROUTE_OPTIONS = [ALL_OPTION, ...ROUTES.map((r) => ({ id: r, label: r }))]
const STAFF_OPTIONS = [ALL_OPTION, ...STAFF_LIST.map((s) => ({ id: s, label: s }))]
const OPS_OPTIONS = [ALL_OPTION, ...OPS_CS_LIST.map((o) => ({ id: o, label: o }))]

interface ReportFilterPanelProps {
  activeTab: ReportSectionTabId
  filters: ReportFilters
  onChange: (next: ReportFilters) => void
  onSearch: () => void
  onRefresh: () => void
  onExport: () => void
}

export function ReportFilterPanel({
  activeTab,
  filters,
  onChange,
  onSearch,
  onRefresh,
  onExport,
}: ReportFilterPanelProps) {
  const patch = (partial: Partial<ReportFilters>) => onChange({ ...filters, ...partial })
  const fields = getFilterFieldsForTab(activeTab)
  const statusOptions = getStatusOptionsForTab(activeTab)
  const has = (key: (typeof fields)[number]) => fields.includes(key)

  const gridCols =
    fields.length <= 6
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'

  return (
    <Card className="mb-6 border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 px-4 py-4">
        <p className="text-sm font-semibold text-gray-900">{getFilterPanelTitle(activeTab)}</p>
        <div className="flex flex-col gap-4">
          <div className={`grid min-w-0 grid-cols-1 gap-x-4 gap-y-4 ${gridCols}`}>
            {has('dateFrom') && (
              <FilterDateInput
                label="Từ ngày"
                value={filters.dateFrom}
                onChange={(v) => patch({ dateFrom: v })}
              />
            )}
            {has('dateTo') && (
              <FilterDateInput
                label="Đến ngày"
                value={filters.dateTo}
                onChange={(v) => patch({ dateTo: v })}
              />
            )}
            {has('periodType') && (
              <FilterField label="Loại kỳ">
                <FilterSelect
                  label="Loại kỳ"
                  value={filters.periodType}
                  options={PERIOD_OPTIONS}
                  onChange={(v) => patch({ periodType: v })}
                />
              </FilterField>
            )}
            {has('year') && (
              <FilterField label="Năm">
                <FilterSelect
                  label="Năm"
                  value={String(filters.year)}
                  options={YEAR_OPTIONS}
                  onChange={(v) => patch({ year: Number(v) })}
                />
              </FilterField>
            )}
            {has('periodValue') &&
              (filters.periodType === 'week' ? (
                <FilterField label="Tuần">
                  <FilterSelect
                    label="Tuần"
                    value={filters.week}
                    options={WEEK_OPTIONS}
                    onChange={(v) => patch({ week: v })}
                  />
                </FilterField>
              ) : (
                <FilterField label="Tháng">
                  <FilterSelect
                    label="Tháng"
                    value={filters.month}
                    options={MONTH_OPTIONS}
                    onChange={(v) => patch({ month: v })}
                  />
                </FilterField>
              ))}
            {has('branch') && (
              <FilterField label="Khu vực">
                <FilterSelect
                  label="Khu vực"
                  value={filters.branch}
                  options={REGION_OPTIONS}
                  onChange={(v) => patch({ branch: v })}
                />
              </FilterField>
            )}
            {has('warehouse') && (
              <FilterField label="Kho">
                <FilterSelect
                  label="Kho"
                  value={filters.warehouse}
                  options={WAREHOUSE_OPTIONS}
                  onChange={(v) => patch({ warehouse: v })}
                />
              </FilterField>
            )}
            {has('route') && (
              <FilterField label="Tuyến">
                <FilterSelect
                  label="Tuyến"
                  value={filters.route}
                  options={ROUTE_OPTIONS}
                  onChange={(v) => patch({ route: v })}
                />
              </FilterField>
            )}
            {has('staff') && (
              <FilterField label="Nhân sự">
                <FilterSelect
                  label="Nhân sự"
                  value={filters.staff}
                  options={STAFF_OPTIONS}
                  onChange={(v) => patch({ staff: v })}
                />
              </FilterField>
            )}
            {has('opsCs') && (
              <FilterField label="OPS/CS">
                <FilterSelect
                  label="OPS/CS"
                  value={filters.opsCs}
                  options={OPS_OPTIONS}
                  onChange={(v) => patch({ opsCs: v })}
                />
              </FilterField>
            )}
            {has('status') && statusOptions.length > 0 && (
              <FilterField label="Trạng thái">
                <FilterSelect
                  label="Trạng thái"
                  value={filters.status}
                  options={statusOptions}
                  onChange={(v) => patch({ status: v })}
                />
              </FilterField>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:gap-2">
            {has('keyword') && (
              <FilterKeywordSearch
                value={filters.keyword}
                placeholder={getSearchPlaceholder(activeTab)}
                onChange={(v) => patch({ keyword: v })}
                className="min-w-0 w-full sm:max-w-md sm:flex-1 lg:max-w-lg"
              />
            )}
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button variant="primary" size="md" className="min-h-10 px-5" onPress={onSearch}>
                Tìm kiếm
              </Button>
              <Button variant="outline" size="md" className="min-h-10" onPress={onRefresh}>
                Đặt lại
              </Button>
              <Button variant="outline" size="md" className="min-h-10" onPress={onExport}>
                Xuất Excel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
