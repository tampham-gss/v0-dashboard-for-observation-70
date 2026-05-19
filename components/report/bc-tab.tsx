'use client'

import { useEffect, useMemo, useState } from 'react'
import { EmptyState, Skeleton, Table } from '@heroui/react'
import type { BcReportRow } from '@/lib/bc-report'
import { filterBcRowsForPeriodType } from '@/lib/bc-report'
import {
  appliedFiltersCaption,
  formatCurrency,
  formatNumber,
  formatPercent,
  periodLabel,
  slCompareRatio,
  slRatioGLS,
  type CPRecord,
  type ReportFilters,
  type SLRecord,
} from '@/lib/report-mock-data'
import {
  TABLE_COL_ACTION,
  TABLE_COL_STATUS,
  TABLE_COL_WIDE,
  TABLE_NUM_COL,
} from './report-table-chrome'
import { ReportDataTable } from './report-data-table'
import { ReportTableLabelAction } from './report-table-actions'
import { ReportPaginationFooter } from './report-pagination-footer'
import { ReportTablePanel } from './report-table-panel'
import { CPStatusChip } from './status-chip'
import { SLStatusChip } from './status-chip'

const PAGE_SIZE = 10

function BcSourceTable({
  title,
  subtitle,
  rows,
  isLoading,
  onViewSl,
  onViewCp,
}: {
  title: string
  subtitle: string
  rows: BcReportRow[]
  isLoading: boolean
  onViewSl: (sl: SLRecord) => void
  onViewCp: (cp: CPRecord) => void
}) {
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [rows])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = useMemo(
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

  const body =
    isLoading ? (
      <Skeleton className="h-48 w-full rounded-md" />
    ) : rows.length === 0 ? (
      <EmptyState className="border-0 bg-transparent py-16">
        <p className="text-sm text-gray-600">Không có dữ liệu {title} theo bộ lọc.</p>
      </EmptyState>
    ) : (
      <ReportDataTable aria-label={title} className="min-w-[72rem]" framed={false}>
        <Table.Header>
          <Table.Column isRowHeader className={TABLE_COL_WIDE}>
            Kỳ
          </Table.Column>
          <Table.Column className={TABLE_COL_WIDE}>Chi nhánh</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>NS GN</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>SL KH</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>SL TH</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>TH/KH</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>SL GLS</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>GLS/SL</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Tổng CP</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>CP TB/Cont</Table.Column>
          <Table.Column className={TABLE_COL_STATUS}>TT SL</Table.Column>
          <Table.Column className={TABLE_COL_STATUS}>TT CP</Table.Column>
          <Table.Column className={TABLE_COL_ACTION}>Thao tác</Table.Column>
        </Table.Header>
        <Table.Body items={paginated}>
          {(row) => (
            <Table.Row id={row.id}>
              <Table.Cell className={`${TABLE_COL_WIDE} font-medium`}>
                {periodLabel(row.sl)}
              </Table.Cell>
              <Table.Cell className={`${TABLE_COL_WIDE} font-medium`}>{row.sl.branch}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.sl.nsGiaoNhan)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.sl.slContKH)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.sl.slContTH)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>
                {formatPercent(slCompareRatio(row.sl.slContKH, row.sl.slContTH))}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.sl.slContGLS)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>
                {formatPercent(slRatioGLS(row.sl.slContGLS, row.sl.slContTH))}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>
                {row.cp ? formatCurrency(row.cp.tongChiPhi) : '—'}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>
                {row.cp ? formatCurrency(row.cp.cpTBPerCont) : '—'}
              </Table.Cell>
              <Table.Cell className={TABLE_COL_STATUS}>
                <div className="flex justify-center">
                  <SLStatusChip status={row.sl.status} />
                </div>
              </Table.Cell>
              <Table.Cell className={TABLE_COL_STATUS}>
                <div className="flex justify-center">
                  {row.cp ? <CPStatusChip status={row.cp.status} /> : <span className="text-xs text-gray-400">—</span>}
                </div>
              </Table.Cell>
              <Table.Cell className={TABLE_COL_ACTION}>
                <div className="flex justify-center gap-1.5">
                  <ReportTableLabelAction label="SL" onPress={() => onViewSl(row.sl)} />
                  <ReportTableLabelAction
                    label="CP"
                    isDisabled={!row.cp}
                    onPress={() => row.cp && onViewCp(row.cp)}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </ReportDataTable>
    )

  return (
    <ReportTablePanel title={title} subtitle={subtitle} footer={footer}>
      {body}
    </ReportTablePanel>
  )
}

export function BcTab({
  periodType,
  title,
  appliedFilters,
  isLoading,
  onViewSl,
  onViewCp,
}: {
  periodType: 'week' | 'month'
  title: string
  appliedFilters: ReportFilters
  isLoading: boolean
  onViewSl: (row: SLRecord) => void
  onViewCp: (row: CPRecord) => void
}) {
  const rows = useMemo(
    () => filterBcRowsForPeriodType(appliedFilters, periodType),
    [appliedFilters, periodType],
  )

  const caption = appliedFiltersCaption(appliedFilters, {
    showBcWeekMonth: periodType === 'week',
  })

  return (
    <BcSourceTable
      title={title}
      subtitle={caption}
      rows={rows}
      isLoading={isLoading}
      onViewSl={onViewSl}
      onViewCp={onViewCp}
    />
  )
}
