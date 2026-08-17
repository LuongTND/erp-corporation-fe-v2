import { useRef, useState } from 'react'
import { AlertTriangle, Building2, Calendar, Camera, Lock, MapPin, MoreHorizontal, Pencil, Unlock, User } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { EmployeeDetail } from '../types/employee.types'
import { USER_STATUS } from '../types/user-status.types'
import { AvatarCropDialog } from './AvatarCropDialog'

interface EmployeeProfileCardProps {
  readonly employee: EmployeeDetail
  readonly isLocked: boolean
  readonly status?: string
  readonly onEditClick?: () => void
  readonly onUploadAvatar: (file: File, callbacks: { onSettled: () => void }) => void
  readonly isUploadingAvatar: boolean
  readonly onLockEmployee?: (lock: boolean) => void
}

const EMPLOYMENT_BADGE: Record<string, string> = {
  'Toàn thời gian': 'bg-green-500/12 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  'Bán thời gian':  'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'Thử việc':       'bg-teal-500/15 text-teal-700 dark:text-teal-400',
  'Thời vụ':        'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  'Cộng tác viên':  'bg-purple-500/15 text-purple-700 dark:text-purple-400',
}
const DEFAULT_BADGE = 'bg-muted text-muted-foreground'

const LOCKED_STATUSES = [USER_STATUS.Resigned, USER_STATUS.Terminated] as const

const LOCK_BANNER: Record<string, { label: string; message: string }> = {
  [USER_STATUS.Resigned]:   { label: 'Đã nghỉ việc',  message: 'Hồ sơ nhân viên đã nghỉ việc. Không thể chỉnh sửa thông tin.' },
  [USER_STATUS.Terminated]: { label: 'Đã chấm dứt',  message: 'Hồ sơ nhân viên đã bị chấm dứt hợp đồng. Không thể chỉnh sửa thông tin.' },
}

export function EmployeeProfileCard({ employee, isLocked, status, onEditClick, onUploadAvatar, isUploadingAvatar, onLockEmployee }: EmployeeProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [lockConfirmOpen, setLockConfirmOpen] = useState(false)

  const isStatusLocked = LOCKED_STATUSES.includes(status as typeof LOCKED_STATUSES[number])
  const isEffectivelyLocked = isLocked || isStatusLocked
  const lockBanner = status ? LOCK_BANNER[status] : undefined

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCropConfirm = (blob: Blob) => {
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
    onUploadAvatar(file, { onSettled: () => setCropSrc(null) })
  }

  return (
    <>
      <div className="bg-card rounded-xl border border-border">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">

          {/* LEFT — identity */}
          <div className="flex items-start gap-4 p-5 md:w-[45%]">
            {/* Avatar */}
            <div className="relative flex-shrink-0 group">
              {employee.avatarUrl ? (
                <img src={employee.avatarUrl} alt={employee.fullName} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold bg-primary/15 text-primary/80 select-none">
                  {employee.initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
                aria-label="Đổi ảnh đại diện"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
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
                    onClick={isEffectivelyLocked ? undefined : onEditClick}
                    disabled={isEffectivelyLocked}
                    title={isEffectivelyLocked ? 'Hồ sơ đã bị khóa, không thể chỉnh sửa' : undefined}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-primary/60 text-primary rounded-md hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
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
                      {onLockEmployee && (
                        <>
                          <DropdownMenuSeparator />
                          {isLocked ? (
                            <DropdownMenuItem
                              className="text-sm cursor-pointer gap-2"
                              onSelect={() => onLockEmployee(false)}
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              Mở khóa tài khoản
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-sm text-destructive focus:text-destructive cursor-pointer gap-2"
                              onSelect={() => setLockConfirmOpen(true)}
                            >
                              <Lock className="w-3.5 h-3.5" />
                              Khóa tài khoản
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-foreground border border-border">
                  {employee.department}
                </span>
                <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${EMPLOYMENT_BADGE[employee.contractType] ?? DEFAULT_BADGE}`}>
                  {employee.contractType}
                </span>
                {isStatusLocked && lockBanner && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 dark:text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    {lockBanner.label}
                  </span>
                )}
                {isLocked && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                    <Lock className="w-3 h-3" />
                    Đã khóa
                  </span>
                )}
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

      {isEffectivelyLocked && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-amber-500/30 bg-amber-500/8 dark:bg-amber-500/10">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Hồ sơ bị khóa — chỉ xem</p>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5">
              {lockBanner?.message ?? 'Tài khoản đã bị khóa bởi quản trị viên. Liên hệ HR để được hỗ trợ.'}
            </p>
          </div>
        </div>
      )}

      {cropSrc && (
        <AvatarCropDialog
          open
          imageSrc={cropSrc}
          onClose={() => setCropSrc(null)}
          onConfirm={handleCropConfirm}
          isPending={isUploadingAvatar}
        />
      )}

      <AlertDialog open={lockConfirmOpen} onOpenChange={setLockConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Khóa tài khoản?</AlertDialogTitle>
            <AlertDialogDescription>
              Nhân viên <strong>{employee.fullName}</strong> sẽ không thể đăng nhập sau khi bị khóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { onLockEmployee?.(true); setLockConfirmOpen(false) }}
            >
              Khóa tài khoản
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
