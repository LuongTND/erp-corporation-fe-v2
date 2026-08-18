import { useMemo, useState } from 'react'
import { UserCog, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  useAddDepartmentMembers,
  useDepartmentMembers,
  useRemoveDepartmentMember,
  useUpdateDepartmentMember,
} from '../../../hooks/use-departments'
import { useEmployees } from '../../../hooks/use-employees'
import type { DepartmentMemberResponse, DepartmentTreeResponse } from '../../../types/admin.types'
import type { JobLevelOption } from './types'
import { MemberRow } from './MemberRow'
import { AddMemberDialog } from './AddMemberDialog'

function groupByLevel(members: DepartmentMemberResponse[]) {
  const map = new Map<string, { levelName: string; order: number; items: DepartmentMemberResponse[] }>()
  for (const member of members) {
    const key = member.jobLevelId ?? '__none__'
    if (!map.has(key)) {
      map.set(key, { levelName: member.jobLevelName ?? 'Chưa có chức danh', order: member.jobLevelOrder ?? 999, items: [] })
    }
    map.get(key)!.items.push(member)
  }
  return [...map.values()].sort((a, b) => a.order - b.order)
}

interface MembersContentProps {
  readonly dept: DepartmentTreeResponse
  readonly jobLevels: JobLevelOption[]
  readonly addOpen: boolean
  readonly onAddOpenChange: (open: boolean) => void
}

export function MembersContent({ dept, jobLevels, addOpen, onAddOpenChange }: MembersContentProps) {
  const { data: members, isLoading } = useDepartmentMembers(dept.id)
  const { data: allUsers = [], isLoading: isLoadingUsers } = useEmployees(undefined, undefined, { enabled: addOpen })
  const addMembers = useAddDepartmentMembers()
  const updateMember = useUpdateDepartmentMember()
  const removeMember = useRemoveDepartmentMember()

  const [pendingRemove, setPendingRemove] = useState<{ userId: string; fullName: string } | null>(null)

  const grouped = useMemo(() => groupByLevel(members ?? []), [members])
  const total = members?.length ?? 0

  const handleLevelChange = (userId: string, jobLevelId: string | null) => {
    updateMember.mutate({ userId, departmentId: dept.id, data: { jobLevelId } })
  }

  const handleRemove = (userId: string, fullName: string) => {
    setPendingRemove({ userId, fullName })
  }

  const confirmRemove = () => {
    if (!pendingRemove) return
    removeMember.mutate({ userId: pendingRemove.userId, departmentId: dept.id })
    setPendingRemove(null)
  }

  const handleAdd = (userIds: string[], startDate: string) => {
    addMembers.mutate(
      { departmentId: dept.id, data: { userIds, startDate } },
      { onSuccess: () => onAddOpenChange(false) },
    )
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-2 space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                <div className="flex-1 space-y-1"><Skeleton className="h-3 w-28" /><Skeleton className="h-2.5 w-16" /></div>
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 gap-2 text-center">
            <UserCog className="w-7 h-7 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">Chưa có thành viên</p>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1 mt-1" onClick={() => onAddOpenChange(true)}>
              <Plus className="w-3 h-3" />Thêm ngay
            </Button>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.levelName}>
              <div className="px-3 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide bg-muted/30 border-b sticky top-0">
                {group.levelName} <span className="normal-case font-normal opacity-70">({group.items.length})</span>
              </div>
              {group.items.map(member => (
                <MemberRow
                  key={member.userDepartmentId}
                  member={member}
                  jobLevels={jobLevels}
                  isManager={member.userId === dept.managerId}
                  isUpdating={updateMember.isPending}
                  isRemoving={removeMember.isPending && pendingRemove?.userId === member.userId}
                  onLevelChange={handleLevelChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          ))
        )}
      </div>

      <AlertDialog open={!!pendingRemove} onOpenChange={open => !open && setPendingRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa khỏi phòng ban?</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa <span className="font-medium text-foreground">{pendingRemove?.fullName}</span> khỏi phòng ban này. Hành động này có thể hoàn tác bằng cách thêm lại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddMemberDialog
        open={addOpen}
        onOpenChange={onAddOpenChange}
        allUsers={allUsers}
        isLoadingUsers={isLoadingUsers}
        currentMembers={members ?? []}
        onAdd={handleAdd}
        isPending={addMembers.isPending}
      />
    </>
  )
}
