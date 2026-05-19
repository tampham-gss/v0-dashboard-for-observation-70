/** Card bọc bảng — không shadow */
export const REPORT_TABLE_PANEL_CLASS =
  'report-table-panel min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-none ring-0'

/** Lùi bảng 16px so với mép trái/phải card */
export const REPORT_TABLE_CARD_INSET_X = 'px-4'

/** Viền bao quanh bảng */
export const REPORT_TABLE_BORDER_CLASS =
  'overflow-hidden rounded-lg border border-gray-200 bg-white shadow-none ring-0'

/** Bảng báo cáo HeroUI — full width, nền trắng */
export const REPORT_TABLE_SHELL_CLASS = [
  '!shadow-none [&_*]:!shadow-none [&_*]:shadow-none',
  '[&_.table-root]:!m-0 [&_.table-root]:!rounded-none [&_.table-root]:!border-0 [&_.table-root]:!bg-white [&_.table-root]:!p-0 [&_.table-root]:!shadow-none [&_.table-root]:!ring-0',
  '[&_[data-slot=table]]:!bg-white [&_[data-slot=table]]:!p-0 [&_[data-slot=table]]:!shadow-none [&_[data-slot=table]]:!ring-0',
  '[&_[data-slot=table-scroll-container]]:w-full [&_[data-slot=table-scroll-container]]:!bg-white [&_[data-slot=table-scroll-container]]:!p-0 [&_[data-slot=table-scroll-container]]:!shadow-none [&_[data-slot=table-scroll-container]]:!ring-0',
  '[&_[data-slot=table-content]]:w-full [&_[data-slot=table-content]]:!bg-white [&_[data-slot=table-content]]:!p-0 [&_[data-slot=table-content]]:!shadow-none [&_[data-slot=table-content]]:!ring-0',
  '[&_[data-slot=table-header]]:!border-b [&_[data-slot=table-header]]:!border-gray-200',
  '[&_[data-slot=table-header]]:!bg-gray-50',
  '[&_[data-slot=table-column]]:!border-0 [&_[data-slot=table-cell]]:!border-0',
  '[&_[data-slot=table-column]]:!font-medium [&_[data-slot=table-column]]:!leading-tight [&_[data-slot=table-column]]:!text-gray-600',
  '[&_[data-slot=table-column]]:!text-xs [&_[data-slot=table-column]]:!px-4 [&_[data-slot=table-column]]:!py-2.5 [&_[data-slot=table-column]]:!align-middle',
  '[&_[data-slot=table-cell]]:!text-sm [&_[data-slot=table-cell]]:!text-gray-900 [&_[data-slot=table-cell]]:!px-4 [&_[data-slot=table-cell]]:!py-2.5 [&_[data-slot=table-cell]]:!align-middle',
  '[& tbody tr]:border-b [& tbody tr]:border-gray-100',
  '[& tbody tr:last-child]:border-b-0',
  '[&_table]:!w-max [&_table]:!min-w-full [&_table]:!table-auto [&_table]:!bg-white [&_table]:border-0 [&_table]:border-collapse',
  '[&_tbody]:!bg-white',
].join(' ')

export const REPORT_TABLE_ROOT_CLASS = 'h-fit min-h-0 max-h-none w-full'

export const REPORT_TABLE_SCROLL_CLASS =
  'w-full min-w-0 overflow-x-auto bg-white !shadow-none ring-0'

/** HeroUI Table: bắt buộc có ít nhất một cột `isRowHeader` trong Table.Header */
export const TABLE_ROW_HEADER_PROP = { isRowHeader: true as const }

/** Cột chữ căn trái */
export const TABLE_TEXT_COL = 'whitespace-nowrap text-left'

/** Cột chữ rộng hơn (kỳ, chi nhánh, tên) */
export const TABLE_COL_WIDE = `${TABLE_TEXT_COL} min-w-[6.5rem]`

/** Cột số căn phải */
const TABLE_NUM_COL_BASE = 'whitespace-nowrap text-end tabular-nums'

export const TABLE_NUM_COL = `${TABLE_NUM_COL_BASE} min-w-[5.25rem]`

/** Cột số có tiêu đề dài (CP, SL) */
export const TABLE_NUM_COL_WIDE = `${TABLE_NUM_COL_BASE} min-w-[7.75rem]`

/** Cột căn giữa (badge, thao tác) */
export const TABLE_CENTER_COL = 'whitespace-nowrap text-center'

export const TABLE_COL_STATUS = `${TABLE_CENTER_COL} min-w-[7.5rem]`

export const TABLE_COL_ACTION = `${TABLE_CENTER_COL} min-w-[7rem]`

/** Bảng CP: 13 cột, tiêu đề dài — cần scroll ngang */
export const REPORT_TABLE_MIN_WIDTH_CP = 'min-w-[88rem]'
