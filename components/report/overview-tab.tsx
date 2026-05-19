'use client'

import {
  Boxes,
  ClipboardList,
  Coins,
  DollarSign,
  Gauge,
  Package,
  Percent,
} from 'lucide-react'
import {
  appliedFiltersCaption,
  computeOverviewSummary,
  formatCurrency,
  formatNumber,
  formatPercent,
  TARGET_CP_PER_CONT,
  type CPRecord,
  type ReportFilters,
  type SLRecord,
} from '@/lib/report-mock-data'
import type { BcSourceSheet } from '@/lib/bc-report'
import { REPORT_CARD_CLASS } from './report-card'
import { SummaryCardGrid } from './summary-card-grid'
import { cn } from '@/lib/utils'

export function OverviewTab({
  slRows,
  cpRows,
  sourceSheet,
  appliedFilters,
  isLoading,
}: {
  slRows: SLRecord[]
  cpRows: CPRecord[]
  sourceSheet: BcSourceSheet
  appliedFilters: ReportFilters
  isLoading: boolean
}) {
  const summary = computeOverviewSummary(slRows, cpRows)

  const cards = [
    {
      title: 'Tổng SL cont KH',
      value: formatNumber(summary.totalSlContKH),
      description: 'Sản lượng container kế hoạch',
      icon: ClipboardList,
      tone: 'primary' as const,
    },
    {
      title: 'Tổng SL cont TH',
      value: formatNumber(summary.totalSlContTH),
      description: 'Sản lượng container thực hiện',
      icon: Package,
      tone: 'primary' as const,
    },
    {
      title: 'Tỷ lệ TH/KH',
      value: formatPercent(summary.thKhRatio),
      icon: Percent,
      tone: 'primary' as const,
    },
    {
      title: 'Tổng cont GLS',
      value: formatNumber(summary.totalSlContGLS),
      icon: Boxes,
      tone: 'primary' as const,
    },
    {
      title: 'Tổng chi phí',
      value: formatCurrency(summary.totalChiPhi),
      description: 'Từ nhóm CP',
      icon: Coins,
      tone: 'warning' as const,
    },
    {
      title: 'CP TB/Cont',
      value: summary.cpTBPerCont != null ? formatCurrency(summary.cpTBPerCont) : '—',
      description: `Định mức tham chiếu ${formatCurrency(TARGET_CP_PER_CONT)}/cont`,
      icon: Percent,
      tone: 'warning' as const,
    },
    {
      title: 'Doanh thu',
      value: 'Chưa có dữ liệu',
      description: 'Chờ nguồn doanh thu chính thức',
      icon: DollarSign,
      tone: 'warning' as const,
      valueClassName: '!text-base font-bold',
    },
    {
      title: 'Hiệu quả',
      value: 'Chưa cấu hình',
      description: 'Chờ công thức phê duyệt',
      icon: Gauge,
      tone: 'warning' as const,
      valueClassName: '!text-base font-bold',
    },
  ]

  return (
    <div className="space-y-5">
  

      <SummaryCardGrid
        items={cards}
        isLoading={isLoading}
        columns="sm:grid-cols-2 lg:grid-cols-4"
      />

      <div
        className={cn(REPORT_CARD_CLASS, 'px-5 py-4')}
        style={{ boxShadow: 'none' }}
      >
        <p className="text-sm leading-relaxed text-gray-600">
          Doanh thu và hiệu quả chưa được tính do chưa có nguồn doanh thu chính thức hoặc công thức
         phê duyệt. Hệ thống không tự tính các chỉ tiêu này.
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
          Phạm vi đang xem · {appliedFiltersCaption(appliedFilters)}
        </p>
      </div>
    </div>
  )
}
