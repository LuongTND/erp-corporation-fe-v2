import type React from 'react'
import { CustomFieldsSection } from '.'
import type { CustomFieldDefinitionResponse } from '@/features/admin/types/admin.types'
import type { EmployeeDetail } from '../../types/employee.types'
import type { CustomFieldValueDto } from '../../types/user-detail.types'

// ─── types ───────────────────────────────────────────────────────────────────

type FieldType = 'text' | 'mono' | 'multiline'

interface FieldDef {
  label: string
  value: string
  type?: FieldType
}

interface PersonalInfoTabProps {
  readonly employee: EmployeeDetail
  readonly customFields?: CustomFieldValueDto[]
  readonly customFieldDefinitions?: CustomFieldDefinitionResponse[]
}

// ─── constants ───────────────────────────────────────────────────────────────

const GENDER_LABELS: Record<string, string> = { Male: 'Nam', Female: 'Nữ', Other: 'Khác' }

// ─── primitives ──────────────────────────────────────────────────────────────

function FieldRow({ label, value, type = 'text' }: FieldDef) {
  const isMultiline = type === 'multiline'
  return (
    <div className={`flex ${isMultiline ? 'items-start' : 'items-center'} gap-3 py-2 border-b border-border/60 last:border-0`}>
      <span className="w-40 shrink-0 text-xs text-muted-foreground leading-5">{label}</span>
      <span className={`flex-1 text-sm text-foreground min-w-0 ${type === 'mono' ? 'font-mono' : ''} ${isMultiline ? 'whitespace-pre-line' : 'truncate'}`}>
        {value || '—'}
      </span>
    </div>
  )
}

function Section({
  title,
  fields,
  children,
  urgent = false,
}: {
  readonly title: string
  readonly fields: FieldDef[]
  readonly children?: React.ReactNode
  readonly urgent?: boolean
}) {
  return (
    <div className={`rounded-xl border p-5 ${urgent ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60' : 'bg-card border-border'}`}>
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${urgent ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground'}`}>
        {title}
      </h3>
      <div>
        {fields.map((f) => <FieldRow key={f.label} {...f} />)}
        {children}
      </div>
    </div>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────────

export function PersonalInfoTab({ employee, customFields = [], customFieldDefinitions = [] }: PersonalInfoTabProps) {
  const mergedCustomFields: CustomFieldValueDto[] = customFieldDefinitions
    .filter((d) => d.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((def) => {
      const existing = customFields.find((f) => f.definitionId === def.id)
      const raw = existing?.value ?? ''
      let display = raw
      if (def.fieldType === 'Select') {
        display = def.options.find((o) => o.value === raw)?.label ?? raw
      } else if (def.fieldType === 'MultiSelect') {
        display = raw.split(',').filter(Boolean).map((v) => def.options.find((o) => o.value === v)?.label ?? v).join(', ')
      } else if (def.fieldType === 'Checkbox') {
        display = raw === 'true' ? 'Có' : raw === 'false' ? 'Không' : raw
      }
      return { definitionId: def.id, code: def.code, name: def.name, fieldType: def.fieldType, group: def.group, sortOrder: def.sortOrder, value: display }
    })

  const personalFields: FieldDef[] = [
    { label: 'Họ và tên',                    value: employee.fullName },
    { label: 'Ngày sinh',                    value: employee.dateOfBirth },
    { label: 'Giới tính',                    value: GENDER_LABELS[employee.gender] ?? employee.gender },
    { label: 'Quốc tịch',                    value: employee.nationality },
    { label: 'Email',                         value: employee.personalEmail },
    { label: 'Số điện thoại',                value: employee.personalPhone },
    { label: 'Số CCCD / CMND',               value: employee.idNumber },
    { label: 'Số hộ chiếu',                  value: employee.passportNumber },
    { label: 'Ngày cấp CCCD',               value: employee.idExpiry },
    { label: 'Địa chỉ thường trú',           value: employee.permanentAddress, type: 'multiline' },
  ]

  const workFields: FieldDef[] = [
    { label: 'Mã nhân viên',   value: employee.employeeCode },
    { label: 'Phòng ban',      value: employee.department },
    { label: 'Quản lý',        value: employee.manager?.name ?? '—' },
    { label: 'Chức danh',      value: employee.position },
    { label: 'Loại hợp đồng',  value: employee.contractType },
    { label: 'Địa điểm',       value: employee.workLocation },
    { label: 'Lịch làm việc',  value: employee.workSchedule },
  ]

  const financeFields: FieldDef[] = [
    { label: 'Ngân hàng',     value: employee.bankAccount.bankName },
    { label: 'Số tài khoản',  value: employee.bankAccount.accountNumberMasked, type: 'mono' },
    { label: 'Chi nhánh',     value: employee.bankAccount.bankBranch ?? '' },
    { label: 'Mã số thuế',    value: employee.taxCode },
    { label: 'Số BHXH',       value: employee.socialInsuranceNumber },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Section title="Thông tin cá nhân" fields={personalFields} />
      <Section title="Công việc"         fields={workFields} />
      <Section title="Tài chính"         fields={financeFields} />

      {mergedCustomFields.length > 0 && (
        <div className="lg:col-span-2">
          <CustomFieldsSection customFields={mergedCustomFields} />
        </div>
      )}
    </div>
  )
}
