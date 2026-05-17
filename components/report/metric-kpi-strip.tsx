'use client'

import type { LucideIcon } from 'lucide-react'
import { Skeleton } from '@heroui/react'
import { cn } from '@/lib/utils'

export interface MetricKpiItem {
  title: string
  value: string
  description?: string
  valueClassName?: string
  icon: LucideIcon
  /** Nền ô icon — như bg-blue-500 trong docs/example/.../KpiCards.tsx */
  iconBgClassName?: string
}

/** KPI tile giống docs/example/app/dashboard/fleet-daily-activity/components/KpiCards.tsx */
const DEFAULT_ICON_BG = 'bg-blue-500'

const valueSizeClass = {
  md: 'text-xl sm:text-2xl',
  sm: 'text-base sm:text-lg',
} as const

const valueSkeletonClass = {
  md: 'h-9',
  sm: 'h-7',
} as const

export function MetricKpiStrip({
  items,
  isLoading,
  columnsClassName = 'sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5',
  valueSize = 'md',
}: {
  items: MetricKpiItem[]
  isLoading?: boolean
  columnsClassName?: string
  /** `sm`: số tiền dài (tab CP) — chữ nhỏ hơn */
  valueSize?: keyof typeof valueSizeClass
}) {
  const grid = cn('grid grid-cols-1 gap-4', columnsClassName)

  if (isLoading) {
    return (
      <div className={grid}>
        {items.map((item) => (
          <div
            key={item.title}
            className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <Skeleton className="pointer-events-none absolute right-5 top-5 size-[3.25rem] shrink-0 rounded-lg" />
            <div className="min-w-0 space-y-2 pr-[4.25rem]">
              <Skeleton className="h-4 w-32 max-w-full rounded-md" />
              <Skeleton
                className={cn('w-full max-w-[12rem] rounded-md', valueSkeletonClass[valueSize])}
              />
              {item.description ? <Skeleton className="h-3 w-36 max-w-full rounded-md" /> : null}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={grid}>
      {items.map((item) => {
        const Icon = item.icon
        const iconBg = item.iconBgClassName ?? DEFAULT_ICON_BG
        return (
          <div
            key={item.title}
            className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div
              className={cn(
                'pointer-events-none absolute right-5 top-5 shrink-0 rounded-lg p-3 text-white',
                iconBg,
              )}
              aria-hidden
            >
              <Icon className="size-6" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 pr-[4.25rem]">
              <p className="mb-1 text-xl font-bold ">{item.title}</p>
              <p
                className={cn(
                  'font-semi tabular-nums leading-snug text-gray-900 [overflow-wrap:anywhere]',
                  valueSizeClass[valueSize],
                  item.valueClassName,
                )}
              >
                {item.value}
              </p>
              {item.description ? (
                <p className="mt-1 text-xs text-gray-400">{item.description}</p>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
