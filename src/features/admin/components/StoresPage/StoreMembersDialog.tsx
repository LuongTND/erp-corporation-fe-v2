import { useMemo } from 'react'
import { Home, Loader2, Users, UserMinus, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import type { StoreMemberResponse, StoreResponse, UserSummaryResponse } from '../../types/admin.types'

function userInitials(name: string) {
  return name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
}

interface StoreMembersDialogProps {
  readonly store: StoreResponse | null
  readonly members: StoreMemberResponse[]
  readonly allUsers: UserSummaryResponse[]
  readonly isLoading: boolean
  readonly isAdding: boolean
  readonly isRemoving: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onAdd: (storeId: string, userId: string, isHomeStore: boolean) => void
  readonly onRemove: (storeId: string, userId: string) => void
}

export function StoreMembersDialog({
  store, members, allUsers, isLoading, isAdding, isRemoving,
  onOpenChange, onAdd, onRemove,
}: StoreMembersDialogProps) {
  const assignable = useMemo(() => {
    const memberIds = new Set(members.map(m => m.userId))
    return allUsers.filter(u => !memberIds.has(u.id))
  }, [members, allUsers])

  return (
    <Sheet open={store !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right animation-duration-300">
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 shrink-0">
          <SheetTitle className="text-base font-semibold">{store?.name}</SheetTitle>
          <SheetDescription className="flex items-center gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />
            Nhân sự biên chế · {members.length} người
          </SheetDescription>
        </SheetHeader>

        <Separator />

        {/* Add members — always visible */}
        <div className="shrink-0">
          <p className="px-5 pt-4 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Thêm nhân sự
          </p>
          <Command className="border-0">
            <div className="px-3 pb-1">
              <CommandInput placeholder="Tìm theo tên hoặc mã nhân viên..." className="h-9" />
            </div>
            <CommandList className="max-h-56 border-0">
              <CommandEmpty className="py-6 text-xs text-muted-foreground text-center">
                {assignable.length === 0 ? 'Tất cả nhân sự đã được thêm' : 'Không tìm thấy nhân sự'}
              </CommandEmpty>
              <CommandGroup className="px-2 pb-2">
                {assignable.map(u => (
                  <CommandItem
                    key={u.id}
                    value={`${u.fullName} ${u.employeeCode}`}
                    onSelect={() => store && onAdd(store.id, u.id, members.length === 0)}
                    disabled={isAdding}
                    className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={u.avatarUrl} />
                      <AvatarFallback className="text-[10px] font-medium">{userInitials(u.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate leading-none">{u.fullName}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{u.employeeCode}</p>
                    </div>
                    {isAdding
                      ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                      : <UserPlus className="h-4 w-4 shrink-0 text-emerald-600" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        <Separator />

        {/* Current members — scrollable */}
        <div className="flex flex-col flex-1 min-h-0">
          <p className="px-5 pt-4 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0">
            Danh sách hiện tại ({members.length})
          </p>
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            {isLoading ? (
              <div className="space-y-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-2 py-2.5">
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-8 w-8 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">Chưa có nhân sự biên chế</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Tìm và thêm nhân sự ở trên</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {members.map(m => (
                  <MemberRow key={m.userStoreId} member={m} storeName={store?.name} isRemoving={isRemoving}
                    onRemove={() => store && onRemove(store.id, m.userId)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MemberRowProps {
  readonly member: StoreMemberResponse
  readonly storeName?: string
  readonly isRemoving: boolean
  readonly onRemove: () => void
}

function MemberRow({ member, storeName, isRemoving, onRemove }: MemberRowProps) {
  return (
    <div className="flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-accent/50 transition-colors group">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={member.avatarUrl} />
        <AvatarFallback className="text-xs font-medium">{userInitials(member.fullName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate leading-none">{member.fullName}</p>
          {member.isHomeStore && (
            <Badge variant="secondary" className="text-[10px] gap-1 py-0 px-1.5 font-normal shrink-0 h-4">
              <Home className="h-2.5 w-2.5" />Chính
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          {member.employeeCode}{member.jobLevelName ? ` · ${member.jobLevelName}` : ''}
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost" size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={isRemoving}
          >
            <UserMinus className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 animation-duration-250">
          <AlertDialogHeader>
            <AlertDialogTitle>Gỡ nhân sự</AlertDialogTitle>
            <AlertDialogDescription>
              Gỡ <span className="font-medium text-foreground">{member.fullName}</span> khỏi{' '}
              <span className="font-medium text-foreground">{storeName}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onRemove}
            >
              Gỡ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
