'use client'

import { Card } from '@heroui/react'
import type { ElementType } from 'react'
import { cn } from '@/lib/utils'

/** Padding ngang mặc định cho KPI tile. */
export const KPI_CARD_INNER_X = 'px-3'

/** Padding dọc mặc định. */
export const KPI_CARD_INNER_Y = 'py-1.5'

/** Padding dọc gọn cho summary / metric strip. */
export const KPI_CARD_INNER_Y_COMPACT = 'py-0.5'

export const KPI_CARD_INNER_CLASS = `${KPI_CARD_INNER_X} ${KPI_CARD_INNER_Y}`

export const KPI_CARD_INNER_COMPACT_CLASS = `${KPI_CARD_INNER_X} ${KPI_CARD_INNER_Y_COMPACT}`

/** Một dòng KPI trong widget — không bọc card (dạng list). */
export function KpiMetricListRow({
  label,
  value,
  icon: Icon,
  valueClass = 'text-gray-900',
  iconClass = 'text-blue-500',
  valueSize = 'md',
  sub,
  className,
}: {
  label: string
  value: string | number
  icon: ElementType
  valueClass?: string
  iconClass?: string
  valueSize?: 'md' | 'sm'
  sub?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 py-2',
        className,
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 stroke-[1.75]', iconClass)} aria-hidden />
      <div className="min-w-0">
        <p className="truncate text-sm leading-snug text-gray-700">{label}</p>
        {sub ? (
          <p className="truncate text-[11px] leading-snug text-gray-500">{sub}</p>
        ) : null}
      </div>
      <p
        className={cn(
          'shrink-0 text-right font-bold leading-none tabular-nums whitespace-nowrap',
          valueSize === 'sm' ? 'text-base' : 'text-lg',
          valueClass,
        )}
      >
        {value}
      </p>
    </div>
  )
}

/** KPI tile — style tham chiếu MasterData (HeroUI Card + body compact). */
export function MasterDataKpiCard({
  label,
  value,
  icon: Icon,
  valueClass = 'text-gray-900',
  iconClass = 'text-blue-500',
  sub,
  className,
  compact = false,
}: {
  label: string
  value: string | number
  icon: ElementType
  valueClass?: string
  iconClass?: string
  sub?: string
  className?: string
  /** Giảm padding trên/dưới cho dải summary KPI. */
  compact?: boolean
}) {
  return (
    <Card className={cn('rounded-lg border border-gray-200 bg-white shadow-none', className)}>
      <Card.Content className="!gap-0 !p-0">
        <div
          className={cn(
            'flex items-center justify-between gap-2',
            KPI_CARD_INNER_X,
            compact ? KPI_CARD_INNER_Y_COMPACT : KPI_CARD_INNER_Y,
          )}
        >
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-xs leading-none text-gray-600">{label}</p>
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
              <p
                className={cn(
                  'text-lg font-bold leading-none tabular-nums [overflow-wrap:anywhere]',
                  valueClass,
                )}
              >
                {value}
              </p>
              {sub ? (
                <p className="text-[11px] leading-none text-gray-500">{sub}</p>
              ) : null}
            </div>
          </div>
          <Icon className={cn('h-5 w-5 shrink-0 stroke-[1.75]', iconClass)} aria-hidden />
        </div>
      </Card.Content>
    </Card>
  )
}
