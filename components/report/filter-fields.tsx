'use client'

import type { ReactNode } from 'react'
import { Input, Label, SearchField } from '@heroui/react'
import { cn } from '@/lib/utils'
import { FILTER_CONTROL_TRIGGER_CLASS } from './filter-select'

export const FILTER_LABEL_CLASS = 'mb-1.5 block text-[11px] font-medium leading-none text-gray-600'

export function FilterField({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Label className={FILTER_LABEL_CLASS}>{label}</Label>
      {children}
    </div>
  )
}

export function FilterDateInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <FilterField label={label}>
      <Input
        type="date"
        aria-label={label}
        fullWidth
        variant="secondary"
        className={cn(
          FILTER_CONTROL_TRIGGER_CLASS,
          '[&_input]:!flex [&_input]:!h-8 [&_input]:!min-h-0 [&_input]:!items-center [&_input]:!border-0 [&_input]:!bg-transparent [&_input]:!py-0 [&_input]:!shadow-none [&_input]:!leading-normal',
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FilterField>
  )
}

export function FilterKeywordSearch({
  value,
  placeholder,
  onChange,
  className,
}: {
  value: string
  placeholder: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <FilterField label="Từ khóa" className={className}>
      <SearchField
        aria-label="Từ khóa"
        fullWidth
        variant="secondary"
        className="w-full border-0 bg-transparent p-0 shadow-none"
        value={value}
        onChange={onChange}
      >
        <SearchField.Group className={cn(FILTER_CONTROL_TRIGGER_CLASS, 'gap-2')}>
          <SearchField.SearchIcon className="shrink-0 self-center text-gray-400" />
          <SearchField.Input
            className="min-w-0 flex-1 self-center border-0 bg-transparent px-0 py-0 leading-normal shadow-none"
            placeholder={placeholder}
          />
          {value.trim().length > 0 ? <SearchField.ClearButton /> : null}
        </SearchField.Group>
      </SearchField>
    </FilterField>
  )
}
