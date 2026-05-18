import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Compact axis labels for Recharts (avoids clipping long numbers). */
export function formatChartAxisValue(value: number): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return ''
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} tr`
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(n)
}
