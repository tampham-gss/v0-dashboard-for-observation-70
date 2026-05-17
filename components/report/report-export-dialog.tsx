'use client'

import { Button, Modal } from '@heroui/react'
import type { UseOverlayStateReturn } from '@heroui/react'
import { appliedFiltersCaption, type ReportFilters } from '@/lib/report-mock-data'

export function ReportExportDialog({
  state,
  filters,
  onConfirm,
}: {
  state: UseOverlayStateReturn
  filters: ReportFilters
  onConfirm: (type: 'week' | 'month') => void
}) {
  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Xuất báo cáo Excel</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body className="space-y-3 text-sm text-gray-700">
              <p>
                File gồm 2 sheet <strong>SL</strong> và <strong>CP</strong> theo bộ lọc hiện tại (mô
                phỏng prototype).
              </p>
              <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
                {appliedFiltersCaption(filters)}
              </p>
            </Modal.Body>
            <Modal.Footer className="flex flex-wrap gap-2">
              <Button variant="outline" onPress={() => state.close()}>
                Hủy
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  onConfirm(filters.periodType)
                  state.close()
                }}
              >
                Xuất báo cáo {filters.periodType === 'week' ? 'tuần' : 'tháng'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
