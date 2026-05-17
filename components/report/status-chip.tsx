'use client'

import { Chip } from '@heroui/react'
import type { CPStatus, SLStatus, StatusChipColor } from '@/lib/report-mock-data'
import { getCPStatusColor, getSLStatusColor } from '@/lib/report-mock-data'

export function SLStatusChip({ status }: { status: SLStatus }) {
  return <StatusChip label={status} color={getSLStatusColor(status)} />
}

export function CPStatusChip({ status }: { status: CPStatus }) {
  return <StatusChip label={status} color={getCPStatusColor(status)} />
}

function StatusChip({ label, color }: { label: string; color: StatusChipColor }) {
  return (
    <Chip color={color} size="sm" variant="soft">
      <Chip.Label>{label}</Chip.Label>
    </Chip>
  )
}
