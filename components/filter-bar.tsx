'use client'

import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Autocomplete,
  Button,
  ListBox,
  SearchField,
  useFilter,
} from '@heroui/react'
import { ChevronsUpDown, RotateCcw } from 'lucide-react'
import { regions, hubs, getDashboardFilterOptions } from '@/lib/mock-data'
import type { FilterPeriod } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  period: FilterPeriod
  setPeriod: (period: FilterPeriod) => void
  selectedRegion: string[]
  setSelectedRegion: Dispatch<SetStateAction<string[]>>
  selectedHub: string[]
  setSelectedHub: Dispatch<SetStateAction<string[]>>
  selectedCustomer: string[]
  setSelectedCustomer: Dispatch<SetStateAction<string[]>>
  selectedStatus: string[]
  setSelectedStatus: Dispatch<SetStateAction<string[]>>
  selectedWarehouse: string[]
  setSelectedWarehouse: Dispatch<SetStateAction<string[]>>
  selectedRoute: string[]
  setSelectedRoute: Dispatch<SetStateAction<string[]>>
  selectedPersonnel: string[]
  setSelectedPersonnel: Dispatch<SetStateAction<string[]>>
  selectedCsOps: string[]
  setSelectedCsOps: Dispatch<SetStateAction<string[]>>
  canResetFilters: boolean
  onResetFilters: () => void
  /** Apply / refresh dashboard with current filter values (explicit action). */
  onApplyFilters: () => void
}

export type HeroFilterOption = { id: string; label: string }

/** id thẻ <label> — dùng với aria-labelledby / htmlFor (a11y RAC). */
export const FILTER_FIELD_LABEL_IDS = {
  period: 'filter-bar-lbl-period',
  region: 'filter-bar-lbl-region',
  hub: 'filter-bar-lbl-hub',
  customer: 'filter-bar-lbl-customer',
  status: 'filter-bar-lbl-status',
  warehouse: 'filter-bar-lbl-warehouse',
  route: 'filter-bar-lbl-route',
  personnel: 'filter-bar-lbl-personnel',
  csOps: 'filter-bar-lbl-csops',
} as const

