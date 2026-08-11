import { useState, useMemo } from 'react'
import { Check } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import type { DepartmentMemberResponse, UserSummaryResponse } from '../../../types/admin.types'

function userInitials(name: string) {
  return name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
}

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  allUsers: UserSummaryResponse[]
  isLoadingUsers: boolean
  currentMembers: DepartmentMemberResponse[]
  onAdd: (userIds: string[], startDate: string) => void
  isPending: boolean
}

export function AddMemberDialog({ open, onOpenChange, allUsers, isLoadingUsers, currentMembers, onAdd, isPending }: AddMemberDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<UserSummaryResponse[]>([])
  const [search, setSearch] = useState('')

  const assignedIds = useMemo(
    () => new Set(currentMembers.map(m => m.userId)),
    [currentMembers],
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return allUsers
    const query = search.toLowerCase()
    return allUsers.filter(user =>
      user.fullName.toLowerCase().includes(query) || user.employeeCode.toLowerCase().includes(query),
    )
  }, [allUsers, search])

  function toggleUser(user: UserSummaryResponse) {
    if (assignedIds.has(user.id)) return
    setSelectedUsers(prev =>
      prev.some(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user],
    )
  }

  const reset = () => { setSelectedUsers([]); setSearch('') }

  function handleSubmit() {
    if (selectedUsers.length === 0) return
    const startDate = new Date().toISOString().split('T')[0]
    onAdd(selectedUsers.map(u => u.id), startDate)
  }

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset() }}>
      <DialogContent className="sm:max-w-sm p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b">
          <DialogTitle className="text-sm">Thêm thành viên</DialogTitle>
        </DialogHeader>

        <Command shouldFilter={false} className="rounded-none border-0">
          <CommandInput
            placeholder="Tìm theo tên hoặc mã nhân viên..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-64">
            {isLoadingUsers ? (
              <div className="p-2 space-y-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-2.5 px-2 py-1.5">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <CommandEmpty className="py-8 text-xs text-muted-foreground">
                {search ? 'Không tìm thấy nhân sự' : 'Không có nhân sự'}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filtered.map(user => {
                  const isAssigned = assignedIds.has(user.id)
                  const isSelected = selectedUsers.some(s => s.id === user.id)
                  return (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      disabled={isAssigned}
                      onSelect={() => toggleUser(user)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-none',
                        isAssigned ? 'cursor-default' : 'cursor-pointer',
                        isSelected && 'bg-accent',
                      )}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="text-[10px] font-medium">{userInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate leading-none">{user.fullName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{user.employeeCode}</p>
                      </div>
                      {isAssigned ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded border border-muted-foreground/30 text-muted-foreground shrink-0 leading-none">
                          Đã có
                        </span>
                      ) : (
                        <Check className={cn('w-4 h-4 shrink-0 text-primary', isSelected ? 'opacity-100' : 'opacity-0')} />
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>

        {selectedUsers.length > 0 && (
          <div className="px-3 py-2 border-t bg-muted/30 flex items-center gap-2">
            <div className="flex -space-x-1.5 shrink-0">
              {selectedUsers.slice(0, 5).map(user => (
                <Avatar key={user.id} className="h-5 w-5 ring-1 ring-background">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="text-[8px]">{userInitials(user.fullName)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-muted-foreground flex-1">
              Đã chọn <span className="font-medium text-foreground">{selectedUsers.length}</span> nhân viên
            </span>
            <button
              type="button"
              onClick={reset}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        )}

        <div className="flex justify-end gap-2 px-4 py-3 border-t rounded-b-xl">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button size="sm" disabled={isPending || selectedUsers.length === 0} onClick={handleSubmit}>
            {isPending ? 'Đang thêm...' : selectedUsers.length > 0 ? `Thêm (${selectedUsers.length})` : 'Thêm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
