import { format, isValid, parse } from 'date-fns'

/** Hiển thị ngày chuẩn app: `dd/MM/yyyy` */
export const APP_DATE_FORMAT = 'dd/MM/yyyy'

/** Hiển thị ngày giờ chuẩn app: `dd/MM/yyyy HH:mm` */
export const APP_DATETIME_FORMAT = 'dd/MM/yyyy HH:mm'

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/
const HAS_TIME_PART = /[T ]\d{1,2}:\d{2}/

/** Parse chuỗi ISO, `dd/MM/yyyy`, `dd/MM/yy` hoặc `Date`. */
export function parseAppDate(input: string | Date | null | undefined): Date | null {
  if (input == null || input === '') return null
  if (input instanceof Date) return isValid(input) ? input : null

  const s = String(input).trim()
  if (!s) return null

  if (ISO_DATE_ONLY.test(s)) {
    const d = parse(s, 'yyyy-MM-dd', new Date())
    return isValid(d) ? d : null
  }

  if (HAS_TIME_PART.test(s)) {
    const normalized = s.includes('T') ? s : s.replace(' ', 'T')
    const d = new Date(normalized)
    return isValid(d) ? d : null
  }

  for (const pattern of ['dd/MM/yyyy', 'dd/MM/yy', 'd/M/yyyy', 'd/M/yy'] as const) {
    const d = parse(s, pattern, new Date())
    if (isValid(d)) return d
  }

  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (m) {
    const day = Number(m[1])
    const month = Number(m[2])
    let year = Number(m[3])
    if (year < 100) year += year >= 50 ? 1900 : 2000
    const d = new Date(year, month - 1, day)
    return isValid(d) ? d : null
  }

  return null
}

export function hasAppDateTime(input: string | Date | null | undefined): boolean {
  if (input == null || input === '') return false
  if (input instanceof Date) return true
  return HAS_TIME_PART.test(String(input).trim())
}

/** `dd/MM/yyyy` — dùng cho cột/ngày thuần. */
export function formatAppDate(
  input: string | Date | null | undefined,
  fallback = '—',
): string {
  const d = parseAppDate(input)
  if (!d) return fallback
  return format(d, APP_DATE_FORMAT)
}

/** `dd/MM/yyyy HH:mm` */
export function formatAppDateTime(
  input: string | Date | null | undefined,
  fallback = '—',
): string {
  const d = parseAppDate(input)
  if (!d) return fallback
  return format(d, APP_DATETIME_FORMAT)
}

/** Tự chọn: có giờ → datetime, không → date. */
export function formatAppDateAuto(
  input: string | Date | null | undefined,
  fallback = '—',
): string {
  if (input == null || input === '') return fallback
  return hasAppDateTime(input) ? formatAppDateTime(input, fallback) : formatAppDate(input, fallback)
}

/** Lưu/so sánh filter: `yyyy-MM-dd`. */
export function toIsoDateString(input: string | Date | null | undefined): string {
  const d = parseAppDate(input)
  if (!d) return ''
  return format(d, 'yyyy-MM-dd')
}

export function formatAppDateRange(
  from: string | Date | null | undefined,
  to: string | Date | null | undefined,
  separator = ' → ',
): string {
  return `${formatAppDate(from)}${separator}${formatAppDate(to)}`
}
