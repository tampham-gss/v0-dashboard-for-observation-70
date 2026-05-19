'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, EmptyState, Skeleton, Table } from '@heroui/react'
import { Boxes, ClipboardList, Eye, Package, Percent, ShoppingBag, Truck, Users } from 'lucide-react'
import {
  appliedFiltersCaption,
  computeSLSummary,
  formatNumber,
  formatPercent,
  periodLabel,
  slCompareRatio,
  slProductivity,
  slRatioGLS,
  slRatioPart,
  type ReportFilters,
  type SLRecord,
} from '@/lib/report-mock-data'
import type { BcSourceSheet } from '@/lib/bc-report'
import {
  TABLE_COL_ACTION,
  TABLE_COL_STATUS,
  TABLE_COL_WIDE,
  TABLE_NUM_COL,
} from './report-table-chrome'
import { reportButtonClass } from './report-button-chrome'
import { ReportDataTable } from './report-data-table'
import { MetricKpiStrip } from './metric-kpi-strip'
import { ReportPaginationFooter } from './report-pagination-footer'
import { ReportTablePanel } from './report-table-panel'
import { SLStatusChip } from './status-chip'

const PAGE_SIZE = 10

export function SLTab({
  rows,
  sourceSheet,
  appliedFilters,
  isLoading,
  onViewDetail,
}: {
  rows: SLRecord[]
  sourceSheet: BcSourceSheet
  appliedFilters: ReportFilters
  isLoading: boolean
  onViewDetail: (row: SLRecord) => void
}) {
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [rows])

  const summary = computeSLSummary(rows)

  const summaryItems = [
    { title: 'Tổng cont KH', value: formatNumber(summary.totalContKH), icon: ClipboardList, tone: 'primary' as const },
    { title: 'Tổng cont TH', value: formatNumber(summary.totalContTH), icon: Package, tone: 'primary' as const },
    { title: 'Tỷ lệ hoàn thành', value: formatPercent(summary.completionRatio), icon: Percent, tone: 'primary' as const },
    { title: 'Cont GLS', value: formatNumber(summary.totalContGLS), icon: Boxes, tone: 'primary' as const },
    { title: 'Tỷ lệ GLS/SL', value: formatPercent(summary.glsSlRatio), icon: Percent, tone: 'primary' as const },
    { title: 'Cont lái xe', value: formatNumber(summary.totalContLX), icon: Truck, tone: 'primary' as const },
    { title: 'Cont Vendor', value: formatNumber(summary.totalContVendor), icon: ShoppingBag, tone: 'primary' as const },
    {
      title: 'NS BQ/người',
      value: summary.avgProductivity != null ? summary.avgProductivity.toFixed(1) : '—',
      icon: Users,
      tone: 'primary' as const,
    },
  ]

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedRows = useMemo(
    () => rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [rows, safePage],
  )

  const footer =
    !isLoading ? (
      <ReportPaginationFooter
        page={safePage}
        pageSize={PAGE_SIZE}
        total={rows.length}
        onPageChange={setPage}
      />
    ) : null

  const tableBody =
    isLoading ? (
      <Skeleton className="h-48 w-full max-w-md rounded-md" />
    ) : rows.length === 0 ? (
      <EmptyState className="border-0 bg-transparent py-16">
        <p className="text-sm text-gray-600">Không có dữ liệu SL theo bộ lọc hiện tại.</p>
      </EmptyState>
    ) : (
      <ReportDataTable aria-label="Bảng sản lượng SL" framed={false}>
        <Table.Header>
          <Table.Column isRowHeader className={TABLE_COL_WIDE}>
            Tuần/Tháng
          </Table.Column>
          <Table.Column className={TABLE_COL_WIDE}>Chi nhánh</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>NS Giao nhận</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>SL cont KH</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>SL cont TH</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>So sánh TH/KH</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>SL cont GLS</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Tỷ lệ GLS/SL</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>NS BQ/Người</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>SL cont Lái xe</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Tỷ lệ LX/SL</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>SL cont Vendor</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Tỷ lệ Vendor/SL</Table.Column>
          <Table.Column className={TABLE_COL_STATUS}>Trạng thái</Table.Column>
          <Table.Column className={TABLE_COL_ACTION}>Thao tác</Table.Column>
        </Table.Header>
        <Table.Body items={paginatedRows}>
          {(row) => (
            <Table.Row id={row.id}>
              <Table.Cell className={`${TABLE_COL_WIDE} font-medium text-gray-900`}>
                {periodLabel(row)}
              </Table.Cell>
              <Table.Cell className={`${TABLE_COL_WIDE} font-semibold text-gray-900`}>
                {row.branch}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.nsGiaoNhan)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.slContKH)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.slContTH)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>
                {formatPercent(slCompareRatio(row.slContKH, row.slContTH))}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.slContGLS)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>
                {formatPercent(slRatioGLS(row.slContGLS, row.slContTH))}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>
                {slProductivity(row.slContTH, row.nsGiaoNhan)?.toFixed(1) ?? '—'}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.slContLX)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>
                {formatPercent(slRatioPart(row.slContLX, row.slContTH))}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.slContVendor)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>
                {formatPercent(slRatioPart(row.slContVendor, row.slContTH))}
              </Table.Cell>
              <Table.Cell className={TABLE_COL_STATUS}>
                <div className="flex justify-center">
                  <SLStatusChip status={row.status} />
                </div>
              </Table.Cell>
              <Table.Cell className={TABLE_COL_ACTION}>
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    isIconOnly
                    aria-label="Xem chi tiết"
                    className={reportButtonClass('h-8 w-8 min-w-8 text-gray-600')}
                    onPress={() => onViewDetail(row)}
                  >
                    <Eye className="size-4 shrink-0" strokeWidth={1.75} />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </ReportDataTable>
    )

  return (
    <div className="space-y-6">
      <MetricKpiStrip
        items={summaryItems}
        isLoading={isLoading}
        columnsClassName="sm:grid-cols-2 lg:grid-cols-4"
      />
      <ReportTablePanel
        title="Bảng sản lượng (SL)"
        subtitle={`${sourceSheet} · ${appliedFiltersCaption(appliedFilters)}`}
        footer={footer}
      >
        {tableBody}
      </ReportTablePanel>
    </div>
  )
}
