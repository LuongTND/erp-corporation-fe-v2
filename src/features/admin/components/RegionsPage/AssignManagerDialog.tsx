import { useState } from 'react'
import { UserMinus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { RegionResponse, UserSummaryResponse } from '../../types/admin.types'

function userInitials(name: string) {
  return name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
}

interface AssignManagerDialogProps {
  readonly region: RegionResponse | null
  readonly users: UserSummaryResponse[]
  readonly isSaving: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onAssign: (regionId: string, managerId: string | null) => void
}

export function AssignManagerDialog({ region, users, isSaving, onOpenChange, onAssign }: AssignManagerDialogProps) {
  const [confirm, setConfirm] = useState<'remove' | UserSummaryResponse | null>(null)

  const currentManager = users.find(u => u.id === region?.managerId)
  const candidates = users.filter(u => u.id !== region?.managerId)

  function handleSelect(user: UserSummaryResponse) {
    if (!region) return
    if (currentManager) {
      setConfirm(user)
    } else {
      onAssign(region.id, user.id)
    }
  }

  const pendingUser = typeof confirm === 'object' && confirm !== null ? confirm : null

  return (
    <>
      <Dialog open={region !== null} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm p-0 gap-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250">
          <DialogHeader className="px-4 pt-4 pb-3 border-b">
            <DialogTitle className="text-sm">Gán quản lý — {region?.name}</DialogTitle>
          </DialogHeader>

          {/* Current manager */}
          {currentManager ? (
            <div className="px-4 py-3 border-b bg-muted/30">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Quản lý hiện tại</p>
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={currentManager.avatarUrl} />
                  <AvatarFallback className="text-[10px] font-medium">{userInitials(currentManager.fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate leading-none">{currentManager.fullName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{currentManager.employeeCode}</p>
                </div>
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  disabled={isSaving}
                  onClick={() => setConfirm('remove')}
                  title="Gỡ quản lý"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2.5 border-b">
              <p className="text-xs text-amber-600 dark:text-amber-400">Khu vực chưa có quản lý</p>
            </div>
          )}

          {/* Candidate list */}
          <Command className="rounded-none border-0">
            <CommandInput placeholder={currentManager ? 'Tìm để thay thế...' : 'Tìm nhân sự...'} />
            <CommandList className="max-h-56">
              <CommandEmpty className="py-8 text-xs text-muted-foreground">Không tìm thấy nhân sự</CommandEmpty>
              <CommandGroup>
                {candidates.map(u => (
                  <CommandItem
                    key={u.id}
                    value={`${u.fullName} ${u.employeeCode}`}
                    onSelect={() => handleSelect(u)}
                    disabled={isSaving}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-none cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={u.avatarUrl} />
                      <AvatarFallback className="text-[10px] font-medium">{userInitials(u.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate leading-none">{u.fullName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{u.employeeCode}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          <div className="flex justify-end px-4 py-3 border-t">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirm === 'remove'} onOpenChange={open => { if (!open) setConfirm(null) }}>
        <AlertDialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250">
          <AlertDialogHeader>
            <AlertDialogTitle>Gỡ quản lý khu vực?</AlertDialogTitle>
            <AlertDialogDescription>
              Khu vực <span className="font-medium text-foreground">{region?.name}</span> sẽ không có quản lý sau khi gỡ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSaving}
              onClick={() => { if (region) onAssign(region.id, null); setConfirm(null) }}
            >
              Gỡ quản lý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={pendingUser !== null} onOpenChange={open => { if (!open) setConfirm(null) }}>
        <AlertDialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250">
          <AlertDialogHeader>
            <AlertDialogTitle>Thay quản lý khu vực?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">{currentManager?.fullName}</span> sẽ bị thay bởi{' '}
              <span className="font-medium text-foreground">{pendingUser?.fullName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSaving}
              onClick={() => { if (region && pendingUser) onAssign(region.id, pendingUser.id); setConfirm(null) }}
            >
              Thay thế
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
