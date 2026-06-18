import { Calendar, MoreHorizontal, Pencil } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { EmployeeDetail, EmploymentType } from '../types/employee.types'

interface EmployeeProfileCardProps {
  readonly employee: EmployeeDetail
}

const EMPLOYMENT_BADGE: Record<EmploymentType, string> = {
  'Full-time': 'bg-green-500/12 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  'Part-time': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'Contract':  'bg-teal-500/15 text-teal-700 dark:text-teal-400',
}

export function EmployeeProfileCard({ employee }: EmployeeProfileCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm p-6">
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
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-semibold bg-primary/15 text-primary/80 select-none">
              {employee.initials}
            </div>
          )}
          {/* Online status dot */}
          <span
            className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
              employee.isOnline ? 'bg-green-500' : 'bg-muted-foreground'
            }`}
            aria-label={employee.isOnline ? 'Online' : 'Offline'}
          />
        </div>

        {/* Name & meta */}
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground font-display leading-tight truncate">
            {employee.fullName}
          </h1>
          <p className="text-base text-foreground">{employee.position}</p>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-foreground border border-border">
              {employee.department}
            </span>
            <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${EMPLOYMENT_BADGE[employee.employmentType]}`}>
              {employee.employmentType}
            </span>
          </div>

          {/* Employee ID */}
          <p className="text-sm font-mono text-muted-foreground mt-0.5">{employee.employeeCode}</p>

          {/* Join date */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Joined {employee.joinDate}</span>
          </div>
        </div>

        {/* Action cluster — pushed right */}
        <div className="flex items-center gap-2 sm:ml-auto flex-shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="p-2 border border-border rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuItem className="text-sm cursor-pointer">Reset Password</DropdownMenuItem>
              <DropdownMenuItem className="text-sm cursor-pointer">Export PDF</DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-destructive focus:text-destructive cursor-pointer">
                Deactivate Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
