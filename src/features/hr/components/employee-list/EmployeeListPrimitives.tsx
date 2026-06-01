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
  Engineering: 'bg-[#efe9de] text-[#141413]',
  Sales: 'bg-[#f5f0e8] text-[#3d3d3a]',
  Marketing: 'bg-[#e8a55a]/15 text-[#9a6b2a]',
  HR: 'bg-[#cc785c]/12 text-[#a9583e]',
  Finance: 'bg-[#e8e0d2] text-[#3d3d3a]',
  Operations: 'bg-[#5db8a6]/15 text-[#357a70]',
}

const statusStyle: Record<EmployeeListStatus, string> = {
  Active: 'bg-[#5db872]/12 text-[#2d7a40]',
  'On Leave': 'bg-[#e8a55a]/15 text-[#9a6b2a]',
  Probation: 'bg-[#efe9de] text-[#6c6a64]',
  Resigned: 'bg-[#c64545]/12 text-[#c64545]',
}

function attendanceColor(percent: number) {
  if (percent >= 90) return 'bg-[#5db872]'
  if (percent >= 75) return 'bg-[#e8a55a]'
  return 'bg-[#c64545]'
}

interface EmployeeAvatarProps {
  initials: string
  size?: number
}

export function EmployeeAvatar({ initials, size = 40 }: EmployeeAvatarProps) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border bg-[#efe9de] font-semibold text-[#141413]"
      style={{ width: size, height: size, fontSize: size * 0.3, borderColor: '#e6dfd8' }}
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
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#ebe6df]">
        <div className={`h-full rounded-full ${attendanceColor(percent)}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs" style={{ color: '#6c6a64' }}>{percent}%</span>
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
        className="cursor-pointer rounded-md p-1.5 transition-colors hover:bg-[#f5f0e8]"
      >
        <Eye className="h-4 w-4 text-[#6c6a64]" />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`More actions ${employee.name}`}
            className="cursor-pointer rounded-md p-1.5 transition-colors hover:bg-[#f5f0e8]"
          >
            <MoreHorizontal className="h-4 w-4 text-[#6c6a64]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 border-[#e6dfd8] bg-[#faf9f5] text-[#141413]">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <Edit className="h-3.5 w-3.5" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2">
            <KeyRound className="h-3.5 w-3.5" /> Reset Password
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2">
            <CalendarOff className="h-3.5 w-3.5" /> Mark Leave
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
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
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors hover:bg-[#f5f0e8]"
        style={{ borderColor: '#e6dfd8', backgroundColor: '#faf9f5' }}
      >
        <Eye className="h-3.5 w-3.5 text-[#6c6a64]" />
      </button>
      <button
        type="button"
        aria-label={`Contact phone ${employee.name}`}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors hover:bg-[#f5f0e8]"
        style={{ borderColor: '#e6dfd8', backgroundColor: '#faf9f5' }}
      >
        <Phone className="h-3.5 w-3.5 text-[#6c6a64]" />
      </button>
      <button
        type="button"
        aria-label={`Send email ${employee.name}`}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors hover:bg-[#f5f0e8]"
        style={{ borderColor: '#e6dfd8', backgroundColor: '#faf9f5' }}
      >
        <Mail className="h-3.5 w-3.5 text-[#6c6a64]" />
      </button>
    </div>
  )
}
