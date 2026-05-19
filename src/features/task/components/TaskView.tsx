import { Button } from '@/components/ui/button'
import type { Column, Task, TaskItemDto, TaskStatusDto, UpdateTaskRequest } from '@/features/task/types/task.types'
import { LayoutGrid, List as ListIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { TaskToolbar } from './toolbar/TaskToolbar'
import { TaskList } from './list/TaskList'
import { KanbanBoard } from './kanban/KanbanBoard'
import { TaskSheet } from './sheet/TaskSheet'
import { taskItemService } from '../mocks/task.mock'
import { taskStatusService } from '../mocks/task.mock'

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
  const [view, setView] = useState<'list' | 'board'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statuses, setStatuses] = useState<TaskStatusDto[]>([])

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const hasLoadedDataRef = useRef(false)

  useEffect(() => {
    if (hasLoadedDataRef.current) return
    hasLoadedDataRef.current = true

    const loadInitialData = async () => {
      try {
        setIsLoading(true)

        const statusData = await taskStatusService.getAllForDropdown()
        setStatuses(statusData)

        const statusColumns: Column[] = statusData.map((status) => ({
          id: status.id,
          title: status.name,
          color: status.color,
        }))
        setColumns(statusColumns)

        const tasksArrays = await mapWithConcurrency(statusData, 3, async (status) => {
          try {
            const tasksResponse = await taskItemService.getTasksByStatusId(status.id)
            return tasksResponse.items.map((taskItem) => ({
              id: taskItem.id,
              columnId: taskItem.statusId,
              title: taskItem.title,
              description: taskItem.description,
              code: taskItem.code,
              status: taskItem.statusName as Task['status'],
              priorityId: taskItem.priorityId,
              priority: taskItem.priorityName as Task['priority'],
              assignee: taskItem.creatorName,
              date: taskItem.dueDate,
            } as Task))
          } catch (error) {
            console.error(`Lỗi khi tải tasks cho status ${status.id}:`, error)
            return []
          }
        })

        const allTasks = tasksArrays.flat()
        setTasks(allTasks)
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu ban đầu:', error)
        toast.error('Không thể tải danh sách công việc')
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task)
    setIsSheetOpen(true)
  }, [])

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
          const matches = String(task.id) === taskId || task.id === taskId
          if (!matches) return task
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
        if (!prev) return prev
        const matches = String(prev.id) === taskId || prev.id === taskId
        if (!matches) return prev
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

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false)
    setSelectedTask(null)
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Đang tải danh sách công việc...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0">
        <div className="flex flex-col gap-1 px-3 pt-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Tác vụ của tôi</h1>
              <p className="text-sm text-muted-foreground">Quản lý và theo dõi tiến độ dự án</p>
            </div>

            <div className="flex items-center p-1 rounded-lg border border-border bg-muted/50 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('list')}
                className={`h-8 px-3 text-xs font-medium transition-all ${
                  view === 'list'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                }`}
              >
                <ListIcon className="mr-2 h-3.5 w-3.5" /> Danh sách
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('board')}
                className={`h-8 px-3 text-xs font-medium transition-all ${
                  view === 'board'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                }`}
              >
                <LayoutGrid className="mr-2 h-3.5 w-3.5" /> Bảng
              </Button>
            </div>
          </div>

          <TaskToolbar
            onCreateTask={handleCreateTask}
            onFilterChange={(params) => {
              setSearchQuery(params.search || '')
            }}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto" data-kanban-scroll>
        {view === 'list' && (
          <div className="p-2">
            <TaskList
              tasks={tasks}
              statuses={statuses}
              onTaskClick={handleTaskClick}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {view === 'board' && (
          <div className="min-w-0 p-2">
            <KanbanBoard
              tasks={tasks}
              columns={columns}
              setTasks={setTasks}
              setColumns={setColumns}
              onTaskClick={handleTaskClick}
              onTaskCreated={handleCreateTask}
              disableAutoLoad={true}
            />
          </div>
        )}
      </div>

      <TaskSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        task={selectedTask}
        columns={columns}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  )
}
