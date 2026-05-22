import {
  BRANCHES,
  TARGET_CP_PER_CONT,
  YEARS,
  type BranchCode,
} from './report-constants'
import { getDimensionBranchSet } from './report-filter-dimensions'
import { formatWeekFilterLabel } from './report-week-range'

export type PeriodType = 'week' | 'month'
export type { BranchCode }
export { BRANCHES, TARGET_CP_PER_CONT, YEARS }

export type SLStatus =
  | 'Đạt kế hoạch'
  | 'Gần đạt'
  | 'Chưa đạt'
  | 'Cần kiểm tra'

export type CPStatus =
  | 'Trong định mức'
  | 'Vượt định mức'
  | 'Cần kiểm tra'
  | 'Dữ liệu bất thường'
  | 'Thiếu dữ liệu'

export type FilterStatus = 'all' | SLStatus | CPStatus

export type StatusChipColor = 'success' | 'warning' | 'danger' | 'accent'

export interface SLRecord {
  id: string
  periodType: PeriodType
  year: number
  week?: string
  month?: string
  branch: BranchCode
  nsGiaoNhan: number
  slKhoKH: number
  slContKH: number
  slKhoTH: number
  slContTH: number
  slKhoGLS: number
  slContGLS: number
  slKhoLX: number
  slContLX: number
  slKhoVendor: number
  slContVendor: number
  status: SLStatus
}

export interface CPRecord {
  id: string
  periodType: PeriodType
  year: number
  week?: string
  month?: string
  date: string
  branch: BranchCode
  nhanCong: number
  cpGNGLSPerCont: number
  tongCPGNGLS: number
  contGNGLSKD: number
  tongCPLaiXeKD: number
  contLaiXeKD: number
  tongCPVendor: number
  contVendorKD: number
  tongChiPhi: number
  cpTBPerCont: number
  status: CPStatus
}

export interface ReportFilters {
  periodType: PeriodType
  year: number
  week: string
  month: string
  /** Khu vực (chi nhánh vận hành) */
  branch: BranchCode | 'all'
  dateFrom: string
  dateTo: string
  warehouse: string | 'all'
  route: string | 'all'
  staff: string | 'all'
  opsCs: string | 'all'
  status: FilterStatus
  keyword: string
  /** Tab BC tuần: lọc theo tháng (mọi tuần trong tháng), không theo một tuần. */
  bcWeekByMonth?: boolean
}

const WEEKS_26 = Array.from({ length: 52 }, (_, i) => `Tuần ${String(i + 1).padStart(2, '0')}/26`)
const WEEKS_25 = Array.from({ length: 52 }, (_, i) => `Tuần ${String(i + 1).padStart(2, '0')}/25`)

/** Danh sách tuần cho bộ lọc (khớp nhãn sinh từ mock generator). */
export const WEEKS = [...WEEKS_26, ...WEEKS_25] as const
export const MONTHS = [
  '08/25',
  '09/25',
  '10/25',
  '11/25',
  '12/25',
  '01/26',
  '02/26',
  '03/26',
  '04/26',
  '05/26',
  '06/26',
  '07/26',
  '08/26',
  '09/26',
  '10/26',
  '11/26',
  '12/26',
] as const

/** Tuần thuộc năm (nhãn dạng `Tuần 01/26`). */
export function weeksForYear(year: number): string[] {
  const yy = String(year).slice(-2)
  return WEEKS.filter((w) => w.endsWith(`/${yy}`))
}

/** Tháng thuộc năm (nhãn dạng `04/26`). */
export function monthsForYear(year: number): string[] {
  const yy = String(year).slice(-2)
  return MONTHS.filter((m) => m.endsWith(`/${yy}`))
}