/** HeroUI Autocomplete đa chọn — giao diện combobox nền trắng, danh sách chữ đen. */
function HeroMultiFilterSelect(props: {
  options: HeroFilterOption[]
  value: string[]
  onChange: (next: string[]) => void
  placeholderEmpty: string
  triggerClassName: string
  listLabel: string
  /** Trùng với `id` của `<label>` cùng hàng — bắt buộc cho a11y (RAC). */
  labelledBy: string
}) {
  const { options, value, onChange, placeholderEmpty, triggerClassName, listLabel, labelledBy } = props
  const { contains } = useFilter({ sensitivity: 'base' })
  const optionsKey = useMemo(() => options.map((o) => o.id).join('\u0001'), [options])

  const triggerShell =
    'rounded-md border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-950'
  const focusRing =
    'focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:border-zinc-500 dark:focus-within:ring-white/10'

  return (
    <Autocomplete
      key={`${listLabel}-${optionsKey}`}
      aria-labelledby={labelledBy}
      selectionMode="multiple"
      value={value}
      onChange={(next) => {
        if (next == null) onChange([])
        else if (Array.isArray(next)) onChange(next.map(String))
        else onChange([String(next)])
      }}
      onClear={() => onChange([])}
      fullWidth
      variant="secondary"
      className="w-full min-w-0"
    >
      <Autocomplete.Trigger
        className={cn(
          triggerClassName,
          'flex h-9 w-full min-w-0 items-center gap-1.5 px-2.5 py-0 text-left text-sm outline-none transition-[box-shadow,border-color]',
          triggerShell,
          focusRing,
          'hover:border-zinc-300 dark:hover:border-zinc-600',
        )}
      >
        <Autocomplete.Value className="min-w-0 flex-1 truncate font-sans font-normal text-zinc-900 dark:text-zinc-100">
          {({ selectedItems }) => {
            const n = selectedItems?.length ?? 0
            if (n === 0) {
              return <span className="text-zinc-500 dark:text-zinc-400">{placeholderEmpty}</span>
            }
            return <span className="text-zinc-900 dark:text-zinc-100">{`${n} mục đã chọn`}</span>
          }}
        </Autocomplete.Value>
        <div className="flex shrink-0 items-center gap-0.5 border-l border-zinc-200/80 pl-1 dark:border-zinc-600/80">
          <Autocomplete.ClearButton
            className="rounded p-0.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Bỏ chọn tất cả"
          />
          <Autocomplete.Indicator
            aria-label="Mở hoặc đóng danh sách"
            className="p-0.5 text-zinc-500 dark:text-zinc-400"
          >
            <ChevronsUpDown aria-hidden className="size-4" strokeWidth={1.75} />
          </Autocomplete.Indicator>
        </div>
      </Autocomplete.Trigger>
      <Autocomplete.Popover
        placement="bottom start"
        className={cn(
          'w-[var(--trigger-width)] max-w-[min(100vw-1.5rem,var(--trigger-width))] overflow-hidden rounded-lg border border-zinc-200 bg-white p-0 shadow-lg dark:border-zinc-700 dark:bg-zinc-950',
          'max-h-[min(70vh,22rem)]',
        )}
      >
        <Autocomplete.Filter filter={contains}>
          <div className="border-b border-zinc-200 p-2 dark:border-zinc-700">
            <SearchField
              className="w-full"
              aria-label={`Tìm kiếm trong bộ lọc ${listLabel}`}
            >
              <SearchField.Group className="flex h-9 w-full items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 dark:border-zinc-600 dark:bg-zinc-900">
                <SearchField.SearchIcon className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
                <SearchField.Input
                  placeholder="Tìm kiếm"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
              </SearchField.Group>
            </SearchField>
          </div>
          <ListBox
            aria-label={`Danh sách ${listLabel}`}
            className={cn(
              'max-h-[min(50vh,16rem)] overflow-y-auto p-1.5 outline-none',
              '[scrollbar-width:thin]',
              '[scrollbar-color:rgb(212_212_216)_transparent]',
              '[&::-webkit-scrollbar]:w-2',
              '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600',
            )}
          >
            {options.map((item) => (
              <ListBox.Item
                key={item.id}
                id={item.id}
                textValue={item.label}
                className={cn(
                  'cursor-pointer rounded-md px-2.5 py-2 outline-none transition-colors',
                  'text-zinc-950 dark:text-zinc-50',
                  'data-[highlighted]:bg-zinc-100 data-[focused]:bg-zinc-100 dark:data-[highlighted]:bg-zinc-800/80 dark:data-[focused]:bg-zinc-800/80',
                  'data-[selected]:bg-zinc-50 dark:data-[selected]:bg-zinc-800/60',
                )}
              >
                <div className="flex w-full min-w-0 items-center justify-between gap-3">
                  <span className="min-w-0 flex-1 truncate text-sm font-normal leading-snug text-zinc-950 dark:text-zinc-50">
                    {item.label}
                  </span>
                  <ListBox.Item.Indicator className="shrink-0 text-zinc-900 dark:text-zinc-100 [&_svg]:size-4" />
                </div>
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}

export function FilterBar({
  period,
  setPeriod,
  selectedRegion,
  setSelectedRegion,
  selectedHub,
  setSelectedHub,
  selectedCustomer,
  setSelectedCustomer,
  selectedStatus,
  setSelectedStatus,
  selectedWarehouse,
  setSelectedWarehouse,
  selectedRoute,
  setSelectedRoute,
  selectedPersonnel,
  setSelectedPersonnel,
  selectedCsOps,
  setSelectedCsOps,
  canResetFilters,
  onResetFilters,
  onApplyFilters,
}: FilterBarProps) {
  const options = getDashboardFilterOptions()
  const labelClassName = 'text-sm font-medium text-muted-foreground whitespace-nowrap w-[92px] text-right'
  const fieldClassName = 'grid grid-cols-[92px_minmax(0,1fr)] items-center gap-1.5'
  const triggerClassName =
    'w-full h-9 min-w-0 font-sans font-normal text-sm leading-snug text-foreground'

  const regionOptions: HeroFilterOption[] = useMemo(
    () => regions.map((region) => ({ id: region.id, label: region.name })),
    [],
  )

  const filteredHubs = useMemo(() => {
    const allow =
      selectedRegion.length === 0
        ? null
        : new Set(selectedRegion)
    const names =
      allow === null
        ? options.hubNames
        : hubs.filter((h) => allow.has(h.regionId)).map((h) => h.name)
    return names
  }, [options.hubNames, selectedRegion])

  useEffect(() => {
    const allow = new Set(filteredHubs)
    setSelectedHub((prev) => {
      const next = prev.filter((h) => allow.has(h))
      if (
        next.length === prev.length &&
        next.every((h, i) => h === prev[i])
      ) {
        return prev
      }
      return next
    })
  }, [filteredHubs, setSelectedHub])

  const hubOptions: HeroFilterOption[] = useMemo(
    () => filteredHubs.map((name) => ({ id: name, label: name })),
    [filteredHubs],
  )

  const customerOptions: HeroFilterOption[] = useMemo(
    () =>
      options.customerNames.map((name) => ({
        id: name,
        label: name,
      })),
    [options.customerNames],
  )

  const warehouseOptions: HeroFilterOption[] = useMemo(
    () => options.warehouses.map((name) => ({ id: name, label: name })),
    [options.warehouses],
  )

  const routeOptions: HeroFilterOption[] = useMemo(
    () => options.routes.map((route) => ({ id: route, label: route })),
    [options.routes],
  )

  const personnelOptions: HeroFilterOption[] = useMemo(
    () =>
      options.personnel.map((name) => ({
        id: name,
        label: name,
      })),
    [options.personnel],
  )

  const csOpsOptions: HeroFilterOption[] = useMemo(
    () =>
      options.csOps.map((name) => ({
        id: name,
        label: name,
      })),
    [options.csOps],
  )

  const statusOptions: HeroFilterOption[] = useMemo(
    () => [
      { id: 'da_chot', label: 'Đã chốt' },
      { id: 'cho_duyet', label: 'Chờ duyệt' },
      { id: 'dang_xu_ly', label: 'Đang xử lý' },
    ],
    [],
  )

  /** md/tablet: hàng đủ rộng; xl: chỉ một cột — tránh ô kép Khách–Trạng thái lệch khi nút không cùng hàng ô lọc. */
  const mdFullRowWhenNarrow = 'md:col-span-2 xl:col-span-1'

  return (
    <Card className="mb-6 gap-0 py-0 shadow-sm">
      <CardContent className="px-4 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4">
        <div
          className={cn(
            'grid grid-cols-1 gap-x-3 gap-y-3',
            'md:grid-cols-2 xl:grid-cols-5 xl:items-start',
          )}
        >
          <div className={cn(fieldClassName, 'xl:col-start-1 xl:row-start-1 xl:justify-self-stretch')}>
            <label id={FILTER_FIELD_LABEL_IDS.period} className={labelClassName}>
              Kỳ:
            </label>
            <ShadcnSelect value={period} onValueChange={(v) => setPeriod(v as FilterPeriod)}>
              <SelectTrigger
                aria-labelledby={FILTER_FIELD_LABEL_IDS.period}
                className={cn(
                  triggerClassName,
                  'border-zinc-200 bg-white text-zinc-900 shadow-sm hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-zinc-600',
                )}
              >
                <SelectValue placeholder="Chọn kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Theo ngày</SelectItem>
                <SelectItem value="week">Theo tuần</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
                <SelectItem value="quarter">Theo quý</SelectItem>
                <SelectItem value="year">Theo năm</SelectItem>
              </SelectContent>
            </ShadcnSelect>
          </div>

          <div className={cn(fieldClassName, 'xl:col-start-2 xl:row-start-1 xl:justify-self-stretch')}>
            <label id={FILTER_FIELD_LABEL_IDS.region} className={labelClassName}>
              Khu vực:
            </label>
            <HeroMultiFilterSelect
              options={regionOptions}
              value={selectedRegion}
              onChange={(next) => setSelectedRegion(next)}
              placeholderEmpty="Tất cả khu vực"
              triggerClassName={triggerClassName}
              listLabel="Khu vực"
              labelledBy={FILTER_FIELD_LABEL_IDS.region}
            />
          </div>

          <div className={cn(fieldClassName, 'xl:col-start-3 xl:row-start-1 xl:justify-self-stretch')}>
            <label id={FILTER_FIELD_LABEL_IDS.hub} className={labelClassName}>
              Hub:
            </label>
            <HeroMultiFilterSelect
              options={hubOptions}
              value={selectedHub}
              onChange={(next) => setSelectedHub(next)}
              placeholderEmpty="Tất cả Hub"
              triggerClassName={triggerClassName}
              listLabel="Hub"
              labelledBy={FILTER_FIELD_LABEL_IDS.hub}
            />
          </div>

          <div className={cn(fieldClassName, 'xl:col-start-4 xl:row-start-1 xl:justify-self-stretch')}>
            <label id={FILTER_FIELD_LABEL_IDS.customer} className={labelClassName}>
              Khách hàng:
            </label>
            <HeroMultiFilterSelect
              options={customerOptions}
              value={selectedCustomer}
              onChange={(next) => setSelectedCustomer(next)}
              placeholderEmpty="Tất cả khách hàng"
              triggerClassName={triggerClassName}
              listLabel="Khách hàng"
              labelledBy={FILTER_FIELD_LABEL_IDS.customer}
            />
          </div>

          {/* Hàng 1 cột 5 — chỉ Trạng thái */}
          <div
            className={cn(fieldClassName, mdFullRowWhenNarrow, 'xl:col-start-5 xl:row-start-1 xl:justify-self-stretch')}
          >
            <label id={FILTER_FIELD_LABEL_IDS.status} className={labelClassName}>
              Trạng thái:
            </label>
            <HeroMultiFilterSelect
              options={statusOptions}
              value={selectedStatus}
              onChange={(next) => setSelectedStatus(next)}
              placeholderEmpty="Tất cả trạng thái"
              triggerClassName={triggerClassName}
              listLabel="Trạng thái"
              labelledBy={FILTER_FIELD_LABEL_IDS.status}
            />
          </div>

          <div className={cn(fieldClassName, 'xl:col-start-1 xl:row-start-2 xl:justify-self-stretch')}>
            <label id={FILTER_FIELD_LABEL_IDS.warehouse} className={labelClassName}>
              Kho:
            </label>
            <HeroMultiFilterSelect
              options={warehouseOptions}
              value={selectedWarehouse}
              onChange={(next) => setSelectedWarehouse(next)}
              placeholderEmpty="Tất cả kho"
              triggerClassName={triggerClassName}
              listLabel="Kho"
              labelledBy={FILTER_FIELD_LABEL_IDS.warehouse}
            />
          </div>

          <div className={cn(fieldClassName, 'xl:col-start-2 xl:row-start-2 xl:justify-self-stretch')}>
            <label id={FILTER_FIELD_LABEL_IDS.route} className={labelClassName}>
              Tuyến:
            </label>
            <HeroMultiFilterSelect
              options={routeOptions}
              value={selectedRoute}
              onChange={(next) => setSelectedRoute(next)}
              placeholderEmpty="Tất cả tuyến"
              triggerClassName={triggerClassName}
              listLabel="Tuyến"
              labelledBy={FILTER_FIELD_LABEL_IDS.route}
            />
          </div>

          <div className={cn(fieldClassName, 'xl:col-start-3 xl:row-start-2 xl:justify-self-stretch')}>
            <label id={FILTER_FIELD_LABEL_IDS.personnel} className={labelClassName}>
              Nhân sự:
            </label>
            <HeroMultiFilterSelect
              options={personnelOptions}
              value={selectedPersonnel}
              onChange={(next) => setSelectedPersonnel(next)}
              placeholderEmpty="Tất cả nhân sự"
              triggerClassName={triggerClassName}
              listLabel="Nhân sự"
              labelledBy={FILTER_FIELD_LABEL_IDS.personnel}
            />
          </div>

          <div className={cn(fieldClassName, 'xl:col-start-4 xl:row-start-2 xl:justify-self-stretch')}>
            <label id={FILTER_FIELD_LABEL_IDS.csOps} className={labelClassName}>
              CS/OPS:
            </label>
            <HeroMultiFilterSelect
              options={csOpsOptions}
              value={selectedCsOps}
              onChange={(next) => setSelectedCsOps(next)}
              placeholderEmpty="Tất cả CS/OPS"
              triggerClassName={triggerClassName}
              listLabel="CS OPS"
              labelledBy={FILTER_FIELD_LABEL_IDS.csOps}
            />
          </div>

          <div
            className={cn(fieldClassName, mdFullRowWhenNarrow, 'xl:col-start-5 xl:row-start-2 xl:justify-self-stretch')}
          >
            <span className={cn(labelClassName, 'invisible shrink-0')} aria-hidden>
              –
            </span>
            <div className="flex min-h-9 flex-nowrap items-center gap-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="h-9 min-h-9 shrink-0 px-3 py-0 text-sm font-normal leading-normal"
                onPress={() => onApplyFilters()}
              >
                Áp dụng
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 min-h-9 shrink-0 px-3 py-0 text-sm font-normal leading-normal"
                onPress={() => onResetFilters()}
                isDisabled={!canResetFilters}
              >
                <RotateCcw className="size-3.5 shrink-0" aria-hidden />
                Đặt lại
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
