import { CalendarDate } from '@internationalized/date'

/** Nhãn tháng `MM/yy` → ngày đầu tháng. */
export function monthLabelToCalendarDate(month: string): CalendarDate {
  const [mm, yy] = month.split('/')
  const year = yy.length === 2 ? 2000 + Number(yy) : Number(yy)
  return new CalendarDate(year, Number(mm), 1)
}

/** `CalendarDate` → nhãn tháng `MM/yy` (khớp mock). */
export function calendarDateToMonthLabel(date: CalendarDate): string {
  const yy = String(date.year).slice(-2)
  return `${String(date.month).padStart(2, '0')}/${yy}`
}

export function yearToCalendarDate(year: number): CalendarDate {
  return new CalendarDate(year, 1, 1)
}

export function monthBoundsFromLabels(months: string[]): {
  min: CalendarDate
  max: CalendarDate
} | null {
  if (months.length === 0) return null
  const dates = months.map(monthLabelToCalendarDate)
  dates.sort((a, b) => a.compare(b))
  return { min: dates[0]!, max: dates[dates.length - 1]! }
}
