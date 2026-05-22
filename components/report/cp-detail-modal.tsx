'use client'

import type { ReactNode } from 'react'
import { Button, Modal } from '@heroui/react'
import { reportButtonClass } from './report-button-chrome'
import type { UseOverlayStateReturn } from '@heroui/react'
import { formatAppDate } from '@/lib/date-format'
import {
  TARGET_CP_PER_CONT,
  formatCurrency,
  formatNumber,
  periodLabel,
  type CPRecord,
} from '@/lib/report-mock-data'
import { CPStatusChip } from './status-chip'
import {
  REPORT_MODAL_HEADER_CLASS,
  REPORT_MODAL_HEADING_CLASS,
  ReportModalCloseTrigger,
} from './report-modal-close'

export function CPDetailModal({
  state,
  record,
}: {
  state: UseOverlayStateReturn
  record: CPRecord | null
}) {
  if (!record) return null

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container size="lg" scroll="inside" className="max-w-3xl">
          <Modal.Dialog className="w-full">
            <Modal.Header className={REPORT_MODAL_HEADER_CLASS}>
              <Modal.Heading className={REPORT_MODAL_HEADING_CLASS}>Chi tiết chi phí</Modal.Heading>
              <ReportModalCloseTrigger />
            </Modal.Header>
            <Modal.Body className="space-y-6 text-sm">
              <DetailSection title="Thông tin kỳ báo cáo">
                <DetailRow label="Kỳ" value={periodLabel(record)} />
                <DetailRow label="Tháng" value={record.month ?? '—'} />
                <DetailRow label="Ngày" value={formatAppDate(record.date)} />
                <DetailRow label="Chi nhánh" value={record.branch} />
                <DetailRow label="Nhân công" value={formatNumber(record.nhanCong)} />
                <DetailRow label="Trạng thái" value={<CPStatusChip status={record.status} />} />
              </DetailSection>
              <DetailSection title="Chi phí GLS">
                <DetailRow label="CP GN GLS/cont" value={formatCurrency(record.cpGNGLSPerCont)} />
                <DetailRow label="Tổng CP GN GLS" value={formatCurrency(record.tongCPGNGLS)} />
                <DetailRow label="Số lượng cont GN GLS KĐ" value={formatNumber(record.contGNGLSKD)} />
              </DetailSection>
              <DetailSection title="Chi phí Lái xe">
                <DetailRow label="Tổng CP Lái xe KĐ" value={formatCurrency(record.tongCPLaiXeKD)} />
                <DetailRow label="Số lượng cont lái xe KĐ" value={formatNumber(record.contLaiXeKD)} />
              </DetailSection>
              <DetailSection title="Chi phí Vendor">
                <DetailRow label="Tổng CP Vendor" value={formatCurrency(record.tongCPVendor)} />
                <DetailRow label="Số lượng cont Vendor KĐ" value={formatNumber(record.contVendorKD)} />
              </DetailSection>
              <DetailSection title="Tổng hợp">
                <DetailRow label="Tổng chi phí" value={formatCurrency(record.tongChiPhi)} />
                <DetailRow label="CP TB/Cont" value={formatCurrency(record.cpTBPerCont)} />
                <DetailRow label="Target CP/Cont" value={formatCurrency(TARGET_CP_PER_CONT)} />
                <DetailRow
                  label="So với target"
                  value={
                    record.cpTBPerCont <= TARGET_CP_PER_CONT ? 'Trong định mức' : 'Vượt định mức'
                  }
                />
              </DetailSection>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" className={reportButtonClass()} onPress={() => state.close()}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-medium text-gray-900">{title}</h3>
      <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
        {children}
      </div>
    </section>
  )
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-0.5">
      <span className="shrink-0 pr-2 text-sm leading-snug text-gray-700">{label}</span>
      <span className="min-w-0 flex-1 text-right text-xs font-medium tabular-nums leading-snug text-gray-900 no-underline">
        {value}
      </span>
    </div>
  )
}
