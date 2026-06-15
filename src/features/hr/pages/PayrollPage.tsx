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
  Draft:      'bg-[#e8a55a]/15 text-[#9a6b2a]',
  Finalized:  'bg-[#5db872]/15 text-[#2d7a40]',
  Processing: 'bg-blue-100 text-blue-700',
}

export default function PayrollPage() {
  const [period, setPeriod]             = useState('may-2025')
  const [payrollStatus]                 = useState<PayrollStatus>('Draft')

  return (
    <div className="min-h-full" style={{ backgroundColor: '#faf9f5' }}>

      {/* Page header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-8 h-14 border-b"
        style={{ backgroundColor: '#faf9f5', borderColor: '#e6dfd8' }}
      >
        <h1 className="text-lg font-semibold text-[#141413]">Payroll</h1>

        <div className="flex items-center gap-2.5">
          {/* Period selector */}
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[148px] h-9 text-sm border-[#e6dfd8] bg-white text-[#3d3d3a] cursor-pointer">
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-[#cc785c] text-white hover:bg-[#a9583e] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5" />
            Run Payroll
          </button>

          {/* Export Payslips */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-[#e6dfd8] bg-white text-[#6c6a64] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
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
