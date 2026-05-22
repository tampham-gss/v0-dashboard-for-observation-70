'use client'

import { Modal } from '@heroui/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const REPORT_MODAL_HEADER_CLASS = 'flex items-start justify-between gap-3'
export const REPORT_MODAL_HEADING_CLASS = 'flex-1 min-w-0'

/** Nút đóng modal — hiển thị rõ dấu X (tránh bị chìm trên nền trắng). */
export function ReportModalCloseTrigger({ className }: { className?: string }) {
  return (
    <Modal.CloseTrigger
      aria-label="Đóng"
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-md',
        'border border-gray-200 bg-white text-gray-700 shadow-sm',
        'hover:bg-gray-50 hover:text-gray-900',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
        className,
      )}
    >
      <X className="size-4" strokeWidth={2} aria-hidden />
    </Modal.CloseTrigger>
  )
}
