'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { FilterBar } from '@/components/filter-bar'
import { KPICards } from '@/components/kpi-cards'
import { TrendChart } from '@/components/trend-chart'
import { RankingTable } from '@/components/ranking-table'
import { DetailView } from '@/components/detail-view'
import { ExportDialog } from '@/components/export-dialog'
import type { FilterPeriod, ViewMode, RegionData, HubData, CustomerData } from '@/lib/mock-data'

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [period, setPeriod] = useState<FilterPeriod>('month')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedHub, setSelectedHub] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [showExport, setShowExport] = useState(false)

  // Detail view state
  const [detailType, setDetailType] = useState<'region' | 'hub' | 'customer' | null>(null)
  const [detailItem, setDetailItem] = useState<RegionData | HubData | CustomerData | null>(null)

  const handleDrillDown = (type: 'region' | 'hub' | 'customer', item: RegionData | HubData | CustomerData) => {
    setDetailType(type)
    setDetailItem(item)
    setViewMode('detail')
  }

  const handleBackToOverview = () => {
    setViewMode('overview')
    setDetailType(null)
    setDetailItem(null)
  }

  const handleFilterChange = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onExport={() => setShowExport(true)} />
      
      <main className="container mx-auto px-4 py-6">
        <FilterBar
          period={period}
          setPeriod={(p) => { setPeriod(p); handleFilterChange() }}
          selectedRegion={selectedRegion}
          setSelectedRegion={(r) => { setSelectedRegion(r); handleFilterChange() }}
          selectedHub={selectedHub}
          setSelectedHub={(h) => { setSelectedHub(h); handleFilterChange() }}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={(c) => { setSelectedCustomer(c); handleFilterChange() }}
          selectedStatus={selectedStatus}
          setSelectedStatus={(s) => { setSelectedStatus(s); handleFilterChange() }}
        />

        {viewMode === 'overview' ? (
          <div className="space-y-6">
            <KPICards isLoading={isLoading} />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TrendChart 
                period={period} 
                isLoading={isLoading}
              />
              <RankingTable
                type="region"
                isLoading={isLoading}
                onDrillDown={(item) => handleDrillDown('region', item)}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <RankingTable
                type="hub"
                isLoading={isLoading}
                onDrillDown={(item) => handleDrillDown('hub', item)}
              />
              <RankingTable
                type="customer"
                isLoading={isLoading}
                onDrillDown={(item) => handleDrillDown('customer', item)}
              />
            </div>
          </div>
        ) : (
          <DetailView
            type={detailType!}
            item={detailItem!}
            period={period}
            onBack={handleBackToOverview}
          />
        )}
      </main>

      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        filters={{
          period,
          region: selectedRegion,
          hub: selectedHub,
          customer: selectedCustomer,
          status: selectedStatus,
        }}
      />
    </div>
  )
}
