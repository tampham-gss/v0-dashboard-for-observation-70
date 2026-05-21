'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const TONE_CLASS = {
  warning: 'border-amber-200 bg-amber-50',
  info: 'border-blue-200 bg-blue-50',
  accent: 'border-gray-200 bg-gray-50',
} as const

const TITLE_CLASS = {
  warning: 'text-amber-900',
  info: 'text-blue-900',
  accent: 'text-gray-900',
} as const

const BODY_CLASS = {
  warning: 'text-amber-800',
  info: 'text-blue-800',
  accent: 'text-gray-700',
} as const

/** Thông báo nội tuyến — chữ đậm, tương phản rõ trên nền báo cáo. */
export function ReportInlineNotice({
  title,
  children,
  tone = 'warning',
  className,
}: {
  title?: string
  children: ReactNode
  tone?: keyof typeof TONE_CLASS
  className?: string
}) {
  return (
    <div
      role="note"
      className={cn('rounded-lg border px-3.5 py-2.5 text-sm', TONE_CLASS[tone], className)}
    >
      {title ? (
        <p className={cn('font-medium leading-snug', TITLE_CLASS[tone])}>{title}</p>
      ) : null}
      <p
        className={cn(
          'leading-snug',
          BODY_CLASS[tone],
          title && 'mt-1',
        )}
      >
        {children}
      </p>
    </div>
  )
}
