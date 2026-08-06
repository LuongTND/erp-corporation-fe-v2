import { Building2, Calendar, MapPin, MoreHorizontal, Pencil, User } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { EmployeeDetail, EmploymentType } from '../types/employee.types'

interface EmployeeProfileCardProps {
  readonly employee: EmployeeDetail
  readonly onEditClick?: () => void
}

const EMPLOYMENT_BADGE: Record<EmploymentType, string> = {
  'Full-time': 'bg-green-500/12 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  'Part-time': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'Contract':  'bg-teal-500/15 text-teal-700 dark:text-teal-400',
}

export function EmployeeProfileCard({ employee, onEditClick }: EmployeeProfileCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">

        {/* LEFT — identity */}
        <div className="flex items-start gap-4 p-5 md:w-[45%]">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {employee.avatarUrl ? (
              <img src={employee.avatarUrl} alt={employee.fullName} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold bg-primary/15 text-primary/80 select-none">
                {employee.initials}
              </div>
            )}
            <span
              className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${employee.isOnline ? 'bg-green-500' : 'bg-muted-foreground'}`}
              aria-label={employee.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
            />
          </div>

          {/* Name block */}
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-foreground leading-tight truncate">{employee.fullName}</h1>
                <p className="text-sm text-muted-foreground truncate">{employee.position}</p>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={onEditClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-primary/60 text-primary rounded-md hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  Chỉnh sửa
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="p-1.5 border border-border rounded-md text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                      aria-label="Thêm tùy chọn"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[180px]">
                    <DropdownMenuItem className="text-sm cursor-pointer">Đặt lại mật khẩu</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm cursor-pointer">Xuất PDF</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm text-destructive focus:text-destructive cursor-pointer">
                      Vô hiệu hóa tài khoản
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-foreground border border-border">
                {employee.department}
              </span>
              <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${EMPLOYMENT_BADGE[employee.employmentType]}`}>
                {employee.employmentType}
              </span>
            </div>

            <p className="text-xs font-mono text-muted-foreground/70 mt-0.5">{employee.employeeCode}</p>
          </div>
        </div>

        {/* RIGHT — key stats grid */}
        <div className="grid grid-cols-2 gap-px bg-border flex-1 md:rounded-r-xl overflow-hidden">
          {[
            { icon: Building2, label: 'Phòng ban', value: employee.department },
            { icon: MapPin,     label: 'Địa điểm',  value: employee.workLocation },
            { icon: User,       label: 'Quản lý',   value: employee.manager?.name ?? '—' },
            { icon: Calendar,   label: 'Vào làm',   value: employee.joinDate },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-card px-4 py-3 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="w-3 h-3" />
                {label}
              </div>
              <p className="text-sm font-medium text-foreground truncate">{value}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
