'use client'

import { ListBox, Select } from '@heroui/react'
import { cn } from '@/lib/utils'

/** Nền trắng cho ô lọc HeroUI (override variant secondary) */
export const FILTER_CONTROL_SURFACE_CLASS =
  '!bg-white bg-white border border-gray-200 text-gray-900 shadow-none'

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
      <Select.Trigger className={cn('min-h-10 w-full min-w-0', FILTER_CONTROL_SURFACE_CLASS)}>
        <Select.Value />
        <Select.Indicator />
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
