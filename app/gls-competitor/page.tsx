'use client'

import { useState } from 'react'
import { toast, useOverlayState } from '@heroui/react'
import { ReportLayout } from '@/components/report/report-layout'
import { ReportHeaderActions, ReportPageHeader } from '@/components/report/report-page-header'
import { GlsCompetitorFilterPanel } from '@/components/report/gls-competitor-filter-panel'
import { GlsCompetitorContent } from '@/components/report/gls-competitor-content'
import { ReportInlineNotice } from '@/components/report/report-inline-notice'
import {
  DEFAULT_GLS_COMPETITOR_FILTERS,
  appliedGlsCompetitorCaption,
  type GlsCompetitorFilters,
} from '@/lib/gls-competitor-mock-data'
import { Modal, Button } from '@heroui/react'
import { reportButtonClass } from '@/components/report/report-button-chrome'
import {
  REPORT_MODAL_HEADER_CLASS,
  REPORT_MODAL_HEADING_CLASS,
  ReportModalCloseTrigger,
} from '@/components/report/report-modal-close'

export default function GlsCompetitorPage() {
  const [draftFilters, setDraftFilters] = useState<GlsCompetitorFilters>(
    DEFAULT_GLS_COMPETITOR_FILTERS,
  )
  const [appliedFilters, setAppliedFilters] = useState<GlsCompetitorFilters>(
    DEFAULT_GLS_COMPETITOR_FILTERS,
  )
  const [isLoading, setIsLoading] = useState(false)
  const exportModalState = useOverlayState()

  const runLoading = (fn: () => void) => {
    setIsLoading(true)
    fn()
    window.setTimeout(() => setIsLoading(false), 200)
  }

  const handleSearch = () => {
    runLoading(() => setAppliedFilters({ ...draftFilters }))
  }

  const handleRefresh = () => {
    runLoading(() => {
      setDraftFilters({ ...DEFAULT_GLS_COMPETITOR_FILTERS })
      setAppliedFilters({ ...DEFAULT_GLS_COMPETITOR_FILTERS })
    })
  }

  const handleExport = () => {
    toast.success('Đã mô phỏng xuất báo cáo GLS vs đối thủ theo bộ lọc hiện tại.')
    exportModalState.close()
  }

  return (
    <ReportLayout>
      <ReportPageHeader
        title="So sánh sản lượng GLS và đối thủ"
        subtitle={appliedGlsCompetitorCaption(appliedFilters)}
        actions={
          <ReportHeaderActions
            onRefresh={handleRefresh}
            onExport={() => exportModalState.open()}
          />
        }
      />

      <ReportInlineNotice tone="accent" title="Web kiểm đếm">
        Quan sát thị phần GLS tại hiện trường theo ngày/tuần, khu vực và loại cont (CONT_20 /
        CONT_40). Báo cáo chỉ đọc dữ liệu nhập liệu hiện trường, không sửa bản ghi nguồn.
      </ReportInlineNotice>

      <GlsCompetitorFilterPanel
        filters={draftFilters}
        onChange={setDraftFilters}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onExport={() => exportModalState.open()}
      />

      <GlsCompetitorContent appliedFilters={appliedFilters} isLoading={isLoading} />

      <Modal state={exportModalState}>
        <Modal.Backdrop>
          <Modal.Container size="md">
            <Modal.Dialog>
              <Modal.Header className={REPORT_MODAL_HEADER_CLASS}>
                <Modal.Heading className={REPORT_MODAL_HEADING_CLASS}>
                  Xuất báo cáo GLS vs đối thủ
                </Modal.Heading>
                <ReportModalCloseTrigger />
              </Modal.Header>
              <Modal.Body className="space-y-3 text-sm text-gray-700">
                <p>
                  Xuất tổng hợp hoặc chi tiết theo bộ lọc hiện tại, giữ tên đối thủ và nhóm danh
                  mục.
                </p>
                <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
                  {appliedGlsCompetitorCaption(appliedFilters)}
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
                <Button variant="primary" className={reportButtonClass()} onPress={handleExport}>
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
