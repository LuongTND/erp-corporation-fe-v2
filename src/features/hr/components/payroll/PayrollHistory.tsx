import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import type { PayrollRun, PayrollStatus } from '../../types/payroll.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const HISTORY: PayrollRun[] = [
  {
    id: 'PR-2025-04',
    period: 'April 2025',
    totalEmployees: 134,
    totalNetPay: 242_500_000,
    runBy: 'Nguyễn T. Hoa',
    runDate: '30 Apr 2025',
    status: 'Finalized',
  },
  {
    id: 'PR-2025-03',
    period: 'March 2025',
    totalEmployees: 132,
    totalNetPay: 238_000_000,
    runBy: 'Nguyễn T. Hoa',
    runDate: '28 Mar 2025',
    status: 'Finalized',
  },
  {
    id: 'PR-2025-02',
    period: 'February 2025',
    totalEmployees: 131,
    totalNetPay: 235_000_000,
    runBy: 'Trần V. Minh',
    runDate: '28 Feb 2025',
    status: 'Finalized',
  },
  {
    id: 'PR-2025-01',
    period: 'January 2025',
    totalEmployees: 131,
    totalNetPay: 233_000_000,
    runBy: 'Trần V. Minh',
    runDate: '29 Jan 2025',
    status: 'Finalized',
  },
]

const STATUS_BADGE: Record<PayrollStatus, string> = {
  Draft:      'bg-[#e8a55a]/10 text-[#9a6b2a]',
  Finalized:  'bg-[#5db872]/10 text-[#2d7a40]',
  Processing: 'bg-blue-100 text-blue-700',
}

const fmtM = (n: number) => `₫${(n / 1_000_000).toFixed(1)}M`

// ─── Component ────────────────────────────────────────────────────────────────

export function PayrollHistory() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-[#141413] mb-4">Previous Payroll Runs</h3>

      <Table>
        <TableHeader>
          <TableRow className="border-[#f0ebe3]">
            <TableHead className="text-xs font-medium text-[#8e8b82]">Period</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Employees</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Total Net Pay</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Run By</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Run Date</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Status</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {HISTORY.map((run, idx) => (
            <TableRow key={run.id} className="border-[#f0ebe3]">
              <TableCell className="text-sm font-medium text-[#3d3d3a]">{run.period}</TableCell>
              <TableCell className="text-sm text-[#6c6a64]">{run.totalEmployees}</TableCell>
              <TableCell className="font-mono text-sm text-[#3d3d3a]">{fmtM(run.totalNetPay)}</TableCell>
              <TableCell className="text-sm text-[#6c6a64]">{run.runBy}</TableCell>
              <TableCell className="text-sm text-[#6c6a64]">{run.runDate}</TableCell>
              <TableCell>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[run.status]}`}>
                  {run.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="text-xs font-medium text-[#cc785c] hover:underline cursor-pointer"
                  >
                    View Details
                  </button>
                  {idx === 0 && (
                    <button
                      type="button"
                      className="text-xs text-[#6c6a64] hover:text-[#3d3d3a] transition-colors cursor-pointer"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
