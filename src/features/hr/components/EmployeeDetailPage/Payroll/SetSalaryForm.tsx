import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePickerField } from '../DatePickerField'
import { fmtVnd } from '@/lib/date'
import type { SetSalaryPayload } from '../../../types/salary.types'

const schema = z.object({
  hourlyRate: z.coerce.number({ invalid_type_error: 'Nhập mức lương' }).min(1, 'Lương phải lớn hơn 0'),
  effectiveFrom: z.string().min(1, 'Chọn ngày hiệu lực'),
  reason: z.string().max(500, 'Tối đa 500 ký tự').optional(),
})

type FormValues = z.infer<typeof schema>


interface Props {
  onClose: () => void
  onSetSalary: (payload: SetSalaryPayload, callbacks: { onSuccess: () => void }) => void
  isPendingSalary: boolean
}

export function SetSalaryForm({ onClose, onSetSalary, isPendingSalary }: Props) {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const [displayRate, setDisplayRate] = useState('')

  const onSubmit = (values: FormValues) => {
    onSetSalary(
      { hourlyRate: values.hourlyRate, effectiveFrom: values.effectiveFrom, reason: values.reason },
      { onSuccess: onClose },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Currency input — display formatted, store raw number */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Lương/giờ (₫) <span className="text-destructive">*</span></Label>
          <Input
            inputMode="numeric"
            placeholder="50.000"
            value={displayRate}
            onChange={(e) => {
              const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '')
              const num = parseInt(raw, 10)
              setDisplayRate(raw ? fmtVnd(num) : '')
              setValue('hourlyRate', num || 0, { shouldValidate: true })
            }}
            className={errors.hourlyRate ? 'border-destructive' : ''}
          />
          {/* hidden field carries the number value to RHF */}
          <input type="hidden" {...register('hourlyRate')} />
          {errors.hourlyRate && <p className="text-xs text-destructive">{errors.hourlyRate.message}</p>}
        </div>

        {/* Date picker */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Hiệu lực từ <span className="text-destructive">*</span></Label>
          <Controller
            name="effectiveFrom"
            control={control}
            render={({ field }) => (
              <DatePickerField
                value={field.value ?? ''}
                onChange={field.onChange}
                fromYear={2000}
                toYear={new Date().getFullYear() + 5}
              />
            )}
          />
          {errors.effectiveFrom && <p className="text-xs text-destructive">{errors.effectiveFrom.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Lý do điều chỉnh</Label>
        <Input {...register('reason')} placeholder="Tăng lương định kỳ..." />
        {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPendingSalary}>Hủy</Button>
        <Button type="submit" size="sm" disabled={isPendingSalary}>
          {isPendingSalary ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </div>
    </form>
  )
}
