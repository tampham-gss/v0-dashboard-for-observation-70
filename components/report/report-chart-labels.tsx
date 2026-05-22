'use client'

import { formatChartLabelShort, REPORT_CHART_LABEL_STYLE } from '@/lib/report-chart-format'

function labelFormatter(raw: unknown): string {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return formatChartLabelShort(raw)
  }
  if (typeof raw === 'string') {
    const n = Number(raw)
    if (Number.isFinite(n)) return formatChartLabelShort(n)
  }
  if (raw && typeof raw === 'object' && 'value' in raw) {
    const n = Number((raw as { value: unknown }).value)
    if (Number.isFinite(n)) return formatChartLabelShort(n)
  }
  return ''
}

const BAR_LINE_LABEL = {
  position: 'top' as const,
  fill: REPORT_CHART_LABEL_STYLE.fill,
  fontSize: REPORT_CHART_LABEL_STYLE.fontSize,
  fontWeight: REPORT_CHART_LABEL_STYLE.fontWeight,
  formatter: labelFormatter,
}

/** Cấu hình nhãn trên đỉnh cột (prop `label` của Recharts Bar). */
export function chartBarTopLabel() {
  return { ...BAR_LINE_LABEL }
}

/** Nhãn số trên đỉnh cột — nghiêng −45° (tab Tổng hợp). */
export function chartBarTopLabelAngled() {
  return {
    ...BAR_LINE_LABEL,
    angle: -45,
    textAnchor: 'start' as const,
    offset: 12,
  }
}

/** Cấu hình nhãn trên điểm đường (prop `label` của Recharts Line). */
export function chartLineTopLabel() {
  return { ...BAR_LINE_LABEL }
}
