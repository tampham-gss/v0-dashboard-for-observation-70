'use client'

import { Info } from 'lucide-react'

export function ReportNoticeBanner() {
  return (
    <div
      role="note"
      className="mb-6 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"
    >
      <Info className="mt-0.5 size-5 shrink-0 text-blue-600" aria-hidden />
      <div className="min-w-0 space-y-1">
        <p className="font-medium">STT 70 — Quan sát sản lượng, doanh thu, hiệu quả</p>
        <p className="leading-relaxed text-blue-800/90">
          Không phân tích theo Khách hàng và Hub theo yêu cầu khách hàng. Layout tham chiếu BC
          Tuần / BC Tháng (Excel); dữ liệu demo trên dashboard, không dùng Excel làm nguồn import.
        </p>
      </div>
    </div>
  )
}
