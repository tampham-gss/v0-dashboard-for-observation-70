'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, EmptyState, Skeleton, Table } from '@heroui/react'
import { Eye } from 'lucide-react'
import {
  buildEfficiencyRows,
  formatCurrency,
  formatNumber,
  formatPercent,
  type EfficiencyRow,
} from '@/lib/report-dashboard-mock'
import type { ReportFilters } from '@/lib/report-mock-data'
import type { OperationalRow } from '@/lib/report-dashboard-mock'
import {
  TABLE_COL_ACTION,
  TABLE_COL_STATUS,
  TABLE_COL_WIDE,
  TABLE_NUM_COL,
} from './report-table-chrome'
import { ReportDataTable } from './report-data-table'
import { MetricKpiStrip } from './metric-kpi-strip'
import { ReportPaginationFooter } from './report-pagination-footer'
import { ReportTablePanel } from './report-table-panel'
import { cn } from '@/lib/utils'
import { Gauge, Percent, Scale } from 'lucide-react'

const PAGE_SIZE = 10

export function EfficiencyTab({
  opRows,
  appliedFilters,
  isLoading,
  canViewFinancial,
  efficiencyConfigured,
  onViewDetail,
}: {
  opRows: OperationalRow[]
  appliedFilters: ReportFilters
  isLoading: boolean
  canViewFinancial: boolean
  efficiencyConfigured: boolean
  onViewDetail: (row: EfficiencyRow) => void
}) {
  const [page, setPage] = useState(1)
  const rows = useMemo(() => buildEfficiencyRows(opRows), [opRows])

  useEffect(() => setPage(1), [rows])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = useMemo(
    () => rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [rows, safePage],
  )

  const avgTyLe =
    rows.filter((r) => r.tyLeHieuQua != null).length > 0
      ? rows.reduce((s, r) => s + (r.tyLeHieuQua ?? 0), 0) /
        rows.filter((r) => r.tyLeHieuQua != null).length
      : null

  const kpiItems = [
    {
      title: 'Tỷ lệ HQ TB',
      value: efficiencyConfigured && canViewFinancial ? formatPercent(avgTyLe) : 'Chưa cấu hình',
      icon: Gauge,
      tone: 'primary',
    },
    {
      title: 'Dòng có DT',
      value: String(rows.filter((r) => r.hasDoanhThu).length),
      icon: Percent,
      tone: 'success',
    },
    {
      title: 'Cảnh báo',
      value: String(rows.filter((r) => r.anomaly).length),
      icon: Scale,
      tone: 'danger',
    },
  ]

  const footer =
    !isLoading ? (
      <ReportPaginationFooter
        page={safePage}
        pageSize={PAGE_SIZE}
        total={rows.length}
        onPageChange={setPage}
      />
    ) : null

  return (
    <div className="space-y-6">
      <MetricKpiStrip items={kpiItems} isLoading={isLoading} columnsClassName="sm:grid-cols-3" />
      <ReportTablePanel
        title="Bảng hiệu quả"
        subtitle="Sản lượng · doanh thu · chi phí · tỷ lệ hiệu quả theo bộ lọc"
        footer={footer}
      >
        {isLoading ? (
          <Skeleton className="mx-4 mb-4 h-48 w-full max-w-md rounded-md" />
        ) : rows.length === 0 ? (
          <EmptyState className="border-0 bg-transparent py-16">
            <p className="text-sm text-gray-600">Không có dữ liệu hiệu quả theo bộ lọc.</p>
          </EmptyState>
        ) : (
          <ReportDataTable aria-label="Bảng hiệu quả">
            <Table.Header>
              <Table.Column isRowHeader className={TABLE_COL_WIDE}>
                Thời gian
              </Table.Column>
              <Table.Column className={TABLE_COL_WIDE}>Khu vực</Table.Column>
              <Table.Column className={TABLE_COL_WIDE}>Tuyến</Table.Column>
              <Table.Column className={TABLE_COL_WIDE}>Kho</Table.Column>
              <Table.Column className={TABLE_COL_WIDE}>Nhân sự</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Sản lượng</Table.Column>
              {canViewFinancial ? (
                <>
                  <Table.Column className={TABLE_NUM_COL}>Doanh thu</Table.Column>
                  <Table.Column className={TABLE_NUM_COL}>Chi phí</Table.Column>
                </>
              ) : null}
              <Table.Column className={TABLE_NUM_COL}>Tỷ lệ HQ</Table.Column>
              <Table.Column className={TABLE_COL_ACTION}> </Table.Column>
            </Table.Header>
            <Table.Body items={paginated}>
              {(row) => (
                <Table.Row
                  id={row.id}
                  className={cn(row.anomaly && 'bg-red-50/50')}
                >
                  <Table.Cell className={TABLE_COL_WIDE}>{row.period}</Table.Cell>
                  <Table.Cell className={TABLE_COL_WIDE}>{row.region}</Table.Cell>
                  <Table.Cell className={TABLE_COL_WIDE}>{row.route}</Table.Cell>
                  <Table.Cell className={TABLE_COL_WIDE}>{row.warehouse}</Table.Cell>
                  <Table.Cell className={TABLE_COL_WIDE}>{row.staff}</Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.sanLuong)}</Table.Cell>
                  {canViewFinancial ? (
                    <>
                      <Table.Cell className={TABLE_NUM_COL}>
                        {row.hasDoanhThu ? formatCurrency(row.doanhThu) : 'Chưa có dữ liệu'}
                      </Table.Cell>
                      <Table.Cell className={TABLE_NUM_COL}>{formatCurrency(row.chiPhi)}</Table.Cell>
                    </>
                  ) : null}
                  <Table.Cell className={TABLE_NUM_COL}>
                    {efficiencyConfigured && row.tyLeHieuQua != null
                      ? formatPercent(row.tyLeHieuQua)
                      : '—'}
                  </Table.Cell>
                  <Table.Cell className={TABLE_COL_ACTION}>
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        aria-label="Chi tiết"
                        className="h-8 w-8 min-w-8 text-gray-600"
                        onPress={() => onViewDetail(row)}
                      >
                        <Eye className="size-4" strokeWidth={1.75} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </ReportDataTable>
        )}
      </ReportTablePanel>
    </div>
  )
}

