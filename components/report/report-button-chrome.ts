import type { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'

/** Bo góc đồng bộ với ô lọc — ghi đè pill mặc định HeroUI */
export const REPORT_BUTTON_RADIUS_CLASS = '!rounded-md'

export function reportButtonClass(...extra: ClassValue[]) {
  return cn(REPORT_BUTTON_RADIUS_CLASS, extra)
}
