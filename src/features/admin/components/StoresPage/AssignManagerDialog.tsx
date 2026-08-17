import { Check, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { StoreResponse, UserSummaryResponse } from '../../types/admin.types'

function userInitials(name: string) {
  return name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
}

interface AssignManagerDialogProps {
  readonly store: StoreResponse | null
  readonly users: UserSummaryResponse[]
  readonly isSaving: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onAssign: (storeId: string, managerId: string | null) => void
}

export function AssignManagerDialog({ store, users, isSaving, onOpenChange, onAssign }: AssignManagerDialogProps) {
  return (
    <Dialog open={store !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b">
          <DialogTitle className="text-sm">Gán quản lý — {store?.name}</DialogTitle>
        </DialogHeader>

        <Command className="rounded-none border-0">
          <CommandInput placeholder="Tìm nhân sự..." />
          <CommandList className="max-h-64">
            <CommandEmpty className="py-8 text-xs text-muted-foreground">Không tìm thấy nhân sự</CommandEmpty>
            <CommandGroup>
              {users.map(u => {
                const isManager = store?.managerId === u.id
                return (
                  <CommandItem
                    key={u.id}
                    value={`${u.fullName} ${u.employeeCode}`}
                    onSelect={() => { if (store && !isManager) onAssign(store.id, u.id) }}
                    disabled={isSaving || isManager}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-none',
                      isManager ? 'cursor-default opacity-100' : 'cursor-pointer',
                    )}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={u.avatarUrl} />
                      <AvatarFallback className="text-[10px] font-medium">{userInitials(u.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate leading-none">{u.fullName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{u.employeeCode}</p>
                    </div>
                    {isManager && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-primary/40 text-primary shrink-0 leading-none">
                        Quản lý
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>

        <div className="flex items-center justify-between gap-2 px-4 py-3 border-t">
          {store?.managerId ? (
            <Button variant="outline" size="sm" disabled={isSaving}
              onClick={() => { if (store) onAssign(store.id, null) }}>
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Gỡ quản lý'}
            </Button>
          ) : <span />}
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Đóng</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
