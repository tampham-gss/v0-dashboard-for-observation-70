'use client'

import { ListBox, Select } from '@heroui/react'
import { cn } from '@/lib/utils'

/** Nền trắng cho ô lọc HeroUI (override variant secondary) */
export const FILTER_CONTROL_SURFACE_CLASS =
  '!bg-white bg-white border border-gray-200 text-gray-900 shadow-none'

/** Trigger/input bộ lọc — căn giữa chữ theo chiều dọc */
export const FILTER_CONTROL_TRIGGER_CLASS = cn(
  FILTER_CONTROL_SURFACE_CLASS,
  '!rounded-md !flex !h-8 !min-h-8 !w-full !items-center !justify-between gap-2 !px-2.5 !py-0 text-sm !leading-normal',
)

export const FILTER_CONTROL_VALUE_CLASS =
  'min-w-0 flex-1 truncate text-left leading-normal [&_[data-slot=value]]:leading-normal'

export const FILTER_CONTROL_INDICATOR_CLASS = 'flex shrink-0 items-center self-center text-gray-500'

export function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  value: T
  options: { id: T; label: string }[]
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <Select
      aria-label={label}
      className={className}
      fullWidth
      variant="secondary"
      value={value}
      onChange={(next) => {
        if (next != null && !Array.isArray(next)) onChange(String(next) as T)
      }}
    >
      <Select.Trigger className={cn('w-full min-w-0', FILTER_CONTROL_TRIGGER_CLASS)}>
        <Select.Value className={FILTER_CONTROL_VALUE_CLASS} />
        <Select.Indicator className={FILTER_CONTROL_INDICATOR_CLASS} />
      </Select.Trigger>
      <Select.Popover>
        <ListBox aria-label={label} className="p-1">
          {options.map((opt) => (
            <ListBox.Item
              key={opt.id}
              id={opt.id}
              textValue={opt.label}
              className="rounded-md px-2 py-2 text-sm text-foreground"
            >
              {opt.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
