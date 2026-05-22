'use client'

import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { ReportSurfaceCard } from './report-card'
import {
  BRANCHES,
  YEARS,
  bcWeekOptionsForMonth,
  weeksForYear,
  type BranchCode,
  type PeriodType,
  type ReportFilters,
} from '@/lib/report-mock-data'
import { formatWeekFilterLabel, formatWeekFilterShort } from '@/lib/report-week-range'
import { FilterMonthPicker, FilterYearPicker } from './filter-period-pickers'
import {
  getFilterFieldsForTab,
  getFilterPanelTitle,
  getStatusOptionsForTab,
  patchMonthForBcWeek,
  patchYearForBcTab,
  type FilterFieldKey,
} from '@/lib/report-filter-config'
import {
  REPORT_DELIVERERS,
  REPORT_OPS_CS,
  REPORT_ROUTES,
  REPORT_WAREHOUSES,
  reportFilterSelectOptions,
} from '@/lib/report-filter-options'
import { monthsForYear } from '@/lib/report-mock-data'
import type { ReportSectionTabId } from '@/components/report/report-section-tabs'
import { cn } from '@/lib/utils'
import { FilterSelect } from './filter-select'
import { FilterField } from './filter-fields'
import { FilterPanelActions } from './filter-panel-actions'

const BC_COMPACT_TABS: ReportSectionTabId[] = ['bcWeek', 'bcMonth']
const BC_COMPACT_FILTER_KEYS: FilterFieldKey[] = ['year', 'month', 'branch', 'status']

const PERIOD_OPTIONS: { id: PeriodType; label: string }[] = [
  { id: 'week', label: 'Tuần' },
  { id: 'month', label: 'Tháng' },
]

const MIN_YEAR = YEARS[0]!
const MAX_YEAR = YEARS[YEARS.length - 1]!

const BRANCH_OPTIONS: { id: BranchCode | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả khu vực' },
  ...BRANCHES.map((b) => ({ id: b, label: b })),
]

const WAREHOUSE_OPTIONS = reportFilterSelectOptions('Tất cả kho', REPORT_WAREHOUSES)
const ROUTE_OPTIONS = reportFilterSelectOptions('Tất cả tuyến', REPORT_ROUTES)
const STAFF_OPTIONS = reportFilterSelectOptions('Tất cả giao nhận', REPORT_DELIVERERS)
const OPS_CS_OPTIONS = reportFilterSelectOptions('Tất cả CS/OPS', REPORT_OPS_CS)

/** Hàng 1: kỳ & khu vực. Hàng 2: kho, tuyến, nhân sự, trạng thái & nút. */
const FILTER_ROW1_KEYS: FilterFieldKey[] = [
  'periodType',
  'year',
  'week',
  'month',
  'branch',
]
const FILTER_ROW2_KEYS: FilterFieldKey[] = [
  'warehouse',
  'route',
  'staff',
  'opsCs',
  'status',
]

function filterRowGridTemplate(cols: number): string {
  if (cols <= 1) return 'minmax(0, 1fr)'
  if (cols === 5) {
    return 'minmax(5.5rem,0.85fr) minmax(6.5rem,0.9fr) minmax(4.5rem,0.75fr) minmax(7.5rem,1fr) minmax(5.5rem,0.85fr)'
  }
  if (cols === 6) {
    return 'minmax(5rem,0.8fr) minmax(5.5rem,0.85fr) minmax(4.5rem,0.7fr) minmax(5.5rem,0.85fr) minmax(4.5rem,0.75fr) minmax(0,1.4fr)'
  }
  return `repeat(${cols}, minmax(0, 1fr))`
}

function FilterPanelRow({
  cols,
  children,
}: {
  cols: number
  children: ReactNode
}) {
  return (
    <div
      className="filter-panel-row grid w-full min-w-0 items-end gap-3"
      style={{ gridTemplateColumns: filterRowGridTemplate(cols) }}
    >
      {children}
    </div>
  )
}

