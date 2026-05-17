'use client'

import type { ReactNode } from 'react'
import { Card, Skeleton } from '@heroui/react'
import { cn } from '@/lib/utils'

export interface SummaryCardItem {
  title: string
  value: string
  description?: string
  valueClassName?: string
}

export function SummaryCardGrid({
  items,
  isLoading,
  columns = 'sm:grid-cols-2 lg:grid-cols-4',
}: {
  items: SummaryCardItem[]
  isLoading?: boolean
  columns?: string
}) {
  if (isLoading) {
    return (
      <SummaryGrid columns={columns}>
        {items.map((item) => (
          <Card key={item.title} className="border border-border bg-surface p-4">
            <Skeleton className="mb-2 h-4 w-28 rounded-md" />
            <Skeleton className="h-8 w-36 max-w-full rounded-md" />
            {item.description ? <Skeleton className="mt-2 h-3 w-24 rounded-md" /> : null}
          </Card>
        ))}
      </SummaryGrid>
    )
  }

  return (
    <SummaryGrid columns={columns}>
      {items.map((item) => (
        <Card key={item.title} className="border border-border bg-surface p-4">
          <p className="text-sm font-medium text-foreground/85">{item.title}</p>
          <p
            className={cn(
              'mt-1 font-semibold',
              item.valueClassName ?? 'text-2xl text-foreground',
            )}
          >
            {item.value}
          </p>
          {item.description ? (
            <p className="mt-2 text-sm leading-snug text-foreground/75">{item.description}</p>
          ) : null}
        </Card>
      ))}
    </SummaryGrid>
  )
}

function SummaryGrid({ children, columns }: { children: ReactNode; columns: string }) {
  return <div className={`grid grid-cols-1 gap-4 ${columns}`}>{children}</div>
}
