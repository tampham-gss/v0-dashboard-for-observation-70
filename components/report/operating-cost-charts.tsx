'use client'

import { EmptyState } from '@heroui/react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  REPORT_CHART_MARGIN_COMBINED,
  REPORT_CHART_X_TICK_ANGLED,
  formatChartLabelShort,
} from '@/lib/report-chart-format'
import { formatCurrency, formatNumber } from '@/lib/operating-cost-mock-data'
import type { OpCostChartPoint } from '@/lib/operating-cost-analytics'
import { chartBarTopLabel } from './report-chart-labels'
import { ReportSectionCard } from './report-card'

export function OperatingCostBarChart({
  data,
  groupLabel,
  canViewAmounts,
  isLoading,
}: {
  data: OpCostChartPoint[]
  groupLabel: string
  canViewAmounts: boolean
  isLoading: boolean
}) {
  return (
    <ReportSectionCard
      title="Chi phí theo kỳ"
      description={`Biểu đồ cột · nhóm ${groupLabel} (tham chiếu sheet CP / Báo cáo ngày)`}
      isLoading={isLoading}
      fillHeight
      bodyClassName="pb-3"
    >
      {data.length === 0 ? (
        <EmptyState className="border-0 bg-transparent py-10">
          <p className="text-sm font-medium text-gray-900">Không có dữ liệu chi phí</p>
          <p className="mt-1 text-sm text-gray-600">Đổi kỳ hoặc bộ lọc khu vực / giao nhận.</p>
        </EmptyState>
      ) : (
        <div className="report-chart-host h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={REPORT_CHART_MARGIN_COMBINED} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tick={REPORT_CHART_X_TICK_ANGLED}
                angle={-35}
                textAnchor="end"
                height={56}
                interval={0}
              />
              <YAxis
                yAxisId="cost"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickFormatter={(v) => formatChartLabelShort(v)}
              />
              <YAxis
                yAxisId="sl"
                orientation="right"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickFormatter={(v) => formatChartLabelShort(v)}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                formatter={(value: number, name: string) => {
                  if (name === 'SL cont') return [formatNumber(value), name]
                  return [
                    canViewAmounts ? formatCurrency(value) : '***',
                    'Tổng chi phí',
                  ]
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#374151' }} />
              <Bar
                yAxisId="cost"
                dataKey="tongChiPhi"
                name="Tổng chi phí"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
                label={chartBarTopLabel()}
              />
              <Bar
                yAxisId="sl"
                dataKey="slCont"
                name="SL cont"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
                label={chartBarTopLabel()}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ReportSectionCard>
  )
}
