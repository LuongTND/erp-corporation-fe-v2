import { useRef, useState } from 'react'
import { AlertTriangle, Camera, Check, Loader2, Lock, MoreHorizontal, Pencil, Tag, Unlock, X } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useLabels, useAssignLabel, useRemoveLabel } from '@/features/admin/hooks/use-labels'
import type { EmployeeDetail } from '../../types/employee.types'
import { USER_STATUS } from '../../types/user-status.types'
import { AvatarCropDialog } from '../AvatarCropDialog'
import { LockEmployeeDialog } from './LockEmployeeDialog'
import { SidebarMetaRow } from './SidebarMetaRow'

export interface NavItem {
  value: string
  label: string
  description: string
}

interface EmployeeSidebarProps {
  readonly employee: EmployeeDetail
  readonly isLocked: boolean
  readonly status?: string
  readonly activeTab: string
  readonly navItems: NavItem[]
  readonly onTabChange: (value: string) => void
  readonly onEditClick?: () => void
  readonly onUploadAvatar: (file: File, callbacks: { onSettled: () => void }) => void
  readonly isUploadingAvatar: boolean
  readonly onLockEmployee?: (lock: boolean) => void
}

const LOCKED_STATUSES = [USER_STATUS.Resigned, USER_STATUS.Terminated] as const

const LOCK_BANNER: Record<string, string> = {
  [USER_STATUS.Resigned]:   'Hồ sơ nhân viên đã nghỉ việc. Không thể chỉnh sửa thông tin.',
  [USER_STATUS.Terminated]: 'Hồ sơ nhân viên đã bị chấm dứt hợp đồng. Không thể chỉnh sửa thông tin.',
}

function calcTenure(joinDate: string): string {
  if (!joinDate || joinDate === '—') return ''
  const start = new Date(joinDate.split('/').reverse().join('-'))
  if (isNaN(start.getTime())) return ''
  const now = new Date()
  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()
  if (months < 0) { years--; months += 12 }
  const parts: string[] = []
  if (years > 0) parts.push(`${years} năm`)
  if (months > 0) parts.push(`${months} tháng`)
  if (parts.length === 0) parts.push('< 1 tháng')
  return parts.join(' ') + ' làm việc'
}

