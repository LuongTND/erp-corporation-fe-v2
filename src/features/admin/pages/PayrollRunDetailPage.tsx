import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Lock } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { usePayrollRunById, useUpdatePayrollEntry, useFinalizePayrollRun } from '../hooks/use-payroll-runs'
import { updatePayrollEntrySchema } from '../schemas/payroll-run.schema'
import type { UpdatePayrollEntryValues } from '../schemas/payroll-run.schema'
import type { PayrollEntryResponse } from '../types/payroll-run.types'
import { EntrySheet } from '../components/PayrollRunDetailPage'

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

export default function PayrollRunDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntryResponse | null>(null)
  const [finalizeOpen, setFinalizeOpen] = useState(false)

  const { data: run, isLoading } = usePayrollRunById(id ?? null)
  const updateEntry = useUpdatePayrollEntry()
  const finalize = useFinalizePayrollRun()

  const isFinalized = run?.status === 'Finalized' || run?.status === 'Paid'
  const totalNet = run?.entries.reduce((sum, entry) => sum + entry.netPay, 0) ?? 0

  const form = useForm<UpdatePayrollEntryValues>({
    resolver: zodResolver(updatePayrollEntrySchema),
  })

  useEffect(() => {
    if (selectedEntry) {
      form.reset({
        hoursWorked: selectedEntry.hoursWorked,
        bonusAmount: selectedEntry.bonusAmount,
        socialInsurance: selectedEntry.socialInsurance ?? null,
        healthInsurance: selectedEntry.healthInsurance ?? null,
        unemploymentIns: selectedEntry.unemploymentIns ?? null,
        personalIncomeTax: selectedEntry.personalIncomeTax ?? null,
        note: selectedEntry.note ?? '',
      })
    }
  }, [selectedEntry, form])

  const onSubmit = (values: UpdatePayrollEntryValues) => {
    if (!selectedEntry) return
    updateEntry.mutate({ entryId: selectedEntry.id, data: values }, {
      onSuccess: () => setSelectedEntry(null),
    })
  }

  return (
    <div className="h-full flex flex-col">
      <HRPageHeader
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'KPI & Lương', href: '/admin/kpi-entries' },
          { label: run ? `Tháng ${run.month}/${run.year}` : '…', isActive: true },
        ]}
      />

      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/admin/kpi-entries')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {run && (
            <>
              <span className="font-semibold">Tháng {run.month}/{run.year}</span>
              <Badge variant="outline" className={STATUS_STYLE[run.status] ?? ''}>
                {run.status === 'Finalized' && <Lock className="h-3 w-3 mr-1" />}
                {STATUS_LABEL[run.status] ?? run.status}
              </Badge>
            </>
          )}
        </div>
        {!isFinalized && (
          <Button size="sm" variant="destructive" onClick={() => setFinalizeOpen(true)}>
            <Lock className="h-4 w-4 mr-1" />
            Chốt bảng lương
          </Button>
        )}
      </div>

      {run && (
        <div className="px-6 py-2 border-b border-border/40 shrink-0 flex gap-6 text-sm">
          <span className="text-muted-foreground">Nhân viên: <strong className="text-foreground">{run.entries.length}</strong></span>
          <span className="text-muted-foreground">Tổng NET: <strong className="text-green-400">{fmt(totalNet)}</strong></span>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead className="text-right">Lương/giờ</TableHead>
              <TableHead className="text-right">Số giờ</TableHead>
              <TableHead className="text-right">Gross</TableHead>
              <TableHead className="text-right">Thưởng</TableHead>
              <TableHead className="text-right">Khấu trừ</TableHead>
              <TableHead className="text-right">NET</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
              : !run || run.entries.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm">
                    Chưa có nhân viên trong bảng lương này
                  </TableCell>
                </TableRow>
              )
              : run.entries.map(entry => (
                <TableRow
                  key={entry.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <TableCell className="font-medium">{entry.fullName}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{fmt(entry.hourlyRateSnapshot)}</TableCell>
                  <TableCell className="text-right tabular-nums">{entry.hoursWorked}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(entry.grossPay)}</TableCell>
                  <TableCell className="text-right tabular-nums text-green-400">{entry.bonusAmount > 0 ? fmt(entry.bonusAmount) : '—'}</TableCell>
                  <TableCell className="text-right tabular-nums text-red-400">{entry.totalDeductions > 0 ? fmt(entry.totalDeductions) : '—'}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{fmt(entry.netPay)}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>

      <EntrySheet
        entry={selectedEntry}
        open={!!selectedEntry}
        onOpenChange={open => { if (!open) setSelectedEntry(null) }}
        form={form}
        onSubmit={onSubmit}
        isPending={updateEntry.isPending}
        runFinalized={isFinalized ?? false}
      />

      <AlertDialog open={finalizeOpen} onOpenChange={setFinalizeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Chốt bảng lương?</AlertDialogTitle>
            <AlertDialogDescription>
              Sau khi chốt, bảng lương tháng {run?.month}/{run?.year} sẽ không thể chỉnh sửa nữa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!id) return
                finalize.mutate(id, { onSuccess: () => setFinalizeOpen(false) })
              }}
            >
              Xác nhận chốt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
