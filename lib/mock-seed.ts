/** Số bản ghi mock mặc định cho các màn báo cáo */
export const MOCK_DATA_ROW_COUNT = 1000

export function seededUnit(index: number, salt: number): number {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function distributeEvenly(count: number, slots: number): number[] {
  const base = Math.floor(count / slots)
  const extra = count % slots
  return Array.from({ length: slots }, (_, i) => base + (i < extra ? 1 : 0))
}
