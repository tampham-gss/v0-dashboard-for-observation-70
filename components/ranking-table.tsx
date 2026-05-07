'use client'

import { TrendingUp, TrendingDown, Minus, ExternalLink, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { regions, hubs, customers, formatCurrency, formatNumber } from '@/lib/mock-data'
import type { RegionData, HubData, CustomerData } from '@/lib/mock-data'

interface RankingTableProps {
  type: 'region' | 'hub' | 'customer'
  isLoading: boolean
  onDrillDown: (item: RegionData | HubData | CustomerData) => void
}

const titles: Record<RankingTableProps['type'], { title: string; description: string }> = {
  region: { title: 'Xếp Hạng Theo Khu Vực', description: 'Sản lượng và hiệu quả theo khu vực' },
  hub: { title: 'Xếp Hạng Theo Hub', description: 'So sánh hiệu quả các Hub' },
  customer: { title: 'Xếp Hạng Theo Khách Hàng', description: 'Top khách hàng theo sản lượng' },
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-success" />
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />
  return <Minus className="h-4 w-4 text-muted-foreground" />
}

export function RankingTable({ type, isLoading, onDrillDown }: RankingTableProps) {
  const { title, description } = titles[type]
  
  const getData = () => {
    switch (type) {
      case 'region':
        return [...regions].sort((a, b) => b.sanLuong - a.sanLuong)
      case 'hub':
        return [...hubs].sort((a, b) => b.sanLuong - a.sanLuong).slice(0, 8)
      case 'customer':
        return [...customers].sort((a, b) => b.sanLuong - a.sanLuong)
    }
  }

  const data = getData()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead>{type === 'region' ? 'Khu vực' : type === 'hub' ? 'Hub' : 'Khách hàng'}</TableHead>
              <TableHead className="text-right">Sản lượng</TableHead>
              <TableHead className="text-right">Doanh thu</TableHead>
              <TableHead className="text-right">Hiệu quả</TableHead>
              {type === 'region' && <TableHead className="w-[60px]">Xu hướng</TableHead>}
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    {'regionName' in item && (
                      <span className="text-xs text-muted-foreground">{item.regionName}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatNumber(item.sanLuong)}
                </TableCell>
                <TableCell className="text-right">
                  {item.hasDoanhThuData ? (
                    formatCurrency(item.doanhThu)
                  ) : (
                    <span className="flex items-center justify-end gap-1 text-warning">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">Chưa có</span>
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {item.hieuQua !== null ? (
                    <span className={item.hieuQua >= 0 ? 'text-success font-medium' : 'text-destructive font-medium'}>
                      {formatCurrency(item.hieuQua)}
                    </span>
                  ) : (
                    <span className="flex items-center justify-end gap-1 text-warning">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">Chưa tính</span>
                    </span>
                  )}
                </TableCell>
                {type === 'region' && 'trend' in item && (
                  <TableCell>
                    <TrendIcon trend={item.trend} />
                  </TableCell>
                )}
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => onDrillDown(item)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Xem chi tiết</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
