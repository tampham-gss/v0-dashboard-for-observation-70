import { BRANCHES, type BranchCode } from './report-constants'

/** Danh mục lọc (không Hub / Khách hàng). */
export const REPORT_WAREHOUSES = [
  'Kho GLS',
  'Kho LX',
  'Kho Vendor',
  'Kho trung chuyển',
  'Kho ngoại quan',
  'Kho Bình Dương',
  'Kho Đình Vũ',
  'Kho Tân Cảng',
] as const

export const REPORT_ROUTES = [
  'Tuyến nội địa',
  'Tuyến xuất',
  'Tuyến nhập',
  'Tuyến liên vùng',
  'HCM–ĐN',
  'HPH–HCM',
  'Nội thành HCM',
] as const

export const REPORT_OPS_CS = [
  'CS Nguyễn',
  'CS Trần',
  'CS Lê',
  'OPS Minh',
  'OPS Hùng',
  'OPS Lan',
] as const

const STAFF_SUFFIXES = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]

export const REPORT_DELIVERERS: string[] = BRANCHES.flatMap((branch) =>
  STAFF_SUFFIXES.map((n) => `NS-${branch}-${n}`),
)

export function reportFilterSelectOptions(
  allLabel: string,
  items: readonly string[],
): { id: string; label: string }[] {
  return [{ id: 'all', label: allLabel }, ...items.map((x) => ({ id: x, label: x }))]
}

export type { BranchCode } from './report-constants'
