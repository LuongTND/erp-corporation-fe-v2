import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { EmployeeListItem } from '../../types/employee-list.types'
import {
  EmployeeAttendanceBar,
  EmployeeAvatar,
  EmployeeDeptBadge,
  EmployeeRowActions,
  EmployeeStatusBadge,
} from './EmployeeListPrimitives'

const tableHeaders = ['Employee', 'ID', 'Department', 'Position', 'Status', 'Join Date', 'Attendance', 'Action']

interface EmployeeListTableProps {
  employees: ReadonlyArray<EmployeeListItem>
  checkedIds: ReadonlySet<string>
  allChecked: boolean
  onToggleAll: () => void
  onToggleRow: (id: string) => void
}

export function EmployeeListTable({
  employees,
  checkedIds,
  allChecked,
  onToggleAll,
  onToggleRow,
}: EmployeeListTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-[#faf9f5] shadow-sm" style={{ borderColor: '#e6dfd8', boxShadow: '0 1px 3px rgba(20,20,19,0.08)' }}>
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent" style={{ borderColor: '#e6dfd8' }}>
            <TableHead className="w-10 pl-4">
              <Checkbox checked={allChecked} onCheckedChange={onToggleAll} aria-label="Select all" />
            </TableHead>
            {tableHeaders.map((header) => (
              <TableHead
                key={header}
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: '#8e8b82' }}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee.id}
              className="cursor-pointer transition-colors hover:bg-[#f5f0e8]"
              style={{ borderColor: '#ebe6df' }}
            >
              <TableCell className="pl-4" onClick={(event) => event.stopPropagation()}>
                <Checkbox
                  checked={checkedIds.has(employee.id)}
                  onCheckedChange={() => onToggleRow(employee.id)}
                  aria-label={`Select ${employee.name}`}
                />
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <EmployeeAvatar initials={employee.initials} size={36} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#141413' }}>{employee.name}</p>
                    <p className="text-xs" style={{ color: '#8e8b82' }}>{employee.email}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <span className="font-mono text-sm" style={{ color: '#6c6a64' }}>{employee.id}</span>
              </TableCell>
              <TableCell><EmployeeDeptBadge dept={employee.dept} /></TableCell>
              <TableCell>
                <span className="text-sm" style={{ color: '#3d3d3a' }}>{employee.position}</span>
              </TableCell>
              <TableCell><EmployeeStatusBadge status={employee.status} /></TableCell>
              <TableCell>
                <span className="text-sm" style={{ color: '#6c6a64' }}>{employee.joinDate}</span>
              </TableCell>
              <TableCell><EmployeeAttendanceBar percent={employee.attendance} /></TableCell>
              <TableCell onClick={(event) => event.stopPropagation()}>
                <EmployeeRowActions employee={employee} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
