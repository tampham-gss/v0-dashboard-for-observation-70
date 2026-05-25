'use client'

import { TrendingUp } from 'lucide-react'
import { EmptyState, Table } from '@heroui/react'
import {
  TARGET_CP_PER_CONT,
  formatCurrency,
  formatNumber,
  formatPercent,
  type BranchCode,
} from '@/lib/report-mock-data'
import type { BranchRankingRow } from '@/lib/report-overview-analytics'
import {
  REPORT_TABLE_TALL_ROWS_CLASS,
  TABLE_COL_ACTION,
  TABLE_CENTER_COL,
  TABLE_MONEY_TEXT_CLASS,
  TABLE_NUM_COL,
  TABLE_TEXT_COL,
} from './report-table-chrome'
import { cn } from '@/lib/utils'
import { ReportDataTable } from './report-data-table'
import { ReportSectionCard } from './report-card'
import { CPStatusChip, SLStatusChip } from './status-chip'
import { ReportTableLabelAction } from './report-table-actions'

export function ReportBranchRanking({
  rows,
  isLoading,
  selectedBranch,
  onSelectBranch,
}: {
  rows: BranchRankingRow[]
  isLoading: boolean
  selectedBranch: BranchCode | null
  onSelectBranch: (branch: BranchCode | null) => void
}) {
  const tableRows = rows.map((row, index) => ({ ...row, rank: index + 1 }))

  return (
    <ReportSectionCard
      title="Xếp hạng theo chi nhánh"
      description="Sản lượng và chi phí theo chi nhánh vận hành · kỳ đang lọc"
      isLoading={isLoading}
      bodyClassName="gap-2"
      action={
        selectedBranch ? (
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:underline"
            onClick={() => onSelectBranch(null)}
          >
            Bỏ chọn {selectedBranch}
          </button>
        ) : null
      }
    >
      {rows.length === 0 ? (
        <EmptyState className="py-10">
          <EmptyState.Title>Không có dữ liệu xếp hạng</EmptyState.Title>
          <EmptyState.Description>Điều chỉnh bộ lọc hoặc chọn kỳ khác.</EmptyState.Description>
        </EmptyState>
      ) : (
        <div className="flex min-h-[300px] min-w-0 flex-1 flex-col">
        <ReportDataTable
          aria-label="Xếp hạng chi nhánh"
          framed={false}
          className={cn('min-h-0 flex-1', REPORT_TABLE_TALL_ROWS_CLASS)}
        >
          <Table.Header>
            <Table.Column isRowHeader className={`${TABLE_TEXT_COL} w-10`}>
              #
            </Table.Column>
            <Table.Column className={TABLE_TEXT_COL}>Chi nhánh</Table.Column>
            <Table.Column className={TABLE_NUM_COL}>SL cont TH</Table.Column>
            <Table.Column className={TABLE_NUM_COL}>TH/KH</Table.Column>
            <Table.Column className={TABLE_NUM_COL}>Tổng CP</Table.Column>
            <Table.Column className={TABLE_NUM_COL}>CP TB/Cont</Table.Column>
            <Table.Column className={TABLE_CENTER_COL}>TT SL</Table.Column>
            <Table.Column className={TABLE_CENTER_COL}>TT CP</Table.Column>
            <Table.Column className={TABLE_COL_ACTION}>Thao tác</Table.Column>
          </Table.Header>
          <Table.Body items={tableRows}>
            {(row) => (
              <Table.Row
                id={row.branch}
                className={selectedBranch === row.branch ? 'bg-blue-50/60' : undefined}
              >
                <Table.Cell className={`${TABLE_TEXT_COL} font-medium text-gray-900`}>
                  {row.rank}
                </Table.Cell>
                <Table.Cell className={TABLE_TEXT_COL}>
                  <span className="font-medium text-gray-900">{row.branch}</span>
                  {row.needsReview ? (
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-amber-700">
                      <TrendingUp className="size-3 shrink-0" aria-hidden />
                      SL cao · CP vượt định mức
                    </span>
                  ) : null}
                </Table.Cell>
                <Table.Cell className={`${TABLE_NUM_COL} font-medium`}>
                  {formatNumber(row.slContTH)}
                </Table.Cell>
                <Table.Cell className={TABLE_NUM_COL}>{formatPercent(row.thKhRatio)}</Table.Cell>
                <Table.Cell className={TABLE_NUM_COL}>
                  <span className={TABLE_MONEY_TEXT_CLASS}>{formatCurrency(row.tongChiPhi)}</span>
                </Table.Cell>
                <Table.Cell className={TABLE_NUM_COL}>
                  {row.cpTBPerCont != null ? (
                    formatCurrency(row.cpTBPerCont)
                  ) : (
                    '—'
                  )}
                </Table.Cell>
                <Table.Cell className={TABLE_CENTER_COL}>
                  <div className="flex justify-center">
                    <SLStatusChip status={row.slStatus} />
                  </div>
                </Table.Cell>
                <Table.Cell className={TABLE_CENTER_COL}>
                  <div className="flex justify-center">
                    {row.cpStatus ? (
                      <CPStatusChip status={row.cpStatus} />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell className={TABLE_COL_ACTION}>
                  <div className="flex justify-center">
                    <ReportTableLabelAction
                      label={selectedBranch === row.branch ? 'Đang xem' : 'Lệnh'}
                      onPress={() =>
                        onSelectBranch(selectedBranch === row.branch ? null : row.branch)
                      }
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </ReportDataTable>
        </div>
      )}
      <p className="shrink-0 px-1 pt-1 text-xs leading-snug text-gray-600">
        Định mức tham chiếu CP TB/Cont: {formatCurrency(TARGET_CP_PER_CONT)}. Doanh thu và hiệu quả
        chưa hiển thị khi chưa có nguồn dữ liệu.
      </p>
    </ReportSectionCard>
  )
}
