import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon, User, FileText, Briefcase, Shield, Settings2 } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useJobLevels } from '@/features/admin/hooks/use-job-levels'
import { useCustomFields } from '@/features/admin/hooks/use-custom-fields'
import { DynamicFormSection } from '@/features/admin/components/EmployeesPage'
import { useUpdateEmployee, useUpsertCustomFields } from '../../hooks/use-employee-detail'
import type { UserDetailDto, UpdateEmployeePayload } from '../../types/user-detail.types'

const schema = z.object({
  fullName: z.string().min(1).max(200),
  jobLevelId: z.string().min(1),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().max(20).optional(),
  permanentAddress: z.string().optional(),
  currentAddress: z.string().optional(),
  identityCardNumber: z.string().max(20).optional(),
  identityCardIssuedDate: z.string().optional(),
  identityCardIssuedPlace: z.string().optional(),
  passportNumber: z.string().max(30).optional(),
  passportExpiryDate: z.string().optional(),
  dateOfJoin: z.string().optional(),
  contractType: z.string().optional(),
  taxCode: z.string().max(20).optional(),
  socialInsuranceCode: z.string().max(30).optional(),
  bankName: z.string().max(100).optional(),
  bankAccountNumber: z.string().max(30).optional(),
  bankBranch: z.string().max(100).optional(),
  customFieldValues: z.record(z.string()).optional(),
})

type FormValues = z.infer<typeof schema>

const CONTRACT_TYPES = [
  { value: 'Probation', label: 'Thử việc' },
  { value: 'FullTime', label: 'Toàn thời gian' },
  { value: 'PartTime', label: 'Bán thời gian' },
  { value: 'Seasonal', label: 'Thời vụ' },
  { value: 'Freelance', label: 'Freelance' },
]

const GENDERS = [
  { value: 'Male', label: 'Nam' },
  { value: 'Female', label: 'Nữ' },
  { value: 'Other', label: 'Khác' },
]

interface Props {
  readonly open: boolean
  readonly employee: UserDetailDto
  readonly onOpenChange: (open: boolean) => void
}

function Field({ label, required, children }: {
  readonly label: string
  readonly required?: boolean
  readonly children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  )
}

