'use client'

import type { ReactNode } from 'react'

/** Sidebar đơn giản như docs/components/layout/sidebar.tsx */
export function ReportLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white lg:block xl:w-60">
        <nav className="space-y-1 p-3" aria-label="Điều hướng báo cáo">
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">Báo cáo</p>
          <div className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-600">
            Quan sát Sản lượng · Doanh Thu · Chi Phí
          </div>
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="report-page w-full max-w-none flex-1 px-3 py-4 sm:px-4 lg:px-5 xl:px-6">
          {children}
        </main>
      </div>
    </div>
  )
}
