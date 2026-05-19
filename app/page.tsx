'use client'

import { useMemo, useState } from 'react'
import { toast, useOverlayState } from '@heroui/react'
import { getBcScopedData } from '@/lib/bc-report'
import {
  DEFAULT_FILTERS,
  appliedFiltersCaption,
  type CPRecord,
  type ReportFilters,
  type SLRecord,
} from '@/lib/report-mock-data'
import { syncFiltersForTab } from '@/lib/report-filter-config'
import { ReportFilterPanel } from '@/components/report/report-filter-panel'
import { ReportHeaderActions, ReportPageHeader } from '@/components/report/report-page-header'
import { ReportLayout } from '@/components/report/report-layout'
import { ReportNoticeBanner } from '@/components/report/report-notice-banner'
import type { ReportSectionTabId } from '@/components/report/report-section-tabs'
import { ReportSectionTabBar } from '@/components/report/report-section-tab-bar'
import { OverviewTab } from '@/components/report/overview-tab'
import { SLTab } from '@/components/report/sl-tab'
import { BcTab } from '@/components/report/bc-tab'
import { CPTab } from '@/components/report/cp-tab'
import { SLDetailModal } from '@/components/report/sl-detail-modal'
import { CPDetailModal } from '@/components/report/cp-detail-modal'
import { ReportExportDialog } from '@/components/report/report-export-dialog'

export default function ReportPage() {
  const [draftFilters, setDraftFilters] = useState<ReportFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(DEFAULT_FILTERS)
  const [activeTab, setActiveTab] = useState<ReportSectionTabId>('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [slDetail, setSlDetail] = useState<SLRecord | null>(null)
  const [cpDetail, setCpDetail] = useState<CPRecord | null>(null)

  const slModalState = useOverlayState()
  const cpModalState = useOverlayState()
  const exportModalState = useOverlayState()

  const { slRows, cpRows, sourceSheet } = useMemo(
    () => getBcScopedData(appliedFilters),
    [appliedFilters],
  )

  const runLoading = (fn: () => void) => {
    setIsLoading(true)
    fn()
    window.setTimeout(() => setIsLoading(false), 200)
  }

  const handleSearch = () => {
    runLoading(() => setAppliedFilters(syncFiltersForTab(draftFilters, activeTab)))
  }

  const handleRefresh = () => {
    runLoading(() => {
      const reset = syncFiltersForTab({ ...DEFAULT_FILTERS }, activeTab)
      setDraftFilters(reset)
      setAppliedFilters(reset)
    })
  }

  const handleExportConfirm = (type: 'week' | 'month') => {
    toast.success(
      `Đã mô phỏng xuất ${type === 'week' ? 'BC tuần' : 'BC tháng'} theo bộ lọc hiện tại.`,
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

  const subtitle = appliedFiltersCaption(appliedFilters, {
    showBcWeekMonth: activeTab === 'bcWeek',
  })

  return (
    <ReportLayout>
      <ReportPageHeader
        title="Báo cáo sản lượng & chi phí kiểm đếm"
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
          setDraftFilters(syncFiltersForTab(draftFilters, tab))
          setAppliedFilters(syncFiltersForTab(appliedFilters, tab))
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
          sourceSheet={sourceSheet}
          appliedFilters={appliedFilters}
          isLoading={isLoading}
        />
      )}
      {activeTab === 'bcWeek' && (
        <BcTab
          periodType="week"
          title="BC tuần"
          appliedFilters={appliedFilters}
          isLoading={isLoading}
          onViewSl={openSLDetail}
          onViewCp={openCPDetail}
        />
      )}
      {activeTab === 'bcMonth' && (
        <BcTab
          periodType="month"
          title="BC tháng"
          appliedFilters={appliedFilters}
          isLoading={isLoading}
          onViewSl={openSLDetail}
          onViewCp={openCPDetail}
        />
      )}
      {activeTab === 'sl' && (
        <SLTab
          rows={slRows}
          sourceSheet={sourceSheet}
          appliedFilters={appliedFilters}
          isLoading={isLoading}
          onViewDetail={openSLDetail}
        />
      )}
      {activeTab === 'cp' && (
        <CPTab
          rows={cpRows}
          slRows={slRows}
          sourceSheet={sourceSheet}
          appliedFilters={appliedFilters}
          isLoading={isLoading}
          onViewDetail={openCPDetail}
        />
      )}

      <SLDetailModal state={slModalState} record={slDetail} />
      <CPDetailModal state={cpModalState} record={cpDetail} />
      <ReportExportDialog
        state={exportModalState}
        filters={appliedFilters}
        onConfirm={handleExportConfirm}
      />
    </ReportLayout>
  )
}
