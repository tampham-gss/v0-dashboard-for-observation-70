export const MOCK_DATA_ROW_COUNT = 500

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
const WEEKS_26 = Array.from({ length: 52 }, (_, i) => `Tuần ${String(i + 1).padStart(2, '0')}/26`)
const WEEKS_25 = Array.from({ length: 52 }, (_, i) => `Tuần ${String(i + 1).padStart(2, '0')}/25`)
/** 104 tuần — khớp `WEEKS` trong report-mock-data */
const ALL_WEEKS = [...WEEKS_26, ...WEEKS_25] as const

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

function yearFromWeekLabel(week: string): number {
  return 2000 + Number(week.slice(-2))
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

/** Sinh `count` cặp SL + CP, phân bổ đều theo tuần (và luân phiên chi nhánh). */
export function createMockRecords(count: number): {
  slRecords: SLRecord[]
  cpRecords: CPRecord[]
} {
  const slRecords: SLRecord[] = []
  const cpRecords: CPRecord[] = []

  const weekCount = ALL_WEEKS.length
  const basePerWeek = Math.floor(count / weekCount)
  const extraWeekSlots = count % weekCount

  let index = 0
  for (let w = 0; w < weekCount; w++) {
    const week = ALL_WEEKS[w]
    const year = yearFromWeekLabel(week)
    const rowsThisWeek = basePerWeek + (w < extraWeekSlots ? 1 : 0)

    for (let j = 0; j < rowsThisWeek; j++) {
      const branch = BRANCHES[j % BRANCHES.length]
      const sl = buildSlRecord(index, 'week', year, branch, week)
      slRecords.push(sl)
      cpRecords.push(buildCpRecord(index, sl))
      index++
    }
  }

  pinDefaultFilterSamples(slRecords, cpRecords)

  return { slRecords, cpRecords }
}
