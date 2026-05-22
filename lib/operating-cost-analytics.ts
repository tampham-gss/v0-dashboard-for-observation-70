import { formatAppDate } from './date-format'
import {
  type OperatingCostFilters,
  type OperatingCostRecord,
  opCostRegionLabel,
} from './operating-cost-mock-data'

export interface OpCostTotals {
  totalChiPhi: number
  totalSlCont: number
  cpPerCont: number | null
  totalKm: number
  recordCount: number
  dataErrorCount: number
  lockedCount: number
}

export interface OpCostBreakdownRow {
  key: string
  label: string
  tongChiPhi: number
  slCont: number
  km: number
  recordCount: number
}

export interface OpCostChartPoint {
  key: string
  label: string
  tongChiPhi: number
  slCont: number
}

export interface OpCostComponentTotals {
  luong: number
  tienAnTrua: number
  tienTangCa: number
  tienAnTangCa: number
  tienPhongTro22h: number
  tienXangVeXe: number
  boiDuongPhatSinh: number
}

function validRows(rows: OperatingCostRecord[]): OperatingCostRecord[] {
  return rows.filter((r) => !r.dataError && r.tongChiPhi >= 0 && r.km >= 0)
}

export function computeOpCostTotals(rows: OperatingCostRecord[]): OpCostTotals {
  const valid = validRows(rows)
  const totalChiPhi = valid.reduce((s, r) => s + r.tongChiPhi, 0)
  const totalSlCont = valid.reduce((s, r) => s + r.slCont, 0)
  const totalKm = valid.reduce((s, r) => s + r.km, 0)
  return {
    totalChiPhi,
    totalSlCont,
    cpPerCont: totalSlCont > 0 ? totalChiPhi / totalSlCont : null,
    totalKm,
    recordCount: rows.length,
    dataErrorCount: rows.filter((r) => r.dataError || r.tongChiPhi < 0 || r.km < 0).length,
    lockedCount: rows.filter((r) => r.lockStatus === 'da_khoa').length,
  }
}

export function computeOpCostComponents(rows: OperatingCostRecord[]): OpCostComponentTotals {
  const valid = validRows(rows)
  return {
    luong: valid.reduce((s, r) => s + r.luong, 0),
    tienAnTrua: valid.reduce((s, r) => s + r.tienAnTrua, 0),
    tienTangCa: valid.reduce((s, r) => s + r.tienTangCa, 0),
    tienAnTangCa: valid.reduce((s, r) => s + r.tienAnTangCa, 0),
    tienPhongTro22h: valid.reduce((s, r) => s + r.tienPhongTro22h, 0),
    tienXangVeXe: valid.reduce((s, r) => s + r.tienXangVeXe, 0),
    boiDuongPhatSinh: valid.reduce((s, r) => s + (r.boiDuongPhatSinh ?? 0), 0),
  }
}

export function buildOpCostChartSeries(
  rows: OperatingCostRecord[],
  filters: OperatingCostFilters,
): OpCostChartPoint[] {
  const valid = validRows(rows)
  const buckets = new Map<string, { label: string; cost: number; sl: number }>()

  for (const r of valid) {
    let key: string
    let label: string
    if (filters.chartGroupBy === 'region') {
      key = r.region
      label = opCostRegionLabel(r.region)
    } else if (filters.chartGroupBy === 'week') {
      key = r.week ?? r.statDate
      label = r.week ?? r.statDate
    } else {
      key = r.statDate
      label = formatAppDate(r.statDate)
    }
    if (!buckets.has(key)) buckets.set(key, { label, cost: 0, sl: 0 })
    const b = buckets.get(key)!
    b.cost += r.tongChiPhi
    b.sl += r.slCont
  }

  return [...buckets.entries()]
    .map(([key, b]) => ({
      key,
      label: b.label,
      tongChiPhi: b.cost,
      slCont: b.sl,
    }))
    .sort((a, b) => a.key.localeCompare(b.key))
}

export function breakdownByDeliverer(rows: OperatingCostRecord[]): OpCostBreakdownRow[] {
  return aggregateBreakdown(rows, (r) => r.delivererName)
}

export function breakdownByCustomer(rows: OperatingCostRecord[]): OpCostBreakdownRow[] {
  return aggregateBreakdown(rows, (r) => r.customer)
}

export function breakdownByRegion(rows: OperatingCostRecord[]): OpCostBreakdownRow[] {
  return aggregateBreakdown(rows, (r) => r.region, (k) => opCostRegionLabel(k as OperatingCostRecord['region']))
}

function aggregateBreakdown(
  rows: OperatingCostRecord[],
  keyFn: (r: OperatingCostRecord) => string,
  labelFn?: (key: string) => string,
): OpCostBreakdownRow[] {
  const map = new Map<string, OpCostBreakdownRow>()
  for (const r of validRows(rows)) {
    const key = keyFn(r)
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: labelFn ? labelFn(key) : key,
        tongChiPhi: 0,
        slCont: 0,
        km: 0,
        recordCount: 0,
      })
    }
    const row = map.get(key)!
    row.tongChiPhi += r.tongChiPhi
    row.slCont += r.slCont
    row.km += r.km
    row.recordCount += 1
  }
  return [...map.values()].sort((a, b) => b.tongChiPhi - a.tongChiPhi)
}

export function filterDetailByKey(
  rows: OperatingCostRecord[],
  field: 'deliverer' | 'customer' | 'region',
  key: string | null,
): OperatingCostRecord[] {
  if (!key) return rows
  if (field === 'deliverer') return rows.filter((r) => r.delivererName === key)
  if (field === 'customer') return rows.filter((r) => r.customer === key)
  return rows.filter((r) => r.region === key)
}
