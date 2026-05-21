'use client'

import { useEffect, useMemo, useState } from 'react'
import { Chip, EmptyState, Table, toast } from '@heroui/react'
import {
  formatCurrency,
  formatNumber,
  type BranchCode,
} from '@/lib/report-mock-data'
import {
  inspectionOrderStatusLabel,
  type InspectionOrder,
  type InspectionOrderStatus,
} from '@/lib/report-inspection-orders'
import {
  TABLE_COL_ACTION,
  TABLE_NUM_COL,
  TABLE_TEXT_COL,
} from './report-table-chrome'
import { ReportDataTable } from './report-data-table'
import { ReportSectionCard } from './report-card'
import { ReportPaginationFooter } from './report-pagination-footer'
import { ReportTableViewAction } from './report-table-actions'

const PAGE_SIZE = 8

function orderStatusColor(s: InspectionOrderStatus): 'success' | 'warning' | 'accent' {
  if (s === 'da_chot') return 'success'
  if (s === 'cho_duyet') return 'warning'
  return 'accent'
}

export function ReportInspectionOrdersTable({
  orders,
  isLoading,
  branchFilter,
}: {
  orders: InspectionOrder[]
  isLoading: boolean
  branchFilter: BranchCode | null
}) {
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!branchFilter) return orders
    return orders.filter((o) => o.branch === branchFilter)
  }, [orders, branchFilter])

  useEffect(() => {
    setPage(1)
  }, [branchFilter, orders.length])

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const title = branchFilter
    ? `Danh sách lệnh kiểm đếm · ${branchFilter}`
    : 'Danh sách lệnh kiểm đếm'

  return (
    <ReportSectionCard
      title={title}
      description="Drill-down từ xếp hạng chi nhánh — mã lệnh, kho, tuyến, nhân sự và chi phí"
      isLoading={isLoading}
      bodyClassName="!px-0 !pb-0"
    >
      {filtered.length === 0 ? (
        <div className="px-5 pb-5">
          <EmptyState className="py-10">
            <EmptyState.Title>Chưa có lệnh trong phạm vi lọc</EmptyState.Title>
            <EmptyState.Description>
              Chọn chi nhánh từ bảng xếp hạng hoặc đổi bộ lọc kỳ / chi nhánh.
            </EmptyState.Description>
          </EmptyState>
        </div>
      ) : (
        <>
          <ReportDataTable aria-label={title} framed={false} className="border-0">
            <Table.Header>
              <Table.Column isRowHeader className={TABLE_TEXT_COL}>
                Mã lệnh
              </Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Ngày</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Chi nhánh</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Kho</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Tuyến</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Nhân sự</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>SL cont</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Tổng CP</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Trạng thái</Table.Column>
              <Table.Column className={TABLE_COL_ACTION}> </Table.Column>
            </Table.Header>
            <Table.Body items={pageItems}>
              {(row) => (
                <Table.Row id={row.id}>
                  <Table.Cell className={`${TABLE_TEXT_COL} font-medium text-gray-900`}>
                    {row.maLenh}
                  </Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{row.ngay}</Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{row.branch}</Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{row.kho}</Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{row.tuyen}</Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{row.nhanSu}</Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.slCont)}</Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>{formatCurrency(row.tongChiPhi)}</Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>
                    <Chip color={orderStatusColor(row.trangThai)} size="sm" variant="soft">
                      <Chip.Label>{inspectionOrderStatusLabel(row.trangThai)}</Chip.Label>
                    </Chip>
                  </Table.Cell>
                  <Table.Cell className={TABLE_COL_ACTION}>
                    <div className="flex justify-center">
                      <ReportTableViewAction
                        label="Chi tiết"
                        onPress={() =>
                          toast.info(`Lệnh ${row.maLenh} · ${row.branch} — chi tiết SL/CP tổng hợp sẽ mở ở bước sau.`)
                        }
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </ReportDataTable>
          <ReportPaginationFooter
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
          />
        </>
      )}
    </ReportSectionCard>
  )
}
