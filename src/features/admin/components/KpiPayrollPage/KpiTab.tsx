import { Save, Plus } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ScoreBadge } from './ScoreBadge'
import type { KpiEntryResponse } from '../../types/kpi-entry.types'
import type { UpsertKpiEntryValues } from '../../schemas/kpi-entry.schema'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)

interface KpiTabProps {
  entries: KpiEntryResponse[]
  isLoading: boolean
  form: UseFormReturn<UpsertKpiEntryValues>
  onSubmit: (values: UpsertKpiEntryValues) => void
  isPending: boolean
  month: number
  year: number
  onMonthChange: (v: number) => void
  onYearChange: (v: number) => void
  sheetOpen: boolean
  onSheetOpenChange: (v: boolean) => void
}

export function KpiTab({ entries, isLoading, form, onSubmit, isPending, month, year, onMonthChange, onYearChange, sheetOpen, onSheetOpenChange }: KpiTabProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-2">
          <Select value={String(month)} onValueChange={v => onMonthChange(Number(v))}>
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTHS.map(m => <SelectItem key={m} value={String(m)}>Tháng {m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={String(year)} onValueChange={v => onYearChange(Number(v))}>
            <SelectTrigger className="w-24 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={() => onSheetOpenChange(true)}>
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

      <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Nhập điểm KPI</SheetTitle>
            <SheetDescription>Nhập hoặc cập nhật điểm KPI cho nhân viên</SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
              <FormField control={form.control} name="userId" render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID *</FormLabel>
                  <FormControl><Input placeholder="UUID nhân viên" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="kpiMetricId" render={({ field }) => (
                <FormItem>
                  <FormLabel>KPI Metric ID *</FormLabel>
                  <FormControl><Input placeholder="UUID metric" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
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
              <FormField control={form.control} name="actualValue" render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá trị thực tế *</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="score" render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm (0–100) *</FormLabel>
                  <FormControl><Input type="number" step="0.1" min="0" max="100" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="note" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => onSheetOpenChange(false)}>Hủy</Button>
                <Button type="submit" disabled={isPending}>
                  <Save className="h-4 w-4 mr-1" />
                  {isPending ? 'Đang lưu…' : 'Lưu'}
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
