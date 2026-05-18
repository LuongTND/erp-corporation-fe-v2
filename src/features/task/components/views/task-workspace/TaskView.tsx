import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { TaskPriorityDto } from '@/features/task/types/priority.types'
import type {
  Column,
  Id,
  SortOption,
  SortOrder,
  Task,
  TaskItemDto,
  TaskStatusDto,
  UpdateTaskRequest,
} from '@/features/task/types/task.types'
import { ArrowUpDown, Check, Download, Filter, Layers, MoreHorizontal, Plus, Search, Share2, Upload } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { TaskActionsProvider } from '@/features/task/context/TaskActionsContext'
import { useTaskFavorites } from '@/features/task/hooks/useTaskFavorites'
import { useTaskRecents } from '@/features/task/hooks/useTaskRecents'
import {
  exportTasksToCSV,
  importTasksFromCSV,
  taskItemService,
  taskPriorityService,
  taskStatusService,
} from '@/features/task/mocks/task.mock'
import { TaskSheet } from '../../detail/TaskSheet'
import { TaskFavoritesBar } from '../../shared/TaskFavoritesBar'
import { TaskHoverPreview } from '../../shared/TaskHoverPreview'
import { TaskQuickFind } from '../../shared/TaskQuickFind'
import { TaskFilterBar } from '../../toolbar/TaskFilterBar'
import { TaskCalendar } from '../calendar/TaskCalendar'
import { TaskCreateDialog } from '../board/dialogs/TaskCreateDialog'
import { KanbanBoard } from '../board/KanbanBoard'
import { TaskList } from '../list/TaskList'
import { TaskTable } from '../table/TaskTable'
import { TaskTimeline } from '../timeline/TaskTimeline'

const FETCH_CONCURRENCY_LIMIT = 3

type ViewMode = 'list' | 'board' | 'table' | 'calendar' | 'timeline'

const VIEW_TABS: { key: ViewMode; label: string }[] = [
  { key: 'list', label: 'Danh sách' },
  { key: 'board', label: 'Bảng' },
  { key: 'table', label: 'Bảng tính' },
  { key: 'calendar', label: 'Lịch' },
  { key: 'timeline', label: 'Dòng thời gian' },
]

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<R>,
) {
  const results: R[] = new Array(items.length)
  let nextIndex = 0
  const workerCount = Math.min(limit, items.length)

  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex
      nextIndex += 1
      results[currentIndex] = await mapper(items[currentIndex])
    }
  })

  await Promise.all(workers)
  return results
}

