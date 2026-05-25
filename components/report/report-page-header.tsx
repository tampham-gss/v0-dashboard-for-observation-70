'use client'

import type { ReactNode } from 'react'
import { Button } from '@heroui/react'
import { FileSpreadsheet, RefreshCw } from 'lucide-react'
import { reportButtonClass } from './report-button-chrome'
import { ReportBreadcrumb } from './report-breadcrumb'

export function ReportPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6">
      <ReportBreadcrumb current={title} />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{subtitle}</p>
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">{actions}</div>
        ) : null}
      </div>
    </div>
  )
}

export function ReportHeaderActions({
  onRefresh,
  onExport,
}: {
  onRefresh: () => void
  onExport: () => void
}) {
  return (
    <>
      <Button
        variant="outline"
        size="md"
        className={reportButtonClass(
          'min-h-10 gap-2 border-gray-300 bg-white px-4 text-gray-700 hover:bg-gray-50',
        )}
        onPress={onRefresh}
      >
        <RefreshCw className="size-4 shrink-0 text-gray-500" aria-hidden />
        Làm mới dữ liệu
      </Button>
      <Button
        variant="outline"
        size="md"
        className={reportButtonClass(
          'min-h-10 gap-2 border-gray-300 bg-white px-4 text-gray-700 hover:bg-gray-50',
        )}
        onPress={onExport}
      >
        <FileSpreadsheet className="size-4 shrink-0 text-gray-500" aria-hidden />
        Xuất báo cáo
      </Button>
    </>
  )
}
