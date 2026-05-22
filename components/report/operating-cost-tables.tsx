'use client'

import { useEffect, useMemo, useState } from 'react'
import { Chip, EmptyState, Table } from '@heroui/react'
import { formatAppDate } from '@/lib/date-format'
import {
  formatNumber,
  formatOpCostAmount,
  opCostLockStatusLabel,
  opCostRegionLabel,
  type OperatingCostRecord,
} from '@/lib/operating-cost-mock-data'
import type { OpCostBreakdownRow } from '@/lib/operating-cost-analytics'
import { TABLE_NUM_COL, TABLE_TEXT_COL } from './report-table-chrome'
import { ReportDataTable } from './report-data-table'
import { ReportSectionCard } from './report-card'
import { ReportPaginationFooter } from './report-pagination-footer'
import { ReportTableLabelAction, ReportTableViewAction } from './report-table-actions'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

type DrillField = 'deliverer' | 'customer' | 'region' | null

export function OperatingCostBreakdownTabs({
  byDeliverer,
  byCustomer,
  byRegion,
  isLoading,
  drillField,
  drillKey,
  onDrill,
  canViewAmounts,
}: {
  byDeliverer: OpCostBreakdownRow[]
  byCustomer: OpCostBreakdownRow[]
  byRegion: OpCostBreakdownRow[]
  isLoading: boolean
  drillField: DrillField
  drillKey: string | null
  onDrill: (field: DrillField, key: string | null) => void
  canViewAmounts: boolean
}) {
  const [tab, setTab] = useState<'deliverer' | 'customer' | 'region'>('deliverer')
  const rows =
    tab === 'deliverer' ? byDeliverer : tab === 'customer' ? byCustomer : byRegion
  const field: DrillField =
    tab === 'deliverer' ? 'deliverer' : tab === 'customer' ? 'customer' : 'region'

  const tabBtn = (id: typeof tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={cn(
        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        tab === id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      )}
    >
      {label}
    </button>
  )

  return (
    <ReportSectionCard
      title="Phân tích chi phí"
      description="Drill-down theo giao nhận, khách hàng hoặc khu vực"
      isLoading={isLoading}
      bodyClassName="!px-0 !pb-0"
      action={
        <div className="flex flex-wrap gap-2">
          {tabBtn('deliverer', 'Theo giao nhận')}
          {tabBtn('customer', 'Theo khách hàng')}
          {tabBtn('region', 'Theo khu vực')}
        </div>
      }
    >
      <ReportDataTable aria-label="Phân tích chi phí" framed={false} className="border-0">
        <Table.Header>
          <Table.Column isRowHeader className={TABLE_TEXT_COL}>
            {tab === 'deliverer' ? 'Giao nhận' : tab === 'customer' ? 'Khách hàng' : 'Khu vực'}
          </Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Tổng CP</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>SL cont</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Km</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Bản ghi</Table.Column>
          <Table.Column className={TABLE_TEXT_COL}>Thao tác</Table.Column>
        </Table.Header>
        <Table.Body items={rows}>
          {(row) => (
            <Table.Row
              id={row.key}
              className={cn(drillField === field && drillKey === row.key && 'bg-blue-50/80')}
            >
              <Table.Cell className={`${TABLE_TEXT_COL} font-medium text-gray-900`}>
                {row.label}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>
                {formatOpCostAmount(row.tongChiPhi, canViewAmounts)}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.slCont)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.km)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.recordCount)}</Table.Cell>
              <Table.Cell className={TABLE_TEXT_COL}>
                <ReportTableLabelAction
                  label={drillField === field && drillKey === row.key ? 'Bỏ lọc' : 'Chi tiết'}
                  onPress={() =>
                    onDrill(
                      drillField === field && drillKey === row.key ? null : field,
                      drillField === field && drillKey === row.key ? null : row.key,
                    )
                  }
                />
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </ReportDataTable>
    </ReportSectionCard>
  )
}

