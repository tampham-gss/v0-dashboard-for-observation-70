'use client'

import { Table } from '@heroui/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  REPORT_TABLE_BORDER_CLASS,
  REPORT_TABLE_ROOT_CLASS,
  REPORT_TABLE_SCROLL_CLASS,
  REPORT_TABLE_SHELL_CLASS,
} from './report-table-chrome'

export function ReportDataTable({
  'aria-label': ariaLabel,
  children,
  className,
  framed = true,
}: {
  'aria-label': string
  children: ReactNode
  className?: string
  /** false khi bảng nằm trong ReportTablePanel (panel đã có viền) */
  framed?: boolean
}) {
  return (
    <Table
      className={cn(
        'report-data-table !shadow-none',
        REPORT_TABLE_ROOT_CLASS,
        REPORT_TABLE_SHELL_CLASS,
        className,
      )}
      style={{ boxShadow: 'none' }}
    >
      <Table.ScrollContainer
        className={cn(
          REPORT_TABLE_SCROLL_CLASS,
          framed && REPORT_TABLE_BORDER_CLASS,
          !framed && 'rounded-none border-0 shadow-none ring-0',
        )}
        style={{ boxShadow: 'none' }}
      >
        <Table.Content aria-label={ariaLabel} className="w-full !shadow-none ring-0">
          {children}
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
