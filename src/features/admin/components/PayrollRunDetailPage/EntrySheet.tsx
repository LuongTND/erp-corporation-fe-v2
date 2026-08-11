import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import type { PayrollEntryResponse } from '../../types/payroll-run.types'
import type { UpdatePayrollEntryValues } from '../../schemas/payroll-run.schema'

function fmt(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

interface EntrySheetProps {
  entry: PayrollEntryResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<UpdatePayrollEntryValues>
  onSubmit: (values: UpdatePayrollEntryValues) => void
  isPending: boolean
  runFinalized: boolean
}

export function EntrySheet({ entry, open, onOpenChange, form, onSubmit, isPending, runFinalized }: EntrySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{entry?.fullName}</SheetTitle>
          <SheetDescription>
            Lương: {entry ? fmt(entry.hourlyRateSnapshot) : '—'}/giờ
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <FormField control={form.control} name="hoursWorked" render={({ field }) => (
              <FormItem>
                <FormLabel>Số giờ làm *</FormLabel>
                <FormControl><Input type="number" step="0.5" disabled={runFinalized} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="bonusAmount" render={({ field }) => (
              <FormItem>
                <FormLabel>Thưởng (VNĐ)</FormLabel>
                <FormControl><Input type="number" step="1000" disabled={runFinalized} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider pt-1">Khấu trừ</p>

            {([
              ['socialInsurance', 'BHXH'],
              ['healthInsurance', 'BHYT'],
              ['unemploymentIns', 'BHTN'],
              ['personalIncomeTax', 'Thuế TNCN'],
            ] as const).map(([name, label]) => (
              <FormField key={name} control={form.control} name={name} render={({ field }) => (
                <FormItem>
                  <FormLabel>{label} (VNĐ)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1000"
                      disabled={runFinalized}
                      value={field.value ?? ''}
                      onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            ))}

            <FormField control={form.control} name="note" render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú</FormLabel>
                <FormControl><Textarea rows={2} disabled={runFinalized} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {!runFinalized && (
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Đang lưu…' : 'Lưu'}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
