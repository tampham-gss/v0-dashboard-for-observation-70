'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { FilterBar } from '@/components/filter-bar'
import { KPICards } from '@/components/kpi-cards'
import { TrendChart } from '@/components/trend-chart'
import { RankingTable } from '@/components/ranking-table'
import { DetailView } from '@/components/detail-view'
import { ExportDialog } from '@/components/export-dialog'
import { computeDashboardData } from '@/lib/mock-data'
import type { FilterPeriod, ViewMode, RegionData, HubData, CustomerData, EfficiencyFormula } from '@/lib/mock-data'

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [period, setPeriod] = useState<FilterPeriod>('month')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedHub, setSelectedHub] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all')
  const [selectedRoute, setSelectedRoute] = useState<string>('all')
  const [selectedPersonnel, setSelectedPersonnel] = useState<string>('all')
  const [selectedCsOps, setSelectedCsOps] = useState<string>('all')
  const [formula, setFormula] = useState<EfficiencyFormula>('profit')
  const [canViewFinancial] = useState<boolean>(true)
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
    setTimeout(() => setIsLoading(false), 150)
  }

  const handleResetFilters = () => {
    setPeriod('month')
    setSelectedRegion('all')
    setSelectedHub('all')
    setSelectedCustomer('all')
    setSelectedStatus('all')
    setSelectedWarehouse('all')
    setSelectedRoute('all')
    setSelectedPersonnel('all')
    setSelectedCsOps('all')
    handleFilterChange()
  }

  const filters = {
    period,
    region: selectedRegion,
    hub: selectedHub,
    customer: selectedCustomer,
    status: selectedStatus,
    warehouse: selectedWarehouse,
    route: selectedRoute,
    personnel: selectedPersonnel,
    csOps: selectedCsOps,
  }
  const canResetFilters =
    period !== 'month' ||
    selectedRegion !== 'all' ||
    selectedHub !== 'all' ||
    selectedCustomer !== 'all' ||
    selectedStatus !== 'all' ||
    selectedWarehouse !== 'all' ||
    selectedRoute !== 'all' ||
    selectedPersonnel !== 'all' ||
    selectedCsOps !== 'all'

  const computed = computeDashboardData(filters, formula)
  const rankingData = computed.rankings

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onExport={() => setShowExport(true)}
        formula={formula}
        setFormula={setFormula}
        canViewFinancial={canViewFinancial}
      />
      
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
          selectedWarehouse={selectedWarehouse}
          setSelectedWarehouse={(w) => { setSelectedWarehouse(w); handleFilterChange() }}
          selectedRoute={selectedRoute}
          setSelectedRoute={(r) => { setSelectedRoute(r); handleFilterChange() }}
          selectedPersonnel={selectedPersonnel}
          setSelectedPersonnel={(p) => { setSelectedPersonnel(p); handleFilterChange() }}
          selectedCsOps={selectedCsOps}
          setSelectedCsOps={(c) => { setSelectedCsOps(c); handleFilterChange() }}
          canResetFilters={canResetFilters}
          onResetFilters={handleResetFilters}
        />

        {viewMode === 'overview' ? (
          <div className="space-y-6">
            <KPICards
              isLoading={isLoading}
              kpi={computed.kpi}
              formula={formula}
              canViewFinancial={canViewFinancial}
              hasNegativeData={computed.anomalies.negativeCostCount > 0 || computed.anomalies.negativeRevenueCount > 0}
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TrendChart 
                period={period} 
                isLoading={isLoading}
                data={computed.trend}
                formula={formula}
                canViewFinancial={canViewFinancial}
              />
              <RankingTable
                type="region"
                isLoading={isLoading}
                data={rankingData.region}
                formula={formula}
                canViewFinancial={canViewFinancial}
                onDrillDown={(item) => handleDrillDown('region', item)}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <RankingTable
                type="hub"
                isLoading={isLoading}
                data={rankingData.hub}
                formula={formula}
                canViewFinancial={canViewFinancial}
                onDrillDown={(item) => handleDrillDown('hub', item)}
              />
              <RankingTable
                type="customer"
                isLoading={isLoading}
                data={rankingData.customer}
                formula={formula}
                canViewFinancial={canViewFinancial}
                onDrillDown={(item) => handleDrillDown('customer', item)}
              />
            </div>
          </div>
        ) : (
          <DetailView
            type={detailType!}
            item={detailItem!}
            period={period}
            formula={formula}
            canViewFinancial={canViewFinancial}
            orders={computed.orders}
            onBack={handleBackToOverview}
          />
        )}
      </main>

      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        filters={{
          ...filters,
        }}
        orders={computed.orders}
        formula={formula}
        canViewFinancial={canViewFinancial}
      />
    </div>
  )
}
