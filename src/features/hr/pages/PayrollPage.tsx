import { useState } from 'react'
import { Play, Download } from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { PayrollStatCards }       from '../components/PayrollPage/PayrollStatCards'
import { PayrollBreakdownChart }  from '../components/PayrollPage/PayrollBreakdownChart'
import { PayrollTable }           from '../components/PayrollPage/PayrollTable'
import { PayrollHistory }         from '../components/PayrollPage/PayrollHistory'
import type { PayrollStatus }     from '../types/payroll.types'

const STATUS_BADGE: Record<PayrollStatus, string> = {
  Draft:      'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Finalized:  'bg-green-500/12 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  Processing: 'bg-blue-100 text-blue-700',
}

const STATUS_LABELS: Record<PayrollStatus, string> = {
  Draft:      'Nháp',
  Finalized:  'Đã hoàn tất',
  Processing: 'Đang xử lý',
}

export default function PayrollPage() {
  const [period, setPeriod]             = useState('may-2025')
  const [payrollStatus]                 = useState<PayrollStatus>('Draft')

  return (
    <div className="h-full flex flex-col bg-background text-foreground">

      {/* Page header */}
      <header
        className="shrink-0 sticky top-0 z-10 flex items-center justify-between px-8 h-14 border-b bg-card border-border"
      >
        <h1 className="text-lg font-semibold text-foreground">Bảng lương</h1>

        <div className="flex items-center gap-2.5">
          {/* Period selector */}
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[148px] h-9 text-sm border-border bg-card text-foreground cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="may-2025">Tháng 5/2025</SelectItem>
              <SelectItem value="apr-2025">Tháng 4/2025</SelectItem>
              <SelectItem value="mar-2025">Tháng 3/2025</SelectItem>
              <SelectItem value="feb-2025">Tháng 2/2025</SelectItem>
              <SelectItem value="jan-2025">Tháng 1/2025</SelectItem>
            </SelectContent>
          </Select>

          {/* Status pill */}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_BADGE[payrollStatus]}`}>
            {STATUS_LABELS[payrollStatus]}
          </span>

          {/* Run Payroll */}
          <button
            type="button"
            disabled={payrollStatus !== 'Draft'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5" />
            Chạy bảng lương
          </button>

          {/* Export Payslips */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Xuất phiếu lương
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="shrink-0"><PayrollStatCards /></div>
        <div className="shrink-0"><PayrollBreakdownChart /></div>
        <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
          <PayrollTable />
        </div>
        <div className="shrink-0"><PayrollHistory /></div>
      </div>

    </div>
  )
}
