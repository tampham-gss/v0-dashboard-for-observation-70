'use client'

import { Table } from '@heroui/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  REPORT_TABLE_ROOT_CLASS,
  REPORT_TABLE_SCROLL_CLASS,
  REPORT_TABLE_SHELL_CLASS,
} from './report-table-chrome'

export function ReportDataTable({
  'aria-label': ariaLabel,
  children,
  className,
}: {
  'aria-label': string
  children: ReactNode
  className?: string
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
      <Table.ScrollContainer className={REPORT_TABLE_SCROLL_CLASS}>
        <Table.Content aria-label={ariaLabel} className="w-full">
          {children}
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
