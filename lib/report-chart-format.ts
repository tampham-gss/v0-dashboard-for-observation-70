/** Rút gọn số trên nhãn biểu đồ (1M, 1.2K, 1B…). */
export function formatChartLabelShort(value: number): string {
  if (value == null || Number.isNaN(value)) return '—'
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (abs >= 1_000_000_000) {
    return `${sign}${compactUnit(value / 1_000_000_000)}B`
  }
  if (abs >= 1_000_000) {
    return `${sign}${compactUnit(value / 1_000_000)}M`
  }
  if (abs >= 1_000) {
    return `${sign}${compactUnit(value / 1_000)}K`
  }
  if (Number.isInteger(value)) return String(value)
  return String(Math.round(value * 10) / 10)
}

function compactUnit(n: number): string {
  const abs = Math.abs(n)
  const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : 1
  const s = n.toFixed(digits).replace(/\.0+$/, '')
  return s
}

/** Lề trên rộng hơn để chứa nhãn trên đỉnh cột/điểm. */
export const REPORT_CHART_MARGIN = { top: 36, right: 24, left: 8, bottom: 4 } as const

/** Biểu đồ Tổng hợp — nhãn trục X / số nghiêng 45°. */
export const REPORT_CHART_MARGIN_COMBINED = { top: 40, right: 24, left: 8, bottom: 36 } as const

export const REPORT_CHART_X_TICK_ANGLED = {
  fill: '#6b7280',
  fontSize: 10,
} as const

export const REPORT_CHART_LABEL_STYLE = {
  fill: '#374151',
  fontSize: 10,
  fontWeight: 600,
} as const
