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

const tableHeaders = ['Nhân viên', 'Mã NV', 'Phòng ban', 'Chức vụ', 'Trạng thái', 'Ngày vào', 'Chuyên cần', 'Thao tác']

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
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="w-10 pl-4">
              <Checkbox checked={allChecked} onCheckedChange={onToggleAll} aria-label="Chọn tất cả" />
            </TableHead>
            {tableHeaders.map((header) => (
              <TableHead
                key={header}
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
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
              className="cursor-pointer border-border transition-colors hover:bg-muted/40"
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
                    <p className="text-sm font-medium text-foreground">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.email}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <span className="font-mono text-sm text-muted-foreground">{employee.id}</span>
              </TableCell>
              <TableCell><EmployeeDeptBadge dept={employee.dept} /></TableCell>
              <TableCell>
                <span className="text-sm text-foreground">{employee.position}</span>
              </TableCell>
              <TableCell><EmployeeStatusBadge status={employee.status} /></TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{employee.joinDate}</span>
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