/** Bốn tuần trong tháng lịch (dùng cho bộ lọc BC tuần). */
export function bcWeekOptionsForMonth(year: number, month: string): string[] {
  const yy = String(year).slice(-2)
  if (!month.endsWith(`/${yy}`)) return []

  const monthNum = Number(month.slice(0, 2))
  if (!Number.isFinite(monthNum) || monthNum < 1 || monthNum > 12) return []

  const startWeek = (monthNum - 1) * 4 + 1
  return Array.from({ length: 4 }, (_, i) => {
    const n = startWeek + i
    return `Tuần ${String(n).padStart(2, '0')}/${yy}`
  })
}

export const DEFAULT_FILTERS: ReportFilters = {
  periodType: 'week',
  year: 2026,
  week: 'Tuần 15/26',
  month: '04/26',
  branch: 'all',
  dateFrom: '2026-04-01',
  dateTo: '2026-04-30',
  warehouse: 'all',
  route: 'all',
  staff: 'all',
  opsCs: 'all',
  status: 'all',
  keyword: '',
}

/** Dòng phụ đề hiển thị phạm vi kỳ / chi nhánh đang áp dụng (đã lọc). */
export function appliedFiltersCaption(
  filters: ReportFilters,
  opts?: { showBcWeekMonth?: boolean },
): string {
  const branch = filters.branch === 'all' ? 'Tất cả chi nhánh' : filters.branch
  const period =
    opts?.showBcWeekMonth && filters.periodType === 'week'
      ? `Tháng ${filters.month} · ${filters.year}`
      : filters.periodType === 'week'
        ? `${formatWeekFilterLabel(filters.week, filters.year, filters.month)} · ${filters.year}`
        : `Tháng ${filters.month} · ${filters.year}`
  const dims: string[] = []
  if (filters.warehouse !== 'all') dims.push(filters.warehouse)
  if (filters.route !== 'all') dims.push(filters.route)
  if (filters.staff !== 'all') dims.push(filters.staff)
  if (filters.opsCs !== 'all') dims.push(filters.opsCs)
  const dimPart = dims.length > 0 ? ` · ${dims.join(' · ')}` : ''
  return `${period} · ${branch}${dimPart}`
}

function periodLabel(r: { periodType: PeriodType; week?: string; month?: string }): string {
  return r.periodType === 'week' ? (r.week ?? '—') : (r.month ?? '—')
}

export function computeSLStatus(
  slContKH: number,
  slContTH: number,
): SLStatus {
  if (slContKH <= 0 || slContTH <= 0) return 'Cần kiểm tra'
  const ratio = (slContTH / slContKH) * 100
  if (ratio >= 100) return 'Đạt kế hoạch'
  if (ratio >= 90) return 'Gần đạt'
  return 'Chưa đạt'
}

export function computeCPStatus(
  tongChiPhi: number,
  cpTBPerCont: number,
  contTH: number,
  hasCostButNoCont: boolean,
): CPStatus {
  if (tongChiPhi < 0 || cpTBPerCont < 0) return 'Dữ liệu bất thường'
  if (hasCostButNoCont) return 'Thiếu dữ liệu'
  if (tongChiPhi === 0 && contTH > 0) return 'Cần kiểm tra'
  if (cpTBPerCont <= TARGET_CP_PER_CONT) return 'Trong định mức'
  return 'Vượt định mức'
}

export function getSLStatusColor(status: SLStatus): StatusChipColor {
  switch (status) {
    case 'Đạt kế hoạch':
      return 'success'
    case 'Gần đạt':
    case 'Cần kiểm tra':
      return 'warning'
    case 'Chưa đạt':
      return 'danger'
    default:
      return 'accent'
  }
}

