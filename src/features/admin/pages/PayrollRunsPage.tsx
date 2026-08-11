import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight, Lock } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePayrollRuns, useCreatePayrollRun } from '../hooks/use-payroll-runs'
import { createPayrollRunSchema } from '../schemas/payroll-run.schema'
import type { CreatePayrollRunValues } from '../schemas/payroll-run.schema'
import { CreatePayrollDialog } from '../components/PayrollRunsPage'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)

const STATUS_STYLE: Record<string, string> = {
  Draft: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Finalized: 'bg-green-500/15 text-green-400 border-green-500/30',
  Paid: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
}
const STATUS_LABEL: Record<string, string> = {
  Draft: 'Nháp',
  Finalized: 'Đã chốt',
  Paid: 'Đã chi',
}

function fmt(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

export default function PayrollRunsPage() {
  const navigate = useNavigate()
  const [yearFilter, setYearFilter] = useState(CURRENT_YEAR)
  const [createOpen, setCreateOpen] = useState(false)

  const { data: runs = [], isLoading } = usePayrollRuns(yearFilter)
  const create = useCreatePayrollRun()

  const form = useForm<CreatePayrollRunValues>({
    resolver: zodResolver(createPayrollRunSchema),
    defaultValues: { month: new Date().getMonth() + 1, year: CURRENT_YEAR },
  })

  const onSubmit = (values: CreatePayrollRunValues) => {
    create.mutate(values, {
      onSuccess: (id) => {
        setCreateOpen(false)
        form.reset()
        navigate(`/admin/payroll-runs/${id}`)
      },
    })
  }

  return (
    <div className="h-full flex flex-col">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Bảng lương', isActive: true }]} />

      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
        <Select value={String(yearFilter)} onValueChange={v => setYearFilter(Number(v))}>
          <SelectTrigger className="w-24 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Tạo bảng lương
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>Kỳ lương</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Số nhân viên</TableHead>
              <TableHead className="text-right">Tổng lương NET</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
              : runs.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-sm">
                    Chưa có bảng lương nào trong năm {yearFilter}
                  </TableCell>
                </TableRow>
              )
              : runs.map(run => (
                <TableRow
                  key={run.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => navigate(`/admin/payroll-runs/${run.id}`)}
                >
                  <TableCell className="font-medium">Tháng {run.month}/{run.year}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_STYLE[run.status] ?? ''}>
                      {run.status === 'Finalized' && <Lock className="h-3 w-3 mr-1" />}
                      {STATUS_LABEL[run.status] ?? run.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{run.entryCount}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{fmt(run.totalNetPay)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{run.note ?? '—'}</TableCell>
                  <TableCell className="w-8">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>

      <CreatePayrollDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        form={form}
        onSubmit={onSubmit}
        isPending={create.isPending}
      />
    </div>
  )
}
