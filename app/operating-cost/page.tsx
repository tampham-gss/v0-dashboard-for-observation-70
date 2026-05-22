'use client'

import { useState } from 'react'
import { toast, useOverlayState, Modal, Button } from '@heroui/react'
import { ReportLayout } from '@/components/report/report-layout'
import { ReportHeaderActions, ReportPageHeader } from '@/components/report/report-page-header'
import { ReportInlineNotice } from '@/components/report/report-inline-notice'
import { OperatingCostFilterPanel } from '@/components/report/operating-cost-filter-panel'
import { OperatingCostContent } from '@/components/report/operating-cost-content'
import { OperatingCostDetailModal } from '@/components/report/operating-cost-detail-modal'
import { reportButtonClass } from '@/components/report/report-button-chrome'
import {
  REPORT_MODAL_HEADER_CLASS,
  REPORT_MODAL_HEADING_CLASS,
  ReportModalCloseTrigger,
} from '@/components/report/report-modal-close'
import {
  DEFAULT_OPERATING_COST_FILTERS,
  appliedOperatingCostCaption,
  type OperatingCostFilters,
  type OperatingCostRecord,
} from '@/lib/operating-cost-mock-data'

export default function OperatingCostPage() {
  const [draftFilters, setDraftFilters] = useState<OperatingCostFilters>(
    DEFAULT_OPERATING_COST_FILTERS,
  )
  const [appliedFilters, setAppliedFilters] = useState<OperatingCostFilters>(
    DEFAULT_OPERATING_COST_FILTERS,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [detail, setDetail] = useState<OperatingCostRecord | null>(null)
  const detailState = useOverlayState()
  const exportModalState = useOverlayState()

  const runLoading = (fn: () => void) => {
    setIsLoading(true)
    fn()
    window.setTimeout(() => setIsLoading(false), 200)
  }

  const handleSearch = () => runLoading(() => setAppliedFilters({ ...draftFilters }))
  const handleRefresh = () =>
    runLoading(() => {
      setDraftFilters({ ...DEFAULT_OPERATING_COST_FILTERS })
      setAppliedFilters({ ...DEFAULT_OPERATING_COST_FILTERS })
    })

  const openDetail = (row: OperatingCostRecord) => {
    setDetail(row)
    detailState.open()
  }

  return (
    <ReportLayout>
      <ReportPageHeader
        title="Báo cáo chi phí vận hành"
        subtitle={appliedOperatingCostCaption(appliedFilters)}
        actions={
          <ReportHeaderActions
            onRefresh={handleRefresh}
            onExport={() => exportModalState.open()}
          />
        }
      />

      <ReportInlineNotice tone="accent" title="Web kiểm đếm">
        Tổng hợp lương, km, xăng/xe, tăng ca, ăn… theo ngày/tuần/tháng, khu vực, giao nhận và
        khách hàng.
      </ReportInlineNotice>

      <OperatingCostFilterPanel
        filters={draftFilters}
        onChange={setDraftFilters}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onExport={() => exportModalState.open()}
      />

      <OperatingCostContent
        appliedFilters={appliedFilters}
        isLoading={isLoading}
        onViewDetail={openDetail}
      />

      <OperatingCostDetailModal
        state={detailState}
        record={detail}
        canViewAmounts={appliedFilters.canViewAmounts}
      />

      <Modal state={exportModalState}>
        <Modal.Backdrop>
          <Modal.Container size="md">
            <Modal.Dialog>
              <Modal.Header className={REPORT_MODAL_HEADER_CLASS}>
                <Modal.Heading className={REPORT_MODAL_HEADING_CLASS}>
                  Xuất báo cáo chi phí vận hành
                </Modal.Heading>
                <ReportModalCloseTrigger />
              </Modal.Header>
              <Modal.Body className="space-y-3 text-sm text-gray-700">
                <p>
                  Xuất tổng hợp hoặc chi tiết theo bộ lọc, gồm trạng thái khóa/chốt cho đối chiếu
                  Payroll.
                </p>
                <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
                  {appliedOperatingCostCaption(appliedFilters)}
                  {!appliedFilters.canViewAmounts ? ' · Không xuất cột tiền chi tiết' : ''}
                </p>
              </Modal.Body>
              <Modal.Footer className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className={reportButtonClass()}
                  onPress={() => exportModalState.close()}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  className={reportButtonClass()}
                  onPress={() => {
                    toast.success('Đã mô phỏng xuất báo cáo chi phí vận hành.')
                    exportModalState.close()
                  }}
                >
                  Xuất Excel
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </ReportLayout>
  )
}
