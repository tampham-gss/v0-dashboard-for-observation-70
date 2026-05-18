'use client'

import type { ReactNode } from 'react'
import { Input, Label, SearchField } from '@heroui/react'
import { FILTER_CONTROL_SURFACE_CLASS, FILTER_CONTROL_TRIGGER_CLASS } from './filter-select'

export const FILTER_LABEL_CLASS = 'mb-1 text-[11px] font-medium leading-none text-gray-600'

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
        className={FILTER_CONTROL_TRIGGER_CLASS}
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
        <SearchField.Group className={FILTER_CONTROL_TRIGGER_CLASS}>
          <SearchField.SearchIcon />
          <SearchField.Input className="bg-white" placeholder={placeholder} />
          {value.trim().length > 0 ? <SearchField.ClearButton /> : null}
        </SearchField.Group>
      </SearchField>
    </FilterField>
  )
}
