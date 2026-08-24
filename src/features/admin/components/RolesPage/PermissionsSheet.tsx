import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, Search, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import type { PermissionResponse, RoleResponse } from '../../types/admin.types'

interface PermissionsSheetProps {
  readonly open: boolean
  readonly role: RoleResponse | undefined
  readonly onOpenChange: (open: boolean) => void
  readonly allPermissions: PermissionResponse[]
  readonly isPermissionsLoading: boolean
  readonly onAssign: (payload: { roleId: string; toAdd: string[]; toRemove: string[] }) => void
  readonly isAssigning: boolean
}

function groupKey(code: string) {
  const parts = code.split(':')
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : (parts[0] ?? 'other')
}

function groupLabel(key: string) {
  const parts = key.split(':')
  return parts.length >= 2
    ? parts.slice(1).join(':').replace(/-/g, ' ')
    : key
}

function groupModule(key: string) {
  return key.split(':')[0]?.toUpperCase() ?? ''
}

interface PermGroupProps {
  readonly groupKey: string
  readonly perms: PermissionResponse[]
  readonly assigned: Set<string>
  readonly onToggle: (id: string) => void
  readonly onToggleAll: (ids: string[], checked: boolean) => void
  readonly defaultOpen: boolean
}

function PermGroup({ groupKey: gk, perms, assigned, onToggle, onToggleAll, defaultOpen }: PermGroupProps) {
  const [open, setOpen] = useState(defaultOpen)
  const assignedCount = perms.filter(p => assigned.has(p.id)).length
  const allChecked = assignedCount === perms.length
  const someChecked = assignedCount > 0 && !allChecked

  return (
    <div className="border-b last:border-b-0">
      <div
        className="flex items-center gap-2.5 px-4 py-2.5 bg-muted/30 hover:bg-muted/50 cursor-pointer select-none"
        onClick={() => setOpen(v => !v)}
      >
        <Checkbox
          checked={allChecked ? true : someChecked ? 'indeterminate' : false}
          onCheckedChange={checked => {
            onToggleAll(perms.map(p => p.id), !!checked)
          }}
          onClick={e => e.stopPropagation()}
          className="shrink-0"
        />
        {open
          ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        }
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex-1">
          <span className="text-muted-foreground/50 mr-1">{groupModule(gk)}</span>
          {groupLabel(gk)}
        </span>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {assignedCount}/{perms.length}
        </span>
      </div>

      {open && (
        <div className="divide-y divide-border/50">
          {perms.map(p => (
            <label
              key={p.id}
              className="flex items-start gap-3 px-4 py-2.5 hover:bg-accent/50 cursor-pointer"
            >
              <Checkbox
                checked={assigned.has(p.id)}
                onCheckedChange={() => onToggle(p.id)}
                className="mt-0.5 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-none">{p.permissionName}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">{p.permissionCode}</p>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export function PermissionsSheet({ open, role, onOpenChange, allPermissions, isPermissionsLoading: isLoading, onAssign, isAssigning }: PermissionsSheetProps) {
  const [assigned, setAssigned] = useState<Set<string>>(new Set())
  const originalRef = useRef<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (open && role) {
      const ids = new Set(role.permissions.map(p => p.id))
      originalRef.current = ids
      setAssigned(new Set(ids))
    }
    if (!open) setSearch('')
  }, [open])

  const toggle = (id: string) =>
    setAssigned(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleAll = (ids: string[], checked: boolean) =>
    setAssigned(prev => {
      const next = new Set(prev)
      ids.forEach(id => checked ? next.add(id) : next.delete(id))
      return next
    })

  const filtered = useMemo(() => {
    if (!search.trim()) return allPermissions
    const q = search.toLowerCase()
    return allPermissions.filter(p =>
      p.permissionCode.toLowerCase().includes(q) || p.permissionName.toLowerCase().includes(q)
    )
  }, [allPermissions, search])

  const groups = useMemo(() => {
    const map = new Map<string, PermissionResponse[]>()
    filtered.forEach(p => {
      const key = groupKey(p.permissionCode)
      const arr = map.get(key) ?? []
      arr.push(p)
      map.set(key, arr)
    })
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  const toAdd = [...assigned].filter(id => !originalRef.current.has(id))
  const toRemove = [...originalRef.current].filter(id => !assigned.has(id))
  const isDirty = toAdd.length > 0 || toRemove.length > 0

  const handleSave = () => {
    if (!role) return
    if (!isDirty) { onOpenChange(false); return }
    onAssign({ roleId: role.id, toAdd, toRemove })
  }

  const handleOpenChange = (next: boolean) => {
    if (!next && isDirty && !window.confirm('Bạn có thay đổi chưa lưu. Đóng sheet?')) return
    onOpenChange(next)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-[min(560px,95vw)] sm:max-w-none flex flex-col gap-0 p-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right animation-duration-300">
        <SheetHeader className="px-5 py-4 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 shrink-0" aria-hidden />
            Phân quyền — {role?.roleName}
            <Badge variant="secondary" className="ml-auto text-xs font-normal">
              {assigned.size} / {allPermissions.length} quyền
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 py-2.5 border-b shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Tìm quyền..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-9 rounded" />)}
            </div>
          ) : groups.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              {search ? `Không tìm thấy quyền phù hợp "${search}"` : 'Không có quyền nào'}
            </div>
          ) : (
            <div>
              {groups.map(([key, perms]) => (
                <PermGroup
                  key={key}
                  groupKey={key}
                  perms={perms}
                  assigned={assigned}
                  onToggle={toggle}
                  onToggleAll={toggleAll}
                  defaultOpen={groups.length <= 4}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-3.5 border-t shrink-0 flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {assigned.size} quyền đã gán
            {isDirty && (
              <span className="ml-2 text-amber-600 dark:text-amber-400">
                {toAdd.length > 0 && `+${toAdd.length}`}
                {toAdd.length > 0 && toRemove.length > 0 && ' '}
                {toRemove.length > 0 && `−${toRemove.length}`}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)}>Hủy</Button>
            <Button size="sm" onClick={handleSave} disabled={isAssigning || !isDirty}>
              {isAssigning ? 'Đang lưu...' : 'Lưu quyền hạn'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
