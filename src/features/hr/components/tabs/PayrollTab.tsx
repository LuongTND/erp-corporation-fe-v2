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
  { month: 'Th5/2025', gross: 22_000_000, deductions: 2_640_000, netPay: 19_360_000, status: 'Processing' },
  { month: 'Th4/2025', gross: 22_000_000, deductions: 2_640_000, netPay: 19_360_000, status: 'Paid' },
  { month: 'Th3/2025', gross: 22_000_000, deductions: 2_640_000, netPay: 19_360_000, status: 'Paid' },
  { month: 'Th2/2025', gross: 20_000_000, deductions: 2_400_000, netPay: 17_600_000, status: 'Paid' },
  { month: 'Th1/2025', gross: 20_000_000, deductions: 2_400_000, netPay: 17_600_000, status: 'Paid' },
  { month: 'Th12/2024', gross: 24_000_000, deductions: 2_880_000, netPay: 21_120_000, status: 'Paid' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatVND(amount: number) {
  return `₫${(amount / 1_000_000).toFixed(1)}M`
}

const STATUS_VI: Record<PayrollStatus, string> = { Paid: 'Đã thanh toán', Processing: 'Đang xử lý' }

const STATUS_BADGE: Record<PayrollStatus, string> = {
  Paid:       'bg-green-500/12 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  Processing: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
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
    <div className="bg-card rounded-lg shadow-lg border border-border px-3 py-2 min-w-[130px]">
      <p className="text-xs font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-xs text-muted-foreground">{p.name}</span>
          </div>
          <span className="text-xs font-medium text-foreground">₫{p.value}M</span>
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
      <div className="bg-card rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-foreground mb-5">6 tháng gần đây — Gross vs Net</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₫${v}M`}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            />
            <Bar dataKey="Gross" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Net"   fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payslip table */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Lịch sử phiếu lương</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-card hover:bg-card">
              {['Tháng', 'Gross', 'Khấu trừ', 'Thực lĩnh', 'Trạng thái', 'Phiếu lương'].map((h) => (
                <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAYROLL_RECORDS.map((record) => (
              <TableRow key={record.month} className="hover:bg-card">
                <TableCell className="text-sm font-medium text-foreground">{record.month}</TableCell>
                <TableCell className="text-sm text-foreground font-mono">{formatVND(record.gross)}</TableCell>
                <TableCell className="text-sm text-foreground font-mono">{formatVND(record.deductions)}</TableCell>
                <TableCell className="text-sm font-semibold text-foreground font-mono">{formatVND(record.netPay)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[record.status]}`}>
                    {STATUS_VI[record.status]}
                  </span>
                </TableCell>
                <TableCell>
                  {record.status === 'Paid' ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Tải PDF
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Đang xử lý</span>
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
