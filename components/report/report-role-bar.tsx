'use client'

import { FilterSelect } from './filter-select'
import type { UserRole } from '@/lib/report-dashboard-mock'

const ROLE_OPTIONS: { id: UserRole; label: string }[] = [
  { id: 'admin', label: 'Admin' },
  { id: 'manager', label: 'Quản lý' },
  { id: 'ops', label: 'OPS' },
  { id: 'accountant', label: 'Kế toán' },
]

export function ReportRoleBar({
  role,
  onRoleChange,
}: {
  role: UserRole
  onRoleChange: (role: UserRole) => void
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="w-full max-w-[14rem]">
        <label className="mb-1 block text-xs font-medium text-gray-600">Vai trò demo</label>
        <FilterSelect label="Vai trò" value={role} options={ROLE_OPTIONS} onChange={onRoleChange} />
      </div>
      <p className="text-xs text-gray-500">
        Phân quyền mô phỏng theo guide §11 — OPS không xem KPI tài chính chi tiết.
      </p>
    </div>
  )
}
