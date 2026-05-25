'use client'

import { Button } from '@heroui/react'
import { ReportSurfaceCard } from './report-card'
import { FileSpreadsheet, LayoutDashboard, Package, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'
import { reportButtonClass } from './report-button-chrome'
import type { ReportSectionTabId } from './report-section-tabs'

const TABS: { id: ReportSectionTabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'bcWeek', label: 'Báo cáo tuần', icon: FileSpreadsheet },
  { id: 'bcMonth', label: 'Báo cáo tháng', icon: FileSpreadsheet },
  { id: 'sl', label: 'Sản lượng', icon: Package },
  { id: 'cp', label: 'Chi phí', icon: Receipt },
]

export function ReportSectionTabBar({
  value,
  onValueChange,
}: {
  value: ReportSectionTabId
  onValueChange: (next: ReportSectionTabId) => void
}) {
  return (
    <ReportSurfaceCard className="mb-4 p-0.5">
      <div
        role="tablist"
        aria-label="Tab báo cáo"
        className="flex w-full max-w-full flex-wrap gap-0.5 sm:flex-nowrap"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = value === id
          return (
            <Button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              variant={active ? 'primary' : 'ghost'}
              size="sm"
              className={reportButtonClass(
                'min-h-5 min-w-[5rem] flex-1 gap-1.5 px-2.5 py-0 text-xs sm:min-w-[5.5rem] sm:flex-none',
                active &&
                  'border-blue-600 bg-blue-600 text-white shadow-none hover:bg-blue-700 data-[hover=true]:bg-blue-700',
                !active && 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
              onPress={() => onValueChange(id)}
            >
              <Icon
                className={cn('size-3.5 shrink-0', active ? 'text-white' : 'text-current')}
                strokeWidth={1.75}
                aria-hidden
              />
              {label}
            </Button>
          )
        })}
      </div>
    </ReportSurfaceCard>
  )
}
