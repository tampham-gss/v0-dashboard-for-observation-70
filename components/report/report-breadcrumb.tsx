'use client'

import { ChevronRight } from 'lucide-react'

export function ReportBreadcrumb({ current }: { current: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-3 flex flex-wrap items-center gap-1 text-sm text-gray-500"
    >
      <span>Kiểm đếm</span>
      <ChevronRight className="size-4 shrink-0" aria-hidden />
      <span>Báo cáo</span>
      <ChevronRight className="size-4 shrink-0" aria-hidden />
      <span className="font-medium text-gray-900">{current}</span>
    </nav>
  )
}
