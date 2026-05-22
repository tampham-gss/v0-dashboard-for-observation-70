'use client'

import type { ComponentProps } from 'react'
import { useMemo, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { FILTER_CONTROL_INDICATOR_CLASS, FILTER_CONTROL_TRIGGER_CLASS } from './filter-select'

const MONTH_SHORT = [
  'T1',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
  'T8',
  'T9',
  'T10',
  'T11',
  'T12',
] as const

function parseMonthLabel(month: string): { monthNum: number; year: number } {
  const [mm, yy] = month.split('/')
  const year = yy.length === 2 ? 2000 + Number(yy) : Number(yy)
  return { monthNum: Number(mm), year }
}

function formatMonthLabel(monthNum: number, year: number): string {
  return `${String(monthNum).padStart(2, '0')}/${String(year).slice(-2)}`
}

function monthDisplayLabel(month: string): string {
  const { monthNum, year } = parseMonthLabel(month)
  return `Tháng ${String(monthNum).padStart(2, '0')}/${year}`
}

const FilterPeriodPickerTrigger = ({
  label,
  displayValue,
  open,
  ...props
}: {
  label: string
  displayValue: string
  open: boolean
} & ComponentProps<'button'>) => {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        FILTER_CONTROL_TRIGGER_CLASS,
        'w-full min-w-0 cursor-pointer text-left',
        open && 'ring-2 ring-blue-500/30',
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate text-sm text-gray-900">{displayValue}</span>
      <Calendar className={cn(FILTER_CONTROL_INDICATOR_CLASS, 'size-4')} aria-hidden />
    </button>
  )
}

const PERIOD_ITEM_SELECTED_CLASS = 'bg-blue-600 text-white shadow-sm'
const PERIOD_ITEM_BASE_CLASS =
  'flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-colors'

/** Chọn năm — lưới 3 cột, ô chọn dạng chữ nhật (đồng bộ month picker). */
export function FilterYearPicker({
  label,
  value,
  minYear,
  maxYear,
  onChange,
}: {
  label: string
  value: number
  minYear: number
  maxYear: number
  onChange: (year: number) => void
}) {
  const [open, setOpen] = useState(false)
  const years = useMemo(() => {
    const list: number[] = []
    for (let y = minYear; y <= maxYear; y++) list.push(y)
    return list
  }, [minYear, maxYear])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FilterPeriodPickerTrigger
          label={label}
          displayValue={`Năm ${value}`}
          open={open}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[15.5rem] rounded-md border-gray-200 p-3 shadow-md"
      >
        <p className="mb-2 px-1 text-xs font-medium text-gray-500">Chọn năm</p>
        <div className="max-h-[13.5rem] overflow-y-auto pr-0.5">
          <div className="grid grid-cols-3 gap-1">
            {years.map((year) => {
              const isSelected = year === value
              return (
                <button
                  key={year}
                  type="button"
                  aria-label={`Năm ${year}`}
                  aria-pressed={isSelected}
                  className={cn(
                    PERIOD_ITEM_BASE_CLASS,
                    isSelected
                      ? PERIOD_ITEM_SELECTED_CLASS
                      : 'text-gray-900 hover:bg-gray-100',
                  )}
                  onClick={() => {
                    onChange(year)
                    setOpen(false)
                  }}
                >
                  {year}
                </button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/** Chọn tháng — lưới T1–T12, điều hướng năm (mockup). */
export function FilterMonthPicker({
  label,
  value,
  months,
  onChange,
}: {
  label: string
  value: string
  months: string[]
  onChange: (month: string) => void
}) {
  const resolved = months.includes(value) ? value : (months[0] ?? value)
  const selected = parseMonthLabel(resolved)
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(selected.year)

  const enabledSet = useMemo(() => new Set(months), [months])
  const viewBounds = useMemo(() => {
    if (months.length === 0) return { min: viewYear, max: viewYear }
    const years = months.map((m) => parseMonthLabel(m).year)
    return { min: Math.min(...years), max: Math.max(...years) }
  }, [months])

  const headerTitle =
    viewYear === selected.year
      ? `Tháng ${String(selected.monthNum).padStart(2, '0')}/${viewYear}`
      : `Năm ${viewYear}`

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setViewYear(selected.year)
      }}
    >
      <PopoverTrigger asChild>
        <FilterPeriodPickerTrigger
          label={label}
          displayValue={monthDisplayLabel(resolved)}
          open={open}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[15.5rem] rounded-md border-gray-200 p-3 shadow-md"
      >
        <div className="mb-2 flex items-center justify-between gap-1 px-0.5">
          <button
            type="button"
            aria-label="Năm trước"
            disabled={viewYear <= viewBounds.min}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30"
            onClick={() => setViewYear((y) => Math.max(viewBounds.min, y - 1))}
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-0 flex-1 truncate text-center text-sm font-medium text-gray-900">
            {headerTitle}
          </span>
          <button
            type="button"
            aria-label="Năm sau"
            disabled={viewYear >= viewBounds.max}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30"
            onClick={() => setViewYear((y) => Math.min(viewBounds.max, y + 1))}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {MONTH_SHORT.map((short, idx) => {
            const monthNum = idx + 1
            const labelValue = formatMonthLabel(monthNum, viewYear)
            const enabled = enabledSet.has(labelValue)
            const isSelected =
              selected.monthNum === monthNum && selected.year === viewYear
            return (
              <button
                key={short}
                type="button"
                disabled={!enabled}
                aria-label={`Tháng ${monthNum}/${viewYear}`}
                aria-pressed={isSelected && enabled}
                className={cn(
                  PERIOD_ITEM_BASE_CLASS,
                  isSelected && enabled
                    ? PERIOD_ITEM_SELECTED_CLASS
                    : enabled
                      ? 'text-gray-900 hover:bg-gray-100'
                      : 'cursor-not-allowed text-gray-300',
                )}
                onClick={() => {
                  onChange(labelValue)
                  setOpen(false)
                }}
              >
                {short}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
