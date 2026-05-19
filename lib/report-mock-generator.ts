export const MOCK_DATA_ROW_COUNT = 5000

type PeriodType = 'week' | 'month'
type BranchCode = 'HCM' | 'HPH' | 'CLO' | 'DAN' | 'GLS'
type SLStatus = 'Đạt kế hoạch' | 'Gần đạt' | 'Chưa đạt' | 'Cần kiểm tra'
type CPStatus =
  | 'Trong định mức'
  | 'Vượt định mức'
  | 'Cần kiểm tra'
  | 'Dữ liệu bất thường'
  | 'Thiếu dữ liệu'

interface SLRecord {
  id: string
  periodType: PeriodType
  year: number
  week?: string
  month?: string
  branch: BranchCode
  nsGiaoNhan: number
  slKhoKH: number
  slContKH: number
  slKhoTH: number
  slContTH: number
  slKhoGLS: number
  slContGLS: number
  slKhoLX: number
  slContLX: number
  slKhoVendor: number
  slContVendor: number
  status: SLStatus
}

interface CPRecord {
  id: string
  periodType: PeriodType
  year: number
  week?: string
  month?: string
  date: string
  branch: BranchCode
  nhanCong: number
  cpGNGLSPerCont: number
  tongCPGNGLS: number
  contGNGLSKD: number
  tongCPLaiXeKD: number
  contLaiXeKD: number
  tongCPVendor: number
  contVendorKD: number
  tongChiPhi: number
  cpTBPerCont: number
  status: CPStatus
}

const BRANCHES: BranchCode[] = ['HCM', 'HPH', 'CLO', 'DAN', 'GLS']
const YEARS = [2025, 2026] as const
const MONTHS = [
  '08/25', '09/25', '10/25', '11/25', '12/25',
  '01/26', '02/26', '03/26', '04/26', '05/26',
  '06/26', '07/26', '08/26', '09/26', '10/26',
  '11/26', '12/26',
] as const

const TARGET_CP_PER_CONT = 150_000

function computeSLStatus(slContKH: number, slContTH: number): SLStatus {
  if (slContKH <= 0 || slContTH <= 0) return 'Cần kiểm tra'
  const ratio = (slContTH / slContKH) * 100
  if (ratio >= 100) return 'Đạt kế hoạch'
  if (ratio >= 90) return 'Gần đạt'
  return 'Chưa đạt'
}

function computeCPStatus(
  tongChiPhi: number,
  cpTBPerCont: number,
  contTH: number,
  hasCostButNoCont: boolean,
): CPStatus {
  if (tongChiPhi < 0 || cpTBPerCont < 0) return 'Dữ liệu bất thường'
  if (hasCostButNoCont) return 'Thiếu dữ liệu'
  if (tongChiPhi === 0 && contTH > 0) return 'Cần kiểm tra'
  if (cpTBPerCont <= TARGET_CP_PER_CONT) return 'Trong định mức'
  return 'Vượt định mức'
}

