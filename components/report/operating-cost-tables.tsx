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
import { TABLE_MONEY_TEXT_CLASS, TABLE_NUM_COL, TABLE_TEXT_COL } from './report-table-chrome'
import { ReportDataTable } from './report-data-table'
import { ReportSectionCard } from './report-card'
import { ReportPaginationFooter } from './report-pagination-footer'
import { ReportTableLabelAction, ReportTableViewAction } from './report-table-actions'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

type DrillField = 'deliverer' | 'customer' | 'region' | null

function MoneyValue({ value }: { value: string }) {
  if (value === '—' || value === '***') return <span>{value}</span>
  return <span className={TABLE_MONEY_TEXT_CLASS}>{value}</span>
}

function BreakdownSummaryRow({
  rows,
  canViewAmounts,
}: {
  rows: OpCostBreakdownRow[]
  canViewAmounts: boolean
}) {
  const totalChiPhi = rows.reduce((sum, row) => sum + row.tongChiPhi, 0)
  const totalSlCont = rows.reduce((sum, row) => sum + row.slCont, 0)
  const totalKm = rows.reduce((sum, row) => sum + row.km, 0)
  const totalRecords = rows.reduce((sum, row) => sum + row.recordCount, 0)

  return (
    <Table.Row id="breakdown-summary">
      <Table.Cell className={`${TABLE_TEXT_COL} font-semibold text-gray-900`}>
        Tổng phạm vi lọc
      </Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>
        <MoneyValue value={formatOpCostAmount(totalChiPhi, canViewAmounts)} />
      </Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>
        {formatNumber(totalSlCont)}
      </Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>
        {formatNumber(totalKm)}
      </Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>
        {formatNumber(totalRecords)}
      </Table.Cell>
      <Table.Cell className={TABLE_TEXT_COL}>
        <span className="text-gray-400">—</span>
      </Table.Cell>
    </Table.Row>
  )
}