export function getCPStatusColor(status: CPStatus): StatusChipColor {
  switch (status) {
    case 'Trong định mức':
      return 'success'
    case 'Cần kiểm tra':
    case 'Thiếu dữ liệu':
      return 'warning'
    case 'Vượt định mức':
    case 'Dữ liệu bất thường':
      return 'danger'
    default:
      return 'accent'
  }
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('vi-VN').format(Math.round(value))
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return `${value.toFixed(1)}%`
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

export function slCompareRatio(slContKH: number, slContTH: number): number | null {
  if (slContKH <= 0) return null
  return (slContTH / slContKH) * 100
}

export function slRatioGLS(slContGLS: number, slContTH: number): number | null {
  if (slContTH <= 0) return null
  return (slContGLS / slContTH) * 100
}

export function slRatioPart(part: number, total: number): number | null {
  if (total <= 0) return null
  return (part / total) * 100
}

export function slProductivity(slContTH: number, ns: number): number | null {
  if (ns <= 0) return null
  return slContTH / ns
}

function matchesKeyword(text: string, keyword: string): boolean {
  const k = keyword.trim().toLowerCase()
  if (!k) return true
  return text.toLowerCase().includes(k)
}

function matchesWeekPeriod(filters: ReportFilters, week?: string): boolean {
  if (!week) return false
  if (filters.bcWeekByMonth) {
    return bcWeekOptionsForMonth(filters.year, filters.month).includes(week)
  }
  return week === filters.week
}

function matchesSlPeriodScope(r: SLRecord, filters: ReportFilters): boolean {
  if (r.periodType !== filters.periodType) return false
  if (r.year !== filters.year) return false
  if (filters.periodType === 'week' && !matchesWeekPeriod(filters, r.week)) return false
  if (filters.periodType === 'month' && r.month !== filters.month) return false
  if (filters.branch !== 'all' && r.branch !== filters.branch) return false
  const label = `${periodLabel(r)} ${r.branch}`
  return matchesKeyword(label, filters.keyword)
}

function matchesCpPeriodScope(r: CPRecord, filters: ReportFilters): boolean {
  if (r.periodType !== filters.periodType) return false
  if (r.year !== filters.year) return false
  if (filters.periodType === 'week' && !matchesWeekPeriod(filters, r.week)) return false
  if (filters.periodType === 'month' && r.month !== filters.month) return false
  if (filters.branch !== 'all' && r.branch !== filters.branch) return false
  const label = `${periodLabel(r)} ${r.branch}`
  return matchesKeyword(label, filters.keyword)
}

function applyDimensionBranchFilter<T extends { branch: BranchCode }>(
  items: T[],
  filters: ReportFilters,
  slScoped: SLRecord[],
  cpScoped: CPRecord[],
): T[] {
  const branchSet = getDimensionBranchSet(filters, slScoped, cpScoped)
  if (!branchSet) return items
  return items.filter((r) => branchSet.has(r.branch))
}

export function filterSLRecords(filters: ReportFilters, rows = slRecords): SLRecord[] {
  const slScoped = rows.filter((r) => matchesSlPeriodScope(r, filters))
  const cpScoped = cpRecords.filter((r) => matchesCpPeriodScope(r, filters))
  const matched = slScoped.filter((r) => {
    if (
      filters.status !== 'all' &&
      (filters.status === 'Đạt kế hoạch' ||
        filters.status === 'Gần đạt' ||
        filters.status === 'Chưa đạt' ||
        filters.status === 'Cần kiểm tra') &&
      r.status !== filters.status
    ) {
      return false
    }
    return true
  })
  return applyDimensionBranchFilter(matched, filters, slScoped, cpScoped)
}

export function filterCPRecords(filters: ReportFilters, rows = cpRecords): CPRecord[] {
  const slScoped = slRecords.filter((r) => matchesSlPeriodScope(r, filters))
  const cpScoped = rows.filter((r) => matchesCpPeriodScope(r, filters))
  const matched = cpScoped.filter((r) => {
    if (
      filters.status !== 'all' &&
      (filters.status === 'Trong định mức' ||
        filters.status === 'Vượt định mức' ||
        filters.status === 'Cần kiểm tra' ||
        filters.status === 'Dữ liệu bất thường' ||
        filters.status === 'Thiếu dữ liệu') &&
      r.status !== filters.status
    ) {
      return false
    }
    return true
  })
  return applyDimensionBranchFilter(matched, filters, slScoped, cpScoped)
}

export function findMatchingSLForCP(cp: CPRecord): SLRecord | undefined {
  return slRecords.find(
    (s) =>
      s.periodType === cp.periodType &&
      s.year === cp.year &&
      s.branch === cp.branch &&
      (cp.periodType === 'week' ? s.week === cp.week : s.month === cp.month),
  )
}

export interface OverviewSummary {
  totalSlContKH: number
  totalSlContTH: number
  thKhRatio: number | null
  totalSlContGLS: number
  totalChiPhi: number
  cpTBPerCont: number | null
}

export function computeOverviewSummary(
  slRows: SLRecord[],
  cpRows: CPRecord[],
): OverviewSummary {
  const totalSlContKH = slRows.reduce((s, r) => s + r.slContKH, 0)
  const totalSlContTH = slRows.reduce((s, r) => s + r.slContTH, 0)
  const totalSlContGLS = slRows.reduce((s, r) => s + r.slContGLS, 0)
  const totalChiPhi = cpRows.reduce((s, r) => s + r.tongChiPhi, 0)
  return {
    totalSlContKH,
    totalSlContTH,
    thKhRatio: slCompareRatio(totalSlContKH, totalSlContTH),
    totalSlContGLS,
    totalChiPhi,
    cpTBPerCont: totalSlContTH > 0 ? totalChiPhi / totalSlContTH : null,
  }
}

export interface SLSummary {
  totalContKH: number
  totalContTH: number
  completionRatio: number | null
  totalContGLS: number
  glsSlRatio: number | null
  totalContLX: number
  totalContVendor: number
  avgProductivity: number | null
}

export function computeSLSummary(rows: SLRecord[]): SLSummary {
  const totalContKH = rows.reduce((s, r) => s + r.slContKH, 0)
  const totalContTH = rows.reduce((s, r) => s + r.slContTH, 0)
  const totalContGLS = rows.reduce((s, r) => s + r.slContGLS, 0)
  const totalContLX = rows.reduce((s, r) => s + r.slContLX, 0)
  const totalContVendor = rows.reduce((s, r) => s + r.slContVendor, 0)
  const totalNs = rows.reduce((s, r) => s + r.nsGiaoNhan, 0)
  return {
    totalContKH,
    totalContTH,
    completionRatio: slCompareRatio(totalContKH, totalContTH),
    totalContGLS,
    glsSlRatio: slRatioGLS(totalContGLS, totalContTH),
    totalContLX,
    totalContVendor,
    avgProductivity: totalNs > 0 ? totalContTH / totalNs : null,
  }
}

export interface CPSummary {
  totalCPGLS: number
  totalCPLX: number
  totalCPVendor: number
  totalChiPhi: number
  cpTBPerCont: number | null
  targetCpPerCont: number
}

export function computeCPSummary(rows: CPRecord[], slRows: SLRecord[]): CPSummary {
  const totalCPGLS = rows.reduce((s, r) => s + r.tongCPGNGLS, 0)
  const totalCPLX = rows.reduce((s, r) => s + r.tongCPLaiXeKD, 0)
  const totalCPVendor = rows.reduce((s, r) => s + r.tongCPVendor, 0)
  const totalChiPhi = rows.reduce((s, r) => s + r.tongChiPhi, 0)
  const totalContTH = slRows.reduce((s, r) => s + r.slContTH, 0)
  return {
    totalCPGLS,
    totalCPLX,
    totalCPVendor,
    totalChiPhi,
    cpTBPerCont: totalContTH > 0 ? totalChiPhi / totalContTH : null,
    targetCpPerCont: TARGET_CP_PER_CONT,
  }
}

export { periodLabel }

import { createMockRecords, MOCK_DATA_ROW_COUNT } from './report-mock-generator'

export { MOCK_DATA_ROW_COUNT }

const __mockDataset = createMockRecords(MOCK_DATA_ROW_COUNT)
export const slRecords: SLRecord[] = __mockDataset.slRecords
export const cpRecords: CPRecord[] = __mockDataset.cpRecords
