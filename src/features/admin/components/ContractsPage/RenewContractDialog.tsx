import { Loader2 } from 'lucide-react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { RenewContractFormValues } from '../../schemas/contract.schema'
import type { EmploymentContractResponse, JobLevelResponse } from '../../types/admin.types'

const CONTRACT_TYPES = [
  { value: 'Probation', label: 'Thử việc' },
  { value: 'FullTime', label: 'Toàn thời gian' },
  { value: 'PartTime', label: 'Bán thời gian' },
  { value: 'Seasonal', label: 'Thời vụ' },
  { value: 'Freelance', label: 'Freelance' },
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract: EmploymentContractResponse | null
  form: UseFormReturn<RenewContractFormValues>
  onSubmit: (values: RenewContractFormValues) => void
  isPending: boolean
  jobLevels: JobLevelResponse[]
}

export function RenewContractDialog({ open, onOpenChange, contract, form, onSubmit, isPending, jobLevels }: Props) {
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = form
  const contractType = watch('type')
  const positionTitle = watch('positionTitle')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gia hạn hợp đồng</DialogTitle>
          {contract && (
            <p className="text-sm text-muted-foreground">
              Hợp đồng hiện tại: <span className="font-mono font-medium">{contract.contractNumber}</span>
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="renew-type">Loại hợp đồng mới <span className="text-destructive">*</span></Label>
            <Select value={contractType} onValueChange={(v) => setValue('type', v)}>
              <SelectTrigger id="renew-type" className="h-9">
                <SelectValue placeholder="Chọn loại hợp đồng" />
              </SelectTrigger>
              <SelectContent align="start" sideOffset={4}>
                {CONTRACT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="renew-startDate">Ngày bắt đầu <span className="text-destructive">*</span></Label>
              <Input id="renew-startDate" type="date" {...register('startDate')} className="h-9" />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="renew-endDate">Ngày kết thúc</Label>
              <Input id="renew-endDate" type="date" {...register('endDate')} className="h-9" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="renew-salary">Lương theo giờ mới (VND/giờ) <span className="text-destructive">*</span></Label>
            <Controller
              name="salary"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="renew-salary"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="0 ₫"
                  className="h-9"
                />
              )}
            />
            {errors.salary && <p className="text-xs text-destructive">{errors.salary.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="renew-positionTitle">Chức danh</Label>
            <Select value={positionTitle ?? ''} onValueChange={(value) => setValue('positionTitle', value || undefined)}>
              <SelectTrigger id="renew-positionTitle" className="h-9">
                <SelectValue placeholder="Chọn chức danh" />
              </SelectTrigger>
              <SelectContent align="start" sideOffset={4}>
                {jobLevels.map((level) => (
                  <SelectItem key={level.id} value={level.levelName}>
                    {level.levelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="renew-salaryForSocialInsurance">Lương BHXH (VND/tháng)</Label>
            <Controller
              name="salaryForSocialInsurance"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="renew-salaryForSocialInsurance"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Để trống = dùng lương/giờ"
                  className="h-9"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="renew-signedDate">Ngày ký</Label>
            <Input id="renew-signedDate" type="date" {...register('signedDate')} className="h-9" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="renew-file">
              File hợp đồng mới <span className="text-destructive">*</span>
            </Label>
            <Input
              id="renew-file"
              type="file"
              accept=".pdf,.docx,.doc"
              className="h-9 cursor-pointer file:cursor-pointer file:text-sm file:font-medium"
              {...register('file')}
            />
            {errors.file && (
              <p className="text-xs text-destructive">{errors.file.message as string}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending} className="cursor-pointer">
              Hủy
            </Button>
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              {isPending ? 'Đang gia hạn...' : 'Gia hạn'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
