'use client'

import type { ReactNode } from 'react'
import {
  REPORT_TABLE_BORDER_CLASS,
  REPORT_TABLE_CARD_INSET_X,
  REPORT_TABLE_PANEL_CLASS,
} from './report-table-chrome'
import { cn } from '@/lib/utils'

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
    <div
      className={cn(REPORT_TABLE_PANEL_CLASS, 'p-0')}
      style={{ boxShadow: 'none' }}
    >
      <div className="px-5 pt-4 pb-2 sm:px-6">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
      </div>
      <div className={cn('pb-3 sm:pb-4', REPORT_TABLE_CARD_INSET_X)}>
        <div
          className={cn(
            REPORT_TABLE_BORDER_CLASS,
            'h-fit min-w-0 w-full overflow-x-auto overscroll-x-contain shadow-none',
          )}
          style={{ boxShadow: 'none' }}
        >
          {children}
        </div>
      </div>
      {footer}
    </div>
  )
}
