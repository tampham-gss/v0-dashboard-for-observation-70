'use client'

import { Button } from '@heroui/react'
import { ReportSurfaceCard } from './report-card'
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
import { cn } from '@/lib/utils'
import { reportButtonClass } from './report-button-chrome'
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

  const keywordColSpan = 'sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2'
  const actionsColSpan = has('keyword')
    ? 'sm:col-span-2 lg:col-span-1 xl:col-span-2 2xl:col-span-3'
    : 'col-span-full sm:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-5'

  return (
    <ReportSurfaceCard className="mb-4 !p-0 shadow-none">
      <div className="report-filter-panel flex flex-col gap-3.5 px-5 pt-5 pb-6">
        <p className="text-xs font-semibold leading-none text-gray-900">
          {getFilterPanelTitle(activeTab)}
        </p>
        <div className={`grid min-w-0 grid-cols-1 items-end gap-3 ${gridCols}`}>
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
                <FilterField label="Kỳ">
                  <FilterSelect
                    label="Kỳ"
                    value={filters.week}
                    options={WEEK_OPTIONS}
                    onChange={(v) => patch({ week: v })}
                  />
                </FilterField>
              ) : (
                <FilterField label="Kỳ">
                  <FilterSelect
                    label="Kỳ"
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
              <FilterField label="Nhân sự giao nhận">
                <FilterSelect
                  label="Nhân sự giao nhận"
                  value={filters.staff}
                  options={STAFF_OPTIONS}
                  onChange={(v) => patch({ staff: v })}
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
            {has('opsCs') && (
              <FilterField label="CS/OPS phụ trách">
                <FilterSelect
                  label="CS/OPS phụ trách"
                  value={filters.opsCs}
                  options={OPS_OPTIONS}
                  onChange={(v) => patch({ opsCs: v })}
                />
              </FilterField>
            )}
          {has('keyword') && (
            <FilterKeywordSearch
              value={filters.keyword}
              placeholder={getSearchPlaceholder(activeTab)}
              onChange={(v) => patch({ keyword: v })}
              className={cn('min-w-0 w-full', keywordColSpan)}
            />
          )}
          <div className={cn('flex min-w-0 flex-wrap items-end gap-3', actionsColSpan)}>
            <Button
              variant="primary"
              className={reportButtonClass('h-8 min-h-8 px-3 text-sm')}
              onPress={onSearch}
            >
              Tìm kiếm
            </Button>
            <Button
              variant="outline"
              className={reportButtonClass('h-8 min-h-8 px-3 text-sm')}
              onPress={onRefresh}
            >
              Đặt lại
            </Button>
            <Button
              variant="outline"
              className={reportButtonClass('h-8 min-h-8 px-3 text-sm')}
              onPress={onExport}
            >
              Xuất Excel
            </Button>
          </div>
        </div>
      </div>
    </ReportSurfaceCard>
  )
}
