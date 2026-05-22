'use client'

import { useEffect, useMemo, useState } from 'react'
import { Chip, EmptyState, Table } from '@heroui/react'
import { formatAppDate } from '@/lib/date-format'
import {
  contTypeLabel,
  formatGlsSharePercent,
  formatNumber,
  glsRegionLabel,
  type GlsCompetitorCatalogId,
  type GlsCompetitorObservation,
} from '@/lib/gls-competitor-mock-data'
import type { CompetitorBreakdownRow } from '@/lib/gls-competitor-analytics'
import { TABLE_NUM_COL, TABLE_TEXT_COL } from './report-table-chrome'
import { ReportDataTable } from './report-data-table'
import { ReportSectionCard } from './report-card'
import { ReportPaginationFooter } from './report-pagination-footer'
import { ReportTableLabelAction } from './report-table-actions'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

export function GlsCompetitorBreakdownTable({
  rows,
  isLoading,
  selectedCompetitor,
  onSelectCompetitor,
}: {
  rows: CompetitorBreakdownRow[]
  isLoading: boolean
  selectedCompetitor: GlsCompetitorCatalogId | null
  onSelectCompetitor: (id: GlsCompetitorCatalogId | null) => void
}) {
  return (
    <ReportSectionCard
      title="Phân tích theo đối thủ"
      description="Nhấn đối thủ để drill-down danh sách bản ghi nguồn"
      isLoading={isLoading}
      bodyClassName="!px-0 !pb-0"
    >
      <ReportDataTable aria-label="Phân tích theo đối thủ" framed={false} className="border-0">
        <Table.Header>
          <Table.Column isRowHeader className={TABLE_TEXT_COL}>
            Đối thủ
          </Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Sản lượng</Table.Column>
          <Table.Column className={TABLE_NUM_COL}>Tỷ lệ / T</Table.Column>
          <Table.Column className={TABLE_TEXT_COL}>Nhóm</Table.Column>
          <Table.Column className={TABLE_TEXT_COL}>Thao tác</Table.Column>
        </Table.Header>
        <Table.Body items={rows}>
          {(row) => (
            <Table.Row
              id={row.competitorId}
              className={cn(
                selectedCompetitor === row.competitorId && 'bg-blue-50/80',
              )}
            >
              <Table.Cell className={`${TABLE_TEXT_COL} font-medium text-gray-900`}>
                {row.competitorName}
              </Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>{formatNumber(row.volume)}</Table.Cell>
              <Table.Cell className={TABLE_NUM_COL}>
                {formatGlsSharePercent(row.sharePct)}
              </Table.Cell>
              <Table.Cell className={TABLE_TEXT_COL}>
                {row.competitorId === 'KHAC' ? (
                  <Chip size="sm" color="warning" variant="soft">
                    Khác
                  </Chip>
                ) : (
                  <Chip size="sm" color="accent" variant="soft">
                    Danh mục
                  </Chip>
                )}
              </Table.Cell>
              <Table.Cell className={TABLE_TEXT_COL}>
                <ReportTableLabelAction
                  label={selectedCompetitor === row.competitorId ? 'Bỏ lọc' : 'Chi tiết'}
                  onPress={() =>
                    onSelectCompetitor(
                      selectedCompetitor === row.competitorId ? null : row.competitorId,
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

export function GlsCompetitorRecordsTable({
  rows,
  isLoading,
  competitorFilter,
}: {
  rows: GlsCompetitorObservation[]
  isLoading: boolean
  competitorFilter: GlsCompetitorCatalogId | null
}) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [rows.length, competitorFilter])

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return rows.slice(start, start + PAGE_SIZE)
  }, [rows, page])

  const title = competitorFilter
    ? `Bản ghi nguồn · ${rows[0]?.competitorName ?? competitorFilter}`
    : 'Danh sách bản ghi phản ánh hiện trường'

  return (
    <ReportSectionCard
      title={title}
      description="Ngày, khu vực, khách hàng, loại cont, sản lượng GLS/đối thủ, người ghi nhận"
      isLoading={isLoading}
      bodyClassName="!px-0 !pb-0"
    >
      {rows.length === 0 ? (
        <div className="px-5 pb-5">
          <EmptyState className="border-0 bg-transparent py-10">
            <p className="text-sm font-medium text-gray-900">Chưa có bản ghi</p>
            <p className="mt-1 text-sm text-gray-600">
              Chọn đối thủ từ bảng phân tích hoặc đổi bộ lọc kỳ / khu vực.
            </p>
          </EmptyState>
        </div>
      ) : (
        <>
          <ReportDataTable aria-label={title} framed={false} className="border-0">
            <Table.Header>
              <Table.Column isRowHeader className={TABLE_TEXT_COL}>
                Mã nguồn
              </Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Ngày</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Khu vực</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Khách hàng</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Loại cont</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Đối thủ</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>SL GLS</Table.Column>
              <Table.Column className={TABLE_NUM_COL}>SL đối thủ</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Người ghi nhận</Table.Column>
              <Table.Column className={TABLE_TEXT_COL}>Trạng thái</Table.Column>
            </Table.Header>
            <Table.Body items={pageItems}>
              {(row) => (
                <Table.Row id={row.id}>
                  <Table.Cell className={`${TABLE_TEXT_COL} font-medium text-gray-900`}>
                    {row.sourceId}
                  </Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{formatAppDate(row.statDate)}</Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{glsRegionLabel(row.region)}</Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{row.customer}</Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{contTypeLabel(row.contType)}</Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{row.competitorName}</Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>
                    {row.glsVolume < 0 ? (
                      <span className="text-red-600">Lỗi DL</span>
                    ) : (
                      formatNumber(row.glsVolume)
                    )}
                  </Table.Cell>
                  <Table.Cell className={TABLE_NUM_COL}>
                    {row.competitorVolume < 0 ? (
                      <span className="text-red-600">Lỗi DL</span>
                    ) : (
                      formatNumber(row.competitorVolume)
                    )}
                  </Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>{row.recordedBy}</Table.Cell>
                  <Table.Cell className={TABLE_TEXT_COL}>
                    {row.dataError ? (
                      <Chip size="sm" color="danger" variant="soft">
                        Lỗi dữ liệu
                      </Chip>
                    ) : row.contType == null ? (
                      <Chip size="sm" color="warning" variant="soft">
                        Chưa gán cont
                      </Chip>
                    ) : (
                      <Chip size="sm" color="success" variant="soft">
                        Hợp lệ
                      </Chip>
                    )}
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
