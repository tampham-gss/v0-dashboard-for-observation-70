'use client'

import { ArrowLeft, Package, DollarSign, Wallet, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState, Table } from '@heroui/react'
import {
  TABLE_COL_STATUS,
  TABLE_NUM_COL,
  TABLE_TEXT_COL,
} from '@/components/report/report-table-chrome'
import { ReportDataTable } from '@/components/report/report-data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  formatCurrency, 
  formatNumber,
  formatEfficiency,
  getStatusLabel,
  getStatusVariant,
  hubs,
  type OrderDetail,
  type EfficiencyFormula,
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
  formula: EfficiencyFormula
  canViewFinancial: boolean
  orders: OrderDetail[]
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

export function DetailView({ type, item, period, formula, canViewFinancial, orders, onBack }: DetailViewProps) {
  const scopedOrders = orders.filter((order) => {
    if (type === 'hub') return order.hub === item.name
    if (type === 'customer') return order.khachHang === item.name
    if (type === 'region') return hubs.find((h) => h.name === order.hub)?.regionId === item.id
    return false
  })

  const comparisonMap = new Map<string, { sanLuong: number; doanhThu: number; chiPhi: number; hasMissingRevenue: boolean }>()
  scopedOrders.forEach((order) => {
    const key = period === 'week' ? order.ngay : order.ngay.slice(3)
    const current = comparisonMap.get(key) || { sanLuong: 0, doanhThu: 0, chiPhi: 0, hasMissingRevenue: false }
    current.sanLuong += order.sanLuong
    current.chiPhi += order.chiPhi
    if (order.doanhThu === null) current.hasMissingRevenue = true
    else current.doanhThu += order.doanhThu
    comparisonMap.set(key, current)
  })

  const comparisonData = Array.from(comparisonMap.entries()).map(([periodKey, values]) => {
    const doanhThu = values.hasMissingRevenue ? null : values.doanhThu
    const hieuQua = doanhThu === null ? null : (formula === 'ratio' ? (values.chiPhi === 0 ? null : doanhThu / values.chiPhi) : doanhThu - values.chiPhi)
    return {
      period: periodKey,
      sanLuong: values.sanLuong,
      doanhThu,
      chiPhi: values.chiPhi,
      hieuQua,
    }
  })

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

        {canViewFinancial && (
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
        )}

        {canViewFinancial && (
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
        )}

        {canViewFinancial && (
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hiệu Quả</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {item.hieuQua !== null ? (
              <>
                <div className={`text-2xl font-bold ${item.hieuQua >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatEfficiency(item.hieuQua, formula)}
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
        )}
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
                    {item.hasDoanhThuData && canViewFinancial && (
                      <Bar yAxisId="left" dataKey="hieuQua" name="Hiệu quả (VNĐ)" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {canViewFinancial && !item.hasDoanhThuData && (
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
                    {item.hasDoanhThuData && canViewFinancial && (
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
          {scopedOrders.length === 0 ? (
            <EmptyState className="border-0 bg-transparent py-12">
              <p className="text-sm text-gray-600">Không có lệnh kiểm đếm trong phạm vi đã chọn.</p>
            </EmptyState>
          ) : (
            <ReportDataTable aria-label="Danh sách lệnh kiểm đếm">
                  <Table.Header>
                    <Table.Column isRowHeader className={`${TABLE_TEXT_COL} font-mono`}>
                      Mã lệnh
                    </Table.Column>
                    <Table.Column className={TABLE_TEXT_COL}>Ngày</Table.Column>
                    <Table.Column className={TABLE_TEXT_COL}>Hub / Kho</Table.Column>
                    <Table.Column className={TABLE_TEXT_COL}>Khách hàng</Table.Column>
                    <Table.Column className={TABLE_TEXT_COL}>Nhân sự</Table.Column>
                    <Table.Column className={`${TABLE_TEXT_COL} font-mono`}>Container</Table.Column>
                    <Table.Column className={TABLE_NUM_COL}>Sản lượng</Table.Column>
                    {canViewFinancial && <Table.Column className={TABLE_NUM_COL}>Doanh thu</Table.Column>}
                    {canViewFinancial && <Table.Column className={TABLE_NUM_COL}>Chi phí</Table.Column>}
                    <Table.Column className={TABLE_CENTER_COL}>Trạng thái</Table.Column>
                    <Table.Column className={TABLE_TEXT_COL}>CS/OPS</Table.Column>
                  </Table.Header>
                  <Table.Body items={scopedOrders}>
                    {(order) => (
                      <Table.Row id={order.id}>
                        <Table.Cell className={`${TABLE_TEXT_COL} font-mono text-sm`}>{order.maLenh}</Table.Cell>
                        <Table.Cell className={TABLE_TEXT_COL}>{order.ngay}</Table.Cell>
                        <Table.Cell className={TABLE_TEXT_COL}>
                          <div className="flex flex-col">
                            <span className="text-sm">{order.hub}</span>
                            <span className="text-xs text-gray-500">{order.kho}</span>
                          </div>
                        </Table.Cell>
                        <Table.Cell className={`${TABLE_TEXT_COL} max-w-[150px]`}>
                          <span className="block truncate" title={order.khachHang}>
                            {order.khachHang}
                          </span>
                        </Table.Cell>
                        <Table.Cell className={TABLE_TEXT_COL}>{order.nhanSu}</Table.Cell>
                        <Table.Cell className={`${TABLE_TEXT_COL} font-mono text-xs`}>{order.container}</Table.Cell>
                        <Table.Cell className={`${TABLE_NUM_COL} font-medium`}>{order.sanLuong}</Table.Cell>
                        {canViewFinancial && (
                          <Table.Cell className={TABLE_NUM_COL}>
                            {order.doanhThu !== null ? (
                              <span className={order.doanhThu < 0 ? 'font-medium text-warning' : ''}>
                                {formatCurrency(order.doanhThu)}
                              </span>
                            ) : (
                              <span className="text-xs text-warning">Chưa có</span>
                            )}
                          </Table.Cell>
                        )}
                        {canViewFinancial && (
                          <Table.Cell className={TABLE_NUM_COL}>
                            <span className={order.chiPhi < 0 ? 'font-medium text-warning' : ''}>
                              {formatCurrency(order.chiPhi)}
                            </span>
                          </Table.Cell>
                        )}
                        <Table.Cell className={TABLE_COL_STATUS}>
                          <div className="flex justify-center">
                            <Badge variant={getStatusVariant(order.trangThai)}>
                              {getStatusLabel(order.trangThai)}
                            </Badge>
                          </div>
                        </Table.Cell>
                        <Table.Cell className={`${TABLE_TEXT_COL} text-sm`}>{order.csOps}</Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
            </ReportDataTable>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
