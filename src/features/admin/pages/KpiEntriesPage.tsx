import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKpiEntries, useUpsertKpiEntry } from '../hooks/use-kpi-entries'
import { upsertKpiEntrySchema } from '../schemas/kpi-entry.schema'
import type { UpsertKpiEntryValues } from '../schemas/kpi-entry.schema'
import { ScoreBadge, KpiUpsertSheet } from '../components/KpiEntriesPage'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)

export default function KpiEntriesPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [sheetOpen, setSheetOpen] = useState(false)

  const { data: entries = [], isLoading } = useKpiEntries({ month, year })
  const upsert = useUpsertKpiEntry()

  const form = useForm<UpsertKpiEntryValues>({
    resolver: zodResolver(upsertKpiEntrySchema),
    defaultValues: { month, year, actualValue: 0, score: 0 },
  })

  const onSubmit = (values: UpsertKpiEntryValues) => {
    upsert.mutate(values, {
      onSuccess: () => {
        setSheetOpen(false)
        form.reset({ month, year, actualValue: 0, score: 0 })
      },
    })
  }

  return (
    <div className="h-full flex flex-col">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'KPI Entries', isActive: true }]} />

      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-2">
          <Select value={String(month)} onValueChange={v => setMonth(Number(v))}>
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTHS.map(m => <SelectItem key={m} value={String(m)}>Tháng {m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={String(year)} onValueChange={v => setYear(Number(v))}>
            <SelectTrigger className="w-24 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={() => setSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nhập điểm
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead>KPI Metric</TableHead>
              <TableHead className="text-right">Giá trị thực tế</TableHead>
              <TableHead className="text-right">Điểm (0–100)</TableHead>
              <TableHead>Ghi chú</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
              : entries.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                    Chưa có dữ liệu KPI cho tháng {month}/{year}
                  </TableCell>
                </TableRow>
              )
              : entries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{entry.metricName}</TableCell>
                  <TableCell className="text-right tabular-nums">{entry.actualValue}</TableCell>
                  <TableCell className="text-right"><ScoreBadge score={entry.score} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{entry.note ?? '—'}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>

      <KpiUpsertSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        form={form}
        onSubmit={onSubmit}
        isPending={upsert.isPending}
      />
    </div>
  )
}
