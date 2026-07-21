import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TaskActionsProvider } from '@/features/task/context/TaskActionsContext'
import { mapTaskItemToTask, useMockTaskWorkspaceData } from '@/features/task/hooks/useMockTaskData'
import { useTaskFavorites } from '@/features/task/hooks/useTaskFavorites'
import { useTaskRecents } from '@/features/task/hooks/useTaskRecents'
import {
  exportTasksToCSV,
  importTasksFromCSV,
  taskItemService,
} from '@/features/task/services/task.service'
import type {
  Id,
  SortOption,
  SortOrder,
  Task,
  TaskItemDto,
  UpdateTaskRequest,
} from '@/features/task/types/task.types'
import { ArrowUpDown, Check, Download, Filter, Layers, Moon, MoreHorizontal, Plus, Search, Share2, Sun, Upload } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { TaskSheet } from '../../detail/TaskSheet'
import { TaskFavoritesBar } from '../../shared/TaskFavoritesBar'
import { TaskHoverPreview } from '../../shared/TaskHoverPreview'
import { TaskQuickFind } from '../../shared/TaskQuickFind'
import { TaskFilterBar } from '../../toolbar/TaskFilterBar'
import { TaskCreateDialog } from '../board/dialogs/TaskCreateDialog'
import { KanbanBoard } from '../board/KanbanBoard'
import { TaskCalendar } from '../calendar/TaskCalendar'
import { TaskList } from '../list/TaskList'
import { TaskTable } from '../table/TaskTable'
import { TaskTimeline } from '../timeline/TaskTimeline'

type ViewMode = 'list' | 'board' | 'table' | 'calendar' | 'timeline'

const VIEW_TABS: { key: ViewMode; label: string }[] = [
  { key: 'list', label: 'Danh sách' },
  { key: 'board', label: 'Bảng' },
  { key: 'table', label: 'Bảng tính' },
  { key: 'calendar', label: 'Lịch' },
  { key: 'timeline', label: 'Dòng thời gian' },
]

