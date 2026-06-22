import { useState, useMemo } from 'react'
import { CheckCircle, Clock, AlertCircle, FileText, Search, type LucideIcon } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import type { PayrollEmployee, EmployeePayStatus } from '../../types/payroll.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const EMPLOYEES: PayrollEmployee[] = [
  {
    id: 'EMP-0001', name: 'Nguyễn Văn An', initials: 'NVA',
    department: 'Engineering', position: 'Senior Engineer', bankAccount: '**** **** **** 1234',
    baseSalary: 25_000_000, allowances: 3_000_000, overtime: 1_500_000, bonus: 2_000_000,
    deductions: { socialInsurance: 2_000_000, healthInsurance: 375_000, pit: 1_800_000, other: 0 },
    netPay: 27_325_000, status: 'Paid',
  },
  {
    id: 'EMP-0017', name: 'Trần Thị Bích', initials: 'TTB',
    department: 'Engineering', position: 'Engineer', bankAccount: '**** **** **** 5678',
    baseSalary: 22_000_000, allowances: 2_500_000, overtime: 800_000, bonus: 0,
    deductions: { socialInsurance: 1_760_000, healthInsurance: 330_000, pit: 1_200_000, other: 0 },
    netPay: 22_010_000, status: 'Paid',
  },
  {
    id: 'EMP-0031', name: 'Lê Minh Dũng', initials: 'LMD',
    department: 'Design', position: 'UI/UX Designer', bankAccount: '**** **** **** 9012',
    baseSalary: 20_000_000, allowances: 2_000_000, overtime: 600_000, bonus: 1_000_000,
    deductions: { socialInsurance: 1_600_000, healthInsurance: 300_000, pit: 900_000, other: 0 },
    netPay: 20_800_000, status: 'Pending',
  },
  {
    id: 'EMP-0058', name: 'Phạm Hải Yến', initials: 'PHY',
    department: 'HR', position: 'HR Specialist', bankAccount: '**** **** **** 3456',
    baseSalary: 18_000_000, allowances: 1_800_000, overtime: 0, bonus: 500_000,
    deductions: { socialInsurance: 1_440_000, healthInsurance: 270_000, pit: 700_000, other: 0 },
    netPay: 17_890_000, status: 'Paid',
  },
  {
    id: 'EMP-0044', name: 'Đặng Thị Mai', initials: 'ĐTM',
    department: 'Product', position: 'Product Manager', bankAccount: '**** **** **** 7890',
    baseSalary: 24_000_000, allowances: 2_800_000, overtime: 1_200_000, bonus: 3_000_000,
    deductions: { socialInsurance: 1_920_000, healthInsurance: 360_000, pit: 1_700_000, other: 0 },
    netPay: 27_020_000, status: 'Paid',
  },
  {
    id: 'EMP-0072', name: 'Hoàng Văn Tú', initials: 'HVT',
    department: 'Finance', position: 'Accountant', bankAccount: '**** **** **** 2345',
    baseSalary: 21_000_000, allowances: 2_200_000, overtime: 400_000, bonus: 0,
    deductions: { socialInsurance: 1_680_000, healthInsurance: 315_000, pit: 1_100_000, other: 0 },
    netPay: 20_505_000, status: 'Error',
  },
  {
    id: 'EMP-0089', name: 'Vũ Thị Lan', initials: 'VTL',
    department: 'Design', position: 'Graphic Designer', bankAccount: '**** **** **** 6789',
    baseSalary: 19_000_000, allowances: 1_900_000, overtime: 0, bonus: 500_000,
    deductions: { socialInsurance: 1_520_000, healthInsurance: 285_000, pit: 800_000, other: 0 },
    netPay: 18_795_000, status: 'Paid',
  },
  {
    id: 'EMP-0103', name: 'Bùi Minh Khoa', initials: 'BMK',
    department: 'Engineering', position: 'Senior Engineer', bankAccount: '**** **** **** 0123',
    baseSalary: 26_000_000, allowances: 3_200_000, overtime: 2_000_000, bonus: 2_500_000,
    deductions: { socialInsurance: 2_080_000, healthInsurance: 390_000, pit: 2_200_000, other: 0 },
    netPay: 29_030_000, status: 'Paid',
  },
  {
    id: 'EMP-0118', name: 'Ngô Thị Hương', initials: 'NTH',
    department: 'HR', position: 'Recruiter', bankAccount: '**** **** **** 4567',
    baseSalary: 17_000_000, allowances: 1_700_000, overtime: 0, bonus: 0,
    deductions: { socialInsurance: 1_360_000, healthInsurance: 255_000, pit: 500_000, other: 0 },
    netPay: 16_585_000, status: 'Pending',
  },
  {
    id: 'EMP-0125', name: 'Trịnh Văn Bảo', initials: 'TVB',
    department: 'Product', position: 'Business Analyst', bankAccount: '**** **** **** 8901',
    baseSalary: 23_000_000, allowances: 2_600_000, overtime: 900_000, bonus: 1_500_000,
    deductions: { socialInsurance: 1_840_000, healthInsurance: 345_000, pit: 1_500_000, other: 0 },
    netPay: 24_315_000, status: 'Paid',
  },
]

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<EmployeePayStatus, { bg: string; text: string; Icon: LucideIcon }> = {
  Paid:    { bg: 'bg-green-500/12 dark:bg-green-500/20', text: 'text-green-700 dark:text-green-400', Icon: CheckCircle },
  Pending: { bg: 'bg-amber-500/15', text: 'text-amber-700 dark:text-amber-400', Icon: Clock },
  Error:   { bg: 'bg-destructive/12', text: 'text-destructive', Icon: AlertCircle },
}

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtM = (n: number) => `₫${(n / 1_000_000).toFixed(1)}M`
const fmtCurrency = (n: number) => `${n.toLocaleString('vi-VN')} ₫`