export function EmployeeSidebar({
  employee, isLocked, status, activeTab, navItems, onTabChange,
  onEditClick, onUploadAvatar, isUploadingAvatar, onLockEmployee,
}: EmployeeSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [lockConfirmOpen, setLockConfirmOpen] = useState(false)
  const [labelPopoverOpen, setLabelPopoverOpen] = useState(false)
  const [pendingLabelId, setPendingLabelId] = useState<string | null>(null)

  const { data: allLabels = [] } = useLabels({ isActive: true })
  const assignLabel = useAssignLabel(employee.id)
  const removeLabel = useRemoveLabel(employee.id)
  const assignedIds = new Set(employee.labels.map(l => l.id))

  const isStatusLocked = LOCKED_STATUSES.includes(status as typeof LOCKED_STATUSES[number])
  const isEffectivelyLocked = isLocked || isStatusLocked
  const lockBannerMessage = status ? LOCK_BANNER[status] : undefined

  const handleToggleLabel = (labelId: string, assigned: boolean) => {
    setPendingLabelId(labelId)
    if (assigned) {
      removeLabel.mutate(labelId, { onSettled: () => setPendingLabelId(null) })
    } else {
      assignLabel.mutate(labelId, { onSettled: () => setPendingLabelId(null) })
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleCropConfirm = (blob: Blob) => {
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
    onUploadAvatar(file, { onSettled: () => setCropSrc(null) })
  }

  return (
    <>
      <aside className="w-64 shrink-0 flex flex-col border-r border-border bg-card overflow-y-auto">
        {/* Avatar + identity */}
        <div className="flex flex-col items-center gap-3 px-5 pt-6 pb-4 border-b border-border">
          <div className="relative group">
            {employee.avatarUrl ? (
              <img src={employee.avatarUrl} alt={employee.fullName} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold bg-primary/15 text-primary/80 select-none">
                {employee.initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-0.5 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
              aria-label="Đổi ảnh đại diện"
            >
              <Camera className="w-4 h-4 text-white" />
              <span className="text-[9px] text-white/80 leading-none">Đổi ảnh</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="text-center min-w-0 w-full">
            <h1 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{employee.fullName}</h1>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{employee.position}</p>
            {employee.joinDate && employee.joinDate !== '—' && (
              <p className="text-xs text-muted-foreground/70 mt-1">{calcTenure(employee.joinDate)}</p>
            )}
          </div>

          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={isEffectivelyLocked ? undefined : onEditClick}
              disabled={isEffectivelyLocked}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
              <DropdownMenuContent align="end" sideOffset={4} className="min-w-[180px]">
                <DropdownMenuItem className="text-sm cursor-pointer">Đặt lại mật khẩu</DropdownMenuItem>
                <DropdownMenuItem className="text-sm cursor-pointer">Xuất PDF</DropdownMenuItem>
                {onLockEmployee && (
                  <>
                    <DropdownMenuSeparator />
                    {isLocked ? (
                      <DropdownMenuItem className="text-sm cursor-pointer gap-2" onSelect={() => onLockEmployee(false)}>
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

        {/* Meta info */}
        <div className="px-5 py-3 border-b border-border space-y-2 text-xs">
          <SidebarMetaRow label="Mã NV"      value={employee.employeeCode} mono />
          <SidebarMetaRow label="Phòng ban"  value={employee.department} />
          <SidebarMetaRow label="Email"      value={employee.personalEmail || employee.id} />
          <SidebarMetaRow label="Điện thoại" value={employee.personalPhone} />
        </div>

        {/* Labels */}
        <div className="px-5 py-3 border-b border-border">
          <div className="flex flex-wrap gap-1">
            {employee.labels.map(label => {
              const isRemoving = pendingLabelId === label.id
              return (
                <span
                  key={label.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border"
                  style={{ backgroundColor: `${label.color}22`, color: label.color, borderColor: `${label.color}44`, opacity: isRemoving ? 0.5 : 1 }}
                >
                  {label.name}
                  {!isEffectivelyLocked && (
                    <button
                      type="button"
                      disabled={pendingLabelId !== null}
                      className="hover:opacity-70 cursor-pointer leading-none disabled:cursor-wait"
                      onClick={() => handleToggleLabel(label.id, true)}
                      aria-label={`Gỡ nhãn ${label.name}`}
                    >
                      {isRemoving ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <X className="w-2.5 h-2.5" />}
                    </button>
                  )}
                </span>
              )
            })}

            {!isEffectivelyLocked && (
              <Popover open={labelPopoverOpen} onOpenChange={setLabelPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    Thêm nhãn
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" sideOffset={4} className="w-48 p-1.5">
                  {allLabels.length === 0 ? (
                    <p className="text-xs text-muted-foreground px-2 py-1">Chưa có nhãn nào</p>
                  ) : (
                    <div className="space-y-0.5">
                      {allLabels.map(label => {
                        const assigned = assignedIds.has(label.id)
                        const isThisPending = pendingLabelId === label.id
                        const anyPending = pendingLabelId !== null
                        return (
                          <button
                            key={label.id}
                            type="button"
                            disabled={anyPending}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs hover:bg-muted/60 transition-colors cursor-pointer text-left disabled:cursor-wait disabled:opacity-50"
                            onClick={() => handleToggleLabel(label.id, assigned)}
                          >
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: label.color }} />
                            <span className="flex-1 truncate">{label.name}</span>
                            {isThisPending
                              ? <Loader2 className="w-3 h-3 flex-shrink-0 animate-spin text-muted-foreground" />
                              : assigned && <Check className="w-3 h-3 text-primary flex-shrink-0" />
                            }
                          </button>
                        )
                      })}
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Vertical nav */}
        <nav className="flex-1 py-2" aria-label="Mục nhân sự">
          {navItems.map(item => {
            const isActive = activeTab === item.value
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onTabChange(item.value)}
                className={`w-full text-left px-5 py-2.5 flex flex-col gap-0.5 transition-colors cursor-pointer border-l-2 ${
                  isActive
                    ? 'bg-primary/8 border-primary'
                    : 'border-transparent hover:bg-muted/50'
                }`}
              >
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>{item.label}</span>
                <span className="text-[11px] text-muted-foreground leading-tight line-clamp-1">{item.description}</span>
              </button>
            )
          })}
        </nav>

        {/* Lock banner */}
        {isEffectivelyLocked && (
          <div className="mx-3 mb-3 flex items-start gap-2 px-3 py-2.5 rounded-lg border border-amber-500/30 bg-amber-500/8">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300">Hồ sơ bị khóa</p>
              <p className="text-[11px] text-amber-600/80 dark:text-amber-400/70 mt-0.5 leading-tight">
                {lockBannerMessage ?? 'Tài khoản đã bị khóa bởi quản trị viên.'}
              </p>
            </div>
          </div>
        )}
      </aside>

      {cropSrc && (
        <AvatarCropDialog
          open
          imageSrc={cropSrc}
          onClose={() => setCropSrc(null)}
          onConfirm={handleCropConfirm}
          isPending={isUploadingAvatar}
        />
      )}

      <LockEmployeeDialog
        open={lockConfirmOpen}
        employeeName={employee.fullName}
        onOpenChange={setLockConfirmOpen}
        onConfirm={() => { onLockEmployee?.(true); setLockConfirmOpen(false) }}
      />
    </>
  )
}
