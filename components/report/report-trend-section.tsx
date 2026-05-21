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
  formatCurrency,
  formatNumber,
  type ReportFilters,
} from '@/lib/report-mock-data'
import type { TrendPoint } from '@/lib/report-overview-analytics'
import { ReportSectionCard } from './report-card'

function formatChartValue(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} tỷ`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} tr`
  return value.toLocaleString('vi-VN')
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
          {entry.name}: {formatChartValue(entry.value)}
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
      bodyClassName="pb-5"
    >
      {data.length === 0 ? (
        <EmptyState className="py-10">
          <EmptyState.Title>Không có dữ liệu xu hướng</EmptyState.Title>
          <EmptyState.Description>Thử đổi bộ lọc hoặc kỳ báo cáo.</EmptyState.Description>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          <ReportInlineNotice title="Doanh thu & hiệu quả" tone="warning">
            Chưa có nguồn doanh thu chính thức — biểu đồ chỉ hiển thị sản lượng và chi phí vận hành.
          </ReportInlineNotice>

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
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <YAxis
                      yAxisId="sl"
                      orientation="left"
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      tickFormatter={(v) => formatNumber(v)}
                    />
                    <YAxis
                      yAxisId="cp"
                      orientation="right"
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      tickFormatter={formatChartValue}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar
                      yAxisId="sl"
                      dataKey="slContTH"
                      name="SL cont TH"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="cp"
                      dataKey="tongChiPhi"
                      name="Tổng chi phí"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
          )}

          {chartTab === 'sanluong' && (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(v) => formatNumber(v)} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="slContTH"
                      name="SL cont TH"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          )}

          {chartTab === 'chiphi' && (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={formatChartValue} />
                    <Tooltip
                      content={<ChartTooltip />}
                      formatter={(value: number) => [formatCurrency(value), 'Tổng chi phí']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tongChiPhi"
                      name="Tổng chi phí"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 3 }}
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