// ─── Payslip sheet content ────────────────────────────────────────────────────

function PayslipContent({ employee }: { employee: PayrollEmployee }) {
  const totalEarnings =
    employee.baseSalary + employee.allowances + employee.overtime + employee.bonus
  const totalDeductions =
    employee.deductions.socialInsurance +
    employee.deductions.healthInsurance +
    employee.deductions.pit +
    employee.deductions.other

  return (
    <div className="py-4 space-y-5 text-sm">
      {/* Company header */}
      <div className="text-center pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center mx-auto mb-2">
          D
        </div>
        <p className="font-bold text-foreground">DigiFNB Corporation</p>
        <p className="text-xs text-muted-foreground">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
      </div>

      {/* Employee info */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-card border border-border text-xs">
        <div>
          <p className="text-muted-foreground mb-0.5">Name</p>
          <p className="font-medium text-foreground">{employee.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-0.5">Employee ID</p>
          <p className="font-mono font-medium text-foreground">{employee.id}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-0.5">Department</p>
          <p className="font-medium text-foreground">{employee.department}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-0.5">Position</p>
          <p className="font-medium text-foreground">{employee.position}</p>
        </div>
        <div className="col-span-2">
          <p className="text-muted-foreground mb-0.5">Bank Account</p>
          <p className="font-mono font-medium text-foreground">{employee.bankAccount}</p>
        </div>
      </div>

      {/* Earnings */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">
          Earnings
        </p>
        <div className="space-y-1.5">
          {([
            ['Base Salary',  employee.baseSalary],
            ['Allowances',   employee.allowances],
            ['Overtime',     employee.overtime],
            ['Bonus',        employee.bonus],
          ] as [string, number][]).map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-mono text-foreground">{fmtCurrency(value)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold border-t border-border pt-1.5 mt-1">
            <span className="text-foreground">Subtotal</span>
            <span className="font-mono text-foreground">{fmtCurrency(totalEarnings)}</span>
          </div>
        </div>
      </div>

      {/* Deductions */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">
          Deductions
        </p>
        <div className="space-y-1.5">
          {([
            ['Social Insurance',    employee.deductions.socialInsurance],
            ['Health Insurance',    employee.deductions.healthInsurance],
            ['Personal Income Tax', employee.deductions.pit],
            ['Other',               employee.deductions.other],
          ] as [string, number][]).map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-mono text-destructive">-{fmtCurrency(value)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold border-t border-border pt-1.5 mt-1">
            <span className="text-foreground">Subtotal</span>
            <span className="font-mono text-destructive">-{fmtCurrency(totalDeductions)}</span>
          </div>
        </div>
      </div>

      {/* Net Pay */}
      <div className="flex justify-between items-center p-4 rounded-lg bg-green-500/12 dark:bg-green-500/20 border border-green-500/30">
        <span className="font-bold text-foreground">NET PAY</span>
        <span className="font-mono text-xl font-bold text-green-700 dark:text-green-400">
          {fmtCurrency(employee.netPay)}
        </span>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-6">
        {['HR Manager', 'Employee'].map((role) => (
          <div key={role} className="text-center">
            <p className="text-xs text-muted-foreground mb-8">{role}</p>
            <div className="border-t border-dashed border-muted-foreground" />
            <p className="text-xs text-muted-foreground mt-1">Signature</p>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button
          type="button"
          className="flex-1 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors cursor-pointer"
        >
          Download PDF
        </button>
        <button
          type="button"
          className="flex-1 py-2 text-sm font-medium rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
        >
          Send to Email
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PayrollTable() {
  const [searchQuery, setSearchQuery]       = useState('')
  const [deptFilter, setDeptFilter]         = useState('all')
  const [statusFilter, setStatusFilter]     = useState('all')
  const [selectedRows, setSelectedRows]     = useState<Set<string>>(new Set())
  const [sheetEmployee, setSheetEmployee]   = useState<PayrollEmployee | null>(null)

  const filtered = useMemo(() =>
    EMPLOYEES.filter((emp) => {
      const q = searchQuery.toLowerCase()
      const matchSearch = emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q)
      const matchDept   = deptFilter === 'all' || emp.department.toLowerCase() === deptFilter
      const matchStatus = statusFilter === 'all' || emp.status.toLowerCase() === statusFilter
      return matchSearch && matchDept && matchStatus
    }),
    [searchQuery, deptFilter, statusFilter],
  )

  const allSelected = selectedRows.size > 0 && selectedRows.size === filtered.length

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelectedRows(allSelected ? new Set() : new Set(filtered.map((e) => e.id)))
  }

  return (
    <>
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        {/* Filter row */}
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or ID…"
              className="w-full pl-8 pr-3 h-8 rounded-lg border border-border text-sm text-foreground bg-card placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[140px] h-8 text-sm border-border cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] h-8 text-sm border-border cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="w-10 pl-5">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="cursor-pointer"
                />
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Employee</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Department</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Base Salary</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Allowances</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Overtime</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Deductions</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Net Pay</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Payslip</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((emp) => {
              const badge = STATUS_BADGE[emp.status]
              const totalDeduct =
                emp.deductions.socialInsurance +
                emp.deductions.healthInsurance +
                emp.deductions.pit +
                emp.deductions.other
              return (
                <TableRow
                  key={emp.id}
                  onClick={() => setSheetEmployee(emp)}
                  className={[
                    'border-border cursor-pointer transition-colors',
                    emp.status === 'Error' ? 'bg-red-50/60 hover:bg-red-50' : 'hover:bg-card',
                  ].join(' ')}
                >
                  <TableCell className="pl-5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(emp.id)}
                      onChange={() => toggleRow(emp.id)}
                      className="cursor-pointer"
                    />
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold bg-primary/15 text-primary/80 shrink-0">
                        {emp.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground leading-tight">{emp.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{emp.id}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">{emp.department}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground text-right">{fmtM(emp.baseSalary)}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground text-right">{fmtM(emp.allowances)}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground text-right">{fmtM(emp.overtime)}</TableCell>
                  <TableCell className="font-mono text-sm text-destructive text-right">-{fmtM(totalDeduct)}</TableCell>
                  <TableCell className="font-mono text-sm font-semibold text-foreground text-right">{fmtM(emp.netPay)}</TableCell>

                  <TableCell>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                      <badge.Icon className="w-3 h-3" />
                      {emp.status}
                    </span>
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      Download
                    </button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Bulk actions bar */}
        {selectedRows.size > 0 && (
          <div className="flex items-center gap-2 px-5 py-3 border-t border-border bg-card">
            <span className="text-xs text-muted-foreground mr-1">{selectedRows.size} selected</span>
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors cursor-pointer"
            >
              Approve Selected
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              Export Selected
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-green-500 text-green-700 dark:text-green-400 hover:bg-green-500/5 transition-colors cursor-pointer"
            >
              Mark as Paid
            </button>
          </div>
        )}
      </div>

      {/* Payslip slide-over */}
      <Sheet open={!!sheetEmployee} onOpenChange={(open) => { if (!open) setSheetEmployee(null) }}>
        <SheetContent className="sm:max-w-[480px] overflow-y-auto">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-base font-semibold text-foreground">
              Payslip — {sheetEmployee?.name} — May 2025
            </SheetTitle>
          </SheetHeader>
          {sheetEmployee && <PayslipContent employee={sheetEmployee} />}
        </SheetContent>
      </Sheet>
    </>
  )
}
