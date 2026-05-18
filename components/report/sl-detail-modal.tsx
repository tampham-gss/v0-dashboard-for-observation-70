'use client'

import type { ReactNode } from 'react'
import { Button, Modal } from '@heroui/react'
import { reportButtonClass } from './report-button-chrome'
import type { UseOverlayStateReturn } from '@heroui/react'
import {
  formatNumber,
  formatPercent,
  periodLabel,
  slCompareRatio,
  slProductivity,
  slRatioGLS,
  slRatioPart,
  type SLRecord,
} from '@/lib/report-mock-data'
import { SLStatusChip } from './status-chip'

export function SLDetailModal({
  state,
  record,
}: {
  state: UseOverlayStateReturn
  record: SLRecord | null
}) {
  if (!record) return null

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container size="lg" scroll="inside" className="max-w-3xl">
          <Modal.Dialog className="w-full">
            <Modal.Header>
              <Modal.Heading>Chi tiết sản lượng</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body className="space-y-6 text-sm">
              <DetailSection title="Thông tin kỳ báo cáo">
                <DetailRow label="Kỳ" value={periodLabel(record)} />
                <DetailRow label="Năm" value={String(record.year)} />
                <DetailRow label="Chi nhánh" value={record.branch} />
                <DetailRow label="Trạng thái" value={<SLStatusChip status={record.status} />} />
              </DetailSection>
              <DetailSection title="Kế hoạch">
                <DetailRow label="SL kho KH" value={formatNumber(record.slKhoKH)} />
                <DetailRow label="SL cont KH" value={formatNumber(record.slContKH)} />
              </DetailSection>
              <DetailSection title="Thực hiện">
                <DetailRow label="SL kho TH" value={formatNumber(record.slKhoTH)} />
                <DetailRow label="SL cont TH" value={formatNumber(record.slContTH)} />
                <DetailRow
                  label="So sánh TH/KH"
                  value={formatPercent(slCompareRatio(record.slContKH, record.slContTH))}
                />
              </DetailSection>
              <DetailSection title="Cơ cấu thực hiện">
                <DetailRow label="SL cont GLS" value={formatNumber(record.slContGLS)} />
                <DetailRow
                  label="Tỷ lệ GLS/SL"
                  value={formatPercent(slRatioGLS(record.slContGLS, record.slContTH))}
                />
                <DetailRow label="SL cont Lái xe" value={formatNumber(record.slContLX)} />
                <DetailRow
                  label="Tỷ lệ LX/SL"
                  value={formatPercent(slRatioPart(record.slContLX, record.slContTH))}
                />
                <DetailRow label="SL cont Vendor" value={formatNumber(record.slContVendor)} />
                <DetailRow
                  label="Tỷ lệ Vendor/SL"
                  value={formatPercent(slRatioPart(record.slContVendor, record.slContTH))}
                />
              </DetailSection>
              <DetailSection title="Nhân sự">
                <DetailRow label="NS giao nhận" value={formatNumber(record.nsGiaoNhan)} />
                <DetailRow
                  label="Năng suất BQ/người"
                  value={slProductivity(record.slContTH, record.nsGiaoNhan)?.toFixed(1) ?? '—'}
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
      <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">{children}</div>
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
