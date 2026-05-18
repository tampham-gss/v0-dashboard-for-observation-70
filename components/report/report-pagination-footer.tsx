'use client'

import { Button } from '@heroui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const PAGE_BTN =
  'min-h-9 min-w-9 gap-1 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 data-[disabled]:opacity-40'

export function ReportPaginationFooter({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number
  pageSize: number
  total: number
  onPageChange: (next: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-600">
        Hiển thị{' '}
        <span className="font-medium tabular-nums text-gray-900">{from}</span>
        {' – '}
        <span className="font-medium tabular-nums text-gray-900">{to}</span>
        {' trên tổng số '}
        <span className="font-medium tabular-nums text-gray-900">{total}</span> kết quả
      </p>
      <nav
        aria-label="Phân trang"
        className="flex w-full flex-wrap items-center gap-1 sm:w-auto sm:justify-end"
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={PAGE_BTN}
          onPress={() => onPageChange(Math.max(1, page - 1))}
          isDisabled={page <= 1}
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden />
          Trước
        </Button>
        <span
          aria-current="page"
          className={cn(
            PAGE_BTN,
            'inline-flex items-center justify-center border-blue-500 bg-blue-50 text-blue-700',
          )}
        >
          {page}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={PAGE_BTN}
          onPress={() => onPageChange(Math.min(totalPages, page + 1))}
          isDisabled={page >= totalPages || total === 0}
        >
          Sau
          <ChevronRight className="size-4 shrink-0" aria-hidden />
        </Button>
      </nav>
    </div>
  )
}
