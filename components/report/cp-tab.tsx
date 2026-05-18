'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, EmptyState, Skeleton, Table } from '@heroui/react'
import { Boxes, ClipboardList, Coins, DollarSign, Eye, Percent, Truck } from 'lucide-react'
import {
  appliedFiltersCaption,
  computeCPSummary,
  formatCurrency,
  formatNumber,
  periodLabel,
  type CPRecord,
  type ReportFilters,
  periodLabel as periodLabelFn,
  type SLRecord,
} from '@/lib/report-mock-data'
import type { OperationalRow } from '@/lib/report-dashboard-mock'
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
import { CPStatusChip } from './status-chip'

const PAGE_SIZE = 10

export function CPTab({
  rows,
  slRows,
  opRows,
  appliedFilters,
  isLoading,
  canViewFinancial,
  onViewDetail,
  onViewOperational,
}: {
  rows: CPRecord[]
  slRows: SLRecord[]
  opRows: OperationalRow[]
  appliedFilters: ReportFilters
  isLoading: boolean
  canViewFinancial: boolean
  onViewDetail: (row: CPRecord) => void
  onViewOperational: (row: OperationalRow) => void
}) {
  const [page, setPage] = useState(1)
  const [opPage, setOpPage] = useState(1)

  useEffect(() => {
    setPage(1)
    setOpPage(1)
  }, [rows, opRows])

  const summary = computeCPSummary(rows, slRows)

  const summaryItems = [
    {
      title: 'Tổng CP GLS',
      value: formatCurrency(summary.totalCPGLS),
      icon: ClipboardList,
      iconBgClassName: 'bg-blue-500',
    },
    {
      title: 'Tổng CP lái xe',
      value: formatCurrency(summary.totalCPLX),
      icon: Truck,
      iconBgClassName: 'bg-teal-600',
    },
    {
      title: 'Tổng CP Vendor',
      value: formatCurrency(summary.totalCPVendor),
      icon: Boxes,
      iconBgClassName: 'bg-violet-500',
    },
    {
      title: 'Tổng chi phí',
      value: formatCurrency(summary.totalChiPhi),
      icon: Coins,
      iconBgClassName: 'bg-emerald-500',
    },
    {
      title: 'CP TB/Cont',
      value: formatCurrency(summary.cpTBPerCont),
      icon: DollarSign,
      iconBgClassName: 'bg-indigo-500',
    },
    {
      title: 'Target CP/Cont',
      value: formatCurrency(summary.targetCpPerCont),
      description: 'Định mức tham chiếu',
      icon: Percent,
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
    !canViewFinancial ? (
      <p className="px-5 py-8 text-center text-sm text-gray-600">
        Vai trò hiện tại không xem chi phí chi tiết.
      </p>
    ) : isLoading ? (
      <Skeleton className="h-48 w-full max-w-md rounded-md" />
    ) : opRows.length === 0 ? (
      <EmptyState className="border-0 bg-transparent py-16">
        <p className="text-sm text-gray-600">Không có dữ liệu chi phí theo bộ lọc.</p>
      </EmptyState>
    ) : (
      <ReportDataTable aria-label="Bảng chi phí chi tiết">
        <Table.Header>
          <Table.Column isRowHeader className={TABLE_COL_WIDE}>
            Thời gian
          </Table.Column>
          <Table.Column className={TABLE_COL_WIDE}>Khu vực</Table.Column>
          <Table.Column className={TABLE_COL_WIDE}>Kho</Table.Column>
          <Table.Column className={TABLE_COL_WIDE}>Tuyến</Table.Column>
          <Table.Column className={TABLE_COL_WIDE}>Nhân sự</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>CP vận hành</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Tăng ca</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Hỗ trợ</Table.Column>
          <Table.Column className={TABLE_COL_ACTION}>Thao tác</Table.Column>
        </Table.Header>
        <Table.Body items={paginatedOp}>
          {(row) => (
            <Table.Row id={`cp-op-${row.id}`}>
              <Table.Cell className={TABLE_COL_WIDE}>{periodLabelFn(row)}</Table.Cell>
              <Table.Cell className={TABLE_COL_WIDE}>{row.region}</Table.Cell>
              <Table.Cell className={TABLE_COL_WIDE}>{row.warehouse}</Table.Cell>
              <Table.Cell className={TABLE_COL_WIDE}>{row.route}</Table.Cell>
              <Table.Cell className={TABLE_COL_WIDE}>{row.staff}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatCurrency(row.chiPhiVanHanh)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatCurrency(row.tangCa)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatCurrency(row.hoTro)}</Table.Cell>
              <Table.Cell className={TABLE_COL_ACTION}>
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    isIconOnly
                    aria-label="Drill-down"
                    className={reportButtonClass('h-8 w-8 min-w-8 text-gray-600')}
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
        <p className="text-sm text-gray-600">Không có dữ liệu CP theo bộ lọc hiện tại.</p>
      </EmptyState>
    ) : (
      <ReportDataTable aria-label="Bảng chi phí CP">
            <Table.Header>
              <Table.Column isRowHeader className={TABLE_COL_WIDE}>
                Kỳ báo cáo
              </Table.Column>
              <Table.Column className={TABLE_COL_WIDE}>Chi nhánh</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Nhân công</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>CP GN / cont</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Tổng CP GN</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Cont GLS KĐ</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>CP lái xe KĐ</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Cont LX KĐ</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>CP Vendor</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Cont Ven KĐ</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Tổng CP</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>CP TB/cont</Table.Column>
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
                  <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.nhanCong)}</Table.Cell>
                  <Table.Cell className={`${TABLE_NUM_COL} font-medium`}>
                    {formatCurrency(row.cpGNGLSPerCont)}
                  </Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>{formatCurrency(row.tongCPGNGLS)}</Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.contGNGLSKD)}</Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>{formatCurrency(row.tongCPLaiXeKD)}</Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.contLaiXeKD)}</Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>{formatCurrency(row.tongCPVendor)}</Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.contVendorKD)}</Table.Cell>
                  <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>{formatCurrency(row.tongChiPhi)}</Table.Cell>
                  <Table.Cell className={`${TABLE_NUM_COL} font-medium`}>{formatCurrency(row.cpTBPerCont)}</Table.Cell>
                  <Table.Cell className={TABLE_COL_STATUS}>
                    <div className="flex justify-center">
                      <CPStatusChip status={row.status} />
                    </div>
                  </Table.Cell>
                  <Table.Cell className={TABLE_COL_ACTION}>
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        aria-label="Chi tiết"
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
        valueSize="sm"
        columnsClassName="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      />
      <ReportTablePanel
        title="Bảng chi phí"
        subtitle={`Chi tiết theo kho, tuyến, nhân sự · ${appliedFiltersCaption(appliedFilters)}`}
        footer={opFooter}
      >
        {opTableBody}
      </ReportTablePanel>
      <ReportTablePanel
        title="Tổng hợp CP theo khu vực (BC Tuần/Tháng)"
        subtitle="Layout tham chiếu sheet CP"
        footer={footer}
      >
        {tableBody}
      </ReportTablePanel>
    </div>
  )
}
