'use client'

import { Pagination } from '@heroui/react'

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
      <Pagination aria-label="Phân trang" size="sm" className="flex w-full justify-start sm:w-auto sm:justify-end">
        <Pagination.Content className="flex flex-wrap items-center gap-1">
          <Pagination.Item>
            <Pagination.Previous
              className={PAGE_BTN}
              onPress={() => onPageChange(Math.max(1, page - 1))}
              isDisabled={page <= 1}
            >
              <Pagination.PreviousIcon />
              Trước
            </Pagination.Previous>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link isActive className={`${PAGE_BTN} border-blue-500 bg-blue-50 text-blue-700`}>
              {page}
            </Pagination.Link>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Next
              className={PAGE_BTN}
              onPress={() => onPageChange(Math.min(totalPages, page + 1))}
              isDisabled={page >= totalPages || total === 0}
            >
              Sau
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  )
}
