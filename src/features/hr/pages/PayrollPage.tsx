import { useState } from 'react'
import { Play, Download } from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { PayrollStatCards }       from '../components/payroll/PayrollStatCards'
import { PayrollBreakdownChart }  from '../components/payroll/PayrollBreakdownChart'
import { PayrollTable }           from '../components/payroll/PayrollTable'
import { PayrollHistory }         from '../components/payroll/PayrollHistory'
import type { PayrollStatus }     from '../types/payroll.types'

const STATUS_BADGE: Record<PayrollStatus, string> = {
  Draft:      'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Finalized:  'bg-green-500/12 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  Processing: 'bg-blue-100 text-blue-700',
}

export default function PayrollPage() {
  const [period, setPeriod]             = useState('may-2025')
  const [payrollStatus]                 = useState<PayrollStatus>('Draft')

  return (
    <div className="min-h-full bg-card">

      {/* Page header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-8 h-14 border-b bg-card border-border"
      >
        <h1 className="text-lg font-semibold text-foreground">Payroll</h1>

        <div className="flex items-center gap-2.5">
          {/* Period selector */}
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[148px] h-9 text-sm border-border bg-card text-foreground cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="may-2025">May 2025</SelectItem>
              <SelectItem value="apr-2025">April 2025</SelectItem>
              <SelectItem value="mar-2025">March 2025</SelectItem>
              <SelectItem value="feb-2025">February 2025</SelectItem>
              <SelectItem value="jan-2025">January 2025</SelectItem>
            </SelectContent>
          </Select>

          {/* Status pill */}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_BADGE[payrollStatus]}`}>
            {payrollStatus}
          </span>

          {/* Run Payroll */}
          <button
            type="button"
            disabled={payrollStatus !== 'Draft'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5" />
            Run Payroll
          </button>

          {/* Export Payslips */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Payslips
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-8 space-y-6">
        <PayrollStatCards />
        <PayrollBreakdownChart />
        <PayrollTable />
        <PayrollHistory />
      </main>

    </div>
  )
}
