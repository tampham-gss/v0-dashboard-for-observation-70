'use client'

import { useMemo, useState } from 'react'
import { BarChart3, Boxes, FileStack, Percent, Scale, Users } from 'lucide-react'
import {
  appliedGlsCompetitorCaption,
  filterGlsCompetitorObservations,
  formatGlsSharePercent,
  formatNumber,
  type GlsCompetitorCatalogId,
  type GlsCompetitorFilters,
} from '@/lib/gls-competitor-mock-data'
import {
  buildGlsCompareChartSeries,
  buildMarketShareSlices,
  computeCompetitorBreakdown,
  computeGlsMarketTotals,
  contTypeBreakdown,
  filterDetailByCompetitor,
} from '@/lib/gls-competitor-analytics'
import { REPORT_CARD_CLASS } from './report-card'
import { SummaryCardGrid } from './summary-card-grid'
import { ReportInlineNotice } from './report-inline-notice'
import { GlsCompetitorBarChart, GlsCompetitorShareChart } from './gls-competitor-charts'
import {
  GlsCompetitorBreakdownTable,
  GlsCompetitorRecordsTable,
} from './gls-competitor-tables'
import { cn } from '@/lib/utils'

const CHART_GROUP_LABEL: Record<GlsCompetitorFilters['chartGroupBy'], string> = {
  day: 'theo ngày',
  week: 'theo tuần',
  region: 'theo khu vực',
}

export function GlsCompetitorKpiSection({
  appliedFilters,
  isLoading,
}: {
  appliedFilters: GlsCompetitorFilters
  isLoading: boolean
}) {
  const scopedRows = useMemo(
    () => filterGlsCompetitorObservations(appliedFilters),
    [appliedFilters],
  )
  const totals = useMemo(() => computeGlsMarketTotals(scopedRows), [scopedRows])

  const cards = [
    {
      title: 'Tổng sản lượng GLS (G)',
      value: formatNumber(totals.g),
      description: 'Mỗi bản ghi nguồn tính một lần',
      icon: Boxes,
      tone: 'primary' as const,
    },
    {
      title: 'Tổng sản lượng đối thủ',
      value: formatNumber(totals.dAll),
      description: 'Tổng sản lượng đối thủ (D_all)',
      icon: Scale,
      tone: 'primary' as const,
    },
    {
      title: 'Tỷ lệ GLS',
      value: formatGlsSharePercent(totals.glsSharePct),
      description: totals.t > 0 ? '100 × G / T' : 'T = 0 → hiển thị —',
      icon: Percent,
      tone: 'success' as const,
    },
    {
      title: 'Tỷ lệ tổng đối thủ',
      value: formatGlsSharePercent(totals.competitorSharePct),
      description: '100% − tỷ lệ GLS khi chỉ GLS + đối thủ trong T',
      icon: Percent,
      tone: 'warning' as const,
    },
    {
      title: 'Bản ghi phản ánh',
      value: formatNumber(totals.recordCount),
      description: `${formatNumber(totals.sourceCount)} bản ghi nguồn`,
      icon: FileStack,
      tone: 'default' as const,
    },
    {
      title: 'Tổng thị trường (T)',
      value: formatNumber(totals.t),
      description: 'G + D_all',
      icon: BarChart3,
      tone: 'default' as const,
    },
  ]

  return (
    <SummaryCardGrid
      items={cards}
      isLoading={isLoading}
      columns="sm:grid-cols-2 lg:grid-cols-3"
    />
  )
}

export function GlsCompetitorContent({
  appliedFilters,
  isLoading,
}: {
  appliedFilters: GlsCompetitorFilters
  isLoading: boolean
}) {
  const [drillCompetitor, setDrillCompetitor] = useState<GlsCompetitorCatalogId | null>(null)

  const scopedRows = useMemo(
    () => filterGlsCompetitorObservations(appliedFilters),
    [appliedFilters],
  )

  const totals = useMemo(() => computeGlsMarketTotals(scopedRows), [scopedRows])
  const breakdown = useMemo(() => computeCompetitorBreakdown(scopedRows), [scopedRows])
  const chartData = useMemo(
    () => buildGlsCompareChartSeries(scopedRows, appliedFilters),
    [scopedRows, appliedFilters],
  )
  const shareSlices = useMemo(() => buildMarketShareSlices(scopedRows), [scopedRows])
  const contBreakdown = useMemo(() => contTypeBreakdown(scopedRows), [scopedRows])

  const detailRows = useMemo(() => {
    const base = filterDetailByCompetitor(scopedRows, drillCompetitor)
    if (appliedFilters.competitor !== 'all') {
      return base.filter((r) => r.competitorId === appliedFilters.competitor)
    }
    return base
  }, [scopedRows, drillCompetitor, appliedFilters.competitor])

  return (
    <div className="space-y-5">
      {(totals.unassignedContCount > 0 || totals.dataErrorCount > 0) && (
        <div className="space-y-2">
          
        </div>
      )}

      <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 xl:grid-cols-2">
        <GlsCompetitorBarChart
          data={chartData}
          groupLabel={CHART_GROUP_LABEL[appliedFilters.chartGroupBy]}
          isLoading={isLoading}
        />
        <GlsCompetitorShareChart slices={shareSlices} isLoading={isLoading} />
      </div>

      <div
        className={cn(REPORT_CARD_CLASS, 'px-5 py-4')}
        style={{ boxShadow: 'none' }}
      >
        <p className="text-sm font-medium text-gray-900">Theo loại container</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {contBreakdown.map((row) => (
            <div
              key={row.contType}
              className="rounded-md border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm"
            >
              <p className="font-medium text-gray-800">{row.contType}</p>
              <p className="mt-1 text-gray-600">
                GLS: {formatNumber(row.gls)} · Đối thủ: {formatNumber(row.competitors)} · T:{' '}
                {formatNumber(row.t)}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Tỷ lệ GLS: {formatGlsSharePercent(row.t > 0 ? (100 * row.gls) / row.t : null)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <GlsCompetitorBreakdownTable
        rows={breakdown}
        isLoading={isLoading}
        selectedCompetitor={drillCompetitor}
        onSelectCompetitor={setDrillCompetitor}
      />

      <GlsCompetitorRecordsTable
        rows={detailRows}
        isLoading={isLoading}
        competitorFilter={drillCompetitor}
      />

     
    </div>
  )
}
