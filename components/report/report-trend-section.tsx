'use client'

import { Button, EmptyState } from '@heroui/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { reportButtonClass } from './report-button-chrome'
import { ReportInlineNotice } from './report-inline-notice'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  REPORT_CHART_LEGEND_WRAPPER_STYLE,
  REPORT_CHART_MARGIN,
  REPORT_CHART_MARGIN_COMBINED,
  REPORT_CHART_X_TICK_ANGLED,
  formatChartLabelShort,
} from '@/lib/report-chart-format'
import { formatCurrency, type ReportFilters } from '@/lib/report-mock-data'
import type { TrendPoint } from '@/lib/report-overview-analytics'
import { chartBarTopLabel, chartBarTopLabelAngled, chartLineTopLabel } from './report-chart-labels'
import { ReportSectionCard } from './report-card'

function formatChartAxisValue(value: number) {
  return formatChartLabelShort(value)
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ color: string; name: string; value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <p className="mb-2 text-sm font-medium text-gray-900">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm text-gray-700" style={{ color: entry.color }}>
          {entry.name}: {formatChartLabelShort(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function ReportTrendSection({
  filters,
  data,
  isLoading,
}: {
  filters: ReportFilters
  data: TrendPoint[]
  isLoading: boolean
}) {
  const periodLabel = filters.periodType === 'week' ? 'tuần' : 'tháng'
  const chartData = data.map((d) => ({
    ...d,
    cpTB: d.cpTBPerCont ?? 0,
  }))

  const [chartTab, setChartTab] = useState<'combined' | 'sanluong' | 'chiphi'>('combined')

  const tabBtn = (id: typeof chartTab, label: string) => (
    <Button
      type="button"
      variant={chartTab === id ? 'primary' : 'ghost'}
      size="sm"
      className={reportButtonClass(
        'min-h-8 px-3 text-sm font-medium',
        chartTab === id
          ? 'border-blue-600 bg-blue-600 text-white shadow-none'
          : 'text-gray-700 hover:bg-white hover:text-gray-900',
      )}
      onPress={() => setChartTab(id)}
    >
      {label}
    </Button>
  )

  return (
    <ReportSectionCard
      title="Biểu đồ xu hướng"
      description={`Sản lượng và chi phí theo ${periodLabel} · năm ${filters.year}`}
      isLoading={isLoading}
      bodyClassName="!pb-1"
    >
      {data.length === 0 ? (
        <EmptyState className="py-10">
          <EmptyState.Title>Không có dữ liệu xu hướng</EmptyState.Title>
          <EmptyState.Description>Thử đổi bộ lọc hoặc kỳ báo cáo.</EmptyState.Description>
        </EmptyState>
      ) : (
        <div className="space-y-3">
       

          <div
            role="tablist"
            aria-label="Loại biểu đồ xu hướng"
            className={cn(
              'mb-3 flex flex-wrap gap-1 rounded-md border border-gray-200 bg-gray-50 p-1',
            )}
          >
            {tabBtn('combined', 'Tổng hợp')}
            {tabBtn('sanluong', 'Sản lượng')}
            {tabBtn('chiphi', 'Chi phí')}
          </div>

          {chartTab === 'combined' && (
              <div className="report-chart-host h-[334px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={REPORT_CHART_MARGIN_COMBINED} barCategoryGap="18%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="period"
                      angle={-45}
                      textAnchor="end"
                      height={44}
                      interval={0}
                      tick={REPORT_CHART_X_TICK_ANGLED}
                    />
                    <YAxis
                      yAxisId="sl"
                      orientation="left"
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      tickFormatter={(v) => formatChartLabelShort(v)}
                    />
                    <YAxis
                      yAxisId="cp"
                      orientation="right"
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      tickFormatter={formatChartAxisValue}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      wrapperStyle={REPORT_CHART_LEGEND_WRAPPER_STYLE}
                      iconSize={10}
                      height={28}
                    />
                    <Bar
                      yAxisId="sl"
                      dataKey="slContTH"
                      name="SL cont TH"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={false}
                      label={chartBarTopLabelAngled()}
                    />
                    <Bar
                      yAxisId="cp"
                      dataKey="tongChiPhi"
                      name="Tổng chi phí"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={false}
                      label={chartBarTopLabelAngled()}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
          )}

          {chartTab === 'sanluong' && (
              <div className="report-chart-host h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={REPORT_CHART_MARGIN}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={formatChartAxisValue} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#374151' }} />
                    <Line
                      type="monotone"
                      dataKey="slContTH"
                      name="SL cont TH"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 3 }}
                      isAnimationActive={false}
                      label={chartLineTopLabel()}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          )}

          {chartTab === 'chiphi' && (
              <div className="report-chart-host h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={REPORT_CHART_MARGIN}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={formatChartAxisValue} />
                    <Tooltip
                      content={<ChartTooltip />}
                      formatter={(value: number) => [formatCurrency(value), 'Tổng chi phí']}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#374151' }} />
                    <Line
                      type="monotone"
                      dataKey="tongChiPhi"
                      name="Tổng chi phí"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 3 }}
                      isAnimationActive={false}
                      label={chartLineTopLabel()}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          )}
        </div>
      )}
    </ReportSectionCard>
  )
}
