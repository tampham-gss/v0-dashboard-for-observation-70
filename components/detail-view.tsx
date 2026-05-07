'use client'

import { ArrowLeft, Package, DollarSign, Wallet, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  orderDetails, 
  formatCurrency, 
  formatNumber,
  getStatusLabel,
  getStatusVariant,
  weeklyTrend,
} from '@/lib/mock-data'
import type { RegionData, HubData, CustomerData, FilterPeriod } from '@/lib/mock-data'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

interface DetailViewProps {
  type: 'region' | 'hub' | 'customer'
  item: RegionData | HubData | CustomerData
  period: FilterPeriod
  onBack: () => void
}

const formatValue = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)} tỷ`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)} tr`
  }
  return value.toLocaleString('vi-VN')
}

const typeLabels = {
  region: 'Khu vực',
  hub: 'Hub',
  customer: 'Khách hàng',
}

export function DetailView({ type, item, period, onBack }: DetailViewProps) {
  // Filter order details based on type (simplified for mock)
  const filteredOrders = orderDetails.slice(0, 6)

  // Mock comparison data for this specific item
  const comparisonData = weeklyTrend.map((d, i) => ({
    ...d,
    sanLuong: Math.round(d.sanLuong * (0.15 + Math.random() * 0.1)),
    doanhThu: item.hasDoanhThuData ? Math.round(d.doanhThu! * (0.15 + Math.random() * 0.1)) : null,
    chiPhi: Math.round(d.chiPhi * (0.15 + Math.random() * 0.1)),
    hieuQua: item.hasDoanhThuData 
      ? Math.round((d.doanhThu! - d.chiPhi) * (0.15 + Math.random() * 0.1)) 
      : null,
  }))

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại tổng quan
        </Button>
        <div className="h-6 w-px bg-border" />
        <div>
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <p className="text-sm text-muted-foreground">
            Chi tiết {typeLabels[type].toLowerCase()} theo {period === 'week' ? 'tuần' : 'tháng'}
          </p>
        </div>
      </div>

      {/* KPI Summary for this item */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sản Lượng</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(item.sanLuong)}</div>
            <p className="text-xs text-muted-foreground">công/container</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Doanh Thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {item.hasDoanhThuData ? (
              <>
                <div className="text-2xl font-bold">{formatCurrency(item.doanhThu)}</div>
                <p className="text-xs text-muted-foreground">doanh thu kiểm đếm</p>
              </>
            ) : (
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning-foreground">Chưa có dữ liệu</p>
                  <p className="text-xs text-muted-foreground">Nguồn chưa tích hợp</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chi Phí</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(item.chiPhi)}</div>
            <p className="text-xs text-muted-foreground">chi phí vận hành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hiệu Quả</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {item.hieuQua !== null ? (
              <>
                <div className={`text-2xl font-bold ${item.hieuQua >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(item.hieuQua)}
                </div>
                <p className="text-xs text-muted-foreground">doanh thu - chi phí</p>
              </>
            ) : (
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning-foreground">Chưa thể tính</p>
                  <p className="text-xs text-muted-foreground">Thiếu dữ liệu doanh thu</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison Charts */}
      <Card>
        <CardHeader>
          <CardTitle>So Sánh Sản Lượng và Hiệu Quả</CardTitle>
          <CardDescription>
            Phân tích để phát hiện nhóm có sản lượng cao nhưng hiệu quả thấp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="comparison">
            <TabsList className="mb-4">
              <TabsTrigger value="comparison">So sánh</TabsTrigger>
              <TabsTrigger value="trend">Xu hướng</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="period" tick={{ fill: 'var(--muted-foreground)' }} />
                    <YAxis yAxisId="left" tickFormatter={formatValue} tick={{ fill: 'var(--muted-foreground)' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--muted-foreground)' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string) => [formatValue(value), name]}
                    />
                    <Legend />
                    <Bar yAxisId="right" dataKey="sanLuong" name="Sản lượng" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    {item.hasDoanhThuData && (
                      <Bar yAxisId="left" dataKey="hieuQua" name="Hiệu quả (VNĐ)" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {!item.hasDoanhThuData && (
                <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Không thể so sánh hiệu quả do chưa có nguồn dữ liệu doanh thu cho {typeLabels[type].toLowerCase()} này.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trend">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="period" tick={{ fill: 'var(--muted-foreground)' }} />
                    <YAxis tickFormatter={formatValue} tick={{ fill: 'var(--muted-foreground)' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string) => [formatValue(value), name]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="sanLuong" name="Sản lượng" stroke="var(--chart-1)" strokeWidth={2} />
                    {item.hasDoanhThuData && (
                      <>
                        <Line type="monotone" dataKey="doanhThu" name="Doanh thu" stroke="var(--chart-2)" strokeWidth={2} />
                        <Line type="monotone" dataKey="chiPhi" name="Chi phí" stroke="var(--chart-3)" strokeWidth={2} />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Details Table - Drill Down */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Lệnh Kiểm Đếm</CardTitle>
          <CardDescription>
            Chi tiết các lệnh kiểm đếm, nhân sự, kho, tuyến và chi phí liên quan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã lệnh</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Hub / Kho</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Nhân sự</TableHead>
                <TableHead>Container</TableHead>
                <TableHead className="text-right">Sản lượng</TableHead>
                <TableHead className="text-right">Doanh thu</TableHead>
                <TableHead className="text-right">Chi phí</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>CS/OPS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.maLenh}</TableCell>
                  <TableCell>{order.ngay}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{order.hub}</span>
                      <span className="text-xs text-muted-foreground">{order.kho}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={order.khachHang}>
                    {order.khachHang}
                  </TableCell>
                  <TableCell>{order.nhanSu}</TableCell>
                  <TableCell className="font-mono text-xs">{order.container}</TableCell>
                  <TableCell className="text-right font-medium">{order.sanLuong}</TableCell>
                  <TableCell className="text-right">
                    {order.doanhThu !== null ? (
                      formatCurrency(order.doanhThu)
                    ) : (
                      <span className="text-xs text-warning">Chưa có</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(order.chiPhi)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.trangThai)}>
                      {getStatusLabel(order.trangThai)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{order.csOps}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
