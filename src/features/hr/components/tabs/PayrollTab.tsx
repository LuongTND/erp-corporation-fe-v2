import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { Download } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import type { PayrollRecord, PayrollStatus } from '../../types/employee.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const PAYROLL_RECORDS: PayrollRecord[] = [
  { month: 'May 2025', gross: 22_000_000, deductions: 2_640_000, netPay: 19_360_000, status: 'Processing' },
  { month: 'Apr 2025', gross: 22_000_000, deductions: 2_640_000, netPay: 19_360_000, status: 'Paid' },
  { month: 'Mar 2025', gross: 22_000_000, deductions: 2_640_000, netPay: 19_360_000, status: 'Paid' },
  { month: 'Feb 2025', gross: 20_000_000, deductions: 2_400_000, netPay: 17_600_000, status: 'Paid' },
  { month: 'Jan 2025', gross: 20_000_000, deductions: 2_400_000, netPay: 17_600_000, status: 'Paid' },
  { month: 'Dec 2024', gross: 24_000_000, deductions: 2_880_000, netPay: 21_120_000, status: 'Paid' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatVND(amount: number) {
  return `₫${(amount / 1_000_000).toFixed(1)}M`
}

const STATUS_BADGE: Record<PayrollStatus, string> = {
  Paid:       'bg-[#5db872]/10 text-[#2d7a40]',
  Processing: 'bg-[#e8a55a]/10 text-[#9a6b2a]',
}

const chartData = PAYROLL_RECORDS.slice().reverse().map((r) => ({
  month:  r.month.split(' ')[0],
  Gross:  +(r.gross   / 1_000_000).toFixed(1),
  Net:    +(r.netPay  / 1_000_000).toFixed(1),
}))

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-[#e6dfd8] px-3 py-2 min-w-[130px]">
      <p className="text-xs font-semibold text-[#141413] mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-xs text-[#6c6a64]">{p.name}</span>
          </div>
          <span className="text-xs font-medium text-[#141413]">₫{p.value}M</span>
        </div>
      ))}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PayrollTab() {
  return (
    <div className="space-y-6">
      {/* Chart card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-[#141413] mb-5">Last 6 Months — Gross vs Net</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e6dfd8" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#6c6a64' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6c6a64' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₫${v}M`}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#6c6a64', paddingTop: 12 }}
            />
            <Bar dataKey="Gross" fill="#cc785c" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Net"   fill="#5db872" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payslip table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e6dfd8]">
          <h3 className="text-sm font-semibold text-[#141413]">Payslip History</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#faf9f5] hover:bg-[#faf9f5]">
              {['Month', 'Gross', 'Deductions', 'Net Pay', 'Status', 'Payslip'].map((h) => (
                <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide text-[#6c6a64]">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAYROLL_RECORDS.map((record) => (
              <TableRow key={record.month} className="hover:bg-[#faf9f5]">
                <TableCell className="text-sm font-medium text-[#141413]">{record.month}</TableCell>
                <TableCell className="text-sm text-[#3d3d3a] font-mono">{formatVND(record.gross)}</TableCell>
                <TableCell className="text-sm text-[#3d3d3a] font-mono">{formatVND(record.deductions)}</TableCell>
                <TableCell className="text-sm font-semibold text-[#141413] font-mono">{formatVND(record.netPay)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[record.status]}`}>
                    {record.status}
                  </span>
                </TableCell>
                <TableCell>
                  {record.status === 'Paid' ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs text-[#cc785c] hover:text-[#a9583e] transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </button>
                  ) : (
                    <span className="text-xs text-[#8e8b82]">Pending</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
