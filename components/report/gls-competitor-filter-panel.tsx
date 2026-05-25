'use client'

import { useMemo } from 'react'
import { ReportSurfaceCard } from './report-card'
import { FilterField, FilterKeywordSearch } from './filter-fields'
import { FilterSelect } from './filter-select'
import { FilterMonthPicker, FilterYearPicker } from './filter-period-pickers'
import { FilterPanelActions } from './filter-panel-actions'
import {
  CONT_TYPE_OPTIONS,
  GLS_COMPETITOR_CATALOG,
  GLS_CUSTOMERS,
  GLS_RECORDERS,
  GLS_REGIONS,
  GLS_ROUTES,
  GLS_WAREHOUSES,
  MONTHS,
  YEARS,
  type GlsCompetitorFilters,
  type GlsCompetitorPeriodType,
} from '@/lib/gls-competitor-mock-data'
import { monthsForYear, weeksForYear } from '@/lib/report-mock-data'

const PERIOD_OPTIONS: { id: GlsCompetitorPeriodType; label: string }[] = [
  { id: 'week', label: 'Tuần' },
  { id: 'month', label: 'Tháng' },
]

const CHART_GROUP_OPTIONS: { id: GlsCompetitorFilters['chartGroupBy']; label: string }[] = [
  { id: 'day', label: 'Theo ngày' },
  { id: 'week', label: 'Theo tuần' },
  { id: 'region', label: 'Theo khu vực' },
]

const MIN_YEAR = YEARS[0]!
const MAX_YEAR = YEARS[YEARS.length - 1]!

const FILTER_ROW_CLASS =
  'grid w-full min-w-0 grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

const FILTER_ACTION_ROW_CLASS =
  'grid w-full min-w-0 grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(17rem,1.15fr)_auto]'

export function GlsCompetitorFilterPanel({
  filters,
  onChange,
  onSearch,
  onRefresh,
  onExport,
}: {
  filters: GlsCompetitorFilters
  onChange: (next: GlsCompetitorFilters) => void
  onSearch: () => void
  onRefresh: () => void
  onExport: () => void
}) {
  const patch = (partial: Partial<GlsCompetitorFilters>) => onChange({ ...filters, ...partial })

  const monthLabels = useMemo(() => monthsForYear(filters.year), [filters.year])
  const weekOptions = useMemo(
    () => weeksForYear(filters.year).map((w) => ({ id: w, label: w })),
    [filters.year],
  )

  const regionOptions = [{ id: 'all' as const, label: 'Tất cả khu vực' }, ...GLS_REGIONS]
  const competitorOptions = [
    { id: 'all' as const, label: 'Tất cả đối thủ' },
    ...GLS_COMPETITOR_CATALOG,
  ]
  const customerOptions = [
    { id: 'all' as const, label: 'Tất cả khách hàng' },
    ...GLS_CUSTOMERS.map((c) => ({ id: c, label: c })),
  ]
  const warehouseOptions = [
    { id: 'all' as const, label: 'Tất cả kho' },
    ...GLS_WAREHOUSES.map((w) => ({ id: w, label: w })),
  ]
  const routeOptions = [
    { id: 'all' as const, label: 'Tất cả tuyến' },
    ...GLS_ROUTES.map((r) => ({ id: r, label: r })),
  ]
  const recorderOptions = [
    { id: 'all' as const, label: 'Tất cả người ghi nhận' },
    ...GLS_RECORDERS.map((r) => ({ id: r, label: r })),
  ]

  return (
    <ReportSurfaceCard className="mb-4 !p-0 shadow-none">
      <div className="report-filter-panel flex flex-col gap-3.5 px-5 pt-5 pb-6">
        <p className="text-xs font-medium leading-none text-gray-900">
          Bộ lọc · So sánh sản lượng GLS và đối thủ
        </p>

        <div className="flex flex-col gap-3">
          {/* Hàng 1: kỳ */}
          <div className={FILTER_ROW_CLASS}>
            <FilterField label="Loại kỳ" className="min-w-0">
              <FilterSelect
                label="Loại kỳ"
                value={filters.periodType}
                options={PERIOD_OPTIONS}
                onChange={(periodType) => patch({ periodType })}
              />
            </FilterField>
            <FilterField label="Năm" className="min-w-0">
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
            {filters.periodType === 'week' ? (
              <FilterField label="Tuần" className="min-w-0">
                <FilterSelect
                  label="Tuần"
                  value={filters.week}
                  options={weekOptions}
                  onChange={(week) => patch({ week })}
                />
              </FilterField>
            ) : (
              <FilterField label="Tháng" className="min-w-0">
                <FilterMonthPicker
                  label="Tháng"
                  value={filters.month}
                  months={monthLabels.length ? monthLabels : [...MONTHS]}
                  onChange={(month) => patch({ month })}
                />
              </FilterField>
            )}
            <FilterField label="Khu vực" className="min-w-0">
              <FilterSelect
                label="Khu vực"
                value={filters.region}
                options={regionOptions}
                onChange={(region) => patch({ region })}
              />
            </FilterField>
          </div>

          {/* Hàng 2: phạm vi + nhóm biểu đồ */}
          <div className={FILTER_ROW_CLASS}>
            <FilterField label="Loại container" className="min-w-0">
              <FilterSelect
                label="Loại container"
                value={filters.contType}
                options={CONT_TYPE_OPTIONS}
                onChange={(contType) => patch({ contType })}
              />
            </FilterField>
            <FilterField label="Khách hàng" className="min-w-0">
              <FilterSelect
                label="Khách hàng"
                value={filters.customer}
                options={customerOptions}
                onChange={(customer) => patch({ customer })}
              />
            </FilterField>
            <FilterField label="Kho" className="min-w-0">
              <FilterSelect
                label="Kho"
                value={filters.warehouse}
                options={warehouseOptions}
                onChange={(warehouse) => patch({ warehouse })}
              />
            </FilterField>
            <FilterField label="Nhóm biểu đồ" className="min-w-0">
              <FilterSelect
                label="Nhóm biểu đồ"
                value={filters.chartGroupBy}
                options={CHART_GROUP_OPTIONS}
                onChange={(chartGroupBy) => patch({ chartGroupBy })}
              />
            </FilterField>
          </div>

          {/* Hàng 3: căn đều 3 ô chọn + từ khóa + cụm nút */}
          <div className={FILTER_ACTION_ROW_CLASS}>
            <FilterField label="Tuyến" className="min-w-0">
              <FilterSelect
                label="Tuyến"
                value={filters.route}
                options={routeOptions}
                onChange={(route) => patch({ route })}
              />
            </FilterField>
            <FilterField label="Đối thủ" className="min-w-0">
              <FilterSelect
                label="Đối thủ"
                value={filters.competitor}
                options={competitorOptions}
                onChange={(competitor) => patch({ competitor })}
              />
            </FilterField>
            <FilterField label="Người ghi nhận" className="min-w-0">
              <FilterSelect
                label="Người ghi nhận"
                value={filters.recorder}
                options={recorderOptions}
                onChange={(recorder) => patch({ recorder })}
              />
            </FilterField>
            <FilterKeywordSearch
              value={filters.keyword}
              onChange={(keyword) => patch({ keyword })}
              placeholder="Tìm mã nguồn"
              className="min-w-0 w-full"
            />
            <div className="flex w-full min-w-0 justify-start xl:justify-end">
              <FilterPanelActions
                compact
                onSearch={onSearch}
                onRefresh={onRefresh}
                onExport={onExport}
              />
            </div>
          </div>
        </div>
      </div>
    </ReportSurfaceCard>
  )
}