export function TaskView() {
  const { theme, setTheme } = useTheme()
  const [view, setView] = useState<ViewMode>('list')
  const {
    columns,
    isLoading,
    priorities,
    setColumns,
    setTasks,
    statuses,
    tasks,
  } = useMockTaskWorkspaceData()

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [quickFindOpen, setQuickFindOpen] = useState(false)

  // Filter state
  const [filterBarOpen, setFilterBarOpen] = useState(false)
  const [selectedStatusIds, setSelectedStatusIds] = useState<string[]>([])
  const [selectedPriorityIds, setSelectedPriorityIds] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('CreatedAtUtc')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [groupBy, setGroupBy] = useState<'status' | 'priority'>('status')
  const [filterSearch, setFilterSearch] = useState('')

  const { favorites, toggleFavorite, isFavorite } = useTaskFavorites()
  const { recents, pushRecent } = useTaskRecents()

  const csvInputRef = useRef<HTMLInputElement>(null)

  const handleExportCSV = useCallback(async () => {
    const all = await taskItemService.getAll()
    const csv = exportTasksToCSV(all.items)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tasks.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Đã xuất CSV')
  }, [])

  const handleImportCSV = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const imported = await importTasksFromCSV(text)
    const newTasks: Task[] = imported.map(mapTaskItemToTask)
    setTasks((prev) => [...newTasks, ...prev])
    toast.success(`Đã nhập ${imported.length} task từ CSV`)
    if (csvInputRef.current) csvInputRef.current.value = ''
  }, [])

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setQuickFindOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Apply filters, search, sort
  const displayedTasks = useMemo(() => {
    let result = tasks
    if (selectedStatusIds.length > 0) {
      result = result.filter((t) => selectedStatusIds.includes(String(t.columnId)))
    }
    if (selectedPriorityIds.length > 0) {
      result = result.filter((t) => selectedPriorityIds.includes(t.priorityId || ''))
    }
    if (filterSearch.trim()) {
      const q = filterSearch.trim().toLowerCase()
      result = result.filter((t) =>
        [t.title, t.description, t.tag, t.code, t.assignee, t.status, t.priority]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
    }
    if (sortBy === 'Title') {
      result = [...result].sort((a, b) => {
        const cmp = (a.title ?? '').localeCompare(b.title ?? '')
        return sortOrder === 'asc' ? cmp : -cmp
      })
    } else if (sortBy === 'DueDate') {
      result = [...result].sort((a, b) => {
        const noDate = sortOrder === 'asc' ? Infinity : -Infinity
        const aD = a.dueDate ? new Date(a.dueDate).getTime() : noDate
        const bD = b.dueDate ? new Date(b.dueDate).getTime() : noDate
        return sortOrder === 'asc' ? aD - bD : bD - aD
      })
    }
    return result
  }, [tasks, selectedStatusIds, selectedPriorityIds, filterSearch, sortBy, sortOrder])

  const hasActiveFilters = selectedStatusIds.length > 0 || selectedPriorityIds.length > 0 || filterSearch.trim().length > 0

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task)
    setIsSheetOpen(true)
    pushRecent(String(task.id))
  }, [pushRecent])

  const handleCreateTask = useCallback((createdTask?: TaskItemDto) => {
    if (createdTask) {
      const newTask = mapTaskItemToTask(createdTask)
      setTasks((prev) => [newTask, ...prev])
      setSelectedTask(newTask)
      setIsSheetOpen(true)
    }
  }, [])

  const handleTaskUpdate = useCallback(
    async (taskId: string, updateData: UpdateTaskRequest): Promise<TaskItemDto> => {
      const updatedTask = await taskItemService.update(taskId, updateData)
      const mappedTask = mapTaskItemToTask(updatedTask)
      setTasks((prev) =>
        prev.map((task) => {
          if (String(task.id) !== taskId && task.id !== taskId) return task
          return {
            ...task,
            ...mappedTask,
          }
        }),
      )
      setSelectedTask((prev) => {
        if (!prev || (String(prev.id) !== taskId && prev.id !== taskId)) return prev
        return {
          ...prev,
          ...mappedTask,
        }
      })
      toast.success('Đã cập nhật task thành công')
      return updatedTask
    },
    [],
  )

  const handleTaskMove = useCallback((taskId: Id, newSectionKey: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        String(task.id) === String(taskId)
          ? { ...task, status: newSectionKey as Task['status'] }
          : task,
      ),
    )
  }, [])

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false)
    setSelectedTask(null)
  }, [])

  const handleDuplicate = useCallback(async (task: Task) => {
    try {
      const dup = await taskItemService.duplicate(String(task.id))
      const newTask = mapTaskItemToTask(dup)
      setTasks((prev) => [newTask, ...prev])
      toast.success('Đã nhân bản task')
    } catch {
      toast.error('Không thể nhân bản task')
    }
  }, [])

  const handleArchive = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => String(t.id) !== taskId))
    setSelectedTask((prev) => {
      if (prev && String(prev.id) === taskId) {
        setIsSheetOpen(false)
        return null
      }
      return prev
    })
    toast.success('Đã xóa task')
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
              style={{ borderColor: 'oklch(var(--primary))' }}
            />
            <p className="text-sm text-muted-foreground">
              Đang tải danh sách công việc...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TaskActionsProvider onOpen={handleTaskClick} onDuplicate={handleDuplicate} onArchive={handleArchive}>
    <div className="flex flex-col h-full min-h-0 bg-background text-foreground">

      {/* ── Topbar ─────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-6 h-[52px] px-5 shrink-0 bg-card border-b border-border"
      >
        {/* Title + tabs */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <h1
            className="text-[22px] font-semibold leading-none shrink-0 text-foreground"
            style={{
              fontFamily: '"Cormorant Garamond", Tiempos Headline, Garamond, serif',
            }}
          >
            Task của tôi
          </h1>

          <nav className="flex items-center gap-0">
            {VIEW_TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                className={`relative h-[52px] px-3 text-[13px] font-normal capitalize cursor-pointer transition-colors duration-[120ms] border-b-2 ${
                  view === key ? 'text-primary border-primary' : 'text-muted-foreground border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick find */}
          <button
            type="button"
            aria-label="Tìm nhanh"
            title="Tìm nhanh (Ctrl+K)"
            onClick={() => setQuickFindOpen(true)}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[12px] cursor-pointer transition-colors duration-[120ms] hover:bg-muted border border-border text-muted-foreground"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tìm</span>
            <kbd className="text-[10px] px-1 py-0.5 rounded bg-muted">⌘K</kbd>
          </button>

          {/* Filter button — toggles filter bar */}
          <button
            type="button"
            aria-label="Bộ lọc"
            onClick={() => setFilterBarOpen((v) => !v)}
            className={`relative flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-muted ${
              filterBarOpen || hasActiveFilters ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <span
                className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary"
              />
            )}
          </button>

          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Sắp xếp"
                title="Sắp xếp"
                className={`relative flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-muted ${
                  sortBy !== 'CreatedAtUtc' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortBy !== 'CreatedAtUtc' && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-[13px]">
              {([
                { field: 'CreatedAtUtc', order: 'desc', label: 'Mới nhất' },
                { field: 'CreatedAtUtc', order: 'asc', label: 'Cũ nhất' },
                null,
                { field: 'Title', order: 'asc', label: 'Tên A–Z' },
                { field: 'Title', order: 'desc', label: 'Tên Z–A' },
                null,
                { field: 'DueDate', order: 'asc', label: 'Hạn sớm nhất' },
                { field: 'DueDate', order: 'desc', label: 'Hạn muộn nhất' },
              ] as (null | { field: SortOption; order: SortOrder; label: string })[]).map((item, i) =>
                item === null ? (
                  <DropdownMenuSeparator key={`sep-${i}`} />
                ) : (
                  <DropdownMenuItem
                    key={`${item.field}-${item.order}`}
                    className="cursor-pointer justify-between"
                    onClick={() => { setSortBy(item.field); setSortOrder(item.order) }}
                  >
                    {item.label}
                    {sortBy === item.field && sortOrder === item.order && (
                      <Check className="h-3.5 w-3.5 ml-2 shrink-0 text-primary" />
                    )}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Group By dropdown (list view only) */}
          {view === 'list' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Nhóm theo"
                  title="Nhóm theo"
                  className={`relative flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-muted ${
                    groupBy !== 'status' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  {groupBy !== 'status' && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 text-[13px]">
                <DropdownMenuItem
                  className="cursor-pointer justify-between"
                  onClick={() => setGroupBy('status')}
                >
                  Nhóm theo trạng thái
                  {groupBy === 'status' && <Check className="h-3.5 w-3.5 ml-2 shrink-0 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer justify-between"
                  onClick={() => setGroupBy('priority')}
                >
                  Nhóm theo ưu tiên
                  {groupBy === 'priority' && <Check className="h-3.5 w-3.5 ml-2 shrink-0 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <button
            type="button"
            aria-label="Xuất CSV"
            title="Xuất CSV"
            onClick={handleExportCSV}
            className="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-muted text-muted-foreground"
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Nhập CSV"
            title="Nhập CSV"
            onClick={() => csvInputRef.current?.click()}
            className="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-muted text-muted-foreground"
          >
            <Upload className="h-4 w-4" />
          </button>
          <input ref={csvInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImportCSV} />

          <button
            type="button"
            aria-label="Thêm tùy chọn"
            className="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-muted text-muted-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          <div className="h-5 w-px mx-1 bg-border" />

          <button
            type="button"
            className="flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-normal cursor-pointer transition-colors duration-[120ms] hover:bg-muted border border-border text-muted-foreground bg-transparent"
          >
            <Share2 className="h-3.5 w-3.5" />
            Chia sẻ
          </button>

          <TaskCreateDialog onTaskCreated={handleCreateTask}>
            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-medium text-primary-foreground bg-primary cursor-pointer transition-colors duration-[120ms] hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              Task mới
            </button>
          </TaskCreateDialog>

          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold text-primary-foreground bg-primary shrink-0 ml-1"
          >
            MT
          </span>
        </div>
      </header>

      {/* ── Filter bar (toggleable) ─────────────────────────── */}
      {filterBarOpen && (
        <TaskFilterBar
          statuses={statuses}
          priorities={priorities}
          selectedStatusIds={selectedStatusIds}
          selectedPriorityIds={selectedPriorityIds}
          onStatusChange={setSelectedStatusIds}
          onPriorityChange={setSelectedPriorityIds}
          searchQuery={filterSearch}
          onSearchChange={setFilterSearch}
        />
      )}

      {/* ── Favorites / Recents bar ──────────────────────────── */}
      <TaskFavoritesBar
        tasks={tasks}
        favorites={favorites}
        recents={recents}
        onTaskClick={handleTaskClick}
      />

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-auto" data-kanban-scroll>
        {view === 'list' && (
          <div className="p-4">
            <TaskList
              tasks={displayedTasks}
              statuses={statuses}
              onTaskClick={handleTaskClick}
              searchQuery=""
              onTaskMove={handleTaskMove}
              groupBy={groupBy}
            />
          </div>
        )}

        {view === 'board' && (
          <div className="min-w-0 p-4">
            <KanbanBoard
              tasks={displayedTasks}
              columns={columns}
              setTasks={setTasks}
              setColumns={setColumns}
              onTaskClick={handleTaskClick}
              onTaskCreated={handleCreateTask}
            />
          </div>
        )}

        {view === 'table' && (
          <TaskTable
            tasks={displayedTasks}
            columns={columns}
            searchQuery={filterSearch}
            onTaskClick={handleTaskClick}
            onTaskCreated={handleCreateTask}
          />
        )}

        {view === 'calendar' && (
          <TaskCalendar tasks={displayedTasks} />
        )}

        {view === 'timeline' && (
          <TaskTimeline tasks={displayedTasks} />
        )}
      </div>

      <TaskQuickFind
        tasks={tasks}
        open={quickFindOpen}
        onOpenChange={setQuickFindOpen}
      />

      <TaskSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        task={selectedTask}
        columns={columns}
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        isFavorite={selectedTask ? isFavorite(String(selectedTask.id)) : false}
        onToggleFavorite={selectedTask ? () => toggleFavorite(String(selectedTask.id)) : undefined}
        onTaskNavigate={(taskId) => {
          const t = tasks.find((x) => String(x.id) === taskId)
          if (t) handleTaskClick(t)
        }}
      />

      <TaskHoverPreview tasks={tasks} />
    </div>
    </TaskActionsProvider>
  )
}
