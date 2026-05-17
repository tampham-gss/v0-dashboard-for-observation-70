'use client'

import { useMemo, useState } from 'react'
import { toast, useOverlayState } from '@heroui/react'
import { ReportFilterPanel } from '@/components/report/report-filter-panel'
import { ReportHeaderActions, ReportPageHeader } from '@/components/report/report-page-header'
import { ReportLayout } from '@/components/report/report-layout'
import type { ReportSectionTabId } from '@/components/report/report-section-tabs'
import { ReportSectionTabBar } from '@/components/report/report-section-tab-bar'
import { OverviewTab } from '@/components/report/overview-tab'
import { SLTab } from '@/components/report/sl-tab'
import { CPTab } from '@/components/report/cp-tab'
import { EfficiencyTab } from '@/components/report/efficiency-tab'
import { SLDetailModal } from '@/components/report/sl-detail-modal'
import { CPDetailModal } from '@/components/report/cp-detail-modal'
import { OperationalDetailModal } from '@/components/report/operational-detail-modal'
import { ReportExportDialog } from '@/components/report/report-export-dialog'
import {
  filterOperationalRows,
  getScopedData,
  type EfficiencyRow,
  type OperationalRow,
} from '@/lib/report-dashboard-mock'
import {
  DEFAULT_FILTERS,
  appliedFiltersCaption,
  type CPRecord,
  type ReportFilters,
  type SLRecord,
} from '@/lib/report-mock-data'
import { sanitizeFiltersForTab } from '@/lib/report-filter-config'

const EFFICIENCY_CONFIGURED = true

export default function ReportPage() {
  const [draftFilters, setDraftFilters] = useState<ReportFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(DEFAULT_FILTERS)
  const [activeTab, setActiveTab] = useState<ReportSectionTabId>('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [slDetail, setSlDetail] = useState<SLRecord | null>(null)
  const [cpDetail, setCpDetail] = useState<CPRecord | null>(null)
  const [opDetail, setOpDetail] = useState<OperationalRow | null>(null)

  const slModalState = useOverlayState()
  const cpModalState = useOverlayState()
  const opModalState = useOverlayState()
  const exportModalState = useOverlayState()

  const { slRows, cpRows } = useMemo(() => getScopedData(appliedFilters), [appliedFilters])
  const opRows = useMemo(() => filterOperationalRows(appliedFilters), [appliedFilters])

  const runLoading = (fn: () => void) => {
    setIsLoading(true)
    fn()
    window.setTimeout(() => setIsLoading(false), 200)
  }

  const handleSearch = () => {
    runLoading(() => setAppliedFilters({ ...draftFilters }))
  }

  const handleRefresh = () => {
    runLoading(() => {
      setDraftFilters({ ...DEFAULT_FILTERS })
      setAppliedFilters({ ...DEFAULT_FILTERS })
    })
  }

  const handleExportConfirm = (type: 'week' | 'month') => {
    toast.success(
      `Đã mô phỏng xuất báo cáo ${type === 'week' ? 'tuần' : 'tháng'} (sheet SL + CP) theo bộ lọc.`,
    )
  }

  const openSLDetail = (row: SLRecord) => {
    setSlDetail(row)
    slModalState.open()
  }

  const openCPDetail = (row: CPRecord) => {
    setCpDetail(row)
    cpModalState.open()
  }

  const openOperationalDetail = (row: OperationalRow | EfficiencyRow) => {
    const op = opRows.find((r) => r.id === row.id) ?? null
    setOpDetail(op)
    if (op) opModalState.open()
  }

  const subtitle = appliedFiltersCaption(appliedFilters)

  return (
    <ReportLayout>
      <ReportPageHeader
        title="Quan sát sản lượng, doanh thu, hiệu quả"
        subtitle={subtitle}
        actions={
          <ReportHeaderActions
            onRefresh={handleRefresh}
            onExport={() => exportModalState.open()}
          />
        }
      />

      <ReportSectionTabBar
        value={activeTab}
        onValueChange={(tab) => {
          setActiveTab(tab)
          const nextDraft = sanitizeFiltersForTab(draftFilters, tab)
          const nextApplied = sanitizeFiltersForTab(appliedFilters, tab)
          setDraftFilters(nextDraft)
          setAppliedFilters(nextApplied)
        }}
      />

      <ReportFilterPanel
        activeTab={activeTab}
        filters={draftFilters}
        onChange={setDraftFilters}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onExport={() => exportModalState.open()}
      />

      {activeTab === 'overview' && (
        <OverviewTab
          slRows={slRows}
          cpRows={cpRows}
          opRows={opRows}
          isLoading={isLoading}
          appliedFilters={appliedFilters}
          canViewFinancial
          efficiencyConfigured={EFFICIENCY_CONFIGURED}
        />
      )}
      {activeTab === 'sl' && (
        <SLTab
          rows={slRows}
          opRows={opRows}
          appliedFilters={appliedFilters}
          isLoading={isLoading}
          onViewDetail={openSLDetail}
          onViewOperational={openOperationalDetail}
        />
      )}
      {activeTab === 'cp' && (
        <CPTab
          rows={cpRows}
          slRows={slRows}
          opRows={opRows}
          appliedFilters={appliedFilters}
          isLoading={isLoading}
          canViewFinancial
          onViewDetail={openCPDetail}
          onViewOperational={openOperationalDetail}
        />
      )}
      {activeTab === 'efficiency' && (
        <EfficiencyTab
          opRows={opRows}
          appliedFilters={appliedFilters}
          isLoading={isLoading}
          canViewFinancial
          efficiencyConfigured={EFFICIENCY_CONFIGURED}
          onViewDetail={openOperationalDetail}
        />
      )}

      <SLDetailModal state={slModalState} record={slDetail} />
      <CPDetailModal state={cpModalState} record={cpDetail} />
      <OperationalDetailModal state={opModalState} row={opDetail} />
      <ReportExportDialog
        state={exportModalState}
        filters={appliedFilters}
        onConfirm={handleExportConfirm}
      />
    </ReportLayout>
  )
}
