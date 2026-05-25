'use client'

import { Button } from '@heroui/react'
import { FILTER_CONTROL_SURFACE_CLASS } from './filter-select'
import { reportButtonClass } from './report-button-chrome'
import { cn } from '@/lib/utils'

const COMPACT_BTN_CLASS = reportButtonClass(
  'inline-flex h-8 min-h-8 shrink-0 items-center px-3 text-sm leading-normal',
)

export function FilterPanelActions({
  onSearch,
  onRefresh,
  onExport,
  compact = false,
}: {
  onSearch: () => void
  onRefresh: () => void
  onExport: () => void
  /** Cao 32px — khớp ô lọc (h-8). */
  compact?: boolean
}) {
  if (compact) {
    return (
      <div className="flex shrink-0 flex-wrap items-center gap-2 self-end">
        <Button variant="primary" className={COMPACT_BTN_CLASS} onPress={onSearch}>
          Áp dụng
        </Button>
        <Button
          variant="outline"
          className={cn(COMPACT_BTN_CLASS, FILTER_CONTROL_SURFACE_CLASS, 'hover:bg-gray-50')}
          onPress={onRefresh}
        >
          Đặt lại
        </Button>
        <Button
          variant="outline"
          className={cn(COMPACT_BTN_CLASS, FILTER_CONTROL_SURFACE_CLASS, 'hover:bg-gray-50')}
          onPress={onExport}
        >
          Xuất PDF
        </Button>
      </div>
    )
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 self-end">
      <Button
        variant="primary"
        size="md"
        className={reportButtonClass('min-h-10 shrink-0 px-5')}
        onPress={onSearch}
      >
        Áp dụng
      </Button>
      <Button
        variant="outline"
        size="md"
        className={reportButtonClass(
          'min-h-10 shrink-0 border-gray-300 bg-white px-4 text-gray-700 hover:bg-gray-50',
        )}
        onPress={onRefresh}
      >
        Đặt lại
      </Button>
      <Button
        variant="outline"
        size="md"
        className={reportButtonClass(
          'min-h-10 shrink-0 border-gray-300 bg-white px-4 text-gray-700 hover:bg-gray-50',
        )}
        onPress={onExport}
      >
        Xuất PDF
      </Button>
    </div>
  )
}
