/** Hằng số dùng chung — không import report-mock-data / inspection-orders. */

export type BranchCode = 'HCM' | 'HPH' | 'CLO' | 'DAN' | 'GLS'

export const BRANCHES: BranchCode[] = ['HCM', 'HPH', 'CLO', 'DAN', 'GLS']
export const YEARS = [2025, 2026] as const
export const TARGET_CP_PER_CONT = 150_000
