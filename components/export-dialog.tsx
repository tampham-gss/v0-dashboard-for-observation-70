'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { FilterPeriod } from '@/lib/mock-data'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: {
    period: FilterPeriod
    region: string
    hub: string
    customer: string
    status: string
  }
}

const periodLabels: Record<FilterPeriod, string> = {
  day: 'Theo ngày',
  week: 'Theo tuần',
  month: 'Theo tháng',
  quarter: 'Theo quý',
  year: 'Theo năm',
}

export function ExportDialog({ open, onOpenChange, filters }: ExportDialogProps) {
  const [exportOptions, setExportOptions] = useState({
    sanLuong: true,
    doanhThu: true,
    chiPhi: true,
    hieuQua: true,
    chiTiet: false,
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsExporting(false)
    setExportComplete(true)
    
    // Reset after showing success
    setTimeout(() => {
      setExportComplete(false)
      onOpenChange(false)
    }, 2000)
  }

  const handleClose = () => {
    if (!isExporting) {
      setExportComplete(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Xuất Dữ Liệu Báo Cáo
          </DialogTitle>
          <DialogDescription>
            Xuất dữ liệu sản lượng, doanh thu và hiệu quả theo bộ lọc hiện tại
          </DialogDescription>
        </DialogHeader>

        {exportComplete ? (
          <div className="py-8 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10 mb-4">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Xuất dữ liệu thành công!</h3>
            <p className="text-sm text-muted-foreground">
              File báo cáo đã được tải xuống máy tính của bạn.
            </p>
          </div>
        ) : (
          <>
            {/* Current Filters Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium mb-2">Bộ lọc hiện tại:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Kỳ:</span>{' '}
                  <span className="font-medium">{periodLabels[filters.period]}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Khu vực:</span>{' '}
                  <span className="font-medium">{filters.region === 'all' ? 'Tất cả' : filters.region}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Hub:</span>{' '}
                  <span className="font-medium">{filters.hub === 'all' ? 'Tất cả' : filters.hub}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Khách hàng:</span>{' '}
                  <span className="font-medium">{filters.customer === 'all' ? 'Tất cả' : filters.customer}</span>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Chọn dữ liệu xuất:</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sanLuong"
                    checked={exportOptions.sanLuong}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, sanLuong: !!checked }))
                    }
                  />
                  <Label htmlFor="sanLuong" className="text-sm font-normal">
                    Sản lượng (số công/container)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="doanhThu"
                    checked={exportOptions.doanhThu}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, doanhThu: !!checked }))
                    }
                  />
                  <Label htmlFor="doanhThu" className="text-sm font-normal">
                    Doanh thu (bao gồm nguồn dữ liệu)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="chiPhi"
                    checked={exportOptions.chiPhi}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, chiPhi: !!checked }))
                    }
                  />
                  <Label htmlFor="chiPhi" className="text-sm font-normal">
                    Chi phí vận hành (lương, tiền ăn, tăng ca, di chuyển)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hieuQua"
                    checked={exportOptions.hieuQua}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, hieuQua: !!checked }))
                    }
                  />
                  <Label htmlFor="hieuQua" className="text-sm font-normal">
                    Hiệu quả tổng hợp (bao gồm trạng thái chốt)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="chiTiet"
                    checked={exportOptions.chiTiet}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, chiTiet: !!checked }))
                    }
                  />
                  <Label htmlFor="chiTiet" className="text-sm font-normal">
                    Chi tiết lệnh kiểm đếm (nhân sự, kho, tuyến, container)
                  </Label>
                </div>
              </div>
            </div>

            {/* Warning about data sources */}
            <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                File xuất sẽ thể hiện rõ nguồn dữ liệu doanh thu, chi phí và trạng thái chốt để phục vụ đối chiếu. 
                Các khu vực chưa có dữ liệu doanh thu sẽ được đánh dấu &ldquo;Chưa có dữ liệu&rdquo;.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isExporting}>
                Hủy
              </Button>
              <Button onClick={handleExport} disabled={isExporting}>
                {isExporting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Xuất Excel
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
