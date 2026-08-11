import type { UseFormReturn } from 'react-hook-form'
import { Plus, ChevronRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { PayrollRunResponse } from '../../types/payroll-run.types'
import type { CreatePayrollRunValues } from '../../schemas/payroll-run.schema'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
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

interface PayrollTabProps {
  runs: PayrollRunResponse[]
  isLoading: boolean
  yearFilter: number
  onYearFilterChange: (v: number) => void
  createOpen: boolean
  onCreateOpenChange: (v: boolean) => void
  form: UseFormReturn<CreatePayrollRunValues>
  onSubmit: (values: CreatePayrollRunValues) => void
  isPending: boolean
  onNavigate: (id: string) => void
}

export function PayrollTab({ runs, isLoading, yearFilter, onYearFilterChange, createOpen, onCreateOpenChange, form, onSubmit, isPending, onNavigate }: PayrollTabProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
        <Select value={String(yearFilter)} onValueChange={v => onYearFilterChange(Number(v))}>
          <SelectTrigger className="w-24 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => onCreateOpenChange(true)}>
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
                  onClick={() => onNavigate(run.id)}
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

      <Dialog open={createOpen} onOpenChange={onCreateOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo bảng lương mới</DialogTitle>
            <DialogDescription>Chọn kỳ lương để bắt đầu nhập dữ liệu</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="month" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tháng *</FormLabel>
                    <Select value={String(field.value)} onValueChange={v => field.onChange(Number(v))}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {MONTHS.map(m => <SelectItem key={m} value={String(m)}>Tháng {m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="year" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Năm *</FormLabel>
                    <Select value={String(field.value)} onValueChange={v => field.onChange(Number(v))}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="note" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl><Textarea rows={2} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onCreateOpenChange(false)}>Hủy</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Đang tạo…' : 'Tạo'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
