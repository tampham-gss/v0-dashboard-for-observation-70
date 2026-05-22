'use client'

import type { ReactNode } from 'react'
import { Button, Modal } from '@heroui/react'
import type { UseOverlayStateReturn } from '@heroui/react'
import { formatAppDate } from '@/lib/date-format'
import { reportButtonClass } from './report-button-chrome'
import {
  formatNumber,
  formatOpCostAmount,
  opCostLockStatusLabel,
  opCostRegionLabel,
  type OperatingCostRecord,
} from '@/lib/operating-cost-mock-data'
import {
  REPORT_MODAL_HEADER_CLASS,
  REPORT_MODAL_HEADING_CLASS,
  ReportModalCloseTrigger,
} from './report-modal-close'

export function OperatingCostDetailModal({
  state,
  record,
  canViewAmounts,
}: {
  state: UseOverlayStateReturn
  record: OperatingCostRecord | null
  canViewAmounts: boolean
}) {
  if (!record) return null

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container size="lg" scroll="inside" className="max-w-3xl">
          <Modal.Dialog className="w-full">
            <Modal.Header className={REPORT_MODAL_HEADER_CLASS}>
              <Modal.Heading className={REPORT_MODAL_HEADING_CLASS}>
                Chi tiết chi phí vận hành
              </Modal.Heading>
              <ReportModalCloseTrigger />
            </Modal.Header>
            <Modal.Body className="space-y-6 text-sm">
              <DetailSection title="Lệnh / phạm vi">
                <DetailRow label="Ngày" value={formatAppDate(record.statDate)} />
                <DetailRow label="Tuần" value={record.week ?? '—'} />
                <DetailRow label="Khu vực" value={opCostRegionLabel(record.region)} />
                <DetailRow label="Hub" value={record.hub} />
                <DetailRow label="Giao nhận" value={record.delivererName} />
                <DetailRow label="Khách hàng" value={record.customer} />
                <DetailRow label="Kho" value={record.warehouse} />
                <DetailRow label="Tuyến" value={record.route} />
                <DetailRow label="CS/OPS" value={record.opsCs} />
                <DetailRow label="SL cont" value={formatNumber(record.slCont)} />
                <DetailRow label="Số km" value={formatNumber(record.km)} />
                <DetailRow label="Quy tắc vùng" value={record.regionRuleNote} />
              </DetailSection>
              <DetailSection title="Thành phần chi phí">
                <DetailRow label="Lương" value={formatOpCostAmount(record.luong, canViewAmounts)} />
                <DetailRow label="Tiền ăn trưa" value={formatOpCostAmount(record.tienAnTrua, canViewAmounts)} />
                <DetailRow label="Tiền tăng ca" value={formatOpCostAmount(record.tienTangCa, canViewAmounts)} />
                <DetailRow
                  label="Tiền ăn tăng ca"
                  value={formatOpCostAmount(record.tienAnTangCa, canViewAmounts)}
                />
                <DetailRow
                  label="Phòng trọ TC sau 22h"
                  value={formatOpCostAmount(record.tienPhongTro22h, canViewAmounts)}
                />
                <DetailRow
                  label="Tiền xăng/vé xe"
                  value={formatOpCostAmount(record.tienXangVeXe, canViewAmounts)}
                />
                <DetailRow label="CPPS theo chuyến" value="—" />
                <DetailRow
                  label="Bồi dưỡng/phát sinh khác"
                  value={
                    record.boiDuongPhatSinh == null
                      ? 'Chưa có dữ liệu'
                      : formatOpCostAmount(record.boiDuongPhatSinh, canViewAmounts)
                  }
                />
                <DetailRow
                  label="Tổng chi phí"
                  value={formatOpCostAmount(record.tongChiPhi, canViewAmounts)}
                />
              </DetailSection>
              <DetailSection title="Nguồn & chốt">
                <DetailRow label="Nguồn dữ liệu" value={record.dataSource} />
                <DetailRow label="Trạng thái chốt" value={opCostLockStatusLabel(record.lockStatus)} />
                {record.dataError ? (
                  <DetailRow label="Cảnh báo" value="Bản ghi lỗi dữ liệu (km/CP âm)" />
                ) : null}
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
    <div>
      <h4 className="mb-2 text-sm font-semibold text-gray-900">{title}</h4>
      <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">{children}</div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-2.5">
      <span className="text-gray-600">{label}</span>
      <span className="text-right font-medium text-gray-900">{value}</span>
    </div>
  )
}
