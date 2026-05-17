'use client'

import { Button, Card } from '@heroui/react'
import { Gauge, LayoutDashboard, Package, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReportSectionTabId } from './report-section-tabs'

const TABS: { id: ReportSectionTabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'sl', label: 'Sản lượng', icon: Package },
  { id: 'cp', label: 'Chi phí', icon: Receipt },
  { id: 'efficiency', label: 'Hiệu quả', icon: Gauge },
]

export function ReportSectionTabBar({
  value,
  onValueChange,
}: {
  value: ReportSectionTabId
  onValueChange: (next: ReportSectionTabId) => void
}) {
  return (
    <Card className="mb-6 border border-gray-200 bg-white p-1.5 shadow-sm">
      <div
        role="tablist"
        aria-label="Tab báo cáo"
        className="flex w-full max-w-full flex-wrap gap-1 sm:flex-nowrap"
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
              size="md"
              className={cn(
                'min-h-10 flex-1 gap-2 px-4 sm:flex-none',
                !active && 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
              onPress={() => onValueChange(id)}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
              {label}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
