'use client'

import { BarChart3, Download, Settings } from 'lucide-react'
import { Button } from '@heroui/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { EfficiencyFormula } from '@/lib/mock-data'
import { getEfficiencyFormulaLabel } from '@/lib/mock-data'

interface DashboardHeaderProps {
  onExport: () => void
  formula: EfficiencyFormula
  setFormula: (formula: EfficiencyFormula) => void
  canViewFinancial: boolean
}

export function DashboardHeader({ onExport, formula, setFormula, canViewFinancial }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-medium leading-tight tracking-tight text-foreground">
                Quan Sát Sản Lượng - Doanh Thu - Hiệu Quả
              </h1>
        
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Select value={formula} onValueChange={(value) => setFormula(value as EfficiencyFormula)}>
              <SelectTrigger className="min-h-11 w-[min(100%,220px)]">
                <SelectValue placeholder="Cấu hình hiệu quả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{getEfficiencyFormulaLabel('none')}</SelectItem>
                <SelectItem value="profit">{getEfficiencyFormulaLabel('profit')}</SelectItem>
                <SelectItem value="ratio">{getEfficiencyFormulaLabel('ratio')}</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" variant="primary" size="lg" className="min-h-11" onPress={onExport}>
              <Download className="size-4" />
              Xuất dữ liệu
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              isIconOnly
              className="min-h-11 min-w-11"
              isDisabled={!canViewFinancial}
              aria-label={canViewFinancial ? 'Có quyền tài chính' : 'Không có quyền tài chính'}
            >
              <Settings className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
