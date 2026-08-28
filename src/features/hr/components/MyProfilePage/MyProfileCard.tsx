import { Pencil, Building2, Calendar, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { EmployeeDetail } from '../../types/employee.types'

const EMPLOYMENT_BADGE: Record<string, string> = {
  'Toàn thời gian': 'bg-green-500/12 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  'Bán thời gian':  'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'Thử việc':       'bg-teal-500/15 text-teal-700 dark:text-teal-400',
  'Thời vụ':        'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  'Cộng tác viên':  'bg-purple-500/15 text-purple-700 dark:text-purple-400',
}
const DEFAULT_BADGE = 'bg-muted text-muted-foreground'

interface MyProfileCardProps {
  readonly employee: EmployeeDetail
  readonly onEditClick: () => void
}

export function MyProfileCard({ employee, onEditClick }: MyProfileCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">

        {/* LEFT — identity */}
        <div className="flex items-start gap-4 p-5 md:w-[45%]">
          {/* Avatar — read-only, no upload hover */}
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

          {/* Name + action */}
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-foreground leading-tight truncate">{employee.fullName}</h1>
                <p className="text-sm text-muted-foreground truncate">{employee.position}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="flex-shrink-0 h-8 px-3 text-xs gap-1.5 border-primary/60 text-primary hover:bg-primary/5"
                onClick={onEditClick}
              >
                <Pencil className="w-3 h-3" />
                Chỉnh sửa
              </Button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-foreground border border-border">
                {employee.department}
              </span>
              {employee.contractType && (
                <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${EMPLOYMENT_BADGE[employee.contractType] ?? DEFAULT_BADGE}`}>
                  {employee.contractType}
                </span>
              )}
            </div>

            {/* Labels — read-only, no remove */}
            {employee.labels.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mt-1">
                {employee.labels.map(label => (
                  <span
                    key={label.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border"
                    style={{ backgroundColor: `${label.color}22`, color: label.color, borderColor: `${label.color}44` }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs font-mono text-muted-foreground/70 mt-0.5">{employee.employeeCode}</p>
          </div>
        </div>

        {/* RIGHT — key stats */}
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
              <p className="text-sm font-medium text-foreground truncate">{value || '—'}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export function MyProfileCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="flex items-start gap-4 p-5 md:w-[45%]">
          <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
            <div className="flex gap-1.5 pt-1">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border flex-1 md:rounded-r-xl overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card px-4 py-3 space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