export function OperatingCostDetailTable({
  rows,
  isLoading,
  canViewAmounts,
  onViewDetail,
}: {
  rows: OperatingCostRecord[]
  isLoading: boolean
  canViewAmounts: boolean
  onViewDetail: (row: OperatingCostRecord) => void
}) {
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [rows.length])

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return rows.slice(start, start + PAGE_SIZE)
  }, [rows, page])

  return (
    <ReportSectionCard
      title="Chi tiết lệnh / bản ghi nguồn"
      description="BC ngày — km, thành phần chi phí, CPPS (trống), trạng thái chốt"
      isLoading={isLoading}
      bodyClassName="!px-0 !pb-0"
    >
      {rows.length === 0 ? (
        <div className="px-5 pb-5">
          <EmptyState className="border-0 bg-transparent py-10">
            <p className="text-sm font-medium text-gray-900">Chưa có bản ghi</p>
            <p className="mt-1 text-sm text-gray-600">
              Chọn nhóm từ bảng phân tích hoặc đổi bộ lọc kỳ / khu vực.
            </p>
          </EmptyState>
        </div>
      ) : (
        <>
          <ReportDataTable
            aria-label="Chi tiết chi phí vận hành"
            framed={false}
            className="min-w-[88rem] border-0"
          >
            <Table.Header>
              <Table.Column isRowHeader className={TABLE_TEXT_COL}>
                Ngày
              </Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Giao nhận</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>KH / Kho</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Khu vực</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>SL</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Km</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Lương</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Ăn/TC</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Xăng/xe</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>CPPS chuyến</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Bồi dưỡng</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>Tổng CP</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Chốt</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Nguồn</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Thao tác</Table.Column>
            </Table.Header>
            <Table.Body items={pageItems}>
              {(row) => (
                <Table.Row id={row.id}>
                  <Table.Cell className={TABLE_TEXT_COL}>{formatAppDate(row.statDate)}</Table.Cell>
                  <Table.Cell className={`${TABLE_TEXT_COL} font-medium text-gray-900`}>
                    {row.delivererName}
                  </Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>
                    <span className="block">{row.customer}</span>
                    <span className="text-xs text-gray-500">{row.warehouse}</span>
                  </Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{opCostRegionLabel(row.region)}</Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.slCont)}</Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>
                    {row.km < 0 ? (
                      <span className="text-red-600">Lỗi</span>
                    ) : (
                      formatNumber(row.km)
                    )}
                  </Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>
                    {formatOpCostAmount(row.luong, canViewAmounts)}
                  </Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>
                    {formatOpCostAmount(
                      row.tienAnTrua + row.tienTangCa + row.tienAnTangCa + row.tienPhongTro22h,
                      canViewAmounts,
                    )}
                  </Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>
                    {formatOpCostAmount(row.tienXangVeXe, canViewAmounts)}
                  </Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>
                    <span className="text-gray-400">—</span>
                  </Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>
                    {row.boiDuongPhatSinh == null ? (
                      <span className="text-xs text-amber-700">Chưa có DL</span>
                    ) : (
                      formatOpCostAmount(row.boiDuongPhatSinh, canViewAmounts)
                    )}
                  </Table.Cell>
                  <Table.Cell className={`${TABLE_NUM_COL} font-medium`}>
                    {formatOpCostAmount(row.tongChiPhi, canViewAmounts)}
                  </Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>
                    <LockChip status={row.lockStatus} dataError={row.dataError} />
                  </Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>
                    <span className="text-xs text-gray-600">{row.dataSource}</span>
                  </Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>
                    <ReportTableViewAction onPress={() => onViewDetail(row)} />
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </ReportDataTable>
          <ReportPaginationFooter
            page={page}
            pageSize={PAGE_SIZE}
            total={rows.length}
            onPageChange={setPage}
          />
        </>
      )}
    </ReportSectionCard>
  )
}

function LockChip({
  status,
  dataError,
}: {
  status: OperatingCostRecord['lockStatus']
  dataError?: boolean
}) {
  if (dataError) {
    return (
      <Chip size="sm" color="danger" variant="soft">
        Lỗi DL
      </Chip>
    )
  }
  const color =
    status === 'da_khoa' ? 'success' : status === 'can_kiem_tra' ? 'warning' : 'accent'
  return (
    <Chip size="sm" color={color} variant="soft">
      {opCostLockStatusLabel(status)}
    </Chip>
  )
}
