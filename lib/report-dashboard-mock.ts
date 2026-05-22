/** Quyền xem chỉ tiêu tài chính (giai đoạn sau khi có nguồn doanh thu). */
export type UserRole = 'admin' | 'manager' | 'ops' | 'accountant'

export function canViewFinancial(role: UserRole): boolean {
  return role === 'admin' || role === 'manager' || role === 'accountant'
}

export function canExport(role: UserRole): boolean {
  return role === 'admin' || role === 'manager'
}

export { getBcScopedData as getScopedData } from './bc-report'
