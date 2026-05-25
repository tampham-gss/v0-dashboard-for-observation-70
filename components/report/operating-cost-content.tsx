'use client'

import { useMemo, useState } from 'react'
import { Coins, Gauge, MapPin, Package, Percent, Route } from 'lucide-react'
import {
  appliedOperatingCostCaption,
  filterOperatingCostRecords,
  formatCurrency,
  formatNumber,
  formatOpCostAmount,
  type OperatingCostFilters,
  type OperatingCostRecord,
} from '@/lib/operating-cost-mock-data'
import {
  breakdownByCustomer,
  breakdownByDeliverer,
  breakdownByRegion,
  buildOpCostChartSeries,
  computeOpCostComponents,
  computeOpCostTotals,
  filterDetailByKey,
} from '@/lib/operating-cost-analytics'
import { REPORT_CARD_CLASS } from './report-card'
import { SummaryCardGrid } from './summary-card-grid'
import { ReportInlineNotice } from './report-inline-notice'
import { OperatingCostBarChart } from './operating-cost-charts'
import {
  OperatingCostBreakdownTabs,
  OperatingCostDetailTable,
} from './operating-cost-tables'
import { cn } from '@/lib/utils'

const CHART_GROUP_LABEL: Record<OperatingCostFilters['chartGroupBy'], string> = {
  day: 'theo ngày',
  week: 'theo tuần',
  region: 'theo khu vực',
}

export function OperatingCostKpiSection({
  appliedFilters,
  isLoading,
}: {
  appliedFilters: OperatingCostFilters
  isLoading: boolean
}) {
  const scopedRows = useMemo(
    () => filterOperatingCostRecords(appliedFilters),
    [appliedFilters],
  )
  const totals = useMemo(() => computeOpCostTotals(scopedRows), [scopedRows])
  const canView = appliedFilters.canViewAmounts

  const cards = [
    {
      title: 'Tổng chi phí',
      value: formatOpCostAmount(totals.totalChiPhi, canView),
      icon: Coins,
      tone: 'warning' as const,
    },
    {
      title: 'Tổng SL cont',
      value: formatNumber(totals.totalSlCont),
      icon: Package,
      tone: 'primary' as const,
    },
    {
      title: 'CP bình quân/cont',
      value:
        totals.cpPerCont != null && canView
          ? formatCurrency(totals.cpPerCont)
          : totals.cpPerCont != null
            ? '***'
            : '—',
      description: 'Khi AMR chốt công thức & có SL',
      icon: Percent,
      tone: 'warning' as const,
    },
    {
      title: 'Tổng km',
      value: formatNumber(totals.totalKm),
      icon: Route,
      tone: 'primary' as const,
    },
    {
      title: 'Bản ghi',
      value: formatNumber(totals.recordCount),
      description: `${formatNumber(totals.lockedCount)} đã khóa`,
      icon: MapPin,
      tone: 'default' as const,
    },
    {
      title: 'Hiệu quả CP',
      value: canView ? 'Theo CP/cont' : 'Ẩn theo quyền',
      description: 'Chờ công thức hiệu quả chính thức',
      icon: Gauge,
      tone: 'default' as const,
      valueClassName: '!text-base font-bold',
    },
  ]

  return (
    <SummaryCardGrid items={cards} isLoading={isLoading} columns="sm:grid-cols-2 lg:grid-cols-3" />
  )
}

