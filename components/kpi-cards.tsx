'use client'

import { Package, DollarSign, Wallet, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { calculateTotalKPI, formatCurrency, formatNumber } from '@/lib/mock-data'

interface KPICardsProps {
  isLoading: boolean
}

export function KPICards({ isLoading }: KPICardsProps) {
  const kpi = calculateTotalKPI()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <p className="text-xs text-muted-foreground mt-1">
            công/container
          </p>
        </CardContent>
      </Card>

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
              <p className="text-xs text-muted-foreground mt-1">
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
                <p className="text-xs text-muted-foreground mt-1">
                  Một số khu vực chưa có nguồn dữ liệu
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
          <p className="text-xs text-muted-foreground mt-1">
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
          {kpi.hieuQua !== null ? (
            <>
              <div className={`text-2xl font-bold ${kpi.hieuQua >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(kpi.hieuQua)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                doanh thu - chi phí
              </p>
            </>
          ) : (
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-warning-foreground">
                  Chưa thể tính hiệu quả
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Thiếu dữ liệu doanh thu để tính
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