function seededUnit(index: number, salt: number): number {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

function weekLabel(weekIndex: number, year: number): string {
  const yy = String(year).slice(-2)
  const n = (weekIndex % 52) + 1
  return `Tuần ${String(n).padStart(2, '0')}/${yy}`
}

function monthLabel(monthIndex: number): string {
  return MONTHS[monthIndex % MONTHS.length]
}

function formatCpDate(year: number, monthIndex: number, day: number): string {
  const mm = String((monthIndex % 12) + 1).padStart(2, '0')
  const dd = String(Math.min(28, Math.max(1, day))).padStart(2, '0')
  const yy = String(year).slice(-2)
  return `${dd}/${mm}/20${yy}`
}

function buildSlRecord(
  index: number,
  periodType: PeriodType,
  year: number,
  branch: BranchCode,
  periodKey: string,
): SLRecord {
  const u = (s: number) => seededUnit(index, s)
  const baseKh = Math.round(400 + u(1) * 1600)
  const ratio = 0.72 + u(2) * 0.38
  const slContKH = index % 97 === 0 ? 0 : baseKh
  const slContTH =
    slContKH === 0 ? Math.round(300 + u(3) * 500) : Math.round(slContKH * ratio)
  const slContGLS = Math.round(slContTH * (0.55 + u(4) * 0.25))
  const slContLX = Math.round(slContTH * (0.08 + u(5) * 0.12))
  const slContVendor = Math.max(0, slContTH - slContGLS - slContLX + Math.round(u(6) * 20 - 10))

  return {
    id: `sl-gen-${index}`,
    periodType,
    year,
    ...(periodType === 'week' ? { week: periodKey } : { month: periodKey }),
    branch,
    nsGiaoNhan: Math.max(8, Math.round(12 + u(7) * 48)),
    slKhoKH: Math.round(slContKH * 1.02),
    slContKH,
    slKhoTH: Math.round(slContTH * 1.01),
    slContTH,
    slKhoGLS: Math.round(slContGLS * 1.01),
    slContGLS,
    slKhoLX: Math.round(slContLX * 1.02),
    slContLX,
    slKhoVendor: Math.round(slContVendor * 1.03),
    slContVendor,
    status: computeSLStatus(slContKH, slContTH),
  }
}

function buildCpRecord(index: number, sl: SLRecord): CPRecord {
  const u = (s: number) => seededUnit(index, s + 100)
  const contTH = sl.slContTH
  const contGNGLSKD = sl.slContGLS
  const contLaiXeKD = sl.slContLX
  const contVendorKD = sl.slContVendor

  const cpGNGLSPerCont = Math.round(120_000 + u(1) * 55_000)
  const tongCPGNGLS = Math.round(cpGNGLSPerCont * Math.max(contGNGLSKD, 0))
  const tongCPLaiXeKD = Math.round((8_000_000 + u(2) * 22_000_000) * Math.max(contLaiXeKD / 120, 0))
  const tongCPVendor = Math.round((3_000_000 + u(3) * 12_000_000) * Math.max(contVendorKD / 100, 0))
  const tongChiPhi =
    index % 211 === 0
      ? 0
      : index % 313 === 0
        ? -Math.round(1_000_000 + u(4) * 5_000_000)
        : tongCPGNGLS + tongCPLaiXeKD + tongCPVendor
  const cpTBPerCont =
    contTH > 0 && tongChiPhi > 0
      ? Math.round(tongChiPhi / contTH)
      : tongChiPhi < 0
        ? -1000
        : 0

  const hasCostButNoCont = contTH <= 0 && tongChiPhi > 0

  return {
    id: `cp-gen-${index}`,
    periodType: sl.periodType,
    year: sl.year,
    week: sl.week,
    month: sl.month,
    date: formatCpDate(sl.year, index % 12, (index % 27) + 1),
    branch: sl.branch,
    nhanCong: sl.nsGiaoNhan,
    cpGNGLSPerCont,
    tongCPGNGLS,
    contGNGLSKD,
    tongCPLaiXeKD,
    contLaiXeKD,
    tongCPVendor,
    contVendorKD,
    tongChiPhi,
    cpTBPerCont,
    status: computeCPStatus(tongChiPhi, cpTBPerCont, contTH, hasCostButNoCont),
  }
}

function pinDefaultFilterSamples(slRecords: SLRecord[], cpRecords: CPRecord[]) {
  const branches: BranchCode[] = ['HCM', 'HPH', 'CLO', 'DAN', 'GLS']

  branches.forEach((branch, idx) => {
    const sl = slRecords[idx]
    const cp = cpRecords[idx]
    if (!sl || !cp) return

    sl.periodType = 'week'
    sl.year = 2026
    sl.week = 'Tuần 15/26'
    sl.month = undefined
    sl.branch = branch
    sl.slContKH = 900 + idx * 80
    sl.slContTH = Math.round(sl.slContKH * (idx === 3 ? 1.02 : 0.88 + idx * 0.03))
    sl.slContGLS = Math.round(sl.slContTH * 0.72)
    sl.slContLX = Math.round(sl.slContTH * 0.12)
    sl.slContVendor = Math.max(0, sl.slContTH - sl.slContGLS - sl.slContLX)
    sl.status = computeSLStatus(sl.slContKH, sl.slContTH)

    cp.periodType = 'week'
    cp.year = 2026
    cp.week = 'Tuần 15/26'
    cp.month = undefined
    cp.date = `0${idx + 8}/04/26`
    cp.branch = branch
    cp.nhanCong = sl.nsGiaoNhan
    cp.contGNGLSKD = sl.slContGLS
    cp.contLaiXeKD = sl.slContLX
    cp.contVendorKD = sl.slContVendor
    cp.tongCPGNGLS = Math.round(130_000 * cp.contGNGLSKD)
    cp.tongCPLaiXeKD = Math.round(12_000_000 + idx * 2_000_000)
    cp.tongCPVendor = Math.round(5_000_000 + idx * 1_500_000)
    cp.tongChiPhi = cp.tongCPGNGLS + cp.tongCPLaiXeKD + cp.tongCPVendor
    cp.cpTBPerCont = sl.slContTH > 0 ? Math.round(cp.tongChiPhi / sl.slContTH) : 0
    cp.cpGNGLSPerCont = cp.contGNGLSKD > 0 ? Math.round(cp.tongCPGNGLS / cp.contGNGLSKD) : 0
    if (idx === 2) {
      cp.cpTBPerCont = TARGET_CP_PER_CONT + 25_000
      cp.tongChiPhi = cp.cpTBPerCont * sl.slContTH
    }
    cp.status = computeCPStatus(cp.tongChiPhi, cp.cpTBPerCont, sl.slContTH, false)
  })
}

/** Sinh `count` cặp SL + CP (mỗi cặp = một dòng BC). */
export function createMockRecords(count: number): {
  slRecords: SLRecord[]
  cpRecords: CPRecord[]
} {
  const slRecords: SLRecord[] = []
  const cpRecords: CPRecord[] = []

  for (let i = 0; i < count; i++) {
    const branch = BRANCHES[i % BRANCHES.length]
    const year = YEARS[Math.floor(i / (count / YEARS.length)) % YEARS.length]
    const periodType: PeriodType = i % 4 === 0 ? 'month' : 'week'
    const periodKey =
      periodType === 'week'
        ? weekLabel(Math.floor(i / BRANCHES.length), year)
        : monthLabel(Math.floor(i / (BRANCHES.length * 3)))

    const sl = buildSlRecord(i, periodType, year, branch, periodKey)
    slRecords.push(sl)
    cpRecords.push(buildCpRecord(i, sl))
  }

  pinDefaultFilterSamples(slRecords, cpRecords)

  return { slRecords, cpRecords }
}
