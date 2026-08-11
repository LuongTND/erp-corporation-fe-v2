import type { EmployeeListItem } from '../../types/employee-list.types'
import {
  EmployeeAvatar,
  EmployeeContactActions,
  EmployeeDeptBadge,
  EmployeeStatusBadge,
} from './EmployeeListPrimitives'

interface EmployeeListGridProps {
  employees: ReadonlyArray<EmployeeListItem>
}

export function EmployeeListGrid({ employees }: EmployeeListGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="cursor-pointer rounded-xl border border-border bg-card p-5 text-center shadow-sm transition-colors hover:bg-muted/40"
        >
          <div className="flex justify-center">
            <EmployeeAvatar initials={employee.initials} size={64} />
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">{employee.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{employee.position}</p>
          <div className="mt-2 flex justify-center">
            <EmployeeDeptBadge dept={employee.dept} />
          </div>
          <div className="mt-1.5 flex justify-center">
            <EmployeeStatusBadge status={employee.status} />
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <EmployeeContactActions employee={employee} />
          </div>
        </div>
      ))}
    </div>
  )
}
