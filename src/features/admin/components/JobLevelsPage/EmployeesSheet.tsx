import { useState } from 'react'
import { X, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { JobLevelResponse, UserSummaryResponse } from '../../types/admin.types'

function initials(name: string) {
  return name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
}

interface EmployeesSheetProps {
  level: JobLevelResponse | null
  open: boolean
  onOpenChange: (v: boolean) => void
  employees: UserSummaryResponse[]
  isLoadingEmployees: boolean
  onUnassign: (ids: string[]) => void
  isUnassigning: boolean
}

export function EmployeesSheet({ level, open, onOpenChange, employees, isLoadingEmployees, onUnassign, isUnassigning }: EmployeesSheetProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [unassignTarget, setUnassignTarget] = useState<UserSummaryResponse | 'bulk' | null>(null)

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(employees.map(e => e.id)) : new Set())

  const toggleOne = (id: string, checked: boolean) => {
    const next = new Set(selected)
    checked ? next.add(id) : next.delete(id)
    setSelected(next)
  }

  const handleUnassignConfirm = () => {
    if (!unassignTarget) return
    const ids = unassignTarget === 'bulk' ? [...selected] : [unassignTarget.id]
    onUnassign(ids)
    setSelected(new Set())
    setUnassignTarget(null)
  }

  const allChecked = employees.length > 0 && selected.size === employees.length
  const someChecked = selected.size > 0 && selected.size < employees.length

  return (
    <>
      <Sheet open={open} onOpenChange={v => { onOpenChange(v); setSelected(new Set()) }}>
        <SheetContent className="w-[420px] sm:w-[480px] flex flex-col">
          <SheetHeader className="shrink-0">
            <SheetTitle className="text-base">{level?.levelName}</SheetTitle>
            <SheetDescription className="text-xs">
              {isLoadingEmployees ? 'Đang tải...' : `${employees.length} nhân sự có cấp bậc này`}
            </SheetDescription>
          </SheetHeader>

          {selected.size > 0 && (
            <div className="shrink-0 flex items-center justify-between px-1 py-2 bg-primary/5 rounded-md border border-primary/20">
              <span className="text-xs text-primary font-medium">Đã chọn {selected.size} nhân sự</span>
              <Button
                variant="destructive"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => setUnassignTarget('bulk')}
                disabled={isUnassigning}
              >
                <X className="w-3 h-3" />
                Gỡ chức danh ({selected.size})
              </Button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            {isLoadingEmployees ? (
              <div className="space-y-2 pt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-2.5 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
                <Users className="w-8 h-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Chưa có nhân sự nào</p>
              </div>
            ) : (
              <div className="pt-2">
                <div className="flex items-center gap-3 px-1 py-1.5 border-b mb-1">
                  <Checkbox
                    checked={allChecked}
                    ref={el => { if (el) (el as HTMLButtonElement).dataset.indeterminate = someChecked ? 'true' : '' }}
                    onCheckedChange={toggleAll}
                    aria-label="Chọn tất cả"
                    className="data-[indeterminate=true]:bg-primary/50"
                  />
                  <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                    Nhân sự ({employees.length})
                  </span>
                </div>
                {employees.map(emp => (
                  <div
                    key={emp.id}
                    className="flex items-center gap-3 px-1 py-2 rounded-md hover:bg-muted/40 group transition-colors"
                  >
                    <Checkbox
                      checked={selected.has(emp.id)}
                      onCheckedChange={v => toggleOne(emp.id, !!v)}
                      aria-label={`Chọn ${emp.fullName}`}
                    />
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarImage src={emp.avatarUrl} />
                      <AvatarFallback className="text-[10px]">{initials(emp.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{emp.fullName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{emp.employeeCode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUnassignTarget(emp)}
                      disabled={isUnassigning}
                      aria-label={`Gỡ chức danh ${emp.fullName}`}
                      className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shrink-0 cursor-pointer disabled:opacity-40"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!unassignTarget} onOpenChange={v => { if (!v) setUnassignTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gỡ chức danh?</AlertDialogTitle>
            <AlertDialogDescription>
              {unassignTarget === 'bulk'
                ? `${selected.size} nhân sự sẽ bị gỡ khỏi chức danh "${level?.levelName}".`
                : `"${(unassignTarget as UserSummaryResponse)?.fullName}" sẽ bị gỡ khỏi chức danh "${level?.levelName}".`
              }
              {' '}Có thể gán lại sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnassignConfirm}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Gỡ chức danh
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
