'use client'

import { Package, DollarSign, Wallet, TrendingUp, AlertCircle } from 'lucide-react'
import { Skeleton } from '@heroui/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { KPIData, EfficiencyFormula } from '@/lib/mock-data'
import { formatCurrency, formatNumber, formatEfficiency } from '@/lib/mock-data'

interface KPICardsProps {
  isLoading: boolean
  kpi: KPIData
  formula: EfficiencyFormula
  canViewFinancial: boolean
  hasNegativeData: boolean
}

export function KPICards({ isLoading, kpi, formula, canViewFinancial, hasNegativeData }: KPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-28 rounded-md" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Skeleton className="h-10 w-40 max-w-full rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${canViewFinancial ? 'lg:grid-cols-4' : 'lg:grid-cols-1'}`}>
      {/* Tổng Sản Lượng */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tổng Sản Lượng
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(kpi.sanLuong)}
          </div>
          <p className="mt-2 text-muted-foreground text-sm">
            công/container
          </p>
        </CardContent>
      </Card>

      {canViewFinancial && (
        <>
          {/* Tổng Doanh Thu */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng Doanh Thu
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {kpi.hasDoanhThuData ? (
                <>
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrency(kpi.doanhThu)}
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">
                    tổng doanh thu từ kiểm đếm
                  </p>
                </>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-warning-foreground">
                      Chưa có dữ liệu doanh thu
                    </p>
                    <p className="mt-2 text-muted-foreground text-sm">
                      Một số bản ghi chưa tích hợp nguồn doanh thu
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tổng Chi Phí */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng Chi Phí
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(kpi.chiPhi)}
              </div>
              <p className="mt-2 text-muted-foreground text-sm">
                lương, tiền ăn, tăng ca, di chuyển
              </p>
            </CardContent>
          </Card>

          {/* Hiệu Quả Tổng Hợp */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hiệu Quả Tổng Hợp
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {!kpi.hasHieuQuaFormula ? (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-warning-foreground">
                      Chưa cấu hình công thức hiệu quả
                    </p>
                    <p className="mt-2 text-muted-foreground text-sm">
                      Cần xác nhận trước khi tính
                    </p>
                  </div>
                </div>
              ) : kpi.hieuQua !== null ? (
                <>
                  <div className={`text-2xl font-bold ${kpi.hieuQua >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatEfficiency(kpi.hieuQua, formula)}
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">
                    theo công thức hiệu quả đã cấu hình
                  </p>
                </>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-warning-foreground">
                      Chưa thể tính hiệu quả
                    </p>
                    <p className="mt-2 text-muted-foreground text-sm">
                      Thiếu dữ liệu doanh thu hoặc chi phí bắt buộc
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {hasNegativeData && (
        <Card className="border-warning/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-warning-foreground">Cảnh báo dữ liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Có bản ghi doanh thu/chi phí âm cần kiểm tra theo quy tắc AMR.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
