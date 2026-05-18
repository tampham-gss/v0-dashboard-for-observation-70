'use client'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card, Skeleton } from '@heroui/react'
import { cn } from '@/lib/utils'
import { KPI_CARD_INNER_CLASS, MasterDataKpiCard } from './master-data-kpi-card'

/** Viền + nền thống nhất cho card báo cáo (filter, chart, bảng). */
export const REPORT_CARD_CLASS =
  'overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'

export type KpiStatTone = 'default' | 'primary' | 'success' | 'danger' | 'warning'

const KPI_TONE_STYLES: Record<KpiStatTone, { icon: string; value: string }> = {
  default: { icon: 'text-blue-500', value: 'text-gray-900' },
  primary: { icon: 'text-blue-500', value: 'text-gray-900' },
  success: { icon: 'text-green-600', value: 'text-green-600' },
  danger: { icon: 'text-red-600', value: 'text-red-600' },
  warning: { icon: 'text-amber-600', value: 'text-amber-600' },
}

export function resolveKpiTone(input: {
  tone?: KpiStatTone
  iconBgClassName?: string
  valueClassName?: string
}): KpiStatTone {
  if (input.tone) return input.tone
  const bg = input.iconBgClassName ?? ''
  if (/red/i.test(bg)) return 'danger'
  if (/orange|amber/i.test(bg)) return 'warning'
  if (/emerald|green|teal/i.test(bg)) return 'success'
  const vc = input.valueClassName ?? ''
  if (/red-6/i.test(vc)) return 'danger'
  if (/amber|yellow/i.test(vc)) return 'warning'
  if (/green|emerald/i.test(vc)) return 'success'
  return 'default'
}

export function ReportSurfaceCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <Card className={cn(REPORT_CARD_CLASS, className)}>{children}</Card>
}

export function KpiStatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = 'default',
  valueClassName,
  iconClassName,
  valueSize = 'md',
  isLoading,
}: {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  tone?: KpiStatTone
  valueClassName?: string
  iconClassName?: string
  valueSize?: 'md' | 'sm'
  isLoading?: boolean
}) {
  const styles = KPI_TONE_STYLES[tone]
  const valueClass = cn(
    valueSize === 'sm' && 'text-base font-bold leading-none sm:text-lg',
    valueClassName ?? styles.value,
  )
  const iconClass = iconClassName ?? styles.icon

  if (isLoading) {
    return (
      <Card className="rounded-lg border border-gray-200 bg-white shadow-none">
        <Card.Content className="!gap-0 !p-0">
          <div className={cn('flex items-center justify-between gap-2', KPI_CARD_INNER_CLASS)}>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Skeleton className="h-2.5 w-20 max-w-full rounded-md" />
              <Skeleton className="h-5 w-24 max-w-full rounded-md" />
            </div>
            <Skeleton className="h-5 w-5 shrink-0 rounded-md" />
          </div>
        </Card.Content>
      </Card>
    )
  }

  return (
    <MasterDataKpiCard
      label={title}
      value={value}
      sub={description}
      icon={Icon}
      valueClass={valueClass}
      iconClass={iconClass}
    />
  )
}

export function ReportSectionCard({
  title,
  description,
  children,
  action,
  isLoading,
  bodyClassName,
}: {
  title: string
  description?: string
  children: ReactNode
  action?: ReactNode
  isLoading?: boolean
  bodyClassName?: string
}) {
  return (
    <Card className={REPORT_CARD_CLASS}>
      <div className="flex flex-col gap-1 px-5 pt-4 pb-0 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className={cn('px-5 pb-4 pt-3 sm:pb-5', bodyClassName)}>
        {isLoading ? <Skeleton className="h-[280px] w-full rounded-lg" /> : children}
      </div>
    </Card>
  )
}
