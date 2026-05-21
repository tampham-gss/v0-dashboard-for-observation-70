'use client'

import { Calendar, DateField, DatePicker } from '@heroui/react'
import { CalendarDate } from '@internationalized/date'
import { cn } from '@/lib/utils'
import {
  calendarDateToMonthLabel,
  monthBoundsFromLabels,
  monthLabelToCalendarDate,
  yearToCalendarDate,
} from '@/lib/report-period-date'
import { FILTER_CONTROL_INDICATOR_CLASS, FILTER_CONTROL_TRIGGER_CLASS } from './filter-select'

const FILTER_DATE_FIELD_GROUP_CLASS = cn(
  FILTER_CONTROL_TRIGGER_CLASS,
  '[&_[data-slot=segment]]:min-w-[1.25rem] [&_[data-slot=segment]]:text-sm',
)

function FilterDatePickerPopover({ label }: { label: string }) {
  return (
    <DatePicker.Popover>
      <Calendar aria-label={label} className="p-2">
        <Calendar.Header className="flex items-center gap-1 pb-2">
          <Calendar.YearPickerTrigger className="inline-flex min-w-0 flex-1 items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100">
            <Calendar.YearPickerTriggerHeading />
            <Calendar.YearPickerTriggerIndicator className={FILTER_CONTROL_INDICATOR_CLASS} />
          </Calendar.YearPickerTrigger>
          <Calendar.NavButton slot="previous" />
          <Calendar.NavButton slot="next" />
        </Calendar.Header>
        <Calendar.Grid>
          <Calendar.GridHeader>
            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
          </Calendar.GridHeader>
          <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
        </Calendar.Grid>
      </Calendar>
    </DatePicker.Popover>
  )
}

/** Chọn năm — HeroUI DatePicker (granularity year) + Calendar.YearPicker. */
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
  const calendarValue = yearToCalendarDate(value)
  const minValue = yearToCalendarDate(minYear)
  const maxValue = new CalendarDate(maxYear, 12, 31)

  return (
    <DatePicker
      aria-label={label}
      granularity="year"
      className="w-full min-w-0"
      value={calendarValue}
      minValue={minValue}
      maxValue={maxValue}
      onChange={(next) => {
        if (next) onChange(next.year)
      }}
    >
      <DateField.Group className={FILTER_DATE_FIELD_GROUP_CLASS} fullWidth variant="secondary">
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger
            aria-label={`Mở lịch chọn ${label.toLowerCase()}`}
            className="inline-flex shrink-0 items-center px-1"
          >
            <DatePicker.TriggerIndicator className={FILTER_CONTROL_INDICATOR_CLASS} />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <FilterDatePickerPopover label={label} />
    </DatePicker>
  )
}

/** Chọn tháng — HeroUI DatePicker (granularity month). */
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
  const bounds = monthBoundsFromLabels(months)
  const calendarValue = monthLabelToCalendarDate(
    months.includes(value) ? value : (months[0] ?? value),
  )

  return (
    <DatePicker
      aria-label={label}
      granularity="month"
      className="w-full min-w-0"
      value={calendarValue}
      minValue={bounds?.min}
      maxValue={bounds?.max}
      onChange={(next) => {
        if (!next) return
        const labelValue = calendarDateToMonthLabel(next)
        if (months.includes(labelValue)) onChange(labelValue)
      }}
    >
      <DateField.Group className={FILTER_DATE_FIELD_GROUP_CLASS} fullWidth variant="secondary">
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger
            aria-label={`Mở lịch chọn ${label.toLowerCase()}`}
            className="inline-flex shrink-0 items-center px-1"
          >
            <DatePicker.TriggerIndicator className={FILTER_CONTROL_INDICATOR_CLASS} />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <FilterDatePickerPopover label={label} />
    </DatePicker>
  )
}
