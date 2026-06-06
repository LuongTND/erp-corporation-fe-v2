import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  pointerWithin,
  type CollisionDetection,
} from '@dnd-kit/core'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

import type { ColumnPositionSnapshot } from '@/features/task/hooks/useKanbanDnd'
import { useKanbanDnd } from '@/features/task/hooks/useKanbanDnd'
import { taskStatusService } from '@/features/task/mocks/task.mock'
import type { Column, Id, Task, TaskItemDto } from '@/features/task/types/task.types'
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
}

export function KanbanBoard({
  tasks,
  columns,
  setTasks,
  setColumns,
  onTaskClick,
  onTaskCreated,
}: KanbanBoardProps) {
  const [isCreatingColumn, setIsCreatingColumn] = useState(false)

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
        toast.success('Đã cập nhật tên cột thành công')
      } catch (error) {
        console.error('Error updating column title:', error)
        toast.error('Có lỗi xảy ra khi cập nhật tên cột')
      }
    },
    [setColumns],
  )

  const handleColumnColorChange = useCallback(
    async (columnId: string, color: string) => {
      try {
        await taskStatusService.update(columnId, { color })
        setColumns((prev) =>
          prev.map((col) => (col.id === columnId ? { ...col, color } : col)),
        )
        toast.success('Đã cập nhật màu cột thành công')
      } catch (error) {
        console.error('Error updating column color:', error)
        toast.error('Có lỗi xảy ra khi cập nhật màu cột')
      }
    },
    [setColumns],
  )

  const handleAddColumn = useCallback(
    async (title: string) => {
      if (isCreatingColumn) return
      setIsCreatingColumn(true)
      try {
        const newStatus = await taskStatusService.create({
          code: `STATUS_${Date.now()}`,
          name: title,
          order: columns.length + 1,
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
        toast.success(`Đã tạo cột "${title}" thành công`)
      } catch (error) {
        console.error('Lỗi khi tạo cột mới:', error)
        toast.error('Không thể tạo cột mới. Vui lòng thử lại.')
      } finally {
        setIsCreatingColumn(false)
      }
    },
    [columns.length, setColumns, isCreatingColumn],
  )

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
