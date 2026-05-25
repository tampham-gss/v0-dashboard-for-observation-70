'use client'

import { useMemo, useState } from 'react'
import {
  Boxes,
  ClipboardList,
  Coins,
  DollarSign,
  Gauge,
  Package,
  Percent,
} from 'lucide-react'
import { toast } from '@heroui/react'
import {
  appliedFiltersCaption,
  computeOverviewSummary,
  cpRecords,
  formatCurrency,
  formatNumber,
  formatPercent,
  slRecords,
  TARGET_CP_PER_CONT,
  type BranchCode,
  type CPRecord,
  type ReportFilters,
  type SLRecord,
} from '@/lib/report-mock-data'
import type { BcSourceSheet } from '@/lib/bc-report'
import {
  buildBranchCompare,
  buildBranchRanking,
  buildTrendSeries,
} from '@/lib/report-overview-analytics'
import { buildInspectionOrdersForScope } from '@/lib/report-inspection-orders'
import { REPORT_CARD_CLASS } from './report-card'
import { SummaryCardGrid } from './summary-card-grid'
import { ReportTrendSection } from './report-trend-section'
import { ReportBranchRanking } from './report-branch-ranking'
import { ReportSlEfficiencyCompare } from './report-sl-efficiency-compare'
import { ReportInspectionOrdersTable } from './report-inspection-orders-table'
import { cn } from '@/lib/utils'

export function OverviewKpiSection({
  slRows,
  cpRows,
  isLoading,
}: {
  slRows: SLRecord[]
  cpRows: CPRecord[]
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
    <SummaryCardGrid
      items={cards}
      isLoading={isLoading}
      columns="sm:grid-cols-2 lg:grid-cols-4"
    />
  )
}

export function OverviewTab({
  slRows,
  cpRows,
  appliedFilters,
  isLoading,
}: {
  slRows: SLRecord[]
  cpRows: CPRecord[]
  sourceSheet?: BcSourceSheet
  appliedFilters: ReportFilters
  isLoading: boolean
}) {
  const [selectedBranch, setSelectedBranch] = useState<BranchCode | null>(null)

  const trendData = useMemo(
    () => buildTrendSeries(appliedFilters, slRecords, cpRecords),
    [appliedFilters],
  )

  const ranking = useMemo(() => buildBranchRanking(slRows, cpRows), [slRows, cpRows])

  const compareData = useMemo(() => buildBranchCompare(slRows, cpRows), [slRows, cpRows])

  const orders = useMemo(
    () => buildInspectionOrdersForScope(appliedFilters, slRows, cpRows),
    [appliedFilters, slRows, cpRows],
  )

  return (
    <div className="space-y-5">
      <ReportTrendSection filters={appliedFilters} data={trendData} isLoading={isLoading} />

      <div className="flex min-w-0 flex-col gap-5">
        <ReportBranchRanking
          rows={ranking}
          isLoading={isLoading}
          selectedBranch={selectedBranch}
          onSelectBranch={setSelectedBranch}
        />
        <ReportSlEfficiencyCompare data={compareData} isLoading={isLoading} />
      </div>

      <ReportInspectionOrdersTable
        orders={orders}
        isLoading={isLoading}
        branchFilter={selectedBranch}
      />
    </div>
  )
}
