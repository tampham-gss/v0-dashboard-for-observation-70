'use client'

import { useState, type ReactNode } from 'react'
import { ReportSectionCard } from './report-card'
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
  buildComparisonSeries,
  buildEfficiencyHeatmap,
  buildTrendSeries,
  type ComparisonDimension,
  type OperationalRow,
} from '@/lib/report-dashboard-mock'
import type { ReportFilters } from '@/lib/report-mock-data'
import { FilterSelect } from './filter-select'
import { cn, formatChartAxisValue } from '@/lib/utils'

const COMPARE_OPTIONS: { id: ComparisonDimension; label: string }[] = [
  { id: 'region', label: 'Khu vực' },
  { id: 'warehouse', label: 'Kho' },
  { id: 'route', label: 'Tuyến' },
  { id: 'staff', label: 'Nhân sự' },
]

const CHART_COLORS = {
  sanLuong: '#2563eb',
  chiPhi: '#ea580c',
  doanhThu: '#16a34a',
}

const CHART_MARGIN = { top: 8, right: 16, left: 8, bottom: 4 }
const CHART_Y_AXIS = {
  width: 56,
  tick: { fontSize: 11, fill: '#6b7280' },
  tickFormatter: formatChartAxisValue,
} as const

function ChartCard({
  title,
  description,
  children,
  isLoading,
  action,
}: {
  title: string
  description?: string
  children: ReactNode
  isLoading?: boolean
  action?: ReactNode
}) {
  return (
    <ReportSectionCard
      title={title}
      description={description}
      isLoading={isLoading}
      action={action}
    >
      {children}
    </ReportSectionCard>
  )
}

export function ReportChartsSection({
  filters,
  opRows,
  isLoading,
  canViewFinancial,
}: {
  filters: ReportFilters
  opRows: OperationalRow[]
  isLoading: boolean
  canViewFinancial: boolean
}) {
  const [compareBy, setCompareBy] = useState<ComparisonDimension>('region')
  const trend = buildTrendSeries(filters, opRows)
  const comparison = buildComparisonSeries(opRows, compareBy)
  const heatmap = buildEfficiencyHeatmap(opRows)

  return (
    <div className="space-y-5">
      <ChartCard
        title="Biểu đồ xu hướng"
        description={`Sản lượng, chi phí${canViewFinancial ? ', doanh thu' : ''} theo ${filters.periodType === 'week' ? 'tuần' : 'tháng'}`}
        isLoading={isLoading}
      >
        <div className="h-[300px] w-full min-w-0 overflow-visible pl-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={CHART_MARGIN}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis {...CHART_Y_AXIS} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sanLuong"
                name="Sản lượng"
                stroke={CHART_COLORS.sanLuong}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="chiPhi"
                name="Chi phí"
                stroke={CHART_COLORS.chiPhi}
                strokeWidth={2}
                dot={false}
              />
              {canViewFinancial ? (
                <Line
                  type="monotone"
                  dataKey="doanhThu"
                  name="Doanh thu"
                  stroke={CHART_COLORS.doanhThu}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Biểu đồ so sánh"
          description="So sánh sản lượng và chi phí"
          isLoading={isLoading}
          action={
            <div className="w-[10rem] shrink-0">
              <FilterSelect
                label="So sánh theo"
                value={compareBy}
                options={COMPARE_OPTIONS}
                onChange={setCompareBy}
              />
            </div>
          }
        >
          <div className="h-[280px] w-full min-w-0 overflow-visible pl-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison} margin={CHART_MARGIN}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis {...CHART_Y_AXIS} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sanLuong" name="Sản lượng" fill={CHART_COLORS.sanLuong} radius={[4, 4, 0, 0]} />
                <Bar dataKey="chiPhi" name="Chi phí" fill={CHART_COLORS.chiPhi} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Heatmap hiệu quả (khu vực)"
          description="Mức hiệu quả tương đối — đỏ thấp, xanh cao"
          isLoading={isLoading}
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {heatmap.map((cell) => (
              <div
                key={cell.region}
                className={cn(
                  'rounded-lg border border-gray-200 px-3 py-3 text-center',
                  cell.score >= 70
                    ? 'bg-emerald-50 text-emerald-900'
                    : cell.score >= 45
                      ? 'bg-amber-50 text-amber-900'
                      : 'bg-red-50 text-red-900',
                )}
              >
                <p className="text-xs font-medium text-gray-600">{cell.region}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{cell.score}</p>
                <p className="text-xs text-gray-500">{cell.period}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
