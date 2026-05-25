'use client'

import { useMemo } from 'react'
import { Switch } from '@heroui/react'
import { ReportSurfaceCard } from './report-card'
import { FilterDateInput, FilterField, FilterKeywordSearch } from './filter-fields'
import { FilterSelect } from './filter-select'
import { FilterMonthPicker, FilterYearPicker } from './filter-period-pickers'
import { FilterPanelActions } from './filter-panel-actions'
import {
  DEFAULT_OPERATING_COST_FILTERS,
  OP_COST_CUSTOMERS,
  OP_COST_DELIVERERS,
  OP_COST_HUBS,
  OP_COST_OPS_CS,
  OP_COST_REGIONS,
  OP_COST_ROUTES,
  OP_COST_WAREHOUSES,
  MONTHS,
  YEARS,
  type OperatingCostFilters,
  type OpCostLockStatus,
  type OpCostPeriodType,
} from '@/lib/operating-cost-mock-data'
import { monthsForYear, weeksForYear } from '@/lib/report-mock-data'

const PERIOD_OPTIONS: { id: OpCostPeriodType; label: string }[] = [
  { id: 'day', label: 'Ngày (Báo cáo ngày)' },
  { id: 'week', label: 'Tuần (Báo cáo tuần)' },
  { id: 'month', label: 'Tháng (Báo cáo tháng)' },
]

const LOCK_OPTIONS: { id: OpCostLockStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả trạng thái' },
  { id: 'tam_tinh', label: 'Tạm tính' },
  { id: 'da_khoa', label: 'Đã khóa' },
  { id: 'can_kiem_tra', label: 'Cần kiểm tra' },
]

const CHART_GROUP_OPTIONS: { id: OperatingCostFilters['chartGroupBy']; label: string }[] = [
  { id: 'day', label: 'Theo ngày' },
  { id: 'week', label: 'Theo tuần' },
  { id: 'region', label: 'Theo khu vực' },
]

const MIN_YEAR = YEARS[0]!
const MAX_YEAR = YEARS[YEARS.length - 1]!

