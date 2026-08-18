import { Controller, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { CreateContractFormValues } from '../../schemas/contract.schema'
import type { ContractTemplateResponse, JobLevelResponse } from '../../types/admin.types'

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
  form: UseFormReturn<CreateContractFormValues>
  onSubmit: (values: CreateContractFormValues) => void
  isPending: boolean
  templates: ContractTemplateResponse[]
  jobLevels: JobLevelResponse[]
}

export function CreateContractSheet({ open, onOpenChange, form, onSubmit, isPending, templates, jobLevels }: Props) {
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = form
  const contractType = watch('type')
  const templateId = watch('templateId')
  const positionTitle = watch('positionTitle')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-lg overflow-y-auto data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right animation-duration-300 ease-out"
      >
        <SheetHeader className="mb-6">
          <SheetTitle>Tạo hợp đồng mới</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type">
              Loại hợp đồng <span className="text-destructive">*</span>
            </Label>
            <Select value={contractType} onValueChange={(value) => setValue('type', value)}>
              <SelectTrigger id="type" className="h-9">
                <SelectValue placeholder="Chọn loại hợp đồng" />
              </SelectTrigger>
              <SelectContent align="start" sideOffset={4}>
                {CONTRACT_TYPES.map((contractTypeOption) => (
                  <SelectItem key={contractTypeOption.value} value={contractTypeOption.value}>
                    {contractTypeOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startDate">
                Ngày bắt đầu <span className="text-destructive">*</span>
              </Label>
              <Input id="startDate" type="date" {...register('startDate')} className="h-9" />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input id="endDate" type="date" {...register('endDate')} className="h-9" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="salary">
              Lương theo giờ (VND/giờ) <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="salary"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="salary"
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
            <Label htmlFor="salaryForSocialInsurance">Lương BHXH (VND/tháng)</Label>
            <Controller
              name="salaryForSocialInsurance"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="salaryForSocialInsurance"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Để trống = dùng lương/giờ"
                  className="h-9"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="positionTitle">Chức danh</Label>
            <Select value={positionTitle ?? ''} onValueChange={(value) => setValue('positionTitle', value || undefined)}>
              <SelectTrigger id="positionTitle" className="h-9">
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
            <Label htmlFor="signedDate">Ngày ký</Label>
            <Input id="signedDate" type="date" {...register('signedDate')} className="h-9" />
          </div>

          {templates.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="templateId">Mẫu hợp đồng (tham khảo)</Label>
              <Select
                value={templateId ?? ''}
                onValueChange={(value) => setValue('templateId', value || undefined)}
              >
                <SelectTrigger id="templateId" className="h-9">
                  <SelectValue placeholder="Không chọn mẫu" />
                </SelectTrigger>
                <SelectContent align="start" sideOffset={4}>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="file">
              File hợp đồng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.docx,.doc"
              className="h-9 cursor-pointer file:cursor-pointer file:text-sm file:font-medium"
              {...register('file')}
            />
            {errors.file && (
              <p className="text-xs text-destructive">{errors.file.message as string}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending ? 'Đang tạo...' : 'Tạo hợp đồng'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
