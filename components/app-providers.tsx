'use client'

import { Toast } from '@heroui/react'

/** Toast region + queue (HeroUI); wrap toàn app để dùng `toast` API. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toast.Provider placement="bottom" gap={12} maxVisibleToasts={3} />
    </>
  )
}
