import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { Building2, GripVertical, Plus, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
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
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  useCreateDepartment,
  useDeleteDepartment,
  useDepartmentTree,
  useUpdateDepartment,
} from '../../../hooks/use-departments'
import type { DepartmentResponse, DepartmentTreeResponse } from '../../../types/admin.types'
import { DepartmentDialog, type DepartmentSubmitPayload } from '../DepartmentDialog'
import { DeptRow } from './DeptRow'
import { RootZone } from './RootZone'
import {
  ROOT_ID,
  descendantIds,
  findNode,
  flatten,
  insertNode,
  removeNode,
} from './utils'

const TREE_KEY = ['departments', 'tree']

// ponytail: orchestrator — owns useDepartmentTree + useCreateDepartment + useUpdateDepartment + useDeleteDepartment
// for the flat list + drag-and-drop view; DepartmentsPage does not manage department CRUD
export function DeptListView() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDept, setEditDept] = useState<DepartmentResponse | undefined>()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [deleteDept, setDeleteDept] = useState<{ id: string; name: string } | null>(null)
  const [toggleDept, setToggleDept] = useState<{ row: ReturnType<typeof flatten>[number] } | null>(null)
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())

  const queryClient = useQueryClient()
  const { data: tree, isLoading } = useDepartmentTree()
  const create = useCreateDepartment()
  const update = useUpdateDepartment()
  const deleteDepartment = useDeleteDepartment()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const rows = useMemo(() => flatten(tree ?? []), [tree])

  const filtered = useMemo(() => {
    let result = rows
    if (statusFilter === 'active') result = result.filter(r => r.node.isActive)
    if (statusFilter === 'inactive') result = result.filter(r => !r.node.isActive)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.node.departmentName.toLowerCase().includes(q) ||
        r.node.departmentCode.toLowerCase().includes(q),
      )
    }
    return result
  }, [rows, search, statusFilter])

  const allDepts = useMemo((): DepartmentResponse[] =>
    rows.map(r => ({
      id: r.node.id,
      departmentName: r.node.departmentName,
      departmentCode: r.node.departmentCode,
      parentDepartmentId: r.parentId ?? undefined,
      isActive: r.node.isActive,
    })),
  [rows])

  const activeNode = useMemo(
    () => (activeId ? findNode(tree ?? [], activeId) : null),
    [activeId, tree],
  )

  const deptMap = useMemo((): Map<string, string> => {
    const m = new Map<string, string>()
    for (const r of rows) m.set(r.node.id, r.node.departmentName)
    return m
  }, [rows])

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setActiveId(null)
    setOverId(null)
    if (!over) return

    const draggedId = active.id as string
    const targetId = over.id as string
    if (draggedId === targetId) return

    const currentTree = tree ?? []
    const dragged = findNode(currentTree, draggedId)
    const draggedRow = rows.find(r => r.node.id === draggedId)
    if (!dragged || !draggedRow) return

    const newParentId = targetId === ROOT_ID ? null : targetId
    if (draggedRow.parentId === newParentId) return
    if (newParentId && descendantIds(dragged).has(newParentId)) return

    const baseData = {
      departmentName: draggedRow.node.departmentName,
      departmentCode: draggedRow.node.departmentCode,
      isActive: draggedRow.node.isActive,
    }

    const prev = queryClient.getQueryData<DepartmentTreeResponse[]>(TREE_KEY)
    const { tree: without, removed } = removeNode(currentTree, draggedId)
    if (removed) {
      queryClient.setQueryData(TREE_KEY, insertNode(without, newParentId, removed))
      setPendingIds(s => new Set(s).add(draggedId))
    }

    update.mutate(
      { id: draggedId, data: { ...baseData, parentDepartmentId: newParentId ?? undefined } },
      {
        onSuccess: () => toast.success('Đã cập nhật phòng ban cấp trên'),
        onError: (error) => {
          logger.error(error)
          if (prev) queryClient.setQueryData(TREE_KEY, prev)
          toast.error('Không thể thay đổi phòng cha')
        },
        onSettled: () => {
          setPendingIds(s => { const next = new Set(s); next.delete(draggedId); return next })
          queryClient.invalidateQueries({ queryKey: TREE_KEY })
        },
      },
    )
  }, [tree, rows, queryClient, update])

  const handleDialogSubmit = async (payload: DepartmentSubmitPayload) => {
    try {
      if (editDept) {
        await update.mutateAsync({ id: editDept.id, data: payload })
        toast.success('Đã cập nhật phòng ban')
      } else {
        await create.mutateAsync(payload)
        toast.success('Đã tạo phòng ban mới')
      }
    } catch (error) {
      logger.error(error)
      toast.error(editDept ? 'Không thể cập nhật phòng ban' : 'Không thể tạo phòng ban')
      throw error
    }
  }

  const openEdit = (row: ReturnType<typeof flatten>[number]) => {
    setEditDept({
      id: row.node.id,
      departmentName: row.node.departmentName,
      departmentCode: row.node.departmentCode,
      parentDepartmentId: row.parentId ?? undefined,
      isActive: row.node.isActive,
    })
    setDialogOpen(true)
  }

  const activeCount = useMemo(() => rows.filter(r => r.node.isActive).length, [rows])
  const inactiveCount = useMemo(() => rows.filter(r => !r.node.isActive).length, [rows])

  const FILTERS = [
    { id: 'all' as const, label: 'Tất cả', count: rows.length },
    { id: 'active' as const, label: 'Hoạt động', count: activeCount },
    { id: 'inactive' as const, label: 'Đã vô hiệu', count: inactiveCount },
  ]

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(active.id as string)}
      onDragOver={({ over }) => setOverId((over?.id as string) ?? null)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => { setActiveId(null); setOverId(null) }}
    >
      <div className="h-full overflow-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center rounded-md border overflow-hidden text-xs">
              {FILTERS.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  className={cn(
                    'px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5',
                    i > 0 && 'border-l',
                    statusFilter === f.id
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  {f.label}
                  <span className={cn(
                    'text-[10px] px-1 rounded tabular-nums',
                    statusFilter === f.id ? 'bg-primary-foreground/20' : 'bg-muted',
                  )}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc mã phòng ban..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-8 pl-8 pr-7 text-xs rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary w-56"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Xóa tìm kiếm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <Button onClick={() => { setEditDept(undefined); setDialogOpen(true) }} size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Thêm phòng ban
              </Button>
            </div>
          </div>

          {!search && rows.length > 0 && <RootZone isOver={overId === ROOT_ID} active={!!activeId} />}

          <div className="rounded-lg border bg-card overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-2 pl-3 pr-2 text-left text-xs font-medium text-muted-foreground">Tên phòng ban</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Mã</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Phòng cấp trên</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">Trưởng phòng</th>
                  <th className="py-2 px-3 text-center text-xs font-medium text-muted-foreground hidden md:table-cell">TV</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Trạng thái</th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-muted-foreground w-[80px]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="py-2 px-3"><Skeleton className="h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center">
                      {rows.length === 0 ? (
                        <div className="flex flex-col items-center gap-3">
                          <Building2 className="w-8 h-8 text-muted-foreground/25" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Chưa có phòng ban nào</p>
                            <p className="text-xs text-muted-foreground/60 mt-0.5">Bắt đầu bằng cách tạo phòng ban đầu tiên</p>
                          </div>
                          <Button size="sm" className="gap-1.5 mt-1" onClick={() => { setEditDept(undefined); setDialogOpen(true) }}>
                            <Plus className="h-3.5 w-3.5" />Tạo phòng ban đầu tiên
                          </Button>
                        </div>
                      ) : search ? (
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-sm text-muted-foreground">Không tìm thấy kết quả cho <span className="font-medium text-foreground">"{search}"</span></p>
                          <button type="button" onClick={() => setSearch('')} className="text-xs text-primary hover:underline cursor-pointer">Xóa bộ lọc</button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {statusFilter === 'inactive' ? 'Không có phòng ban đã vô hiệu' : 'Không có phòng ban đang hoạt động'}
                          </p>
                          <button type="button" onClick={() => setStatusFilter('all')} className="text-xs text-primary hover:underline cursor-pointer">Xem tất cả</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map(row => (
                    <DeptRow
                      key={row.node.id}
                      row={row}
                      isOver={overId === row.node.id && activeId !== row.node.id}
                      isPending={pendingIds.has(row.node.id)}
                      parentName={row.parentId ? deptMap.get(row.parentId) : undefined}
                      onEdit={() => openEdit(row)}
                      onToggle={() => setToggleDept({ row })}
                      onDelete={() => setDeleteDept({ id: row.node.id, name: row.node.departmentName })}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!search && rows.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Kéo <GripVertical className="inline w-3.5 h-3.5 align-text-bottom" /> để thay đổi phòng cha
            </p>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeNode && (
          <div className="rounded-md border bg-card shadow-xl px-3 py-2 text-sm font-medium whitespace-nowrap max-w-[280px] w-fit cursor-grabbing rotate-1 scale-105 ring-1 ring-primary/20 truncate">
            {activeNode.departmentName}
          </div>
        )}
      </DragOverlay>

      <AlertDialog open={!!deleteDept} onOpenChange={open => { if (!open) setDeleteDept(null) }}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa phòng ban</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa phòng ban <strong>{deleteDept?.name}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleteDept) {
                  deleteDepartment.mutate(deleteDept.id, {
                    onSuccess: () => toast.success('Đã xóa phòng ban'),
                    onError: (error) => { logger.error(error); toast.error('Không thể xóa phòng ban') },
                  })
                }
                setDeleteDept(null)
              }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!toggleDept} onOpenChange={open => { if (!open) setToggleDept(null) }}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleDept?.row.node.isActive ? 'Vô hiệu hóa phòng ban?' : 'Kích hoạt lại phòng ban?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleDept?.row.node.isActive
                ? <>Phòng ban <strong>{toggleDept.row.node.departmentName}</strong> sẽ bị vô hiệu hóa và ẩn khỏi danh sách hoạt động.</>
                : <>Phòng ban <strong>{toggleDept?.row.node.departmentName}</strong> sẽ được kích hoạt lại.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant={toggleDept?.row.node.isActive ? 'destructive' : 'default'}
              onClick={() => {
                if (!toggleDept) return
                const { row } = toggleDept
                update.mutate(
                  {
                    id: row.node.id,
                    data: {
                      departmentName: row.node.departmentName,
                      departmentCode: row.node.departmentCode,
                      parentDepartmentId: row.parentId ?? undefined,
                      managerId: row.node.managerId,
                      isActive: !row.node.isActive,
                    },
                  },
                  {
                    onSuccess: () => toast.success(row.node.isActive ? `Đã vô hiệu hóa ${row.node.departmentName}` : `Đã kích hoạt lại ${row.node.departmentName}`),
                    onError: (error) => { logger.error(error); toast.error('Không thể thay đổi trạng thái phòng ban') },
                  },
                )
                setToggleDept(null)
              }}
            >
              {toggleDept?.row.node.isActive ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DepartmentDialog
        open={dialogOpen}
        department={editDept}
        allDepartments={allDepts}
        isPending={create.isPending || update.isPending}
        onOpenChange={setDialogOpen}
        onSubmit={handleDialogSubmit}
      />
    </DndContext>
  )
}
