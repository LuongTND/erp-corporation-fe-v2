import { CalendarOff, Edit, Eye, KeyRound, MoreHorizontal, Phone, Mail, UserX } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type {
  EmployeeListDepartment,
  EmployeeListItem,
  EmployeeListStatus,
} from '../../types/employee-list.types'

const departmentStyle: Record<EmployeeListDepartment, string> = {
  Engineering: 'bg-muted text-foreground',
  Sales: 'bg-muted/60 text-foreground',
  Marketing: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  HR: 'bg-primary/10 text-primary',
  Finance: 'bg-muted/50 text-foreground',
  Operations: 'bg-teal-500/15 text-teal-700 dark:text-teal-400',
}

const statusStyle: Record<EmployeeListStatus, string> = {
  Active: 'bg-green-500/12 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  'On Leave': 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  Probation: 'bg-muted text-muted-foreground',
  Resigned: 'bg-destructive/12 text-destructive',
}

function attendanceColor(percent: number) {
  if (percent >= 90) return 'bg-green-500'
  if (percent >= 75) return 'bg-amber-500'
  return 'bg-destructive'
}

interface EmployeeAvatarProps {
  initials: string
  size?: number
}

export function EmployeeAvatar({ initials, size = 40 }: EmployeeAvatarProps) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border border-border bg-muted font-semibold text-foreground"
      style={{ width: size, height: size, fontSize: size * 0.3 }}
    >
      {initials}
    </div>
  )
}

interface EmployeeDeptBadgeProps {
  dept: EmployeeListDepartment
}

export function EmployeeDeptBadge({ dept }: EmployeeDeptBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${departmentStyle[dept]}`}>
      {dept}
    </span>
  )
}

interface EmployeeStatusBadgeProps {
  status: EmployeeListStatus
}

export function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[status]}`}>
      {status}
    </span>
  )
}

interface EmployeeAttendanceBarProps {
  percent: number
}

export function EmployeeAttendanceBar({ percent }: EmployeeAttendanceBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
        <div className={`h-full rounded-full ${attendanceColor(percent)}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{percent}%</span>
    </div>
  )
}

interface EmployeeRowActionsProps {
  employee: EmployeeListItem
}

export function EmployeeRowActions({ employee }: EmployeeRowActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={`View profile ${employee.name}`}
        className="cursor-pointer rounded-md p-1.5 transition-colors hover:bg-muted/50"
      >
        <Eye className="h-4 w-4 text-muted-foreground" />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`More actions ${employee.name}`}
            className="cursor-pointer rounded-md p-1.5 transition-colors hover:bg-muted/50"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 border-border bg-card text-foreground">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <Edit className="h-3.5 w-3.5" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2">
            <KeyRound className="h-3.5 w-3.5" /> Reset Password
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2">
            <CalendarOff className="h-3.5 w-3.5" /> Mark Leave
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive">
            <UserX className="h-3.5 w-3.5" /> Deactivate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

interface EmployeeContactActionsProps {
  employee: EmployeeListItem
}

export function EmployeeContactActions({ employee }: EmployeeContactActionsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label={`View profile ${employee.name}`}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-muted/50"
      >
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      <button
        type="button"
        aria-label={`Contact phone ${employee.name}`}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-muted/50"
      >
        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      <button
        type="button"
        aria-label={`Send email ${employee.name}`}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-muted/50"
      >
        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </div>
  )
}