function DatePickerField({ value, onChange, fromYear = 1950, toYear = new Date().getFullYear() + 5 }: {
  readonly value: string
  readonly onChange: (v: string) => void
  readonly fromYear?: number
  readonly toYear?: number
}) {
  const [open, setOpen] = useState(false)
  const selected = value ? new Date(value) : undefined
  const display = selected
    ? selected.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'Chọn ngày'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${!value ? 'text-muted-foreground' : 'text-foreground'}`}
        >
          <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {display}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? date.toISOString().split('T')[0] : '')
            setOpen(false)
          }}
          captionLayout="dropdown"
          startMonth={new Date(fromYear, 0)}
          endMonth={new Date(toYear, 11)}
          defaultMonth={selected ?? new Date(2000, 0)}
        />
      </PopoverContent>
    </Popover>
  )
}

function SectionHeader({ icon: Icon, title }: {
  readonly icon: React.ElementType
  readonly title: string
}) {
  return (
    <span className="flex items-center gap-2 text-sm font-medium">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {title}
    </span>
  )
}

export function EditEmployeeSheet({ open, employee, onOpenChange }: Props) {
  const update = useUpdateEmployee(employee.id)
  const upsertCustomFields = useUpsertCustomFields(employee.id)
  const { data: jobLevelData } = useJobLevels()
  const { data: customFieldDefs = [] } = useCustomFields('Employee')
  const jobLevels = jobLevelData?.items ?? []

  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const gender = watch('gender')
  const jobLevelId = watch('jobLevelId')
  const contractType = watch('contractType')
  const customFieldValues = watch('customFieldValues') ?? {}

  useEffect(() => {
    if (!open) return
    reset({
      fullName: employee.fullName,
      jobLevelId: employee.jobLevelId,
      gender: employee.profile?.gender ?? '',
      dateOfBirth: employee.profile?.dateOfBirth ?? '',
      phoneNumber: employee.profile?.phoneNumber ?? '',
      permanentAddress: employee.profile?.permanentAddress ?? '',
      currentAddress: employee.profile?.currentAddress ?? '',
      identityCardNumber: employee.identity?.identityCardNumber ?? '',
      identityCardIssuedDate: employee.identity?.identityCardIssuedDate ?? '',
      identityCardIssuedPlace: employee.identity?.identityCardIssuedPlace ?? '',
      passportNumber: employee.identity?.passportNumber ?? '',
      passportExpiryDate: employee.identity?.passportExpiryDate ?? '',
      dateOfJoin: employee.employment?.dateOfJoin ?? '',
      contractType: employee.employment?.contractType ?? '',
      taxCode: employee.employment?.taxCode ?? '',
      socialInsuranceCode: employee.employment?.socialInsuranceCode ?? '',
      bankName: employee.employment?.bankName ?? '',
      bankAccountNumber: employee.employment?.bankAccountNumber ?? '',
      bankBranch: employee.employment?.bankBranch ?? '',
      customFieldValues: Object.fromEntries(
        (employee.customFields ?? []).map((f) => [f.definitionId, f.value ?? ''])
      ),
    })
  }, [open, employee, reset])

  const onSubmit = async (values: FormValues) => {
    const payload: UpdateEmployeePayload = {
      fullName: values.fullName,
      jobLevelId: values.jobLevelId,
      managerId: employee.managerId,
      gender: values.gender || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      phoneNumber: values.phoneNumber || undefined,
      permanentAddress: values.permanentAddress || undefined,
      currentAddress: values.currentAddress || undefined,
      identityCardNumber: values.identityCardNumber || undefined,
      identityCardIssuedDate: values.identityCardIssuedDate || undefined,
      identityCardIssuedPlace: values.identityCardIssuedPlace || undefined,
      passportNumber: values.passportNumber || undefined,
      passportExpiryDate: values.passportExpiryDate || undefined,
      dateOfJoin: values.dateOfJoin || undefined,
      contractType: values.contractType || undefined,
      taxCode: values.taxCode || undefined,
      socialInsuranceCode: values.socialInsuranceCode || undefined,
      bankName: values.bankName || undefined,
      bankAccountNumber: values.bankAccountNumber || undefined,
      bankBranch: values.bankBranch || undefined,
    }
    await update.mutateAsync(payload)

    const cfEntries = Object.entries(values.customFieldValues ?? {})
      .filter(([, v]) => v !== '')
      .map(([definitionId, value]) => ({ definitionId, value }))
    if (cfEntries.length > 0) {
      await upsertCustomFields.mutateAsync(cfEntries)
    }

    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden sm:max-w-xl">
        <SheetHeader className="shrink-0 pb-4">
          <SheetTitle>Chỉnh sửa hồ sơ — {employee.fullName}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto pr-1">
            <Accordion type="multiple" defaultValue={['basic', 'personal', 'identity', 'employment', 'customFields']} className="w-full space-y-1.5">

              {/* ── Cơ bản ── */}
              <AccordionItem value="basic" className="rounded-lg border border-border bg-card/50 px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <SectionHeader icon={User} title="Thông tin cơ bản" />
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <Field label="Họ và tên" required>
                    <Input {...register('fullName')} placeholder="Nguyễn Văn A" />
                  </Field>
                  <Field label="Cấp bậc" required>
                    <Select value={jobLevelId ?? ''} onValueChange={(v) => setValue('jobLevelId', v)}>
                      <SelectTrigger><SelectValue placeholder="Chọn cấp bậc" /></SelectTrigger>
                      <SelectContent>
                        {jobLevels.map((jl) => (
                          <SelectItem key={jl.id} value={jl.id}>{jl.levelName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </AccordionContent>
              </AccordionItem>

              {/* ── Cá nhân ── */}
              <AccordionItem value="personal" className="rounded-lg border border-border bg-card/50 px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <SectionHeader icon={User} title="Thông tin cá nhân" />
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Giới tính">
                      <Select value={gender ?? ''} onValueChange={(v) => setValue('gender', v)}>
                        <SelectTrigger><SelectValue placeholder="Chọn..." /></SelectTrigger>
                        <SelectContent>
                          {GENDERS.map((g) => (
                            <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Ngày sinh">
                      <DatePickerField value={watch('dateOfBirth') ?? ''} onChange={(v) => setValue('dateOfBirth', v)} toYear={new Date().getFullYear()} />
                    </Field>
                  </div>
                  <Field label="Số điện thoại">
                    <Input {...register('phoneNumber')} placeholder="0912 345 678" />
                  </Field>
                  <Field label="Địa chỉ thường trú">
                    <Input {...register('permanentAddress')} placeholder="Số nhà, đường, phường, quận, tỉnh/TP" />
                  </Field>
                  <Field label="Địa chỉ hiện tại">
                    <Input {...register('currentAddress')} placeholder="Để trống nếu giống thường trú" />
                  </Field>
                </AccordionContent>
              </AccordionItem>

              {/* ── Giấy tờ ── */}
              <AccordionItem value="identity" className="rounded-lg border border-border bg-card/50 px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <SectionHeader icon={FileText} title="Giấy tờ tùy thân" />
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Số CCCD / CMND">
                      <Input {...register('identityCardNumber')} placeholder="079xxxxxx" />
                    </Field>
                    <Field label="Ngày cấp">
                      <DatePickerField value={watch('identityCardIssuedDate') ?? ''} onChange={(v) => setValue('identityCardIssuedDate', v)} toYear={new Date().getFullYear()} />
                    </Field>
                  </div>
                  <Field label="Nơi cấp">
                    <Input {...register('identityCardIssuedPlace')} placeholder="Cục CSQLHC về TTXH - Bộ Công An" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Số hộ chiếu">
                      <Input {...register('passportNumber')} placeholder="B12345678" />
                    </Field>
                    <Field label="Ngày hết hạn HC">
                      <DatePickerField value={watch('passportExpiryDate') ?? ''} onChange={(v) => setValue('passportExpiryDate', v)} fromYear={new Date().getFullYear()} toYear={new Date().getFullYear() + 20} />
                    </Field>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ── Công việc & Tài chính ── */}
              <AccordionItem value="employment" className="rounded-lg border border-border bg-card/50 px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <SectionHeader icon={Briefcase} title="Công việc & Tài chính" />
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Ngày vào làm">
                      <DatePickerField value={watch('dateOfJoin') ?? ''} onChange={(v) => setValue('dateOfJoin', v)} toYear={new Date().getFullYear() + 1} />
                    </Field>
                    <Field label="Loại hợp đồng">
                      <Select value={contractType ?? ''} onValueChange={(v) => setValue('contractType', v)}>
                        <SelectTrigger><SelectValue placeholder="Chọn..." /></SelectTrigger>
                        <SelectContent>
                          {CONTRACT_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Mã số thuế">
                      <Input {...register('taxCode')} placeholder="8823456789" />
                    </Field>
                    <Field label="Số BHXH">
                      <Input {...register('socialInsuranceCode')} placeholder="0101xxxxxx" />
                    </Field>
                  </div>

                  <div className="mt-1 border-t border-border pt-3">
                    <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Shield className="h-3.5 w-3.5" />
                      Thông tin ngân hàng
                    </p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Ngân hàng">
                          <Input {...register('bankName')} placeholder="Vietcombank" />
                        </Field>
                        <Field label="Số tài khoản">
                          <Input {...register('bankAccountNumber')} placeholder="1234567890" />
                        </Field>
                      </div>
                      <Field label="Chi nhánh">
                        <Input {...register('bankBranch')} placeholder="Chi nhánh TP.HCM" />
                      </Field>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ── Trường tùy chỉnh ── */}
              {customFieldDefs.filter((d) => d.isActive).length > 0 && (
                <AccordionItem value="customFields" className="rounded-lg border border-border bg-card/50 px-4">
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <SectionHeader icon={Settings2} title="Trường tùy chỉnh" />
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <DynamicFormSection
                      values={customFieldValues}
                      onChange={(id, value) => setValue('customFieldValues', { ...customFieldValues, [id]: value })}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

            </Accordion>
          </div>

          <SheetFooter className="mt-4 shrink-0 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting || update.isPending || upsertCustomFields.isPending}>
              {(update.isPending || upsertCustomFields.isPending) ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
