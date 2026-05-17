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
  periodLabel as periodLabelFn,
  type ReportFilters,
  type SLRecord,
} from '@/lib/report-mock-data'
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
import { SLStatusChip } from './status-chip'

const PAGE_SIZE = 10

export function SLTab({
  rows,
  opRows,
  appliedFilters,
  isLoading,
  onViewDetail,
  onViewOperational,
}: {
  rows: SLRecord[]
  opRows: OperationalRow[]
  appliedFilters: ReportFilters
  isLoading: boolean
  onViewDetail: (row: SLRecord) => void
  onViewOperational: (row: OperationalRow) => void
}) {
  const [page, setPage] = useState(1)
  const [opPage, setOpPage] = useState(1)

  useEffect(() => {
    setPage(1)
    setOpPage(1)
  }, [rows, opRows])

  const summary = computeSLSummary(rows)

  const summaryItems = [
    { title: 'Tổng cont KH', value: formatNumber(summary.totalContKH), icon: ClipboardList, iconBgClassName: 'bg-blue-500' },
    { title: 'Tổng cont TH', value: formatNumber(summary.totalContTH), icon: Package, iconBgClassName: 'bg-emerald-500' },
    { title: 'Tỷ lệ hoàn thành', value: formatPercent(summary.completionRatio), icon: Percent, iconBgClassName: 'bg-indigo-500' },
    { title: 'Cont GLS', value: formatNumber(summary.totalContGLS), icon: Boxes, iconBgClassName: 'bg-violet-500' },
    { title: 'Tỷ lệ GLS/SL', value: formatPercent(summary.glsSlRatio), icon: Percent, iconBgClassName: 'bg-cyan-600' },
    { title: 'Cont lái xe', value: formatNumber(summary.totalContLX), icon: Truck, iconBgClassName: 'bg-teal-600' },
    { title: 'Cont Vendor', value: formatNumber(summary.totalContVendor), icon: ShoppingBag, iconBgClassName: 'bg-slate-600' },
    {
      title: 'NS BQ/người',
      value: summary.avgProductivity != null ? summary.avgProductivity.toFixed(1) : '—',
      icon: Users,
      iconBgClassName: 'bg-orange-500',
    },
  ]

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedRows = useMemo(
    () => rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [rows, safePage],
  )

  const opTotalPages = Math.max(1, Math.ceil(opRows.length / PAGE_SIZE))
  const safeOpPage = Math.min(opPage, opTotalPages)
  const paginatedOp = useMemo(
    () => opRows.slice((safeOpPage - 1) * PAGE_SIZE, safeOpPage * PAGE_SIZE),
    [opRows, safeOpPage],
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

  const opFooter =
    !isLoading ? (
      <ReportPaginationFooter
        page={safeOpPage}
        pageSize={PAGE_SIZE}
        total={opRows.length}
        onPageChange={setOpPage}
      />
    ) : null

  const opTableBody =
    isLoading ? (
      <Skeleton className="h-48 w-full max-w-md rounded-md" />
    ) : opRows.length === 0 ? (
      <EmptyState className="border-0 bg-transparent py-16">
        <p className="text-sm text-gray-600">Không có dữ liệu sản lượng theo bộ lọc.</p>
      </EmptyState>
    ) : (
      <ReportDataTable aria-label="Bảng sản lượng chi tiết">
        <Table.Header>
          <Table.Column className={TABLE_COL_WIDE}>Thời gian</Table.Column>
          <Table.Column className={TABLE_COL_WIDE}>Khu vực</Table.Column>
          <Table.Column className={TABLE_COL_WIDE}>Kho</Table.Column>
          <Table.Column className={TABLE_COL_WIDE}>Tuyến</Table.Column>
          <Table.Column className={TABLE_COL_WIDE}>Nhân sự</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Sản lượng</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Số đơn</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Số chuyến</Table.Column>
          <Table.Column className={TABLE_COL_ACTION}>Thao tác</Table.Column>
        </Table.Header>
        <Table.Body items={paginatedOp}>
          {(row) => (
            <Table.Row id={row.id}>
              <Table.Cell className={TABLE_COL_WIDE}>{periodLabelFn(row)}</Table.Cell>
              <Table.Cell className={TABLE_COL_WIDE}>{row.region}</Table.Cell>
              <Table.Cell className={TABLE_COL_WIDE}>{row.warehouse}</Table.Cell>
              <Table.Cell className={TABLE_COL_WIDE}>{row.route}</Table.Cell>
              <Table.Cell className={TABLE_COL_WIDE}>{row.staff}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.sanLuong)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.soDon)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.soChuyen)}</Table.Cell>
              <Table.Cell className={TABLE_COL_ACTION}>
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    isIconOnly
                    aria-label="Drill-down"
                    className="h-8 w-8 min-w-8 text-gray-600"
                    onPress={() => onViewOperational(row)}
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

  const tableBody =
    isLoading ? (
      <Skeleton className="h-48 w-full max-w-md rounded-md" />
    ) : rows.length === 0 ? (
      <EmptyState className="border-0 bg-transparent py-16">
        <p className="text-sm text-gray-600">Không có dữ liệu SL theo bộ lọc hiện tại.</p>
      </EmptyState>
    ) : (
      <ReportDataTable aria-label="Bảng sản lượng SL">
            <Table.Header>
              <Table.Column className={TABLE_COL_WIDE}>Kỳ báo cáo</Table.Column>
              <Table.Column className={TABLE_COL_WIDE}>Chi nhánh</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>NS GN</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>SL KH</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>SL TH</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>TH/KH</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>SL GLS</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>GLS/SL</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>NS BQ</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>LX</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>LX/SL</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Vendor</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Vend/SL</Table.Column>
              <Table.Column className={TABLE_COL_STATUS}>Trạng thái</Table.Column>
              <Table.Column className={TABLE_COL_ACTION}>Thao tác</Table.Column>
            </Table.Header>
            <Table.Body items={paginatedRows}>
              {(row) => (
                <Table.Row id={row.id}>
                  <Table.Cell
                    className={`${TABLE_COL_WIDE} font-medium text-blue-600 underline decoration-blue-600/40 underline-offset-2 hover:text-blue-700`}
                  >
                    {periodLabel(row)}
                  </Table.Cell>
                  <Table.Cell className={`${TABLE_COL_WIDE} font-semibold text-gray-900`}>{row.branch}</Table.Cell>
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
                        aria-label="Chi tiết"
                        className="h-8 w-8 min-w-8 text-gray-600"
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
        columnsClassName="sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
      />
      <ReportTablePanel
        title="Bảng sản lượng"
        subtitle={`Chi tiết theo kho, tuyến, nhân sự · ${appliedFiltersCaption(appliedFilters)}`}
        footer={opFooter}
      >
        {opTableBody}
      </ReportTablePanel>
      <ReportTablePanel
        title="Tổng hợp SL theo khu vực (BC Tuần/Tháng)"
        subtitle="Layout tham chiếu sheet SL"
        footer={footer}
      >
        {tableBody}
      </ReportTablePanel>
    </div>
  )
}
