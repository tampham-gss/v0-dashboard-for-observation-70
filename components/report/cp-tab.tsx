'use client'

import { useEffect, useMemo, useState } from 'react'
import { EmptyState, Skeleton, Table } from '@heroui/react'
import { Boxes, ClipboardList, Coins, DollarSign, Percent, Truck } from 'lucide-react'
import {
  appliedFiltersCaption,
  computeCPSummary,
  formatCurrency,
  formatNumber,
  periodLabel,
  type CPRecord,
  type ReportFilters,
  type SLRecord,
} from '@/lib/report-mock-data'
import type { BcSourceSheet } from '@/lib/bc-report'
import {
  REPORT_TABLE_MIN_WIDTH_CP,
  TABLE_COL_ACTION,
  TABLE_COL_STATUS,
  TABLE_COL_WIDE,
  TABLE_NUM_COL,
  TABLE_NUM_COL_WIDE,
} from './report-table-chrome'
import { ReportDataTable } from './report-data-table'
import { ReportTableViewAction } from './report-table-actions'
import { MetricKpiStrip } from './metric-kpi-strip'
import { ReportPaginationFooter } from './report-pagination-footer'
import { ReportTablePanel } from './report-table-panel'
import { CPStatusChip } from './status-chip'

const PAGE_SIZE = 10

export function CPTab({
  rows,
  slRows,
  sourceSheet,
  appliedFilters,
  isLoading,
  onViewDetail,
}: {
  rows: CPRecord[]
  slRows: SLRecord[]
  sourceSheet: BcSourceSheet
  appliedFilters: ReportFilters
  isLoading: boolean
  onViewDetail: (row: CPRecord) => void
}) {
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [rows])

  const summary = computeCPSummary(rows, slRows)

  const summaryItems = [
    { title: 'Tổng CP GLS', value: formatCurrency(summary.totalCPGLS), icon: ClipboardList, tone: 'primary' as const },
    { title: 'Tổng CP lái xe', value: formatCurrency(summary.totalCPLX), icon: Truck, tone: 'primary' as const },
    { title: 'Tổng CP Vendor', value: formatCurrency(summary.totalCPVendor), icon: Boxes, tone: 'primary' as const },
    { title: 'Tổng chi phí', value: formatCurrency(summary.totalChiPhi), icon: Coins, tone: 'warning' as const },
    { title: 'CP TB/Cont', value: formatCurrency(summary.cpTBPerCont), icon: DollarSign, tone: 'warning' as const },
    {
      title: 'Target CP/Cont',
      value: formatCurrency(summary.targetCpPerCont),
      description: 'Định mức tham chiếu',
      icon: Percent,
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
        <p className="text-sm text-gray-600">Không có dữ liệu CP theo bộ lọc hiện tại.</p>
      </EmptyState>
    ) : (
      <ReportDataTable
        aria-label="Bảng chi phí CP"
        className={REPORT_TABLE_MIN_WIDTH_CP}
        framed={false}
      >
        <Table.Header>
          <Table.Column isRowHeader className={TABLE_COL_WIDE}>
            Tuần/Tháng
          </Table.Column>
          <Table.Column className={TABLE_COL_WIDE}>Chi nhánh</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Nhân công</Table.Column>
          <Table.Column className={TABLE_NUM_COL_WIDE}>CP GN GLS/cont</Table.Column>
          <Table.Column className={TABLE_NUM_COL_WIDE}>Tổng CP GN GLS</Table.Column>
          <Table.Column className={TABLE_NUM_COL_WIDE}>Cont GLS KĐ</Table.Column>
          <Table.Column className={TABLE_NUM_COL_WIDE}>Tổng CP Lái xe KĐ</Table.Column>
          <Table.Column className={TABLE_NUM_COL_WIDE}>Cont lái xe KĐ</Table.Column>
          <Table.Column className={TABLE_NUM_COL_WIDE}>Tổng CP Vendor</Table.Column>
          <Table.Column className={TABLE_NUM_COL_WIDE}>Cont Vendor KĐ</Table.Column>
          <Table.Column className={TABLE_NUM_COL_WIDE}>Tổng chi phí</Table.Column>
          <Table.Column className={TABLE_NUM_COL_WIDE}>CP TB/Cont</Table.Column>
          <Table.Column className={TABLE_COL_STATUS}>Trạng thái</Table.Column>
          <Table.Column className={TABLE_COL_ACTION}>Thao tác</Table.Column>
        </Table.Header>
        <Table.Body items={paginatedRows}>
          {(row) => (
            <Table.Row id={row.id}>
              <Table.Cell className={`${TABLE_COL_WIDE} font-medium text-gray-900`}>
                {periodLabel(row)}
              </Table.Cell>
              <Table.Cell className={`${TABLE_COL_WIDE} font-medium text-gray-900`}>
                {row.branch}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.nhanCong)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL_WIDE}>{formatCurrency(row.cpGNGLSPerCont)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL_WIDE}>{formatCurrency(row.tongCPGNGLS)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL_WIDE}>{formatNumber(row.contGNGLSKD)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL_WIDE}>{formatCurrency(row.tongCPLaiXeKD)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL_WIDE}>{formatNumber(row.contLaiXeKD)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL_WIDE}>{formatCurrency(row.tongCPVendor)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL_WIDE}>{formatNumber(row.contVendorKD)}</Table.Cell>
              <Table.Cell className={`${TABLE_NUM_COL_WIDE} font-medium`}>
                {formatCurrency(row.tongChiPhi)}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL_WIDE}>{formatCurrency(row.cpTBPerCont)}</Table.Cell>
              <Table.Cell className={TABLE_COL_STATUS}>
                <div className="flex justify-center">
                  <CPStatusChip status={row.status} />
                </div>
              </Table.Cell>
              <Table.Cell className={TABLE_COL_ACTION}>
                <div className="flex justify-center">
                  <ReportTableViewAction onPress={() => onViewDetail(row)} />
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
        columnsClassName="sm:grid-cols-2 lg:grid-cols-3"
      />
      <ReportTablePanel
        title="Bảng chi phí (CP)"
        subtitle={`${sourceSheet} · ${appliedFiltersCaption(appliedFilters)}`}
        footer={footer}
      >
        {tableBody}
      </ReportTablePanel>
    </div>
  )
}
