import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Download, Pencil, TrendingUp } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { PayrollRecord } from '../../types/employee.types'
import type { SalaryRecord, SetSalaryPayload } from '../../types/salary.types'
import { CustomTooltip, SetSalaryForm } from './Payroll'

const PAYROLL_RECORDS: PayrollRecord[] = [
  { month: 'Th5/2025', gross: 22_000_000, deductions: 2_640_000, netPay: 19_360_000, status: 'Processing' },
  { month: 'Th4/2025', gross: 22_000_000, deductions: 2_640_000, netPay: 19_360_000, status: 'Paid' },
  { month: 'Th3/2025', gross: 22_000_000, deductions: 2_640_000, netPay: 19_360_000, status: 'Paid' },
  { month: 'Th2/2025', gross: 20_000_000, deductions: 2_400_000, netPay: 17_600_000, status: 'Paid' },
  { month: 'Th1/2025', gross: 20_000_000, deductions: 2_400_000, netPay: 17_600_000, status: 'Paid' },
  { month: 'Th12/2024', gross: 24_000_000, deductions: 2_880_000, netPay: 21_120_000, status: 'Paid' },
]

function formatVND(amount: number) {
  return `₫${(amount / 1_000_000).toFixed(1)}M`
}

function formatHourlyRate(rate: number) {
  return rate.toLocaleString('vi-VN')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN')
}

const chartData = PAYROLL_RECORDS.slice().reverse().map((r) => ({
  month: r.month.replace('Th', 'T'),
  Gross: +(r.gross / 1_000_000).toFixed(1),
  Net: +(r.netPay / 1_000_000).toFixed(1),
}))

interface PayrollTabProps {
  current: SalaryRecord | undefined
  loadingCurrent: boolean
  history: SalaryRecord[] | undefined
  onSetSalary: (payload: SetSalaryPayload, callbacks: { onSuccess: () => void }) => void
  isPendingSalary: boolean
}

export function PayrollTab({ current, loadingCurrent, history, onSetSalary, isPendingSalary }: PayrollTabProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-4">

      {/* Current salary */}
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Mức lương hiện tại</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs"
            onClick={() => setShowForm(v => !v)}
          >
            <Pencil className="h-3 w-3" />
            {showForm ? 'Hủy' : 'Cập nhật'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          {showForm && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <SetSalaryForm onClose={() => setShowForm(false)} onSetSalary={onSetSalary} isPendingSalary={isPendingSalary} />
            </div>
          )}
          {loadingCurrent ? (
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          ) : current ? (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums text-foreground">
                ₫{formatHourlyRate(current.hourlyRate)}
              </span>
              <span className="text-xs text-muted-foreground">/ giờ</span>
              <span className="ml-1 text-xs text-muted-foreground">· từ {formatDate(current.effectiveFrom)}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu lương.</p>
          )}
        </CardContent>
      </Card>

      {/* Salary history */}
      {history && history.length > 0 && (
        <Card className="shadow-none">
          <CardHeader className="pb-0 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lịch sử điều chỉnh lương</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {['Hiệu lực từ', 'Hiệu lực đến', 'Lương/giờ', 'Lý do'].map((h) => (
                    <TableHead key={h} className="px-6 text-xs font-medium text-muted-foreground">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/40">
                    <TableCell className="px-6 text-sm tabular-nums">{formatDate(r.effectiveFrom)}</TableCell>
                    <TableCell className="px-6 text-sm tabular-nums text-muted-foreground">
                      {r.effectiveTo
                        ? formatDate(r.effectiveTo)
                        : <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-xs font-normal text-green-600 dark:text-green-400">Đang hiệu lực</Badge>}
                    </TableCell>
                    <TableCell className="px-6 font-mono text-sm tabular-nums">
                      ₫{formatHourlyRate(r.hourlyRate)}
                    </TableCell>
                    <TableCell className="px-6 text-sm text-muted-foreground">{r.reason ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center gap-2 pb-4 pt-4">
          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
          <CardTitle className="text-sm font-medium text-muted-foreground">Gross vs Net — 6 tháng</CardTitle>
        </CardHeader>
        <CardContent className="pb-4 pl-2 pr-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={3} barCategoryGap="35%">
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
                tickFormatter={(v) => `${v}M`}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} />
              <Bar dataKey="Gross" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Net" fill="#22c55e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-sm bg-primary" /> Gross
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-sm bg-green-500" /> Net
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Payslip table */}
      <Card className="shadow-none">
        <CardHeader className="pb-0 pt-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Lịch sử phiếu lương</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {['Tháng', 'Gross', 'Khấu trừ', 'Thực lĩnh', 'Trạng thái', ''].map((h, i) => (
                  <TableHead key={i} className="px-6 text-xs font-medium text-muted-foreground">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYROLL_RECORDS.map((record) => (
                <TableRow key={record.month} className="hover:bg-muted/40">
                  <TableCell className="px-6 text-sm font-medium">{record.month}</TableCell>
                  <TableCell className="px-6 font-mono text-sm tabular-nums text-muted-foreground">{formatVND(record.gross)}</TableCell>
                  <TableCell className="px-6 font-mono text-sm tabular-nums text-muted-foreground">{formatVND(record.deductions)}</TableCell>
                  <TableCell className="px-6 font-mono text-sm font-medium tabular-nums">{formatVND(record.netPay)}</TableCell>
                  <TableCell className="px-6">
                    {record.status === 'Paid' ? (
                      <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-xs font-normal text-green-600 dark:text-green-400">
                        Đã thanh toán
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-xs font-normal text-amber-600 dark:text-amber-400">
                        Đang xử lý
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6">
                    {record.status === 'Paid' ? (
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Download className="h-3 w-3" />
                        PDF
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator />
        </CardContent>
      </Card>

    </div>
  )
}
