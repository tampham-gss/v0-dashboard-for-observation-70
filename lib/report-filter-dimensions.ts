import {
  buildInspectionOrdersForScope,
  type InspectionOrder,
} from './report-inspection-orders'
import type { BranchCode, CPRecord, ReportFilters, SLRecord } from './report-mock-data'

function hasDimensionFilters(filters: ReportFilters): boolean {
  return (
    filters.warehouse !== 'all' ||
    filters.route !== 'all' ||
    filters.staff !== 'all' ||
    filters.opsCs !== 'all'
  )
}

function orderMatchesDimensions(order: InspectionOrder, filters: ReportFilters): boolean {
  if (filters.warehouse !== 'all' && order.kho !== filters.warehouse) return false
  if (filters.route !== 'all' && order.tuyen !== filters.route) return false
  if (filters.staff !== 'all' && order.nhanSu !== filters.staff) return false
  if (filters.opsCs !== 'all' && order.opsCs !== filters.opsCs) return false
  return true
}

/** Chi nhánh còn lại sau lọc kho / tuyến / giao nhận / CS-OPS. */
export function getDimensionBranchSet(
  filters: ReportFilters,
  slRows: SLRecord[],
  cpRows: CPRecord[],
): Set<BranchCode> | null {
  if (!hasDimensionFilters(filters)) return null

  const orders = buildInspectionOrdersForScope(filters, slRows, cpRows)
  const branches = new Set<BranchCode>()
  for (const o of orders) {
    if (orderMatchesDimensions(o, filters)) branches.add(o.branch)
  }
  return branches
}
