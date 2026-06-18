import { Clock, Laptop, MapPin, Shield } from 'lucide-react'
import type { EmployeeDetail, WorkLocation } from '../../types/employee.types'

interface WorkInfoTabProps {
  readonly employee: EmployeeDetail
}

const LOCATION_STYLE: Record<WorkLocation, string> = {
  HQ:     'bg-primary/10 text-primary/80',
  Remote: 'bg-teal-500/15 text-teal-700 dark:text-teal-400',
  Hybrid: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
}

function FieldRow({ label, children }: {
  readonly label: string
  readonly children: React.ReactNode
}) {
  return (
    <div className="border-b border-border pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      {children}
    </div>
  )
}

export function WorkInfoTab({ employee }: WorkInfoTabProps) {
  const isExpiringSoon =
    employee.daysUntilContractExpiry !== undefined &&
    employee.daysUntilContractExpiry <= 30

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left — position & contract */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Position &amp; Contract</h3>
        <FieldRow label="Department">
          <p className="text-sm text-foreground">{employee.department}</p>
        </FieldRow>
        <FieldRow label="Position / Title">
          <p className="text-sm text-foreground">{employee.position}</p>
        </FieldRow>
        <FieldRow label="Direct Manager">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-foreground flex-shrink-0">
              {employee.manager.initials}
            </div>
            <span className="text-sm text-foreground">{employee.manager.name}</span>
            <a
              href={`/hr/employees/${employee.manager.id}`}
              className="text-xs text-primary hover:text-primary/80 transition-colors ml-1"
            >
              View profile
            </a>
          </div>
        </FieldRow>
        <FieldRow label="Work Location">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${LOCATION_STYLE[employee.workLocation]}`}>
            <MapPin className="w-3 h-3" />
            {employee.workLocation}
          </span>
        </FieldRow>
        <FieldRow label="Work Schedule">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-sm text-foreground">{employee.workSchedule}</p>
          </div>
        </FieldRow>
        <FieldRow label="Contract Type">
          <p className="text-sm text-foreground">{employee.contractType}</p>
        </FieldRow>
        <FieldRow label="Contract End Date">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-foreground">{employee.contractEndDate}</p>
            {isExpiringSoon && (
              <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/12 text-destructive">
                Expires in {employee.daysUntilContractExpiry} days
              </span>
            )}
          </div>
        </FieldRow>
      </div>

      {/* Right — compensation & access */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Compensation &amp; Access</h3>
        <FieldRow label="Salary Grade / Band">
          <p className="text-sm font-medium text-foreground">
            {employee.salaryGrade} · {employee.salaryRange}
          </p>
        </FieldRow>
        <FieldRow label="Probation Status">
          <p className="text-sm text-foreground">{employee.probationStatus}</p>
        </FieldRow>
        {employee.probationEndDate && (
          <FieldRow label="Probation End Date">
            <p className="text-sm text-foreground">{employee.probationEndDate}</p>
          </FieldRow>
        )}
        <FieldRow label="IT Equipment">
          <div className="flex flex-col gap-3 mt-1">
            {employee.itEquipment.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <Laptop className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.serialNumber}</p>
                  <p className="text-xs text-muted-foreground">Assigned {item.assignedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </FieldRow>
        <FieldRow label="System Access">
          <div className="flex flex-wrap gap-1.5 mt-1">
            {employee.systemRoles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-foreground"
              >
                <Shield className="w-3 h-3 text-muted-foreground" />
                {role}
              </span>
            ))}
          </div>
        </FieldRow>
      </div>
    </div>
  )
}
