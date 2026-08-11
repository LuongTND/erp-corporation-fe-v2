import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, FileText, Briefcase, Shield, Settings2 } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useJobLevels } from '@/features/admin/hooks/use-job-levels'
import { useCustomFields } from '@/features/admin/hooks/use-custom-fields'
import { DynamicFormSection } from '@/features/admin/components/EmployeesPage'
import { DatePickerField } from './DatePickerField'
import { editEmployeeSchema, type EditEmployeeEditEmployeeFormValues } from '../../schemas/edit-employee.schema'
import type { UserDetailDto, UpdateEmployeePayload } from '../../types/user-detail.types'

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
  readonly onSave: (payload: UpdateEmployeePayload, customFields: { definitionId: string; value: string }[]) => Promise<void>
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

export function EditEmployeeSheet({ open, employee, onOpenChange, onSave }: Props) {
  const { data: jobLevelData } = useJobLevels()
  const { data: customFieldDefs = [] } = useCustomFields('Employee')
  const jobLevels = jobLevelData?.items ?? []

  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting, errors } } = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeSchema),
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

  const onSubmit = async (values: EditEmployeeFormValues) => {
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
    const cfEntries = Object.entries(values.customFieldValues ?? {})
      .filter(([, v]) => v !== '')
      .map(([definitionId, value]) => ({ definitionId, value }))
    await onSave(payload, cfEntries)
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
                    <Input {...register('fullName')} placeholder="Nguyễn Văn A" className={errors.fullName ? 'border-destructive' : ''} />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                  </Field>
                  <Field label="Cấp bậc" required>
                    <Select value={jobLevelId ?? ''} onValueChange={(v) => setValue('jobLevelId', v)}>
                      <SelectTrigger className={errors.jobLevelId ? 'border-destructive' : ''}><SelectValue placeholder="Chọn cấp bậc" /></SelectTrigger>
                      <SelectContent>
                        {jobLevels.map((jl) => (
                          <SelectItem key={jl.id} value={jl.id}>{jl.levelName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.jobLevelId && <p className="text-xs text-destructive">{errors.jobLevelId.message}</p>}
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
                    {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>}
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
                      {errors.identityCardNumber && <p className="text-xs text-destructive">{errors.identityCardNumber.message}</p>}
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
                      {errors.passportNumber && <p className="text-xs text-destructive">{errors.passportNumber.message}</p>}
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
                      {errors.taxCode && <p className="text-xs text-destructive">{errors.taxCode.message}</p>}
                    </Field>
                    <Field label="Số BHXH">
                      <Input {...register('socialInsuranceCode')} placeholder="0101xxxxxx" />
                      {errors.socialInsuranceCode && <p className="text-xs text-destructive">{errors.socialInsuranceCode.message}</p>}
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
                          {errors.bankAccountNumber && <p className="text-xs text-destructive">{errors.bankAccountNumber.message}</p>}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
