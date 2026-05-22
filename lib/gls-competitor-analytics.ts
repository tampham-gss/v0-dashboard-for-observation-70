import { formatAppDate } from './date-format'
import {
  GLS_COMPETITOR_CATALOG,
  type ContType,
  type GlsCompetitorCatalogId,
  type GlsCompetitorFilters,
  type GlsCompetitorObservation,
  type GlsRegionCode,
  glsRegionLabel,
  rowsForRatioCalc,
} from './gls-competitor-mock-data'

export interface GlsMarketTotals {
  /** G — tổng SL GLS (mỗi bản ghi nguồn một lần) */
  g: number
  /** D_all */
  dAll: number
  /** T = G + D_all */
  t: number
  glsSharePct: number | null
  competitorSharePct: number | null
  recordCount: number
  sourceCount: number
  unassignedContCount: number
  dataErrorCount: number
}

export interface CompetitorBreakdownRow {
  competitorId: GlsCompetitorCatalogId
  competitorName: string
  volume: number
  sharePct: number | null
  isCatalog: boolean
}

export interface GlsCompareChartPoint {
  key: string
  label: string
  gls: number
  competitors: number
  total: number
}

function sumGBySource(rows: GlsCompetitorObservation[]): number {
  const bySource = new Map<string, number>()
  for (const r of rows) {
    if (r.dataError || r.glsVolume < 0) continue
    if (!bySource.has(r.sourceId)) bySource.set(r.sourceId, r.glsVolume)
  }
  return [...bySource.values()].reduce((s, v) => s + v, 0)
}

function sumCompetitorVolume(rows: GlsCompetitorObservation[]): number {
  return rows.reduce((s, r) => {
    if (r.dataError || r.competitorVolume < 0) return s
    return s + r.competitorVolume
  }, 0)
}

export function computeGlsMarketTotals(rows: GlsCompetitorObservation[]): GlsMarketTotals {
  const ratioRows = rowsForRatioCalc(rows)
  const g = sumGBySource(ratioRows)
  const dAll = sumCompetitorVolume(ratioRows)
  const t = g + dAll
  const sourceCount = new Set(ratioRows.map((r) => r.sourceId)).size

  return {
    g,
    dAll,
    t,
    glsSharePct: t > 0 ? (100 * g) / t : null,
    competitorSharePct: t > 0 ? (100 * dAll) / t : null,
    recordCount: rows.length,
    sourceCount,
    unassignedContCount: rows.filter((r) => r.contType == null).length,
    dataErrorCount: rows.filter((r) => r.dataError || r.glsVolume < 0 || r.competitorVolume < 0)
      .length,
  }
}

export function computeCompetitorBreakdown(
  rows: GlsCompetitorObservation[],
): CompetitorBreakdownRow[] {
  const ratioRows = rowsForRatioCalc(rows)
  const t = computeGlsMarketTotals(rows).t
  const volById = new Map<GlsCompetitorCatalogId, number>()

  for (const r of ratioRows) {
    if (r.dataError || r.competitorVolume < 0) continue
    volById.set(r.competitorId, (volById.get(r.competitorId) ?? 0) + r.competitorVolume)
  }

  return GLS_COMPETITOR_CATALOG.map((cat) => {
    const volume = volById.get(cat.id) ?? 0
    return {
      competitorId: cat.id,
      competitorName: cat.label,
      volume,
      sharePct: t > 0 ? (100 * volume) / t : null,
      isCatalog: cat.id !== 'KHAC',
    }
  })
}

export function buildGlsCompareChartSeries(
  rows: GlsCompetitorObservation[],
  filters: GlsCompetitorFilters,
): GlsCompareChartPoint[] {
  const ratioRows = rowsForRatioCalc(rows)
  const groupBy = filters.chartGroupBy

  const buckets = new Map<
    string,
    { label: string; glsBySource: Map<string, number>; comp: number }
  >()

  for (const r of ratioRows) {
    if (r.dataError) continue
    let key: string
    let label: string
    if (groupBy === 'region') {
      key = r.region
      label = glsRegionLabel(r.region)
    } else if (groupBy === 'week') {
      key = r.week
      label = r.week
    } else {
      key = r.statDate
      label = formatAppDate(r.statDate)
    }

    if (!buckets.has(key)) {
      buckets.set(key, { label, glsBySource: new Map(), comp: 0 })
    }
    const b = buckets.get(key)!
    if (!b.glsBySource.has(r.sourceId) && r.glsVolume >= 0) {
      b.glsBySource.set(r.sourceId, r.glsVolume)
    }
    if (r.competitorVolume >= 0) b.comp += r.competitorVolume
  }

  return [...buckets.entries()]
    .map(([key, b]) => {
      const gls = [...b.glsBySource.values()].reduce((s, v) => s + v, 0)
      return {
        key,
        label: b.label,
        gls,
        competitors: b.comp,
        total: gls + b.comp,
      }
    })
    .sort((a, b) => a.key.localeCompare(b.key))
}

export interface ShareSlice {
  name: string
  value: number
  pct: number | null
  fill: string
}

const SHARE_COLORS: Record<string, string> = {
  GLS: '#2563eb',
  VIETSUN: '#0ea5e9',
  VSICO: '#06b6d4',
  DUONG_BO: '#14b8a6',
  VIMC: '#10b981',
  TMS: '#84cc16',
  XNK: '#eab308',
  VINAFCO: '#f59e0b',
  HAI_AN: '#f97316',
  KHAC: '#94a3b8',
}

export function buildMarketShareSlices(rows: GlsCompetitorObservation[]): ShareSlice[] {
  const totals = computeGlsMarketTotals(rows)
  const breakdown = computeCompetitorBreakdown(rows)
  const slices: ShareSlice[] = []

  if (totals.g > 0) {
    slices.push({
      name: 'GLS',
      value: totals.g,
      pct: totals.glsSharePct,
      fill: SHARE_COLORS.GLS,
    })
  }

  for (const row of breakdown) {
    if (row.volume <= 0) continue
    slices.push({
      name: row.competitorName,
      value: row.volume,
      pct: row.sharePct,
      fill: SHARE_COLORS[row.competitorId] ?? '#64748b',
    })
  }

  return slices
}

export function filterDetailByCompetitor(
  rows: GlsCompetitorObservation[],
  competitorId: GlsCompetitorCatalogId | null,
): GlsCompetitorObservation[] {
  if (!competitorId) return rows
  return rows.filter((r) => r.competitorId === competitorId)
}

export function contTypeBreakdown(
  rows: GlsCompetitorObservation[],
): { contType: ContType; gls: number; competitors: number; t: number }[] {
  const types: ContType[] = ['CONT_20', 'CONT_40']
  return types.map((contType) => {
    const subset = rows.filter((r) => r.contType === contType)
    const m = computeGlsMarketTotals(subset)
    return { contType, gls: m.g, competitors: m.dAll, t: m.t }
  })
}

export type { GlsRegionCode }
