'use client'

import { useMemo } from 'react'
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
import { FilterMonthPicker, FilterYearPicker } from './filter-period-pickers'
import {
  getFilterFieldsForTab,
  getFilterPanelTitle,
  getSearchPlaceholder,
  getStatusOptionsForTab,
  patchMonthForBcWeek,
  patchYearForBcTab,
} from '@/lib/report-filter-config'
import { bcWeekOptionsForMonth, monthsForYear, weeksForYear } from '@/lib/report-mock-data'
import type { ReportSectionTabId } from '@/components/report/report-section-tabs'
import { reportButtonClass } from './report-button-chrome'
import { FilterSelect } from './filter-select'
import { FilterField, FilterKeywordSearch } from './filter-fields'

const PERIOD_OPTIONS: { id: PeriodType; label: string }[] = [
  { id: 'week', label: 'Tuần' },
  { id: 'month', label: 'Tháng' },
]

const MIN_YEAR = YEARS[0]!
const MAX_YEAR = YEARS[YEARS.length - 1]!

const BRANCH_OPTIONS: { id: BranchCode | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  ...BRANCHES.map((b) => ({ id: b, label: b })),
]

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

  const weekOptions = useMemo(() => {
    const weeks =
      activeTab === 'bcWeek'
        ? bcWeekOptionsForMonth(filters.year, filters.month)
        : weeksForYear(filters.year)
    return weeks.map((w) => ({ id: w, label: w }))
  }, [activeTab, filters.year, filters.month])

  const monthLabels = useMemo(() => monthsForYear(filters.year), [filters.year])

  const periodWeekOptions = useMemo(
    () => WEEKS.filter((w) => w.endsWith(`/${String(filters.year).slice(-2)}`)).map((w) => ({ id: w, label: w })),
    [filters.year],
  )

  const periodMonthOptions = useMemo(
    () => MONTHS.filter((m) => m.endsWith(`/${String(filters.year).slice(-2)}`)).map((m) => ({ id: m, label: m })),
    [filters.year],
  )

  const handleYearChange = (v: string) => {
    const year = Number(v)
    patch({ year, ...patchYearForBcTab(filters, year, activeTab) })
  }

  return (
    <ReportSurfaceCard className="mb-4 !p-0 shadow-none">
      <div className="report-filter-panel flex flex-col gap-3.5 px-5 pt-5 pb-6">
        <p className="text-xs font-medium leading-none text-gray-900">
          {getFilterPanelTitle(activeTab)}
        </p>
        <div className="flex flex-col gap-3">
          <div className="grid min-w-0 grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              <FilterYearPicker
                label="Năm"
                value={filters.year}
                minYear={MIN_YEAR}
                maxYear={MAX_YEAR}
                onChange={(year) => handleYearChange(String(year))}
              />
            </FilterField>
          )}
          {has('periodValue') &&
            (filters.periodType === 'week' ? (
              <FilterField label="Tuần">
                <FilterSelect
                  label="Tuần"
                  value={filters.week}
                  options={periodWeekOptions}
                  onChange={(v) => patch({ week: v })}
                />
              </FilterField>
            ) : (
              <FilterField label="Tháng">
                <FilterMonthPicker
                  label="Tháng"
                  value={filters.month}
                  months={periodMonthOptions.map((o) => o.id)}
                  onChange={(v) => patch({ month: v })}
                />
              </FilterField>
            ))}
          {has('month') && (
            <FilterField label="Tháng">
              <FilterMonthPicker
                label="Tháng"
                value={filters.month}
                months={monthLabels}
                onChange={(v) =>
                  patch(
                    activeTab === 'bcWeek'
                      ? patchMonthForBcWeek(filters, v)
                      : { month: v },
                  )
                }
              />
            </FilterField>
          )}
          {has('week') && (
            <FilterField label="Tuần">
              <FilterSelect
                label="Tuần"
                value={filters.week}
                options={weekOptions}
                onChange={(v) => patch({ week: v })}
              />
            </FilterField>
          )}
          {has('branch') && (
            <FilterField label="Chi nhánh">
              <FilterSelect
                label="Chi nhánh"
                value={filters.branch}
                options={BRANCH_OPTIONS}
                onChange={(v) => patch({ branch: v })}
              />
            </FilterField>
          )}
          </div>

          <div className="flex min-w-0 flex-wrap items-end gap-3 sm:flex-nowrap">
            {has('status') && statusOptions.length > 0 && (
              <FilterField label="Trạng thái" className="min-w-[9rem] shrink-0 sm:min-w-[10rem]">
                <FilterSelect
                  label="Trạng thái"
                  value={filters.status}
                  options={statusOptions}
                  onChange={(v) => patch({ status: v })}
                />
              </FilterField>
            )}
            {has('keyword') && (
              <FilterKeywordSearch
                value={filters.keyword}
                placeholder={getSearchPlaceholder(activeTab)}
                onChange={(v) => patch({ keyword: v })}
                className="min-w-0 w-full max-w-[16rem] shrink-0 sm:max-w-[20rem]"
              />
            )}
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap">
              <Button
                variant="primary"
                className={reportButtonClass('h-8 min-h-8 shrink-0 px-3 text-sm')}
                onPress={onSearch}
              >
                Tìm kiếm
              </Button>
              <Button
                variant="outline"
                className={reportButtonClass('h-8 min-h-8 shrink-0 px-3 text-sm')}
                onPress={onRefresh}
              >
                Đặt lại
              </Button>
              <Button
                variant="outline"
                className={reportButtonClass('h-8 min-h-8 shrink-0 px-3 text-sm')}
                onPress={onExport}
              >
                Xuất Excel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ReportSurfaceCard>
  )
}
