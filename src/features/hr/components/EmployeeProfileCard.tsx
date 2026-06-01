import { Calendar, MoreHorizontal, Pencil } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { EmployeeDetail, EmploymentType } from '../types/employee.types'

interface EmployeeProfileCardProps {
  readonly employee: EmployeeDetail
}

const EMPLOYMENT_BADGE: Record<EmploymentType, string> = {
  'Full-time': 'bg-[#5db872]/10 text-[#2d7a40]',
  'Part-time': 'bg-[#e8a55a]/10 text-[#9a6b2a]',
  'Contract':  'bg-[#5db8a6]/10 text-[#357a70]',
}

export function EmployeeProfileCard({ employee }: EmployeeProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0 self-start sm:self-auto">
          {employee.avatarUrl ? (
            <img
              src={employee.avatarUrl}
              alt={employee.fullName}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-semibold bg-[#cc785c]/15 text-[#a9583e] select-none">
              {employee.initials}
            </div>
          )}
          {/* Online status dot */}
          <span
            className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
              employee.isOnline ? 'bg-[#5db872]' : 'bg-[#8e8b82]'
            }`}
            aria-label={employee.isOnline ? 'Online' : 'Offline'}
          />
        </div>

        {/* Name & meta */}
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-2xl font-bold text-[#141413] font-display leading-tight truncate">
            {employee.fullName}
          </h1>
          <p className="text-base text-[#3d3d3a]">{employee.position}</p>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-[#efe9de] text-[#141413] border border-[#e6dfd8]">
              {employee.department}
            </span>
            <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${EMPLOYMENT_BADGE[employee.employmentType]}`}>
              {employee.employmentType}
            </span>
          </div>

          {/* Employee ID */}
          <p className="text-sm font-mono text-[#8e8b82] mt-0.5">{employee.employeeCode}</p>

          {/* Join date */}
          <div className="flex items-center gap-1.5 text-xs text-[#8e8b82]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Joined {employee.joinDate}</span>
          </div>
        </div>

        {/* Action cluster — pushed right */}
        <div className="flex items-center gap-2 sm:ml-auto flex-shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[#cc785c] text-[#cc785c] rounded-lg hover:bg-[#cc785c]/5 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="p-2 border border-[#e6dfd8] rounded-lg text-[#6c6a64] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuItem className="text-sm cursor-pointer">Reset Password</DropdownMenuItem>
              <DropdownMenuItem className="text-sm cursor-pointer">Export PDF</DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-[#c64545] focus:text-[#c64545] cursor-pointer">
                Deactivate Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
