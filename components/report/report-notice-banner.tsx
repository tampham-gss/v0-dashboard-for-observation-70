'use client'

import { Info } from 'lucide-react'
import type { BcSourceSheet } from '@/lib/bc-report'

export function ReportNoticeBanner({ sourceSheet }: { sourceSheet: BcSourceSheet }) {
  return (
    <div
      role="note"
      className="mb-6 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"
    >
      <Info className="mt-0.5 size-5 shrink-0 text-blue-600" aria-hidden />
      <div className="min-w-0 space-y-1">
       
      </div>
    </div>
  )
}
  