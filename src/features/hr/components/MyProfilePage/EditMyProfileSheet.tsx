import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, FileText, Shield } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePickerField } from '../EmployeeDetailPage/DatePickerField'
import type { UserDetailDto, UpdateMyProfilePayload } from '../../types/user-detail.types'

const GENDERS = [
  { value: 'Male',   label: 'Nam' },
  { value: 'Female', label: 'Nữ'  },
  { value: 'Other',  label: 'Khác' },
]

interface Props {
  readonly open: boolean
  readonly employee: UserDetailDto
  readonly isSaving: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onSave: (payload: UpdateMyProfilePayload) => Promise<void>
}

function Field({ label, children }: { readonly label: string; readonly children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function SectionHeader({ icon: Icon, title }: { readonly icon: React.ElementType; readonly title: string }) {
  return (
    <span className="flex items-center gap-2 text-sm font-medium">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {title}
    </span>
  )
}

type FormValues = Omit<UpdateMyProfilePayload, never>

export function EditMyProfileSheet({ open, employee, isSaving, onOpenChange, onSave }: Props) {
  const { register, handleSubmit, setValue, watch, reset, formState: { isDirty } } = useForm<FormValues>()

  const handleOpenChange = (next: boolean) => {
    if (!next && isDirty && !window.confirm('Bạn có thay đổi chưa lưu. Đóng?')) return
    onOpenChange(next)
  }

  useEffect(() => {
    if (!open) return
    reset({
      gender:                   employee.profile?.gender                   ?? '',
      dateOfBirth:              employee.profile?.dateOfBirth              ?? '',
      phoneNumber:              employee.profile?.phoneNumber              ?? '',
      permanentAddress:         employee.profile?.permanentAddress         ?? '',
      currentAddress:           employee.profile?.currentAddress           ?? '',
      identityCardNumber:       employee.identity?.identityCardNumber      ?? '',
      identityCardIssuedDate:   employee.identity?.identityCardIssuedDate  ?? '',
      identityCardIssuedPlace:  employee.identity?.identityCardIssuedPlace ?? '',
      passportNumber:           employee.identity?.passportNumber          ?? '',
      passportExpiryDate:       employee.identity?.passportExpiryDate      ?? '',
      taxCode:                  employee.employment?.taxCode               ?? '',
      socialInsuranceCode:      employee.employment?.socialInsuranceCode   ?? '',
      bankName:                 employee.employment?.bankName              ?? '',
      bankAccountNumber:        employee.employment?.bankAccountNumber     ?? '',
      bankBranch:               employee.employment?.bankBranch            ?? '',
    })
  }, [open, employee, reset])

  const onSubmit = async (values: FormValues) => {
    const payload: UpdateMyProfilePayload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '')
    ) as UpdateMyProfilePayload
    await onSave(payload)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden sm:max-w-xl">
        <SheetHeader className="shrink-0 pb-4">
          <SheetTitle>Cập nhật hồ sơ cá nhân</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto pr-1">
            <Accordion type="multiple" defaultValue={['personal', 'identity', 'financial']} className="w-full space-y-1.5">

              {/* Thông tin cá nhân */}
              <AccordionItem value="personal" className="rounded-lg border border-border bg-card/50 px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <SectionHeader icon={User} title="Thông tin cá nhân" />
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Giới tính">
                      <Select value={watch('gender') ?? ''} onValueChange={(v) => setValue('gender', v, { shouldDirty: true })}>
                        <SelectTrigger><SelectValue placeholder="Chọn..." /></SelectTrigger>
                        <SelectContent align="start" sideOffset={4}>
                          {GENDERS.map((g) => (
                            <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Ngày sinh">
                      <DatePickerField
                        value={watch('dateOfBirth') ?? ''}
                        onChange={(v) => setValue('dateOfBirth', v, { shouldDirty: true })}
                        toYear={new Date().getFullYear()}
                      />
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

              {/* Giấy tờ tùy thân */}
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
                      <DatePickerField
                        value={watch('identityCardIssuedDate') ?? ''}
                        onChange={(v) => setValue('identityCardIssuedDate', v, { shouldDirty: true })}
                        toYear={new Date().getFullYear()}
                      />
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
                      <DatePickerField
                        value={watch('passportExpiryDate') ?? ''}
                        onChange={(v) => setValue('passportExpiryDate', v, { shouldDirty: true })}
                        fromYear={new Date().getFullYear()}
                        toYear={new Date().getFullYear() + 20}
                      />
                    </Field>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Tài chính */}
              <AccordionItem value="financial" className="rounded-lg border border-border bg-card/50 px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <SectionHeader icon={Shield} title="Tài chính" />
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Mã số thuế">
                      <Input {...register('taxCode')} placeholder="8823456789" />
                    </Field>
                    <Field label="Số BHXH">
                      <Input {...register('socialInsuranceCode')} placeholder="0101xxxxxx" />
                    </Field>
                  </div>
                  <div className="border-t border-border pt-3 space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">Thông tin ngân hàng</p>
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
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>

          <SheetFooter className="mt-4 shrink-0 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
