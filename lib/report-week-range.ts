import { endOfISOWeek, startOfISOWeek, setISOWeek, setISOWeekYear } from 'date-fns'
import { formatAppDate } from './date-format'
import { bcWeekOptionsForMonth } from './report-mock-data'

const WEEK_LABEL_RE = /^Tuần\s+(\d{1,2})\/(\d{2})$/

export function parseWeekLabel(weekLabel: string): { weekNum: number; year: number } | null {
  const m = weekLabel.match(WEEK_LABEL_RE)
  if (!m) return null
  return { weekNum: Number(m[1]), year: 2000 + Number(m[2]) }
}

/** Tuần theo lịch ISO (Thứ 2 – Chủ nhật). */
export function weekDateRangeIso(weekLabel: string): { from: Date; to: Date } | null {
  const parsed = parseWeekLabel(weekLabel)
  if (!parsed) return null
  const anchor = setISOWeek(
    setISOWeekYear(new Date(parsed.year, 0, 4), parsed.year),
    parsed.weekNum,
  )
  return {
    from: startOfISOWeek(anchor, { weekStartsOn: 1 }),
    to: endOfISOWeek(anchor, { weekStartsOn: 1 }),
  }
}

/** Tuần thuộc khối 4 tuần/tháng (khớp bcWeekOptionsForMonth). */
export function weekDateRangeInMonth(
  year: number,
  monthLabel: string,
  weekLabel: string,
): { from: Date; to: Date } | null {
  const weeks = bcWeekOptionsForMonth(year, monthLabel)
  const idx = weeks.indexOf(weekLabel)
  if (idx < 0) return null

  const monthNum = Number(monthLabel.slice(0, 2))
  if (!Number.isFinite(monthNum) || monthNum < 1 || monthNum > 12) return null

  const daysInMonth = new Date(year, monthNum, 0).getDate()
  const startDay = Math.floor((idx * daysInMonth) / 4) + 1
  const endDay = Math.floor(((idx + 1) * daysInMonth) / 4)

  return {
    from: new Date(year, monthNum - 1, startDay),
    to: new Date(year, monthNum - 1, endDay),
  }
}

export function weekDateRange(
  weekLabel: string,
  year: number,
  monthLabel?: string,
): { from: Date; to: Date } | null {
  if (monthLabel) {
    const inMonth = weekDateRangeInMonth(year, monthLabel, weekLabel)
    if (inMonth) return inMonth
  }
  return weekDateRangeIso(weekLabel)
}

function formatRange(from: Date, to: Date): string {
  return `${formatAppDate(from)} - ${formatAppDate(to)}`
}

/** Rút gọn `Tuần 15/26` → `15/26`. */
export function formatWeekFilterShort(weekLabel: string): string {
  return weekLabel.replace(/^Tuần\s+/, '')
}

/** Nhãn dropdown: `15/26 (14/02/2026 - 21/02/2026)`. */
export function formatWeekFilterLabel(
  weekLabel: string,
  year: number,
  monthLabel?: string,
): string {
  const short = formatWeekFilterShort(weekLabel)
  const range = weekDateRange(weekLabel, year, monthLabel)
  if (!range) return weekLabel
  return `${short} (${formatRange(range.from, range.to)})`
}