export function OperatingCostFilterPanel({
  filters,
  onChange,
  onSearch,
  onRefresh,
  onExport,
}: {
  filters: OperatingCostFilters
  onChange: (next: OperatingCostFilters) => void
  onSearch: () => void
  onRefresh: () => void
  onExport: () => void
}) {
  const patch = (partial: Partial<OperatingCostFilters>) => onChange({ ...filters, ...partial })
  const monthLabels = useMemo(() => monthsForYear(filters.year), [filters.year])
  const weekOptions = useMemo(
    () => weeksForYear(filters.year).map((w) => ({ id: w, label: w })),
    [filters.year],
  )

  const regionOptions = [{ id: 'all' as const, label: 'Tất cả khu vực' }, ...OP_COST_REGIONS.map((r) => ({ id: r.id, label: r.label }))]
  const opt = (all: string, items: string[]) => [
    { id: 'all' as const, label: all },
    ...items.map((x) => ({ id: x, label: x })),
  ]

  return (
    <ReportSurfaceCard className="mb-4 !p-0 shadow-none">
      <div className="report-filter-panel flex flex-col gap-3.5 px-5 pt-5 pb-6">
        <p className="text-xs font-medium leading-none text-gray-900">
          Bộ lọc - Báo cáo chi phí vận hành
        </p>
        <div className="grid min-w-0 grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <FilterField label="Loại kỳ">
            <FilterSelect
              label="Loại kỳ"
              value={filters.periodType}
              options={PERIOD_OPTIONS}
              onChange={(periodType) => patch({ periodType })}
            />
          </FilterField>
          <FilterField label="Năm">
            <FilterYearPicker
              label="Năm"
              value={filters.year}
              minYear={MIN_YEAR}
              maxYear={MAX_YEAR}
              onChange={(year) => {
                const months = monthsForYear(year)
                const weeks = weeksForYear(year)
                patch({
                  year,
                  month: months.includes(filters.month) ? filters.month : months[0] ?? filters.month,
                  week: weeks.includes(filters.week) ? filters.week : weeks[0] ?? filters.week,
                })
              }}
            />
          </FilterField>
          {filters.periodType === 'week' && (
            <FilterField label="Tuần">
              <FilterSelect label="Tuần" value={filters.week} options={weekOptions} onChange={(week) => patch({ week })} />
            </FilterField>
          )}
          {filters.periodType === 'month' && (
            <FilterField label="Tháng">
              <FilterMonthPicker
                label="Tháng"
                value={filters.month}
                months={monthLabels.length ? monthLabels : [...MONTHS]}
                onChange={(month) => patch({ month })}
              />
            </FilterField>
          )}
          {filters.periodType === 'day' && (
            <>
              <FilterDateInput
                label="Từ ngày"
                value={filters.dateFrom}
                onChange={(dateFrom) => patch({ dateFrom })}
              />
              <FilterDateInput
                label="Đến ngày"
                value={filters.dateTo}
                onChange={(dateTo) => patch({ dateTo })}
              />
            </>
          )}
          <FilterField label="Khu vực / Hub">
            <FilterSelect label="Khu vực" value={filters.region} options={regionOptions} onChange={(region) => patch({ region })} />
          </FilterField>
          <FilterField label="Hub">
            <FilterSelect label="Hub" value={filters.hub} options={opt('Tất cả Hub', OP_COST_HUBS)} onChange={(hub) => patch({ hub })} />
          </FilterField>
          <FilterField label="Khách hàng">
            <FilterSelect
              label="Khách hàng"
              value={filters.customer}
              options={opt('Tất cả khách hàng', OP_COST_CUSTOMERS)}
              onChange={(customer) => patch({ customer })}
            />
          </FilterField>
          <FilterField label="Kho">
            <FilterSelect
              label="Kho"
              value={filters.warehouse}
              options={opt('Tất cả kho', OP_COST_WAREHOUSES)}
              onChange={(warehouse) => patch({ warehouse })}
            />
          </FilterField>
          <FilterField label="Tuyến">
            <FilterSelect label="Tuyến" value={filters.route} options={opt('Tất cả tuyến', OP_COST_ROUTES)} onChange={(route) => patch({ route })} />
          </FilterField>
          <FilterField label="Tên giao nhận">
            <FilterSelect
              label="Tên giao nhận"
              value={filters.deliverer}
              options={opt('Tất cả giao nhận', OP_COST_DELIVERERS)}
              onChange={(deliverer) => patch({ deliverer })}
            />
          </FilterField>
          <FilterField label="CS/OPS">
            <FilterSelect label="CS/OPS" value={filters.opsCs} options={opt('Tất cả CS/OPS', OP_COST_OPS_CS)} onChange={(opsCs) => patch({ opsCs })} />
          </FilterField>
          <FilterField label="Trạng thái chốt">
            <FilterSelect
              label="Trạng thái chốt"
              value={filters.lockStatus}
              options={LOCK_OPTIONS}
              onChange={(lockStatus) => patch({ lockStatus })}
            />
          </FilterField>
          <FilterField label="Nhóm biểu đồ">
            <FilterSelect
              label="Nhóm biểu đồ"
              value={filters.chartGroupBy}
              options={CHART_GROUP_OPTIONS}
              onChange={(chartGroupBy) => patch({ chartGroupBy })}
            />
          </FilterField>
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
          <FilterKeywordSearch
            value={filters.keyword}
            onChange={(keyword) => patch({ keyword })}
            placeholder="Tìm giao nhận, khách hàng, kho, tuyến…"
            className="min-w-0 flex-1 sm:max-w-xl"
          />
          <FilterPanelActions
            compact
            onSearch={onSearch}
            onRefresh={onRefresh}
            onExport={onExport}
          />
        </div>
      </div>
    </ReportSurfaceCard>
  )
}
