'use client'

import { EmptyState } from '@heroui/react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  REPORT_CHART_MARGIN,
  REPORT_CHART_MARGIN_COMBINED,
  REPORT_CHART_X_TICK_ANGLED,
  formatChartLabelShort,
} from '@/lib/report-chart-format'
import { formatNumber } from '@/lib/gls-competitor-mock-data'
import type { GlsCompareChartPoint } from '@/lib/gls-competitor-analytics'
import type { ShareSlice } from '@/lib/gls-competitor-analytics'
import { chartBarTopLabel } from './report-chart-labels'
import { ReportSectionCard } from './report-card'

export function GlsCompetitorBarChart({
  data,
  groupLabel,
  isLoading,
}: {
  data: GlsCompareChartPoint[]
  groupLabel: string
  isLoading: boolean
}) {
  return (
    <ReportSectionCard
      title="So sánh sản lượng GLS và đối thủ"
      description={`Biểu đồ cột · nhóm ${groupLabel} (chỉ bản ghi CONT_20/CONT_40)`}
      isLoading={isLoading}
      fillHeight
      bodyClassName="pb-3"
    >
      {data.length === 0 ? (
        <EmptyState className="border-0 bg-transparent py-10">
          <p className="text-sm font-medium text-gray-900">Không có dữ liệu so sánh</p>
          <p className="mt-1 text-sm text-gray-600">
            Đổi kỳ hoặc bộ lọc khu vực / loại cont để xem sản lượng.
          </p>
        </EmptyState>
      ) : (
        <div className="report-chart-host h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={REPORT_CHART_MARGIN_COMBINED}
              barCategoryGap="18%"
            >
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
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickFormatter={(v) => formatChartLabelShort(v)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: 13,
                }}
                formatter={(value: number, name: string) => [formatNumber(value), name]}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#374151' }} />
              <Bar
                dataKey="gls"
                name="Sản lượng GLS"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
                label={chartBarTopLabel()}
              />
              <Bar
                dataKey="competitors"
                name="Sản lượng đối thủ"
                fill="#94a3b8"
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

export function GlsCompetitorShareChart({
  slices,
  isLoading,
}: {
  slices: ShareSlice[]
  isLoading: boolean
}) {
  return (
    <ReportSectionCard
      title="Tỷ trọng thị trường quan sát"
      description="T = GLS + tổng đối thủ — hiển thị khi T &gt; 0"
      isLoading={isLoading}
      fillHeight
      bodyClassName="pb-3"
    >
      {slices.length === 0 ? (
        <EmptyState className="border-0 bg-transparent py-10">
          <p className="text-sm font-medium text-gray-900">Chưa có tỷ trọng</p>
          <p className="mt-1 text-sm text-gray-600">
            Tổng thị trường T = 0 — tỷ lệ hiển thị dấu &quot;—&quot;.
          </p>
        </EmptyState>
      ) : (
        <div className="report-chart-host h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={REPORT_CHART_MARGIN}>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  percent > 0.04 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                }
                labelLine={false}
                isAnimationActive={false}
              >
                {slices.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [formatNumber(value), name]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </ReportSectionCard>
  )
}
