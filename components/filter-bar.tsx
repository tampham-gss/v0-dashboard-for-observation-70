'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { regions, hubs, customers } from '@/lib/mock-data'
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
}: FilterBarProps) {
  const filteredHubs = selectedRegion === 'all' 
    ? hubs 
    : hubs.filter(h => h.regionId === selectedRegion)

  const filteredCustomers = selectedRegion === 'all'
    ? customers
    : customers.filter(c => c.regionId === selectedRegion)

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Kỳ:</label>
            <Select value={period} onValueChange={(v) => setPeriod(v as FilterPeriod)}>
              <SelectTrigger className="w-[140px]">
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

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Khu vực:</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-[180px]">
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

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Hub:</label>
            <Select value={selectedHub} onValueChange={setSelectedHub}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tất cả Hub" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả Hub</SelectItem>
                {filteredHubs.map((hub) => (
                  <SelectItem key={hub.id} value={hub.id}>
                    {hub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Khách hàng:</label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Tất cả khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khách hàng</SelectItem>
                {filteredCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Trạng thái:</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px]">
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
        </div>
      </CardContent>
    </Card>
  )
}
