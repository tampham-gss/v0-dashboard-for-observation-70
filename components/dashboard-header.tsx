'use client'

import { BarChart3, Download, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
  onExport: () => void
}

export function DashboardHeader({ onExport }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight text-foreground">
                Quan Sát Sản Lượng - Doanh Thu - Hiệu Quả
              </h1>
              <p className="text-xs text-muted-foreground">
                STT 70 - Phân hệ Web Kiểm Đếm
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Xuất dữ liệu
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Cài đặt</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
