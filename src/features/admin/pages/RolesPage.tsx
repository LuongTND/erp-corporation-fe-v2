import { useEffect, useState } from 'react'
import { ArrowUpDown, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
import { useDeleteRole, useRoles } from '../hooks/use-roles'
import type { RoleResponse } from '../types/admin.types'
import { RoleDialog } from '../components/RolesPage/RoleDialog'
import { PermissionsSheet } from '../components/RolesPage/PermissionsSheet'
import { SortableRoleRow } from '../components/RolesPage/SortableRoleRow'

type SortKey = 'roleName' | 'permissions'
type SortDir = 'asc' | 'desc'
type TypeFilter = 'all' | 'system' | 'custom'

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />
  return sortDir === 'asc'
    ? <ChevronUp className="h-3 w-3 ml-1" />
    : <ChevronDown className="h-3 w-3 ml-1" />
}

export default function RolesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('roleName')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editRole, setEditRole] = useState<RoleResponse | undefined>()
  const [permSheet, setPermSheet] = useState<RoleResponse | undefined>()
  const [localRoles, setLocalRoles] = useState<RoleResponse[]>([])
  const [activeRole, setActiveRole] = useState<RoleResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<RoleResponse | null>(null)

  const { data, isLoading } = useRoles()
  const deleteRole = useDeleteRole()

  useEffect(() => {
    if (data) setLocalRoles(data)
  }, [data])

  const isSearching = search.trim().length > 0
  const isFiltering = typeFilter !== 'all' || isSearching

  // ponytail: client-side filter+sort — BE has no search/sort params (≤100 roles)
  const displayRoles = [...localRoles]
    .filter((r) => {
      if (isSearching && !r.roleName.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter === 'system' && !r.isSystemRole) return false
      if (typeFilter === 'custom' && r.isSystemRole) return false
      return true
    })
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'roleName') return mul * a.roleName.localeCompare(b.roleName)
      return mul * (a.permissions.length - b.permissions.length)
    })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveRole(localRoles.find((r) => r.id === event.active.id) ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveRole(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    setLocalRoles((prev) => {
      const oldIdx = prev.findIndex((r) => r.id === active.id)
      const newIdx = prev.findIndex((r) => r.id === over.id)
      return arrayMove(prev, oldIdx, newIdx)
    })
  }

  const openCreate = () => { setEditRole(undefined); setDialogOpen(true) }
  const openEdit = (role: RoleResponse) => { setEditRole(role); setDialogOpen(true) }
  const confirmDelete = (role: RoleResponse) => setDeleteTarget(role)

  return (
    <div className="min-h-full bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Roles & Permissions', isActive: true }]} />

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold">Vai trò</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{displayRoles.length} vai trò</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Input
              placeholder="Tìm vai trò..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="system">Hệ thống</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={openCreate} size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Tạo vai trò
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>
                    <button
                      className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                      onClick={() => toggleSort('roleName')}
                    >
                      Tên vai trò
                      <SortIcon col="roleName" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </TableHead>
                  <TableHead>Tên hiển thị</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                      onClick={() => toggleSort('permissions')}
                    >
                      Số quyền
                      <SortIcon col="permissions" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </TableHead>
                  <TableHead className="w-[140px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : displayRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                      {isFiltering ? 'Không tìm thấy vai trò nào' : 'Không có vai trò nào'}
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext items={displayRoles.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                    {displayRoles.map((role) => (
                      <SortableRoleRow
                        key={role.id}
                        role={role}
                        isDragDisabled={isFiltering || role.isSystemRole}
                        onEdit={openEdit}
                        onDelete={confirmDelete}
                        onPermissions={setPermSheet}
                      />
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>

            <DragOverlay>
              {activeRole && (
                <table className="w-full">
                  <tbody>
                    <tr className="bg-card border rounded-lg shadow-2xl ring-1 ring-border flex items-center px-2">
                      <td className="w-8 p-2 text-muted-foreground/60">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                      </td>
                      <td className="flex-1 p-2 font-medium text-sm">{activeRole.roleName}</td>
                      <td className="p-2 text-sm hidden sm:table-cell">{activeRole.displayName ?? '—'}</td>
                      <td className="p-2 text-muted-foreground text-sm hidden sm:table-cell">{activeRole.description ?? '—'}</td>
                      <td className="p-2">
                        {activeRole.isSystemRole
                          ? <Badge variant="secondary">Hệ thống</Badge>
                          : <Badge variant="outline">Tùy chỉnh</Badge>}
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">{activeRole.permissions.length}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </main>

      <RoleDialog open={dialogOpen} role={editRole} onOpenChange={setDialogOpen} />

      <PermissionsSheet
        open={!!permSheet}
        role={permSheet}
        onOpenChange={(open) => { if (!open) setPermSheet(undefined) }}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vai trò</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa vai trò <span className="font-semibold text-foreground">"{deleteTarget?.roleName}"</span>?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (deleteTarget) deleteRole.mutate(deleteTarget.id) }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
