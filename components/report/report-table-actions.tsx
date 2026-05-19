'use client'

import { Button } from '@heroui/react'
import { Eye } from 'lucide-react'
import { reportButtonClass } from './report-button-chrome'

const TABLE_ACTION_CLASS = reportButtonClass(
  'h-8 min-h-8 cursor-pointer gap-1.5 px-2.5 text-xs font-medium',
  'border border-blue-200 bg-blue-50/60 text-blue-700 underline-offset-2',
  'hover:border-blue-400 hover:bg-blue-100 hover:text-blue-800 hover:underline',
  'data-[hover=true]:border-blue-400 data-[hover=true]:bg-blue-100 data-[hover=true]:text-blue-800',
  'focus-visible:ring-2 focus-visible:ring-blue-500/40',
  'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:no-underline',
  'disabled:hover:border-gray-200 disabled:hover:bg-gray-50 disabled:hover:text-gray-400',
)

/** Nút chữ ngắn (SL / CP) trong cột Thao tác. */
export function ReportTableLabelAction({
  label,
  onPress,
  isDisabled,
  'aria-label': ariaLabel,
}: {
  label: string
  onPress: () => void
  isDisabled?: boolean
  'aria-label'?: string
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      isDisabled={isDisabled}
      aria-label={ariaLabel ?? `Xem ${label}`}
      className={TABLE_ACTION_CLASS}
      onPress={onPress}
    >
      {label}
    </Button>
  )
}

/** Nút xem chi tiết (icon + nhãn) trong cột Thao tác. */
export function ReportTableViewAction({
  onPress,
  label = 'Xem',
}: {
  onPress: () => void
  label?: string
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      aria-label="Xem chi tiết"
      className={TABLE_ACTION_CLASS}
      onPress={onPress}
    >
      <Eye className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
      {label}
    </Button>
  )
}
