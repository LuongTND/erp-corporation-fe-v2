import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, Shield, X, GripVertical, ArrowRight } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import type { PermissionResponse, RoleResponse } from '../../types/admin.types'
import { cn } from '@/lib/utils'

interface PermissionsSheetProps {
  open: boolean
  role: RoleResponse | undefined
  onOpenChange: (open: boolean) => void
  allPermissions: PermissionResponse[]
  isPermissionsLoading: boolean
  onAssign: (payload: { roleId: string; toAdd: string[]; toRemove: string[] }) => void
  isAssigning: boolean
}

// ── Draggable permission chip ──────────────────────────────────────────────
function DraggableChip({
  id,
  label,
  containerId,
  onRemove,
}: {
  id: string
  label: string
  containerId: string
  onRemove?: () => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${containerId}:${id}`,
    data: { permId: id, from: containerId },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-md border bg-card text-xs',
        'cursor-grab active:cursor-grabbing select-none transition-all',
        isDragging ? 'opacity-0' : 'hover:border-primary/50 hover:bg-accent',
      )}
    >
      <span {...attributes} {...listeners} className="touch-none">
        <GripVertical className="h-3 w-3 text-muted-foreground/50 shrink-0" />
      </span>
      <span className="truncate max-w-[140px]" title={label}>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-auto text-muted-foreground/50 hover:text-destructive transition-colors shrink-0"
          aria-label={`Gỡ quyền ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

// ── Droppable panel ────────────────────────────────────────────────────────
function DroppablePanel({
  id,
  children,
  isEmpty,
  placeholder,
  isOver,
}: {
  id: string
  children: React.ReactNode
  isEmpty: boolean
  placeholder: string
  isOver?: boolean
}) {
  const { setNodeRef, isOver: dndOver } = useDroppable({ id })
  const over = isOver ?? dndOver

  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-full rounded-lg border-2 border-dashed transition-colors p-3',
          over ? 'border-primary bg-primary/5' : 'border-border bg-muted/20',
        )}
      >
        {isEmpty ? (
          <div className="min-h-[160px] flex items-center justify-center text-xs text-muted-foreground text-center p-4">
            {placeholder}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">{children}</div>
        )}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export function PermissionsSheet({ open, role, onOpenChange, allPermissions, isPermissionsLoading: isLoading, onAssign, isAssigning }: PermissionsSheetProps) {

  const [assigned, setAssigned] = useState<Set<string>>(new Set())
  const originalRef = useRef<Set<string>>(new Set())
  const [searchAvail, setSearchAvail] = useState('')
  const [searchAssigned, setSearchAssigned] = useState('')
  const [activeChip, setActiveChip] = useState<{ id: string; label: string } | null>(null)

  useEffect(() => {
    if (open && role) {
      const ids = new Set(role.permissions.map((p) => p.id))
      originalRef.current = ids
      setAssigned(new Set(ids))
    }
    if (!open) { setSearchAvail(''); setSearchAssigned('') }
  }, [open])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  )

  // Split into available vs assigned
  const { available, assignedList } = useMemo(() => {
    const all = allPermissions
    const qAvail = searchAvail.toLowerCase()
    const qAssigned = searchAssigned.toLowerCase()
    return {
      available: all.filter((p) => !assigned.has(p.id) && (!qAvail || p.permissionCode.toLowerCase().includes(qAvail) || p.permissionName.toLowerCase().includes(qAvail))),
      assignedList: all.filter((p) => assigned.has(p.id) && (!qAssigned || p.permissionCode.toLowerCase().includes(qAssigned) || p.permissionName.toLowerCase().includes(qAssigned))),
    }
  }, [allPermissions, assigned, searchAvail, searchAssigned])

  const groupByResource = (list: typeof available) =>
    list.reduce<Record<string, typeof available>>((acc, p) => {
      const resource = p.permissionCode.split(':')[0] ?? 'other'
      ;(acc[resource] ??= []).push(p)
      return acc
    }, {})

  // Group available by resource
  const grouped = useMemo(() => groupByResource(available), [available])
  const groupedAssigned = useMemo(() => groupByResource(assignedList), [assignedList])

  const assign = (id: string) => setAssigned((prev) => new Set([...prev, id]))
  const unassign = (id: string) => setAssigned((prev) => { const next = new Set(prev); next.delete(id); return next })

  const handleDragStart = (event: DragStartEvent) => {
    const { permId, from } = event.active.data.current as { permId: string; from: string }
    const perm = allPermissions?.find((p) => p.id === permId)
    if (perm) setActiveChip({ id: permId, label: perm.permissionName })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveChip(null)
    const { over, active } = event
    if (!over) return
    const { permId, from } = active.data.current as { permId: string; from: string }
    const to = over.id as string
    if (from === 'available' && to === 'assigned') assign(permId)
    else if (from === 'assigned' && to === 'available') unassign(permId)
  }

  const toAdd = [...assigned].filter((id) => !originalRef.current.has(id))
  const toRemove = [...originalRef.current].filter((id) => !assigned.has(id))
  const isDirty = toAdd.length > 0 || toRemove.length > 0

  const handleSave = () => {
    if (!role) return
    if (!isDirty) { onOpenChange(false); return }
    onAssign({ roleId: role.id, toAdd, toRemove })
    // parent closes sheet after onSuccess — ensures role data is fresh when user reopens
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && isDirty && !window.confirm('Bạn có thay đổi chưa lưu. Đóng sheet?')) return
    onOpenChange(open)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-[min(800px,95vw)] sm:max-w-none flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" aria-hidden="true" />
            Phân quyền — {role?.roleName}
            <Badge variant="secondary" className="ml-auto text-xs font-normal">
              {assigned.size} quyền đã gán
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <DndContext
            sensors={sensors}
            modifiers={[restrictToWindowEdges]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {isLoading ? (
              <div className="p-6 grid grid-cols-2 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 rounded-md" />
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-hidden grid grid-cols-2 gap-0 divide-x">
                {/* ── LEFT: available ─────────────────────────────── */}
                <div className="flex flex-col overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Có sẵn
                      </span>
                      <span className="text-xs text-muted-foreground">{available.length} quyền</span>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Tìm quyền..."
                        value={searchAvail}
                        onChange={(e) => setSearchAvail(e.target.value)}
                        className="pl-8 h-7 text-xs"
                      />
                    </div>
                  </div>

                  <DroppablePanel id="available" isEmpty={available.length === 0} placeholder="Tất cả quyền đã được gán">
                    <div className="w-full space-y-3">
                      {Object.entries(grouped).map(([resource, perms]) => (
                        <div key={resource}>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5 px-0.5">
                            {resource}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {perms.map((p) => (
                                <button
                                  key={p.id}
                                  onClick={() => assign(p.id)}
                                  className="group relative"
                                  title={p.permissionCode}
                                >
                                  <DraggableChip id={p.id} label={p.permissionName} containerId="available" />
                                  <ArrowRight className="absolute -right-1 -top-1 h-3 w-3 bg-primary text-primary-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </button>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DroppablePanel>
                </div>

                {/* ── RIGHT: assigned ──────────────────────────────── */}
                <div className="flex flex-col overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Đã gán
                      </span>
                      <span className="text-xs text-muted-foreground">{assignedList.length} quyền</span>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Lọc đã gán..."
                        value={searchAssigned}
                        onChange={(e) => setSearchAssigned(e.target.value)}
                        className="pl-8 h-7 text-xs"
                      />
                    </div>
                  </div>

                  <DroppablePanel
                    id="assigned"
                    isEmpty={assignedList.length === 0}
                    placeholder={'Kéo quyền vào đây để gán\nhoặc click vào quyền bên trái'}
                  >
                    <div className="w-full space-y-3">
                      {Object.entries(groupedAssigned).map(([resource, perms]) => (
                        <div key={resource}>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5 px-0.5">
                            {resource}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {perms.map((p) => (
                                <DraggableChip
                                  key={p.id}
                                  id={p.id}
                                  label={p.permissionName}
                                  containerId="assigned"
                                  onRemove={() => unassign(p.id)}
                                />
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DroppablePanel>
                </div>
              </div>
            )}

            <DragOverlay modifiers={[restrictToWindowEdges]}>
              {activeChip && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-primary bg-card shadow-xl text-xs opacity-95 cursor-grabbing pointer-events-none">
                  <GripVertical className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                  <span>{activeChip.label}</span>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>

        <div className="px-6 py-4 border-t flex justify-between items-center shrink-0 gap-3">
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>{assigned.size} quyền được gán</p>
            {isDirty && (
              <p className="text-amber-600 dark:text-amber-400">
                {toAdd.length > 0 && `+${toAdd.length} thêm`}
                {toAdd.length > 0 && toRemove.length > 0 && ', '}
                {toRemove.length > 0 && `−${toRemove.length} gỡ`}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={isAssigning}>
              {isAssigning ? 'Đang lưu...' : 'Lưu quyền hạn'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
