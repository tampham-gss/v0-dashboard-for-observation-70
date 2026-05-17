'use client'

import type { ReactNode } from 'react'

/** Khối bảng trắng — tiêu đề rõ, không gradient (theo prototype trong docs). */
export function ReportTablePanel({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-gray-600">{subtitle}</p> : null}
      </div>
      <div className="h-fit min-w-0 w-full overflow-x-auto overscroll-x-contain">{children}</div>
      {footer}
    </div>
  )
}
