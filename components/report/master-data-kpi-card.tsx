'use client'

import { Card } from '@heroui/react'
import type { ElementType } from 'react'
import { cn } from '@/lib/utils'

/** Padding dọc bù trừ gap giữa label ↔ value (giữ nguyên chiều cao card). */
export const KPI_CARD_INNER_CLASS = 'px-3.5 py-[7px]'

/** KPI tile — style tham chiếu MasterData (HeroUI Card + body compact). */
export function MasterDataKpiCard({
  label,
  value,
  icon: Icon,
  valueClass = 'text-gray-900',
  iconClass = 'text-blue-500',
  sub,
  className,
}: {
  label: string
  value: string | number
  icon: ElementType
  valueClass?: string
  iconClass?: string
  sub?: string
  className?: string
}) {
  return (
    <Card className={cn('rounded-lg border border-gray-200 bg-white shadow-none', className)}>
      <Card.Content className="!gap-0 !p-0">
        <div className={cn('flex items-center justify-between gap-2', KPI_CARD_INNER_CLASS)}>
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
