'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { FilterPeriod, TimeSeriesData, EfficiencyFormula } from '@/lib/mock-data'
import { getEfficiencyFormulaLabel } from '@/lib/mock-data'
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

interface TrendChartProps {
  period: FilterPeriod
  isLoading: boolean
  data: TimeSeriesData[]
  formula: EfficiencyFormula
  canViewFinancial: boolean
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

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatValue(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function TrendChart({ period, isLoading, data, formula, canViewFinancial }: TrendChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xu Hướng Theo Thời Gian</CardTitle>
        <CardDescription>
          Biểu đồ sản lượng, doanh thu và chi phí theo {period === 'week' ? 'tuần' : 'tháng'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="combined" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="combined">Tổng hợp</TabsTrigger>
            <TabsTrigger value="sanluong">Sản lượng</TabsTrigger>
            {canViewFinancial && <TabsTrigger value="revenue">Doanh thu & Chi phí</TabsTrigger>}
          </TabsList>

          <TabsContent value="combined">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="period" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis yAxisId="left" className="text-xs" tickFormatter={formatValue} tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="right" dataKey="sanLuong" name="Sản lượng (công)" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  {canViewFinancial && (
                    <>
                      <Bar yAxisId="left" dataKey="doanhThu" name="Doanh thu (VNĐ)" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" dataKey="chiPhi" name="Chi phí (VNĐ)" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="sanluong">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="period" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sanLuong" 
                    name="Sản lượng (công)" 
                    stroke="var(--chart-1)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--chart-1)', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="revenue">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="period" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis className="text-xs" tickFormatter={formatValue} tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="doanhThu" 
                    name="Doanh thu (VNĐ)" 
                    stroke="var(--chart-2)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--chart-2)', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="chiPhi" 
                    name="Chi phí (VNĐ)" 
                    stroke="var(--chart-3)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--chart-3)', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hieuQua" 
                    name={formula === 'ratio' ? 'Hiệu quả (x)' : 'Hiệu quả (VNĐ)'} 
                    stroke="var(--chart-4)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: 'var(--chart-4)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Công thức hiệu quả hiện tại: {getEfficiencyFormulaLabel(formula)}
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
