/** Bảng báo cáo HeroUI — full width, chỉ đường kẻ ngang */
export const REPORT_TABLE_SHELL_CLASS = [
  '[&_[data-slot=table-scroll]]:w-full',
  '[&_[data-slot=table-content]]:w-full',
  '[&_[data-slot=table-header]]:!border-b [&_[data-slot=table-header]]:!border-gray-200',
  '[&_[data-slot=table-header]]:!bg-gray-50',
  '[&_[data-slot=table-column]]:!border-0 [&_[data-slot=table-cell]]:!border-0',
  '[&_[data-slot=table-column]]:!font-medium [&_[data-slot=table-column]]:!leading-tight [&_[data-slot=table-column]]:!text-gray-600',
  '[&_[data-slot=table-column]]:!text-xs [&_[data-slot=table-column]]:!px-4 [&_[data-slot=table-column]]:!py-2.5 [&_[data-slot=table-column]]:!align-middle',
  '[&_[data-slot=table-cell]]:!text-sm [&_[data-slot=table-cell]]:!text-gray-900 [&_[data-slot=table-cell]]:!px-4 [&_[data-slot=table-cell]]:!py-2.5 [&_[data-slot=table-cell]]:!align-middle',
  '[& tbody tr]:border-b [& tbody tr]:border-gray-100',
  '[& tbody tr:last-child]:border-b-0',
  '[&_table]:!w-full [&_table]:!table-fixed [&_table]:border-0 [&_table]:border-collapse',
].join(' ')

export const REPORT_TABLE_ROOT_CLASS = 'h-fit min-h-0 max-h-none w-full'

export const REPORT_TABLE_SCROLL_CLASS =
  'w-full min-w-0 overflow-x-auto rounded-none border-x-0 border-t-0 border-gray-200 bg-white'

/** Cột chữ căn trái */
export const TABLE_TEXT_COL = 'whitespace-nowrap text-left'

/** Cột chữ rộng hơn (kỳ, chi nhánh, tên) */
export const TABLE_COL_WIDE = `${TABLE_TEXT_COL} w-[11%] min-w-[6.5rem]`

/** Cột số căn phải */
export const TABLE_NUM_COL = 'whitespace-nowrap text-end tabular-nums'

/** Cột căn giữa (badge, thao tác) */
export const TABLE_CENTER_COL = 'whitespace-nowrap text-center'

export const TABLE_COL_STATUS = `${TABLE_CENTER_COL} w-[9%] min-w-[7.5rem]`

export const TABLE_COL_ACTION = `${TABLE_CENTER_COL} w-[4.5rem] min-w-[4.5rem]`
