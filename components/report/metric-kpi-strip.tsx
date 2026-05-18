'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KpiStatCard, resolveKpiTone, type KpiStatTone } from './report-card'

export interface MetricKpiItem {
  title: string
  value: string
  description?: string
  valueClassName?: string
  icon: LucideIcon
  /** Màu semantic: icon outline + giá trị (theo mẫu HeroUI KPI). */
  tone?: KpiStatTone
  /** @deprecated Dùng `tone`. Vẫn map tự động nếu còn truyền. */
  iconBgClassName?: string
}

export function MetricKpiStrip({
  items,
  isLoading,
  columnsClassName = 'sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5',
  valueSize = 'md',
}: {
  items: MetricKpiItem[]
  isLoading?: boolean
  columnsClassName?: string
  valueSize?: 'md' | 'sm'
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-3', columnsClassName)}>
      {items.map((item) => (
        <KpiStatCard
          key={item.title}
          title={item.title}
          value={item.value}
          description={item.description}
          icon={item.icon}
          tone={resolveKpiTone(item)}
          valueClassName={item.valueClassName}
          valueSize={valueSize}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}
