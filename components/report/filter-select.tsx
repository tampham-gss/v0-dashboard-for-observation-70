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

/** Popover dropdown — bo góc nhỏ (tránh pill quá tròn; class riêng cho portal). */
export const FILTER_SELECT_POPOVER_CLASS = cn(
  'report-filter-select-popover',
  '!rounded-md !border-gray-200 overflow-hidden shadow-md',
)

export const FILTER_LISTBOX_CLASS = 'p-1'
export const FILTER_LISTBOX_ITEM_CLASS = 'rounded-sm px-2 py-1.5 text-sm text-foreground'

export function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
  triggerTitle,
  displayValue,
  popoverClassName,
}: {
  label: string
  value: T
  options: { id: T; label: string }[]
  onChange: (value: T) => void
  className?: string
  /** Tooltip / title khi nhãn dài (vd. tuần kèm khoảng ngày). */
  triggerTitle?: string
  /** Nhãn ngắn trên trigger (dropdown vẫn dùng label đầy đủ). */
  displayValue?: string
  popoverClassName?: string
}) {
  const selected = options.find((o) => o.id === value)
  const triggerText = displayValue ?? selected?.label ?? value

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
      <Select.Trigger
        className={cn('w-full min-w-0', FILTER_CONTROL_TRIGGER_CLASS)}
        title={triggerTitle ?? selected?.label ?? triggerText}
      >
        <Select.Value className={FILTER_CONTROL_VALUE_CLASS}>{triggerText}</Select.Value>
        <Select.Indicator className={FILTER_CONTROL_INDICATOR_CLASS} />
      </Select.Trigger>
      <Select.Popover className={cn(FILTER_SELECT_POPOVER_CLASS, popoverClassName)}>
        <ListBox aria-label={label} className={FILTER_LISTBOX_CLASS}>
          {options.map((opt) => (
            <ListBox.Item
              key={opt.id}
              id={opt.id}
              textValue={opt.label}
              className={FILTER_LISTBOX_ITEM_CLASS}
            >
              {opt.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
