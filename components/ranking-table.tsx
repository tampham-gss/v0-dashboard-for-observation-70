'use client'

import { TrendingUp, TrendingDown, Minus, ExternalLink, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, Skeleton, Table } from '@heroui/react'
import {
  TABLE_COL_ACTION,
  TABLE_CENTER_COL,
  TABLE_NUM_COL,
  TABLE_TEXT_COL,
} from '@/components/report/report-table-chrome'
import { ReportDataTable } from '@/components/report/report-data-table'
import { formatCurrency, formatNumber, formatEfficiency } from '@/lib/mock-data'
import type { RegionData, HubData, CustomerData, EfficiencyFormula } from '@/lib/mock-data'

interface RankingTableProps {
  type: 'region' | 'hub' | 'customer'
  isLoading: boolean
  data: Array<RegionData | HubData | CustomerData>
  formula: EfficiencyFormula
  canViewFinancial: boolean
  onDrillDown: (item: RegionData | HubData | CustomerData) => void
}

const titles: Record<RankingTableProps['type'], { title: string; description: string }> = {
  region: { title: 'Xếp Hạng Theo Khu Vực', description: 'Sản lượng và hiệu quả theo khu vực' },
  hub: { title: 'Xếp Hạng Theo Hub', description: 'So sánh hiệu quả các Hub' },
  customer: { title: 'Xếp Hạng Theo Khách Hàng', description: 'Top khách hàng theo sản lượng' },
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="size-4 text-success" aria-hidden />
  if (trend === 'down') return <TrendingDown className="size-4 text-muted-foreground" aria-hidden />
  return <Minus className="size-4 text-muted-foreground" aria-hidden />
}

export function RankingTable({ type, isLoading, data, formula, canViewFinancial, onDrillDown }: RankingTableProps) {
  const { title, description } = titles[type]

  if (isLoading) {
    return (
      <Card>
      <CardHeader className="gap-1 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-6 w-52 max-w-full rounded-md" />
          <Skeleton className="h-4 w-72 max-w-full rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
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
        {data.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">
            Không có dữ liệu phù hợp với bộ lọc hiện tại.
          </p>
        ) : (
        <ReportDataTable aria-label={title}>
              <Table.Header>
                <Table.Column isRowHeader className={`${TABLE_TEXT_COL} w-[40px]`}>
                  #
                </Table.Column>
                <Table.Column className={TABLE_TEXT_COL}>
                  {type === 'region' ? 'Khu vực' : type === 'hub' ? 'Hub' : 'Khách hàng'}
                </Table.Column>
                <Table.Column className={TABLE_NUM_COL}>Sản lượng</Table.Column>
                {canViewFinancial && <Table.Column className={TABLE_NUM_COL}>Doanh thu</Table.Column>}
                {canViewFinancial && <Table.Column className={TABLE_NUM_COL}>Hiệu quả</Table.Column>}
                {type === 'region' && (
                  <Table.Column className={`${TABLE_CENTER_COL} w-[60px]`}>Xu hướng</Table.Column>
                )}
                <Table.Column className={TABLE_COL_ACTION}> </Table.Column>
              </Table.Header>
              <Table.Body items={data.map((item, index) => ({ ...item, rank: index + 1 }))}>
                {(row) => {
                  const { rank, ...item } = row
                  return (
                    <Table.Row id={item.id}>
                      <Table.Cell className={`${TABLE_TEXT_COL} font-medium text-gray-900`}>{rank}</Table.Cell>
                      <Table.Cell className={TABLE_TEXT_COL}>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          {'regionName' in item && (
                            <span className="text-sm text-gray-500">{item.regionName}</span>
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell className={`${TABLE_NUM_COL} font-medium`}>{formatNumber(item.sanLuong)}</Table.Cell>
                      {canViewFinancial && (
                        <Table.Cell className={TABLE_NUM_COL}>
                          {item.hasDoanhThuData ? (
                            formatCurrency(item.doanhThu)
                          ) : (
                            <span className="inline-flex items-center justify-end gap-1 text-warning">
                              <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                              <span className="text-sm">Chưa có</span>
                            </span>
                          )}
                        </Table.Cell>
                      )}
                      {canViewFinancial && (
                        <Table.Cell className={TABLE_NUM_COL}>
                          {item.hieuQua !== null ? (
                            <span
                              className={
                                item.hieuQua >= 0 ? 'font-medium text-success' : 'font-medium text-destructive'
                              }
                            >
                              {formatEfficiency(item.hieuQua, formula)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-end gap-1 text-warning">
                              <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                              <span className="text-sm">Chưa tính</span>
                            </span>
                          )}
                        </Table.Cell>
                      )}
                      {type === 'region' && 'trend' in item && (
                        <Table.Cell className={TABLE_CENTER_COL}>
                          <div className="flex justify-center">
                            <TrendIcon trend={item.trend} />
                          </div>
                        </Table.Cell>
                      )}
                      <Table.Cell className={TABLE_COL_ACTION}>
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            isIconOnly
                            className="h-8 w-8 min-w-8 text-gray-600"
                            aria-label="Xem chi tiết"
                            onPress={() => onDrillDown(item)}
                          >
                            <ExternalLink className="size-4" />
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )
                }}
              </Table.Body>
        </ReportDataTable>
        )}
      </CardContent>
    </Card>
  )
}