export function OperatingCostContent({
  appliedFilters,
  isLoading,
  onViewDetail,
}: {
  appliedFilters: OperatingCostFilters
  isLoading: boolean
  onViewDetail: (row: OperatingCostRecord) => void
}) {
  const [drillField, setDrillField] = useState<'deliverer' | 'customer' | 'region' | null>(null)
  const [drillKey, setDrillKey] = useState<string | null>(null)

  const scopedRows = useMemo(
    () => filterOperatingCostRecords(appliedFilters),
    [appliedFilters],
  )

  const totals = useMemo(() => computeOpCostTotals(scopedRows), [scopedRows])
  const components = useMemo(() => computeOpCostComponents(scopedRows), [scopedRows])
  const chartData = useMemo(
    () => buildOpCostChartSeries(scopedRows, appliedFilters),
    [scopedRows, appliedFilters],
  )

  const detailRows = useMemo(() => {
    if (!drillField || !drillKey) return scopedRows
    return filterDetailByKey(scopedRows, drillField, drillKey)
  }, [scopedRows, drillField, drillKey])

  const canView = appliedFilters.canViewAmounts

  const handleDrill = (field: typeof drillField, key: string | null) => {
    setDrillField(field)
    setDrillKey(key)
  }

  return (
    <div className="space-y-5">
      {!canView ? (
        <ReportInlineNotice tone="warning" title="Quyền xem chi phí">
          Bạn không có quyền tài chính — số tiền chi tiết hiển thị dạng ***.
        </ReportInlineNotice>
      ) : null}

      {(totals.dataErrorCount > 0) && (
        <ReportInlineNotice tone="warning" title="Lỗi / thiếu cấu hình">
          {totals.dataErrorCount} bản ghi có km hoặc chi phí âm — không cộng vào tổng. Thiếu barem
          vùng: hiển thị cảnh báo, không tự tính.
        </ReportInlineNotice>
      )}

      <OperatingCostBarChart
        data={chartData}
        groupLabel={CHART_GROUP_LABEL[appliedFilters.chartGroupBy]}
        canViewAmounts={canView}
        isLoading={isLoading}
      />

      <div
        className={cn(REPORT_CARD_CLASS, 'px-5 py-4')}
        style={{ boxShadow: 'none' }}
      >
        <p className="text-sm font-medium text-gray-900">Thành phần chi phí (tổng phạm vi lọc)</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Lương', components.luong],
            ['Ăn trưa', components.tienAnTrua],
            ['Tăng ca + ăn TC', components.tienTangCa + components.tienAnTangCa],
            ['Phòng trọ TC 22h', components.tienPhongTro22h],
            ['Xăng/vé xe', components.tienXangVeXe],
            ['Bồi dưỡng (có nguồn)', components.boiDuongPhatSinh],
            ['CPPS chuyến', null],
          ].map(([label, val]) => (
            <div
              key={String(label)}
              className="rounded-md border border-gray-100 bg-gray-50/80 px-3 py-2 text-sm"
            >
              <span className="text-gray-600">{label}</span>
              <p className="font-medium text-gray-900">
                {val === null ? '—' : formatOpCostAmount(val as number, canView)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <OperatingCostBreakdownTabs
        byDeliverer={breakdownByDeliverer(scopedRows)}
        byCustomer={breakdownByCustomer(scopedRows)}
        byRegion={breakdownByRegion(scopedRows)}
        isLoading={isLoading}
        drillField={drillField}
        drillKey={drillKey}
        onDrill={handleDrill}
        canViewAmounts={canView}
      />

      <OperatingCostDetailTable
        rows={detailRows}
        isLoading={isLoading}
        canViewAmounts={canView}
        onViewDetail={onViewDetail}
      />

      <div className={cn(REPORT_CARD_CLASS, 'px-5 py-4')} style={{ boxShadow: 'none' }}>
        <p className="text-sm leading-relaxed text-gray-600">
          Dữ liệu mock tham chiếu sheet <strong className="font-medium text-gray-800">CP</strong>,{' '}
          <strong className="font-medium text-gray-800">BC tuần/tháng</strong> và{' '}
          <strong className="font-medium text-gray-800">BC ngày</strong>. Payroll nhận một chiều sau
          khi chuyến khóa — không chỉnh ngược TMS.
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
          Phạm vi · {appliedOperatingCostCaption(appliedFilters)}
        </p>
      </div>
    </div>
  )
}
