import { AlertTriangle, Lock } from 'lucide-react'
import type { EmployeeDetail } from '../../types/employee.types'

interface PersonalInfoTabProps {
  readonly employee: EmployeeDetail
}

function FieldRow({ label, value, multiline = false }: {
  readonly label: string
  readonly value: string
  readonly multiline?: boolean
}) {
  return (
    <div className="border-b border-[#e6dfd8] pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
      <p className="text-xs font-medium uppercase tracking-wide text-[#6c6a64] mb-1">{label}</p>
      {multiline
        ? <p className="text-sm text-[#141413] whitespace-pre-line">{value}</p>
        : <p className="text-sm text-[#141413]">{value}</p>
      }
    </div>
  )
}

export function PersonalInfoTab({ employee }: PersonalInfoTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left — personal details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-[#141413] mb-4">Personal Details</h3>
        <FieldRow label="Full Name" value={employee.fullName} />
        <FieldRow label="Date of Birth" value={employee.dateOfBirth} />
        <FieldRow label="Gender" value={employee.gender} />
        <FieldRow label="Nationality" value={employee.nationality} />
        <FieldRow label="Personal Email" value={employee.personalEmail} />
        <FieldRow label="Personal Phone" value={employee.personalPhone} />
        <FieldRow label="ID / Passport Number" value={employee.idNumber} />
        <FieldRow label="ID / Passport Expiry" value={employee.idExpiry} />
        <FieldRow label="Permanent Address" value={employee.permanentAddress} multiline />
      </div>

      {/* Right — emergency, bank, insurance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-[#141413] mb-4">Emergency &amp; Financial</h3>

        {/* Emergency contact — amber callout */}
        <div className="bg-amber-50 rounded-lg p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Emergency Contact
            </span>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6c6a64] mb-0.5">Name</p>
              <p className="text-sm text-[#141413]">{employee.emergencyContact.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6c6a64] mb-0.5">Relationship</p>
              <p className="text-sm text-[#141413]">{employee.emergencyContact.relationship}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6c6a64] mb-0.5">Phone</p>
              <p className="text-sm text-[#141413]">{employee.emergencyContact.phone}</p>
            </div>
          </div>
        </div>

        <div className="border-b border-[#e6dfd8] pb-3 mb-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#6c6a64] mb-1">Bank Name</p>
          <p className="text-sm text-[#141413]">{employee.bankAccount.bankName}</p>
        </div>
        <div className="border-b border-[#e6dfd8] pb-3 mb-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#6c6a64] mb-1">Account Number</p>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#8e8b82]" />
            <p className="text-sm text-[#141413] font-mono">{employee.bankAccount.accountNumberMasked}</p>
          </div>
        </div>
        <div className="border-b border-[#e6dfd8] pb-3 mb-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#6c6a64] mb-1">
            Social Insurance Number
          </p>
          <p className="text-sm text-[#141413]">{employee.socialInsuranceNumber}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6c6a64] mb-1">Tax Code</p>
          <p className="text-sm text-[#141413]">{employee.taxCode}</p>
        </div>
      </div>
    </div>
  )
}