export function TaskView() {
  const [view, setView] = useState<ViewMode>('list')
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statuses, setStatuses] = useState<TaskStatusDto[]>([])
  const [priorities, setPriorities] = useState<TaskPriorityDto[]>([])

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

  const hasLoadedDataRef = useRef(false)
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
    const newTasks: Task[] = imported.map((t) => ({
      id: t.id,
      columnId: t.statusId,
      title: t.title,
      description: t.description,
      code: t.code,
      status: t.statusName as Task['status'],
      priorityId: t.priorityId,
      priority: t.priorityName as Task['priority'],
      assignee: t.creatorName || 'Unassigned',
      date: t.dueDate,
      dueDate: t.dueDate,
      estimatedHours: t.estimatedHours,
    }))
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

  useEffect(() => {
    if (hasLoadedDataRef.current) return
    hasLoadedDataRef.current = true

    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        const [statusData, priorityData] = await Promise.all([
          taskStatusService.getAllForDropdown(),
          taskPriorityService.getAllForDropdown(),
        ])
        setStatuses(statusData)
        setPriorities(priorityData)

        const statusColumns: Column[] = statusData.map((status) => ({
          id: status.id,
          title: status.name,
          color: status.color,
        }))
        setColumns(statusColumns)

        const tasksArrays = await mapWithConcurrency(
          statusData,
          FETCH_CONCURRENCY_LIMIT,
          async (status) => {
            try {
              const tasksResponse = await taskItemService.getTasksByStatusId(status.id)
              return tasksResponse.items.map(
                (taskItem) =>
                  ({
                    id: taskItem.id,
                    columnId: taskItem.statusId,
                    title: taskItem.title,
                    description: taskItem.description,
                    parentId: (taskItem as typeof taskItem & { parentId?: string }).parentId,
                    parentTitle: (taskItem as typeof taskItem & { parentTitle?: string }).parentTitle,
                    parentCode: (taskItem as typeof taskItem & { parentCode?: string }).parentCode,
                    code: taskItem.code,
                    status: taskItem.statusName as Task['status'],
                    priorityId: taskItem.priorityId,
                    priority: taskItem.priorityName as Task['priority'],
                    assignee: taskItem.creatorName,
                    date: taskItem.dueDate,
                    dueDate: taskItem.dueDate,
                    estimatedHours: taskItem.estimatedHours,
                  }) as Task,
              )
            } catch (error) {
              console.error(`Lỗi khi tải tasks cho status ${status.id}:`, error)
              return []
            }
          },
        )

        setTasks(tasksArrays.flat())
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu ban đầu:', error)
        toast.error('Không thể tải danh sách công việc')
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
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
      const newTask: Task = {
        id: createdTask.id,
        columnId: createdTask.statusId,
        title: createdTask.title,
        description: createdTask.description,
        code: createdTask.code,
        status: createdTask.statusName as Task['status'],
        priorityId: createdTask.priorityId,
        priority: createdTask.priorityName as Task['priority'],
        assignee: createdTask.creatorName || 'Unassigned',
        date: createdTask.dueDate,
        dueDate: createdTask.dueDate,
        estimatedHours: createdTask.estimatedHours,
      }
      setTasks((prev) => [newTask, ...prev])
      setSelectedTask(newTask)
      setIsSheetOpen(true)
    }
  }, [])

  const handleTaskUpdate = useCallback(
    async (taskId: string, updateData: UpdateTaskRequest): Promise<TaskItemDto> => {
      const updatedTask = await taskItemService.update(taskId, updateData)
      setTasks((prev) =>
        prev.map((task) => {
          if (String(task.id) !== taskId && task.id !== taskId) return task
          return {
            ...task,
            title: updatedTask.title ?? task.title,
            description: updatedTask.description ?? task.description,
            columnId: updatedTask.statusId ?? task.columnId,
            status: (updatedTask.statusName ?? task.status) as Task['status'],
            priorityId: updatedTask.priorityId ?? task.priorityId,
            priority: (updatedTask.priorityName ?? task.priority) as Task['priority'],
            startDate: updatedTask.startDate ?? task.startDate,
            dueDate: updatedTask.dueDate ?? task.dueDate,
            date: updatedTask.dueDate ?? task.date,
          }
        }),
      )
      setSelectedTask((prev) => {
        if (!prev || (String(prev.id) !== taskId && prev.id !== taskId)) return prev
        return {
          ...prev,
          title: updatedTask.title ?? prev.title,
          description: updatedTask.description ?? prev.description,
          columnId: updatedTask.statusId ?? prev.columnId,
          status: (updatedTask.statusName ?? prev.status) as Task['status'],
          priorityId: updatedTask.priorityId ?? prev.priorityId,
          priority: (updatedTask.priorityName ?? prev.priority) as Task['priority'],
          startDate: updatedTask.startDate ?? prev.startDate,
          dueDate: updatedTask.dueDate ?? prev.dueDate,
          date: updatedTask.dueDate ?? prev.date,
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
      const newTask: Task = {
        id: dup.id,
        columnId: dup.statusId,
        title: dup.title,
        description: dup.description,
        code: dup.code,
        status: dup.statusName as Task['status'],
        priorityId: dup.priorityId,
        priority: dup.priorityName as Task['priority'],
        assignee: dup.creatorName || 'Unassigned',
        date: dup.dueDate,
        dueDate: dup.dueDate,
        estimatedHours: dup.estimatedHours,
      }
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
              style={{ borderColor: '#cc785c' }}
            />
            <p className="text-sm" style={{ color: '#8e8b82' }}>
              Đang tải danh sách công việc...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TaskActionsProvider onOpen={handleTaskClick} onDuplicate={handleDuplicate} onArchive={handleArchive}>
    <div className="flex flex-col h-full min-h-0" style={{ backgroundColor: '#faf9f5' }}>

      {/* ── Topbar ─────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-6 h-[52px] px-5 shrink-0"
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '0.5px solid #e6dfd8',
        }}
      >
        {/* Title + tabs */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <h1
            className="text-[22px] font-semibold leading-none shrink-0"
            style={{
              fontFamily: '"Cormorant Garamond", Tiempos Headline, Garamond, serif',
              color: '#141413',
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
                className="relative h-[52px] px-3 text-[13px] font-normal capitalize cursor-pointer transition-colors duration-[120ms]"
                style={{
                  color: view === key ? '#cc785c' : '#6c6a64',
                  borderBottom: view === key ? '2px solid #cc785c' : '2px solid transparent',
                }}
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
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[12px] cursor-pointer transition-colors duration-[120ms] hover:bg-[#f5f0e8]"
            style={{ color: '#6c6a64', border: '0.5px solid #e6dfd8' }}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tìm</span>
            <kbd className="text-[10px] px-1 py-0.5 rounded" style={{ backgroundColor: '#f5f0e8' }}>⌘K</kbd>
          </button>

          {/* Filter button — toggles filter bar */}
          <button
            type="button"
            aria-label="Bộ lọc"
            onClick={() => setFilterBarOpen((v) => !v)}
            className="relative flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-[#f5f0e8]"
            style={{ color: filterBarOpen || hasActiveFilters ? '#cc785c' : '#6c6a64' }}
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <span
                className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#cc785c' }}
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
                className="relative flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-[#f5f0e8]"
                style={{ color: sortBy !== 'CreatedAtUtc' ? '#cc785c' : '#6c6a64' }}
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortBy !== 'CreatedAtUtc' && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#cc785c' }} />
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
                      <Check className="h-3.5 w-3.5 ml-2 shrink-0" style={{ color: '#cc785c' }} />
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
                  className="relative flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-[#f5f0e8]"
                  style={{ color: groupBy !== 'status' ? '#cc785c' : '#6c6a64' }}
                >
                  <Layers className="h-4 w-4" />
                  {groupBy !== 'status' && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#cc785c' }} />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 text-[13px]">
                <DropdownMenuItem
                  className="cursor-pointer justify-between"
                  onClick={() => setGroupBy('status')}
                >
                  Nhóm theo trạng thái
                  {groupBy === 'status' && <Check className="h-3.5 w-3.5 ml-2 shrink-0" style={{ color: '#cc785c' }} />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer justify-between"
                  onClick={() => setGroupBy('priority')}
                >
                  Nhóm theo ưu tiên
                  {groupBy === 'priority' && <Check className="h-3.5 w-3.5 ml-2 shrink-0" style={{ color: '#cc785c' }} />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <button
            type="button"
            aria-label="Xuất CSV"
            title="Xuất CSV"
            onClick={handleExportCSV}
            className="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-[#f5f0e8]"
            style={{ color: '#6c6a64' }}
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Nhập CSV"
            title="Nhập CSV"
            onClick={() => csvInputRef.current?.click()}
            className="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-[#f5f0e8]"
            style={{ color: '#6c6a64' }}
          >
            <Upload className="h-4 w-4" />
          </button>
          <input ref={csvInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImportCSV} />

          <button
            type="button"
            aria-label="Thêm tùy chọn"
            className="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-[#f5f0e8]"
            style={{ color: '#6c6a64' }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          <div className="h-5 w-px mx-1" style={{ backgroundColor: '#e6dfd8' }} />

          <button
            type="button"
            className="flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-normal cursor-pointer transition-colors duration-[120ms] hover:bg-[#f5f0e8]"
            style={{
              border: '0.5px solid #e6dfd8',
              color: '#6c6a64',
              backgroundColor: 'transparent',
            }}
          >
            <Share2 className="h-3.5 w-3.5" />
            Chia sẻ
          </button>

          <TaskCreateDialog onTaskCreated={handleCreateTask}>
            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-medium text-white cursor-pointer transition-colors duration-[120ms]"
              style={{ backgroundColor: '#cc785c' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = '#a9583e'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = '#cc785c'
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Task mới
            </button>
          </TaskCreateDialog>

          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0 ml-1"
            style={{ backgroundColor: '#cc785c' }}
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
              disableAutoLoad={true}
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
