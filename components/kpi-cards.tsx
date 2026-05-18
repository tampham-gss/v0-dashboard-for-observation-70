'use client'

import { AlertCircle, DollarSign, Package, TrendingUp, Wallet } from 'lucide-react'
import { MetricKpiStrip } from '@/components/report/metric-kpi-strip'
import type { KPIData, EfficiencyFormula } from '@/lib/mock-data'
import { formatCurrency, formatNumber, formatEfficiency } from '@/lib/mock-data'

interface KPICardsProps {
  isLoading: boolean
  kpi: KPIData
  formula: EfficiencyFormula
  canViewFinancial: boolean
  hasNegativeData: boolean
}

export function KPICards({
  isLoading,
  kpi,
  formula,
  canViewFinancial,
  hasNegativeData,
}: KPICardsProps) {
  const items = [
    {
      title: 'Tổng Sản Lượng',
      value: formatNumber(kpi.sanLuong),
      description: 'công/container',
      icon: Package,
      tone: 'primary' as const,
    },
    ...(canViewFinancial
      ? [
          {
            title: 'Tổng Doanh Thu',
            value: kpi.hasDoanhThuData ? formatCurrency(kpi.doanhThu) : 'Chưa có dữ liệu',
            description: kpi.hasDoanhThuData
              ? 'tổng doanh thu từ kiểm đếm'
              : 'Một số bản ghi chưa tích hợp nguồn doanh thu',
            icon: DollarSign,
            tone: (kpi.hasDoanhThuData ? 'success' : 'warning') as const,
            valueClassName: kpi.hasDoanhThuData ? undefined : '!text-base font-bold',
          },
          {
            title: 'Tổng Chi Phí',
            value: formatCurrency(kpi.chiPhi),
            description: 'lương, tiền ăn, tăng ca, di chuyển',
            icon: Wallet,
            tone: 'warning' as const,
          },
          {
            title: 'Hiệu Quả Tổng Hợp',
            value: !kpi.hasHieuQuaFormula
              ? 'Chưa cấu hình'
              : kpi.hieuQua !== null
                ? formatEfficiency(kpi.hieuQua, formula)
                : 'Chưa thể tính',
            description: !kpi.hasHieuQuaFormula
              ? 'Cần xác nhận trước khi tính'
              : kpi.hieuQua !== null
                ? 'theo công thức hiệu quả đã cấu hình'
                : 'Thiếu dữ liệu doanh thu hoặc chi phí bắt buộc',
            icon: TrendingUp,
            tone: (!kpi.hasHieuQuaFormula
              ? 'danger'
              : kpi.hieuQua !== null && kpi.hieuQua >= 0
                ? 'success'
                : 'warning') as const,
            valueClassName:
              kpi.hieuQua !== null && kpi.hasHieuQuaFormula
                ? kpi.hieuQua >= 0
                  ? undefined
                  : '!text-red-600'
                : '!text-base font-bold',
          },
        ]
      : []),
    ...(hasNegativeData
      ? [
          {
            title: 'Cảnh báo dữ liệu',
            value: 'Cần kiểm tra',
            description: 'Có bản ghi doanh thu/chi phí âm theo quy tắc AMR',
            icon: AlertCircle,
            tone: 'danger' as const,
          },
        ]
      : []),
  ]

  return (
    <MetricKpiStrip
      isLoading={isLoading}
      columnsClassName={canViewFinancial ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-1'}
      items={items}
    />
  )
}
