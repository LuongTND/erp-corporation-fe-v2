import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { CustomFieldsSection } from '..'
import type { CustomFieldDefinitionResponse } from '@/features/admin/types/admin.types'
import type { EmployeeDetail } from '../../../types/employee.types'
import type { CustomFieldValueDto } from '../../../types/user-detail.types'
import { FieldCell } from './FieldCell'
import { InfoSection } from './InfoSection'

interface PersonalInfoTabProps {
  readonly employee: EmployeeDetail
  readonly customFields?: CustomFieldValueDto[]
  readonly customFieldDefinitions?: CustomFieldDefinitionResponse[]
}

const GENDER_LABELS: Record<string, string> = { Male: 'Nam', Female: 'Nữ', Other: 'Khác' }

function mergeCustomFields(
  definitions: CustomFieldDefinitionResponse[],
  values: CustomFieldValueDto[],
): CustomFieldValueDto[] {
  return definitions
    .filter(d => d.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(def => {
      const existing = values.find(f => f.definitionId === def.id)
      const raw = existing?.value ?? ''
      let display = raw
      if (def.fieldType === 'Select') {
        display = def.options.find(o => o.value === raw)?.label ?? raw
      } else if (def.fieldType === 'MultiSelect') {
        display = raw.split(',').filter(Boolean).map(v => def.options.find(o => o.value === v)?.label ?? v).join(', ')
      } else if (def.fieldType === 'Checkbox') {
        display = raw === 'true' ? 'Có' : raw === 'false' ? 'Không' : raw
      }
      return { definitionId: def.id, code: def.code, name: def.name, fieldType: def.fieldType, group: def.group, sortOrder: def.sortOrder, value: display }
    })
}

export function PersonalInfoTab({ employee, customFields = [], customFieldDefinitions = [] }: PersonalInfoTabProps) {
  const [insuranceHistoryOpen, setInsuranceHistoryOpen] = useState(false)
  const mergedCustomFields = mergeCustomFields(customFieldDefinitions, customFields)

  return (
    <div className="px-6">
      <InfoSection title="Thông tin chính" subtitle="Các thông tin cá nhân quan trọng">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
          <FieldCell label="Họ và tên"                  value={employee.fullName} />
          <FieldCell label="Mã nhân sự"                  value={employee.employeeCode} />
          <FieldCell label="Ngày bắt đầu"               value={employee.joinDate} />
          <FieldCell label="Ngày chính thức" />

          <FieldCell label="Trạng thái nhân sự" />
          <FieldCell label="Hợp đồng hiện tại"          value={employee.contractType} />
          <FieldCell label="Số điện thoại"              value={employee.personalPhone} />
          <FieldCell label="Chức danh"                  value={employee.position} />

          <FieldCell label="Ngày sinh"                  value={employee.dateOfBirth} />
          <FieldCell label="Địa chỉ email"              value={employee.personalEmail} />
          <FieldCell label="Giới tính"                  value={GENDER_LABELS[employee.gender] ?? employee.gender} />
          <FieldCell label="Tình trạng hôn nhân" />

          <FieldCell label="Văn phòng" />
          <FieldCell label="Lịch làm việc" />
          <FieldCell label="Khu vực / Chuyên môn" />
          <FieldCell label="Phân loại nhân sự"          value={employee.contractType} />

          <FieldCell label="Ghi chú thêm" fullWidth />
        </div>
      </InfoSection>

      <InfoSection title="Thuế và bảo hiểm" subtitle="Thông tin về thuế, bảo hiểm và các chính sách theo kèm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
          <FieldCell label="Mã số thuế"                        value={employee.taxCode} />
          <FieldCell label="Giảm trừ thuế thu nhập cá nhân" />
          <FieldCell label="Chính sách thuế" />
          <div />

          <FieldCell label="Số BHXH"                          value={employee.socialInsuranceNumber} />
          <FieldCell label="Nơi đăng ký BHXH" />
          <FieldCell label="Vùng lương" />
          <FieldCell label="Chính sách bảo hiểm" />
        </div>

        <button
          type="button"
          onClick={() => setInsuranceHistoryOpen(o => !o)}
          className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${insuranceHistoryOpen ? 'rotate-90' : ''}`} />
          Lịch sử tham gia các chính sách thuế &amp; bảo hiểm trong công ty
        </button>
        {insuranceHistoryOpen && (
          <p className="mt-2 text-xs text-muted-foreground px-4">Chưa có dữ liệu lịch sử.</p>
        )}
      </InfoSection>

      <InfoSection title="Thông tin cá nhân bổ sung" subtitle="Giấy tờ tùy thân và địa chỉ">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
          <FieldCell label="Số CCCD / CMND"  value={employee.idNumber} />
          <FieldCell label="Ngày cấp"        value={employee.idExpiry} />
          <FieldCell label="Nơi cấp" />
          <div />

          <FieldCell label="Số hộ chiếu"    value={employee.passportNumber} />
          <FieldCell label="Ngày hết hạn HC" />
          <div /><div />

          <FieldCell label="Địa chỉ thường trú" value={employee.permanentAddress} fullWidth />
        </div>
      </InfoSection>

      <InfoSection title="Thông tin ngân hàng" subtitle="Tài khoản ngân hàng để nhận lương">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
          <FieldCell label="Ngân hàng"    value={employee.bankAccount.bankName} />
          <FieldCell label="Số tài khoản" value={employee.bankAccount.accountNumberMasked} />
          <FieldCell label="Chi nhánh"    value={employee.bankAccount.bankBranch ?? undefined} />
          <div />
        </div>
      </InfoSection>

      {mergedCustomFields.length > 0 && (
        <div className="py-6">
          <CustomFieldsSection customFields={mergedCustomFields} />
        </div>
      )}
    </div>
  )
}
