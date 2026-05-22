'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Sản lượng & Chi phí', match: (p: string) => p === '/' },
  {
    href: '/gls-competitor',
    label: 'So sánh sản lượng với đối thủ',
    match: (p: string) => p.startsWith('/gls-competitor'),
  },
  {
    href: '/operating-cost',
    label: 'Báo cáo chi phí vận hành',
    match: (p: string) => p.startsWith('/operating-cost'),
  },
] as const

export function ReportLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white lg:block xl:w-60">
        <nav className="space-y-1 p-3" aria-label="Điều hướng báo cáo">
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Báo cáo kiểm đếm
          </p>
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname ?? '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                )}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
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
