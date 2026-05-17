'use client'

import {
  CircleAlert,
  DollarSign,
  Gauge,
  Package,
  Percent,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Truck,
  Wallet,
} from 'lucide-react'
import {
  computeDashboardKpis,
  formatCurrency,
  formatNumber,
  formatPercent,
  type OperationalRow,
} from '@/lib/report-dashboard-mock'
import type { CPRecord, ReportFilters, SLRecord } from '@/lib/report-mock-data'
import { appliedFiltersCaption } from '@/lib/report-mock-data'
import { MetricKpiStrip } from './metric-kpi-strip'
import { ReportChartsSection } from './report-charts-section'

export function OverviewTab({
  slRows,
  cpRows,
  opRows,
  appliedFilters,
  isLoading,
  canViewFinancial,
  efficiencyConfigured,
}: {
  slRows: SLRecord[]
  cpRows: CPRecord[]
  opRows: OperationalRow[]
  appliedFilters: ReportFilters
  isLoading: boolean
  canViewFinancial: boolean
  efficiencyConfigured: boolean
}) {
  const kpi = computeDashboardKpis(opRows, slRows, cpRows, efficiencyConfigured)

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          KPI sản lượng
        </h2>
        <MetricKpiStrip
          isLoading={isLoading}
          columnsClassName="sm:grid-cols-2 lg:grid-cols-4"
          items={[
            {
              title: 'Tổng sản lượng',
              value: formatNumber(kpi.sanLuong.total),
              icon: Package,
              iconBgClassName: 'bg-blue-500',
            },
            {
              title: 'Tổng số đơn',
              value: formatNumber(kpi.sanLuong.soDon),
              icon: ShoppingCart,
              iconBgClassName: 'bg-blue-600',
            },
            {
              title: 'Tổng số chuyến',
              value: formatNumber(kpi.sanLuong.soChuyen),
              icon: Truck,
              iconBgClassName: 'bg-indigo-500',
            },
            {
              title: 'Tăng trưởng SL',
              value:
                kpi.sanLuong.growthPct != null
                  ? `${kpi.sanLuong.growthPct >= 0 ? '+' : ''}${kpi.sanLuong.growthPct.toFixed(1)}%`
                  : '—',
              description: 'So với kế hoạch (TH/KH)',
              icon: TrendingUp,
              iconBgClassName: 'bg-cyan-600',
            },
          ]}
        />
      </section>

      {canViewFinancial ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            KPI doanh thu
          </h2>
          <MetricKpiStrip
            isLoading={isLoading}
            columnsClassName="sm:grid-cols-2 lg:grid-cols-3"
            items={[
              {
                title: 'Tổng doanh thu',
                value: kpi.doanhThu.missing ? 'Chưa có dữ liệu' : formatCurrency(kpi.doanhThu.total),
                valueClassName: kpi.doanhThu.missing ? '!text-lg font-bold text-amber-600' : undefined,
                icon: DollarSign,
                iconBgClassName: 'bg-emerald-500',
              },
              {
                title: 'Doanh thu TB',
                value: kpi.doanhThu.missing ? '—' : formatCurrency(kpi.doanhThu.avg),
                icon: Receipt,
                iconBgClassName: 'bg-green-600',
              },
              {
                title: 'Tăng trưởng DT',
                value: '—',
                description: 'Chờ nguồn dữ liệu chính thức',
                icon: TrendingUp,
                iconBgClassName: 'bg-teal-600',
              },
            ]}
          />
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          KPI doanh thu được ẩn theo phân quyền vai trò hiện tại.
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          KPI chi phí
        </h2>
        <MetricKpiStrip
          isLoading={isLoading}
          valueSize="sm"
          columnsClassName="sm:grid-cols-2 lg:grid-cols-4"
          items={[
            {
              title: 'Tổng chi phí',
              value: canViewFinancial ? formatCurrency(kpi.chiPhi.total) : '—',
              icon: Wallet,
              iconBgClassName: 'bg-orange-500',
            },
            {
              title: 'Chi phí vận hành',
              value: canViewFinancial ? formatCurrency(kpi.chiPhi.vanHanh) : '—',
              icon: Package,
              iconBgClassName: 'bg-amber-500',
            },
            {
              title: 'Chi phí tăng ca',
              value: canViewFinancial ? formatCurrency(kpi.chiPhi.tangCa) : '—',
              icon: Receipt,
              iconBgClassName: 'bg-orange-600',
            },
            {
              title: 'Chi phí hỗ trợ',
              value: canViewFinancial ? formatCurrency(kpi.chiPhi.hoTro) : '—',
              icon: CircleAlert,
              iconBgClassName: 'bg-slate-600',
            },
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          KPI hiệu quả
        </h2>
        <MetricKpiStrip
          isLoading={isLoading}
          columnsClassName="sm:grid-cols-2 lg:grid-cols-3"
          items={[
            {
              title: 'Tỷ lệ hiệu quả',
              value:
                !efficiencyConfigured || !canViewFinancial
                  ? 'Chưa cấu hình'
                  : formatPercent(kpi.hieuQua.tyLe),
              valueClassName:
                !efficiencyConfigured || !canViewFinancial ? '!text-lg font-bold text-red-600' : undefined,
              icon: Gauge,
              iconBgClassName: 'bg-violet-500',
            },
            {
              title: 'Chi phí / sản lượng',
              value:
                canViewFinancial && kpi.hieuQua.chiPhiPerSl != null
                  ? formatCurrency(kpi.hieuQua.chiPhiPerSl)
                  : '—',
              icon: Percent,
              iconBgClassName: 'bg-indigo-500',
            },
            {
              title: 'Doanh thu / chi phí',
              value:
                efficiencyConfigured && canViewFinancial && kpi.hieuQua.doanhThuPerChiPhi != null
                  ? kpi.hieuQua.doanhThuPerChiPhi.toFixed(2)
                  : '—',
              description: 'Công thức configurable AMR',
              icon: TrendingUp,
              iconBgClassName: 'bg-purple-500',
            },
          ]}
        />
      </section>

      <ReportChartsSection
        filters={appliedFilters}
        opRows={opRows}
        isLoading={isLoading}
        canViewFinancial={canViewFinancial}
      />

      <div className="rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm leading-relaxed text-gray-600">
          Doanh thu không tự tính khi thiếu nguồn. Hiệu quả chỉ hiển thị khi đã cấu hình công thức
          và đủ dữ liệu bắt buộc.
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
          Phạm vi đang xem · {appliedFiltersCaption(appliedFilters)}
        </p>
      </div>
    </div>
  )
}

