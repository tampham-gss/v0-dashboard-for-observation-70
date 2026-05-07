'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { regions, hubs, getDashboardFilterOptions } from '@/lib/mock-data'
import type { FilterPeriod } from '@/lib/mock-data'

interface FilterBarProps {
  period: FilterPeriod
  setPeriod: (period: FilterPeriod) => void
  selectedRegion: string
  setSelectedRegion: (region: string) => void
  selectedHub: string
  setSelectedHub: (hub: string) => void
  selectedCustomer: string
  setSelectedCustomer: (customer: string) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
  selectedWarehouse: string
  setSelectedWarehouse: (warehouse: string) => void
  selectedRoute: string
  setSelectedRoute: (route: string) => void
  selectedPersonnel: string
  setSelectedPersonnel: (personnel: string) => void
  selectedCsOps: string
  setSelectedCsOps: (csOps: string) => void
  canResetFilters: boolean
  onResetFilters: () => void
}

export function FilterBar({
  period,
  setPeriod,
  selectedRegion,
  setSelectedRegion,
  selectedHub,
  setSelectedHub,
  selectedCustomer,
  setSelectedCustomer,
  selectedStatus,
  setSelectedStatus,
  selectedWarehouse,
  setSelectedWarehouse,
  selectedRoute,
  setSelectedRoute,
  selectedPersonnel,
  setSelectedPersonnel,
  selectedCsOps,
  setSelectedCsOps,
  canResetFilters,
  onResetFilters,
}: FilterBarProps) {
  const options = getDashboardFilterOptions()
  const labelClassName = 'text-sm font-medium text-muted-foreground whitespace-nowrap w-[92px] text-right'
  const fieldClassName = 'grid grid-cols-[92px_minmax(0,1fr)] items-center gap-2'
  const triggerClassName = 'w-full h-9 min-w-0'
  const filteredHubs = selectedRegion === 'all' 
    ? options.hubNames
    : hubs.filter(h => h.regionId === selectedRegion).map((h) => h.name)

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="mb-4 flex justify-end">
          <Button
            variant="outline"
            onClick={onResetFilters}
            disabled={!canResetFilters}
            className="h-9 px-4"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Đặt lại bộ lọc
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <div className={fieldClassName}>
            <label className={labelClassName}>Kỳ:</label>
            <Select value={period} onValueChange={(v) => setPeriod(v as FilterPeriod)}>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder="Chọn kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Theo ngày</SelectItem>
                <SelectItem value="week">Theo tuần</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
                <SelectItem value="quarter">Theo quý</SelectItem>
                <SelectItem value="year">Theo năm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={fieldClassName}>
            <label className={labelClassName}>Khu vực:</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder="Tất cả khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khu vực</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={fieldClassName}>
            <label className={labelClassName}>Hub:</label>
            <Select value={selectedHub} onValueChange={setSelectedHub}>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder="Tất cả Hub" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả Hub</SelectItem>
                {filteredHubs.map((hubName) => (
                  <SelectItem key={hubName} value={hubName}>
                    {hubName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={fieldClassName}>
            <label className={labelClassName}>Khách hàng:</label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder="Tất cả khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khách hàng</SelectItem>
                {options.customerNames.map((customerName) => (
                  <SelectItem key={customerName} value={customerName}>
                    {customerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={fieldClassName}>
            <label className={labelClassName}>Trạng thái:</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="da_chot">Đã chốt</SelectItem>
                <SelectItem value="cho_duyet">Chờ duyệt</SelectItem>
                <SelectItem value="dang_xu_ly">Đang xử lý</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={fieldClassName}>
            <label className={labelClassName}>Kho:</label>
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder="Tất cả kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kho</SelectItem>
                {options.warehouses.map((warehouse) => (
                  <SelectItem key={warehouse} value={warehouse}>
                    {warehouse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={fieldClassName}>
            <label className={labelClassName}>Tuyến:</label>
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder="Tất cả tuyến" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tuyến</SelectItem>
                {options.routes.map((route) => (
                  <SelectItem key={route} value={route}>
                    {route}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={fieldClassName}>
            <label className={labelClassName}>Nhân sự:</label>
            <Select value={selectedPersonnel} onValueChange={setSelectedPersonnel}>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder="Tất cả nhân sự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nhân sự</SelectItem>
                {options.personnel.map((person) => (
                  <SelectItem key={person} value={person}>
                    {person}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={fieldClassName}>
            <label className={labelClassName}>CS/OPS:</label>
            <Select value={selectedCsOps} onValueChange={setSelectedCsOps}>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder="Tất cả CS/OPS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả CS/OPS</SelectItem>
                {options.csOps.map((ops) => (
                  <SelectItem key={ops} value={ops}>
                    {ops}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
