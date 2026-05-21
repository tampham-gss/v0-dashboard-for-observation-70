'use client'

import { EmptyState } from '@heroui/react'
import { ReportInlineNotice } from './report-inline-notice'
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
  TARGET_CP_PER_CONT,
  formatCurrency,
  formatNumber,
} from '@/lib/report-mock-data'
import type { BranchComparePoint } from '@/lib/report-overview-analytics'
import { ReportSectionCard } from './report-card'

export function ReportSlEfficiencyCompare({
  data,
  isLoading,
}: {
  data: BranchComparePoint[]
  isLoading: boolean
}) {
  const reviewCount = data.filter((d) => d.needsReview).length
  const chartData = data.map((d) => ({
    branch: d.branch,
    slContTH: d.slContTH,
    cpTB: d.cpTBPerCont ?? 0,
    needsReview: d.needsReview,
  }))

  return (
    <ReportSectionCard
      title="So sánh sản lượng và hiệu quả"
      description="Phát hiện chi nhánh SL cao nhưng CP TB/Cont vượt định mức (proxy hiệu quả giai đoạn 1)"
      isLoading={isLoading}
      fillHeight
      bodyClassName="pb-3"
    >
      {data.length === 0 ? (
        <EmptyState className="py-10">
          <EmptyState.Title>Không có dữ liệu so sánh</EmptyState.Title>
          <EmptyState.Description>Chọn kỳ có dữ liệu SL/CP theo chi nhánh.</EmptyState.Description>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {reviewCount > 0 ? (
            <ReportInlineNotice title={`${reviewCount} chi nhánh cần xem xét`} tone="warning">
              SL cont TH thuộc nhóm cao (≥ P75) và CP TB/Cont vượt định mức{' '}
              {formatCurrency(TARGET_CP_PER_CONT)}/cont.
            </ReportInlineNotice>
          ) : (
            <ReportInlineNotice tone="accent">
              Chưa phát hiện nhóm SL cao kèm CP vượt định mức trong phạm vi lọc.
            </ReportInlineNotice>
          )}

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="branch" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis
                  yAxisId="sl"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  tickFormatter={(v) => formatNumber(v)}
                />
                <YAxis
                  yAxisId="cp"
                  orientation="right"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 13,
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'SL cont TH') return [formatNumber(value), name]
                    return [formatCurrency(value), 'CP TB/Cont']
                  }}
                />
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
                  dataKey="cpTB"
                  name="CP TB/Cont"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-gray-500">
            Hiệu quả tài chính (doanh thu − chi phí) sẽ hiển thị khi chốt công thức và nguồn
            doanh thu. Hiện dùng CP TB/Cont so với định mức.
          </p>
        </div>
      )}
    </ReportSectionCard>
  )
}