function DetailSummaryRow({
  rows,
  canViewAmounts,
}: {
  rows: OperatingCostRecord[]
  canViewAmounts: boolean
}) {
  const validRows = rows.filter((row) => !row.dataError && row.km >= 0 && row.tongChiPhi >= 0)
  const totals = validRows.reduce(
    (acc, row) => ({
      slCont: acc.slCont + row.slCont,
      km: acc.km + row.km,
      luong: acc.luong + row.luong,
      anTc:
        acc.anTc +
        row.tienAnTrua +
        row.tienTangCa +
        row.tienAnTangCa +
        row.tienPhongTro22h,
      xangXe: acc.xangXe + row.tienXangVeXe,
      boiDuong: acc.boiDuong + (row.boiDuongPhatSinh ?? 0),
      tongChiPhi: acc.tongChiPhi + row.tongChiPhi,
    }),
    {
      slCont: 0,
      km: 0,
      luong: 0,
      anTc: 0,
      xangXe: 0,
      boiDuong: 0,
      tongChiPhi: 0,
    },
  )

  return (
    <Table.Row id="detail-summary">
      <Table.Cell className={`${TABLE_TEXT_COL} font-semibold text-gray-900`}>
        Tổng phạm vi lọc
      </Table.Cell>
      <Table.Cell className={TABLE_TEXT_COL}>
        <span className="text-gray-400">—</span>
      </Table.Cell>
      <Table.Cell className={TABLE_TEXT_COL}>
        <span className="text-gray-400">—</span>
      </Table.Cell>
      <Table.Cell className={TABLE_TEXT_COL}>
        <span className="text-gray-400">—</span>
      </Table.Cell>
      <Table.Cell className={TABLE_TEXT_COL}>
        <span className="text-gray-400">—</span>
      </Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>{formatNumber(totals.slCont)}</Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>{formatNumber(totals.km)}</Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>
        {formatOpCostAmount(totals.luong, canViewAmounts)}
      </Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>
        {formatOpCostAmount(totals.anTc, canViewAmounts)}
      </Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>
        {formatOpCostAmount(totals.xangXe, canViewAmounts)}
      </Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>
        <span className="text-gray-400">—</span>
      </Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>
        {formatOpCostAmount(totals.boiDuong, canViewAmounts)}
      </Table.Cell>
      <Table.Cell className={`${TABLE_NUM_COL} font-semibold`}>
        <MoneyValue value={formatOpCostAmount(totals.tongChiPhi, canViewAmounts)} />
      </Table.Cell>
      <Table.Cell className={TABLE_TEXT_COL}>
        <span className="text-gray-400">—</span>
      </Table.Cell>
      <Table.Cell className={TABLE_TEXT_COL}>
        <span className="text-gray-400">—</span>
      </Table.Cell>
      <Table.Cell className={TABLE_TEXT_COL}>
        <span className="text-gray-400">—</span>
      </Table.Cell>
    </Table.Row>
  )
}

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
  const tableItems = useMemo(
    () => [
      ...rows.map((row) => ({ key: `row-${row.key}`, kind: 'row' as const, row })),
      { key: 'summary-breakdown', kind: 'summary' as const },
    ],
    [rows],
  )

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
        <Table.Body items={tableItems}>
          {(item) =>
            item.kind === 'summary' ? (
              <BreakdownSummaryRow rows={rows} canViewAmounts={canViewAmounts} />
            ) : (
              <Table.Row
                id={item.row.key}
                className={cn(drillField === field && drillKey === item.row.key && 'bg-blue-50/80')}
              >
                <Table.Cell className={`${TABLE_TEXT_COL} font-medium text-gray-900`}>
                  {item.row.label}
                </Table.Cell>
                <Table.Cell className={TABLE_NUM_COL}>
                  <MoneyValue value={formatOpCostAmount(item.row.tongChiPhi, canViewAmounts)} />
                </Table.Cell>
                <Table.Cell className={TABLE_NUM_COL}>{formatNumber(item.row.slCont)}</Table.Cell>
                <Table.Cell className={TABLE_NUM_COL}>{formatNumber(item.row.km)}</Table.Cell>
                <Table.Cell className={TABLE_NUM_COL}>{formatNumber(item.row.recordCount)}</Table.Cell>
                <Table.Cell className={TABLE_TEXT_COL}>
                  <ReportTableLabelAction
                    label={drillField === field && drillKey === item.row.key ? 'Bỏ lọc' : 'Chi tiết'}
                    onPress={() =>
                      onDrill(
                        drillField === field && drillKey === item.row.key ? null : field,
                        drillField === field && drillKey === item.row.key ? null : item.row.key,
                      )
                    }
                  />
                </Table.Cell>
              </Table.Row>
            )
          }
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
  const tableItems = useMemo(
    () => [
      ...pageItems.map((row) => ({ key: `row-${row.id}`, kind: 'row' as const, row })),
      { key: 'summary-detail', kind: 'summary' as const },
    ],
    [pageItems],
  )

  return (
    <ReportSectionCard
      title="Chi tiết lệnh / bản ghi nguồn"
      description="Báo cáo ngày — km, thành phần chi phí, CPPS (trống), trạng thái chốt"
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
            className="min-w-[96rem] border-0"
          >
            <Table.Header>
              <Table.Column isRowHeader className={TABLE_TEXT_COL}>
                Ngày
              </Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Giao nhận</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>KH / Kho</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Khu vực</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Tuyến</Table.Column>
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
            <Table.Body items={tableItems}>
              {(item) =>
                item.kind === 'summary' ? (
                  <DetailSummaryRow rows={rows} canViewAmounts={canViewAmounts} />
                ) : (
                  <Table.Row id={item.row.id}>
                    <Table.Cell className={TABLE_TEXT_COL}>{formatAppDate(item.row.statDate)}</Table.Cell>
                    <Table.Cell className={`${TABLE_TEXT_COL} font-medium text-gray-900`}>
                      {item.row.delivererName}
                    </Table.Cell>
                    <Table.Cell className={TABLE_TEXT_COL}>
                      <span className="block">{item.row.customer}</span>
                      <span className="text-xs text-gray-500">{item.row.warehouse}</span>
                    </Table.Cell>
                    <Table.Cell className={TABLE_TEXT_COL}>{opCostRegionLabel(item.row.region)}</Table.Cell>
                    <Table.Cell className={TABLE_TEXT_COL}>{item.row.route}</Table.Cell>
                    <Table.Cell className={TABLE_NUM_COL}>{formatNumber(item.row.slCont)}</Table.Cell>
                    <Table.Cell className={TABLE_NUM_COL}>
                      {item.row.km < 0 ? (
                        <span className="text-red-600">Lỗi</span>
                      ) : (
                        formatNumber(item.row.km)
                      )}
                    </Table.Cell>
                    <Table.Cell className={TABLE_NUM_COL}>
                      {formatOpCostAmount(item.row.luong, canViewAmounts)}
                    </Table.Cell>
                    <Table.Cell className={TABLE_NUM_COL}>
                      {formatOpCostAmount(
                        item.row.tienAnTrua +
                          item.row.tienTangCa +
                          item.row.tienAnTangCa +
                          item.row.tienPhongTro22h,
                        canViewAmounts,
                      )}
                    </Table.Cell>
                    <Table.Cell className={TABLE_NUM_COL}>
                      {formatOpCostAmount(item.row.tienXangVeXe, canViewAmounts)}
                    </Table.Cell>
                    <Table.Cell className={TABLE_NUM_COL}>
                      <span className="text-gray-400">—</span>
                    </Table.Cell>
                    <Table.Cell className={TABLE_NUM_COL}>
                      {item.row.boiDuongPhatSinh == null ? (
                        <span className="text-xs text-amber-700">Chưa có dữ liệu</span>
                      ) : (
                        formatOpCostAmount(item.row.boiDuongPhatSinh, canViewAmounts)
                      )}
                    </Table.Cell>
                    <Table.Cell className={`${TABLE_NUM_COL} font-medium`}>
                      <MoneyValue value={formatOpCostAmount(item.row.tongChiPhi, canViewAmounts)} />
                    </Table.Cell>
                    <Table.Cell className={TABLE_TEXT_COL}>
                      <LockChip status={item.row.lockStatus} dataError={item.row.dataError} />
                    </Table.Cell>
                    <Table.Cell className={TABLE_TEXT_COL}>
                      <span className="text-xs text-gray-600">{item.row.dataSource}</span>
                    </Table.Cell>
                    <Table.Cell className={TABLE_TEXT_COL}>
                      <ReportTableViewAction onPress={() => onViewDetail(item.row)} />
                    </Table.Cell>
                  </Table.Row>
                )
              }
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
