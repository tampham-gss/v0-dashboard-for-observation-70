'use client'

import { Button, Modal } from '@heroui/react'
import { reportButtonClass } from './report-button-chrome'
import type { UseOverlayStateReturn } from '@heroui/react'
import { formatCurrency, formatNumber, type OperationalRow } from '@/lib/report-dashboard-mock'
import { periodLabel } from '@/lib/report-mock-data'

export function OperationalDetailModal({
  state,
  row,
}: {
  state: UseOverlayStateReturn
  row: OperationalRow | null
}) {
  if (!row) return null

  const orders = [
    { ma: `KD-${row.id}-01`, container: 'MSKU1234567', chiPhi: Math.round(row.chiPhiVanHanh * 0.4) },
    { ma: `KD-${row.id}-02`, container: 'TCLU9876543', chiPhi: Math.round(row.chiPhiVanHanh * 0.35) },
    { ma: `KD-${row.id}-03`, container: 'OOLU5678901', chiPhi: Math.round(row.tangCa + row.hoTro) },
  ]

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container size="lg" scroll="inside" className="max-w-3xl">
          <Modal.Dialog className="w-full">
            <Modal.Header>
              <Modal.Heading>Chi tiết vận hành — drill-down</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body className="space-y-5 text-sm">
              <section className="grid gap-2 sm:grid-cols-2">
                <Info label="Kỳ" value={periodLabel(row)} />
                <Info label="Khu vực" value={row.region} />
                <Info label="Kho" value={row.warehouse} />
                <Info label="Tuyến" value={row.route} />
                <Info label="Nhân sự" value={row.staff} />
                <Info label="OPS/CS" value={row.opsCs} />
                <Info label="Sản lượng" value={formatNumber(row.sanLuong)} />
                <Info
                  label="Doanh thu"
                  value={row.hasDoanhThu ? formatCurrency(row.doanhThu) : 'Chưa có dữ liệu doanh thu'}
                />
              </section>
              <section>
                <h3 className="mb-2 font-semibold text-gray-900">Lệnh kiểm đếm liên quan</h3>
                <ul className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  {orders.map((o) => (
                    <li
                      key={o.ma}
                      className="flex flex-wrap justify-between gap-2 border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="font-mono text-xs text-blue-700">{o.ma}</span>
                      <span className="text-xs text-gray-600">{o.container}</span>
                      <span className="text-xs font-medium tabular-nums text-gray-900">
                        CP: {formatCurrency(o.chiPhi)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-100 bg-white px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  )
}
