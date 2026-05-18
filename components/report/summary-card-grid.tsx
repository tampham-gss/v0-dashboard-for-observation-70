'use client'

import { BarChart2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KpiStatCard, resolveKpiTone, type KpiStatTone } from './report-card'

export interface SummaryCardItem {
  title: string
  value: string
  description?: string
  valueClassName?: string
  icon?: LucideIcon
  tone?: KpiStatTone
}

export function SummaryCardGrid({
  items,
  isLoading,
  columns = 'sm:grid-cols-2 lg:grid-cols-4',
  valueSize = 'md',
  compact = true,
}: {
  items: SummaryCardItem[]
  isLoading?: boolean
  columns?: string
  valueSize?: 'md' | 'sm'
  compact?: boolean
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-4', columns)}>
      {items.map((item) => (
        <KpiStatCard
          key={item.title}
          title={item.title}
          value={item.value}
          description={item.description}
          icon={item.icon ?? BarChart2}
          tone={resolveKpiTone(item)}
          valueClassName={item.valueClassName}
          valueSize={valueSize}
          isLoading={isLoading}
          compact={compact}
        />
      ))}
    </div>
  )
}