function FilterPanelCell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('filter-panel-cell min-w-0 overflow-hidden', className)}>
      {children}
    </div>
  )
}

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
  const has = (key: FilterFieldKey) => fields.includes(key)
  const isBcCompactTab = BC_COMPACT_TABS.includes(activeTab)
  const showWeekPicker =
    has('week') && filters.periodType === 'week' && !filters.bcWeekByMonth

  const monthLabels = useMemo(() => monthsForYear(filters.year), [filters.year])

  const weekIds = useMemo(() => {
    if (!showWeekPicker) return []
    if (has('month') && filters.month) {
      const inMonth = bcWeekOptionsForMonth(filters.year, filters.month)
      if (inMonth.length > 0) return inMonth
    }
    return weeksForYear(filters.year)
  }, [showWeekPicker, filters.year, filters.month, fields])

  const weekOptions = useMemo(
    () =>
      weekIds.map((w) => ({
        id: w,
        label: formatWeekFilterLabel(w, filters.year, filters.month),
      })),
    [weekIds, filters.year, filters.month],
  )

  const selectedWeekShort = useMemo(
    () => formatWeekFilterShort(filters.week),
    [filters.week],
  )

  const selectedWeekTitle = useMemo(
    () => formatWeekFilterLabel(filters.week, filters.year, filters.month),
    [filters.week, filters.year, filters.month],
  )

  const row1Count = useMemo(() => {
    let n = 0
    for (const key of FILTER_ROW1_KEYS) {
      if (!has(key)) continue
      if (key === 'week' && !showWeekPicker) continue
      n++
    }
    return n
  }, [fields, showWeekPicker])

  const row2Count = useMemo(() => {
    let n = 0
    for (const key of FILTER_ROW2_KEYS) {
      if (has(key)) n++
    }
    return n + 1
  }, [fields])

  const handleYearChange = (year: number) => {
    patch({ year, ...patchYearForBcTab(filters, year, activeTab) })
  }

  const handlePeriodTypeChange = (periodType: PeriodType) => {
    const weeks = weeksForYear(filters.year)
    patch({
      periodType,
      bcWeekByMonth: periodType === 'week' && activeTab === 'bcWeek',
      week: weeks.includes(filters.week) ? filters.week : (weeks[0] ?? filters.week),
    })
  }

  const renderField = (key: FilterFieldKey): ReactNode => {
    switch (key) {
      case 'periodType':
        if (!has('periodType')) return null
        return (
          <FilterField key={key} label="Loại kỳ" className="min-w-0">
            <FilterSelect
              label="Loại kỳ"
              value={filters.periodType}
              options={PERIOD_OPTIONS}
              onChange={handlePeriodTypeChange}
            />
          </FilterField>
        )
      case 'year':
        if (!has('year')) return null
        return (
          <FilterField key={key} label="Năm" className="min-w-0">
            <FilterYearPicker
              label="Năm"
              value={filters.year}
              minYear={MIN_YEAR}
              maxYear={MAX_YEAR}
              onChange={handleYearChange}
            />
          </FilterField>
        )
      case 'week':
        if (!showWeekPicker) return null
        return (
          <FilterField key={key} label="Tuần" className="min-w-0">
            <FilterSelect
              label="Tuần"
              value={filters.week}
              options={weekOptions}
              displayValue={selectedWeekShort}
              triggerTitle={selectedWeekTitle}
              popoverClassName="!min-w-[17rem]"
              onChange={(week) => patch({ week })}
            />
          </FilterField>
        )
      case 'month':
        if (!has('month')) return null
        return (
          <FilterField key={key} label="Tháng" className="min-w-0">
            <FilterMonthPicker
              label="Tháng"
              value={filters.month}
              months={monthLabels}
              onChange={(month) => {
                const monthsWeeks = bcWeekOptionsForMonth(filters.year, month)
                patch({
                  ...patchMonthForBcWeek(month),
                  month,
                  week: monthsWeeks.includes(filters.week)
                    ? filters.week
                    : (monthsWeeks[0] ?? filters.week),
                })
              }}
            />
          </FilterField>
        )
      case 'branch':
        if (!has('branch')) return null
        return (
          <FilterField key={key} label="Khu vực" className="min-w-0">
            <FilterSelect
              label="Khu vực"
              value={filters.branch}
              options={BRANCH_OPTIONS}
              onChange={(v) => patch({ branch: v })}
            />
          </FilterField>
        )
      case 'warehouse':
        if (!has('warehouse')) return null
        return (
          <FilterField key={key} label="Kho" className="min-w-0">
            <FilterSelect
              label="Kho"
              value={filters.warehouse}
              options={WAREHOUSE_OPTIONS}
              onChange={(v) => patch({ warehouse: v })}
            />
          </FilterField>
        )
      case 'route':
        if (!has('route')) return null
        return (
          <FilterField key={key} label="Tuyến" className="min-w-0">
            <FilterSelect
              label="Tuyến"
              value={filters.route}
              options={ROUTE_OPTIONS}
              onChange={(v) => patch({ route: v })}
            />
          </FilterField>
        )
      case 'staff':
        if (!has('staff')) return null
        return (
          <FilterField key={key} label="Giao nhận" className="min-w-0">
            <FilterSelect
              label="Giao nhận"
              value={filters.staff}
              options={STAFF_OPTIONS}
              onChange={(v) => patch({ staff: v })}
            />
          </FilterField>
        )
      case 'opsCs':
        if (!has('opsCs')) return null
        return (
          <FilterField key={key} label="CS / OPS" className="min-w-0">
            <FilterSelect
              label="CS / OPS"
              value={filters.opsCs}
              options={OPS_CS_OPTIONS}
              onChange={(v) => patch({ opsCs: v })}
            />
          </FilterField>
        )
      case 'status':
        if (!has('status') || statusOptions.length === 0) return null
        return (
          <FilterField key={key} label="Trạng thái" className="min-w-0">
            <FilterSelect
              label="Trạng thái"
              value={filters.status}
              options={statusOptions}
              onChange={(v) => patch({ status: v })}
            />
          </FilterField>
        )
      default:
        return null
    }
  }

  const wrapCells = (nodes: ReactNode[]) =>
    nodes.map((node, i) => (node ? <FilterPanelCell key={`f-${i}`}>{node}</FilterPanelCell> : null))

  const row1Fields = wrapCells(FILTER_ROW1_KEYS.map(renderField).filter(Boolean))
  const row2Fields = [
    ...wrapCells(FILTER_ROW2_KEYS.map(renderField).filter(Boolean)),
    <FilterPanelCell key="actions">
      <FilterPanelActions compact onSearch={onSearch} onRefresh={onRefresh} onExport={onExport} />
    </FilterPanelCell>,
  ]

  const bcCompactFields = BC_COMPACT_FILTER_KEYS.map(renderField)
    .filter(Boolean)
    .map((node, i) => (
      <FilterPanelCell key={`bc-${i}`} className="flex-[1_1_0%] basis-0">
        {node}
      </FilterPanelCell>
    ))

  return (
    <ReportSurfaceCard className="mb-4 !p-0 shadow-none">
      <div className="report-filter-panel flex flex-col gap-3.5 px-5 pt-5 pb-6">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium leading-none text-gray-900">
            {getFilterPanelTitle(activeTab)}
          </p>
          {(activeTab === 'overview' || activeTab === 'sl' || activeTab === 'cp') && (
            <p className="text-[11px] text-gray-500">
              Không lọc Hub / Khách hàng
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {isBcCompactTab ? (
            <div className="flex w-full min-w-0 flex-nowrap items-end gap-3">
              {bcCompactFields}
              <div className="ml-auto shrink-0">
                <FilterPanelActions
                  compact
                  onSearch={onSearch}
                  onRefresh={onRefresh}
                  onExport={onExport}
                />
              </div>
            </div>
          ) : (
            <>
              {row1Count > 0 && (
                <FilterPanelRow cols={row1Count}>{row1Fields}</FilterPanelRow>
              )}
              {row2Count > 0 && (
                <FilterPanelRow cols={row2Count}>{row2Fields}</FilterPanelRow>
              )}
            </>
          )}
        </div>
      </div>
    </ReportSurfaceCard>
  )
}
