import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  pointerWithin,
  type CollisionDetection,
} from '@dnd-kit/core'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

import type { ColumnPositionSnapshot } from '@/features/task/hooks/useKanbanDnd'
import { useKanbanDnd } from '@/features/task/hooks/useKanbanDnd'
import { taskItemService } from '@/features/task/mocks/task.mock'
import { taskStatusService } from '@/features/task/mocks/task.mock'
import type { Column, Id, Task, TaskItemDto, TaskStatusDto } from '@/features/task/types/task.types'
import { KanbanCardOverlay } from './card/KanbanCard'
import { BoardColumn } from './column/KanbanColumn'
import { KanbanDroppableMeasurer } from './KanbanDroppableMeasurer'
import { NewColumnBtn } from './KanbanNewColumnButton'

interface KanbanBoardProps {
  tasks: Task[]
  columns: Column[]
  setTasks: Dispatch<SetStateAction<Task[]>>
  setColumns: Dispatch<SetStateAction<Column[]>>
  onTaskClick?: (task: Task) => void
  onTaskCreated?: (task?: TaskItemDto) => void
  disableAutoLoad?: boolean
}

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

export function KanbanBoard({
  tasks,
  columns,
  setTasks,
  setColumns,
  onTaskClick,
  onTaskCreated,
  disableAutoLoad = false,
}: KanbanBoardProps) {
  const [isCreatingColumn, setIsCreatingColumn] = useState(false)
  const [statuses, setStatuses] = useState<TaskStatusDto[]>([])
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true)
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const hasLoadedStatusesRef = useRef(false)
  const loadedStatusIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (disableAutoLoad || hasLoadedStatusesRef.current) return
    hasLoadedStatusesRef.current = true
    const loadStatuses = async () => {
      try {
        setIsLoadingStatuses(true)
        const statusData = await taskStatusService.getAllForDropdown()
        setStatuses(statusData)

        if (statusData.length > 0) {
          const statusColumns: Column[] = statusData.map((status) => ({
            id: status.id,
            title: status.name,
            color: status.color,
          }))
          setColumns((prev) => (prev.length === 0 ? statusColumns : prev))
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách task statuses:', error)
        toast.error('Không thể tải danh sách trạng thái công việc')
      } finally {
        setIsLoadingStatuses(false)
      }
    }

    loadStatuses()
  }, [setColumns, disableAutoLoad])

  useEffect(() => {
    if (disableAutoLoad || isLoadingStatuses) return
    if (statuses.length === 0) return

    const missingStatuses = statuses.filter(
      (status) => !loadedStatusIdsRef.current.has(status.id),
    )
    if (missingStatuses.length === 0) return

    const isInitialLoad = loadedStatusIdsRef.current.size === 0
    let isMounted = true

    const loadTasksForStatuses = async () => {
      try {
        setIsLoadingTasks(true)

        const taskGroups = await mapWithConcurrency(missingStatuses, 3, async (status) => {
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

        if (!isMounted) return

        const allTasks = taskGroups.flat()
        setTasks((prev) => (isInitialLoad ? allTasks : [...prev, ...allTasks]))
        missingStatuses.forEach((status) => loadedStatusIdsRef.current.add(status.id))
      } catch (error) {
        console.error('Lỗi khi tải tất cả tasks:', error)
        toast.error('Không thể tải danh sách công việc')
      } finally {
        if (isMounted) setIsLoadingTasks(false)
      }
    }

    loadTasksForStatuses()

    return () => {
      isMounted = false
    }
  }, [statuses, isLoadingStatuses, setTasks, disableAutoLoad])

  const tasksByColumn = useMemo(() => {
    const byColumn = new Map<Id, Task[]>()
    for (const column of columns) {
      byColumn.set(column.id, [])
    }
    for (const task of tasks) {
      const columnTasks = byColumn.get(task.columnId)
      if (!columnTasks) continue
      columnTasks.push(task)
    }
    return byColumn
  }, [tasks, columns])

  const columnIds = useMemo(() => columns.map((column) => column.id), [columns])

  const columnPositionsRef = useRef<Map<Id, ColumnPositionSnapshot>>(new Map())

  const handlePositionsChange = useCallback((columnId: Id, snapshot: ColumnPositionSnapshot) => {
    columnPositionsRef.current.set(columnId, snapshot)
  }, [])

  const {
    sensors,
    activeTask,
    activeId,
    dropHint,
    isDragging,
    onDragStart,
    onDragOver,
    onDragMove,
    onDragEnd,
    onDragCancel,
  } = useKanbanDnd({ setTasks, tasksByColumn, columnPositionsByIdRef: columnPositionsRef })

  const collisionDetection: CollisionDetection = (args) => {
    const pointerHits = pointerWithin(args)
    return pointerHits.length > 0 ? pointerHits : []
  }

  const handleColumnTitleChange = useCallback(
    async (columnId: string, newTitle: string) => {
      try {
        await taskStatusService.update(columnId, { name: newTitle })
        setColumns((prev) =>
          prev.map((col) => (col.id === columnId ? { ...col, title: newTitle } : col)),
        )
        setStatuses((prev) =>
          prev.map((status) => (status.id === columnId ? { ...status, name: newTitle } : status)),
        )
        toast.success('Đã cập nhật tên cột thành công')
      } catch (error) {
        console.error('Error updating column title:', error)
        toast.error('Có lỗi xảy ra khi cập nhật tên cột')
      }
    },
    [setColumns, setStatuses],
  )

  const handleColumnColorChange = useCallback(
    async (columnId: string, color: string) => {
      try {
        await taskStatusService.update(columnId, { color })
        setColumns((prev) =>
          prev.map((col) => (col.id === columnId ? { ...col, color } : col)),
        )
        setStatuses((prev) =>
          prev.map((status) => (status.id === columnId ? { ...status, color } : status)),
        )
        toast.success('Đã cập nhật màu cột thành công')
      } catch (error) {
        console.error('Error updating column color:', error)
        toast.error('Có lỗi xảy ra khi cập nhật màu cột')
      }
    },
    [setColumns, setStatuses],
  )

  const handleAddColumn = useCallback(
    async (title: string) => {
      if (isCreatingColumn) return
      setIsCreatingColumn(true)
      try {
        const newStatus = await taskStatusService.create({
          code: `STATUS_${Date.now()}`,
          name: title,
          order: Math.max(...statuses.map((s) => s.order), 0) + 1,
          color: '#808080',
          isSystem: true,
          isActive: true,
        })

        const newColumn: Column = {
          id: newStatus.id,
          title: newStatus.name,
          color: newStatus.color,
        }

        setColumns((prev) => [...prev, newColumn])
        setStatuses((prev) => [...prev, newStatus])
        toast.success(`Đã tạo cột "${title}" thành công`)
      } catch (error) {
        console.error('Lỗi khi tạo cột mới:', error)
        toast.error('Không thể tạo cột mới. Vui lòng thử lại.')
      } finally {
        setIsCreatingColumn(false)
      }
    },
    [setColumns, statuses, isCreatingColumn],
  )

  if (!disableAutoLoad && (isLoadingStatuses || isLoadingTasks)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            {isLoadingStatuses
              ? 'Đang tải danh sách trạng thái...'
              : 'Đang tải danh sách công việc...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.BeforeDragging,
        },
      }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <KanbanDroppableMeasurer columnIds={columnIds} />
      <div className="w-full">
        <div className="flex gap-3 items-stretch pb-4 min-w-max">
          {columns.map((col) => (
            <BoardColumn
              key={String(col.id)}
              column={col}
              tasks={tasksByColumn.get(col.id) ?? []}
              dropHint={dropHint?.columnId === col.id ? dropHint : null}
              activeId={activeId}
              onTaskClick={onTaskClick}
              onTaskCreated={onTaskCreated}
              onPositionsChange={handlePositionsChange}
              onTitleChange={handleColumnTitleChange}
              onColorChange={handleColumnColorChange}
              isDragging={isDragging}
            />
          ))}
          <NewColumnBtn onAddColumn={handleAddColumn} isLoading={isCreatingColumn} />
          <div className="w-2 shrink-0" />
        </div>
      </div>

      {createPortal(
        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="w-75 pointer-events-none">
              <KanbanCardOverlay task={activeTask} isSimple />
            </div>
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
