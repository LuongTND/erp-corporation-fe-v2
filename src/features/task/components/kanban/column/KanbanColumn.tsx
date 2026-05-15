import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Column, Task, Id, TaskItemDto } from '../../../types/task.types'
import { ColumnHeader } from './KanbanColumnHeader'
import { ColumnTaskList } from './KanbanColumnTaskList'
import { cn } from '@/lib/utils'
import type { DropHint, ColumnPositionSnapshot } from '../../../hooks/use-kanban-dnd'

interface BoardColumnProps {
  column: Column
  tasks: Task[]
  dropHint?: DropHint
  activeId?: Id | null
  isDragging?: boolean
  onTaskClick?: (task: Task) => void
  onTaskCreated?: (task?: TaskItemDto) => void
  onPositionsChange?: (columnId: Id, snapshot: ColumnPositionSnapshot) => void
  onTitleChange?: (columnId: string, newTitle: string) => void
  onColorChange?: (columnId: string, color: string) => void
}

function BoardColumnBase({
  column,
  tasks,
  dropHint,
  activeId,
  isDragging,
  onTaskClick,
  onTaskCreated,
  onPositionsChange,
  onTitleChange,
  onColorChange,
}: BoardColumnProps) {
  const {
    setNodeRef,
    transform,
    transition,
    isDragging: isColumnDragging,
  } = useSortable({
    id: column.id,
    data: { type: 'Column', column },
    disabled: true,
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: '#f5f0e8',
        borderRadius: 8,
        width: 260,
        minWidth: 260,
        opacity: isColumnDragging ? 0.5 : 1,
      }}
      className="group shrink-0 flex flex-col self-stretch"
    >
      <div
        className={cn(
          'sticky top-0 z-20 rounded-t-xl overflow-hidden',
          !isDragging && 'backdrop-blur-sm',
        )}
      >
        <ColumnHeader
          column={column}
          taskCount={tasks.length}
          onTitleChange={onTitleChange}
          onColorChange={onColorChange}
        />
      </div>

      <div className="w-full flex-1 rounded-b-xl overflow-hidden">
        <ColumnTaskList
          columnId={column.id}
          tasks={tasks}
          onTaskClick={onTaskClick}
          onTaskCreated={onTaskCreated}
          dropHint={dropHint}
          activeId={activeId}
          isDragging={isDragging}
          onPositionsChange={onPositionsChange}
        />
      </div>
    </div>
  )
}

function areBoardColumnPropsEqual(prev: BoardColumnProps, next: BoardColumnProps) {
  if (prev.column === next.column && prev.tasks === next.tasks) {
    return (
      prev.onTaskClick === next.onTaskClick &&
      prev.onTaskCreated === next.onTaskCreated &&
      prev.dropHint === next.dropHint &&
      prev.activeId === next.activeId &&
      prev.isDragging === next.isDragging &&
      prev.onPositionsChange === next.onPositionsChange
    )
  }

  if (prev.column.id !== next.column.id) return false
  if (prev.column.title !== next.column.title) return false
  if (prev.column.color !== next.column.color) return false
  if (prev.onTaskClick !== next.onTaskClick) return false
  if (prev.onTaskCreated !== next.onTaskCreated) return false
  if (prev.tasks.length !== next.tasks.length) return false
  if (prev.dropHint !== next.dropHint) return false
  if (prev.activeId !== next.activeId) return false
  if (prev.isDragging !== next.isDragging) return false
  if (prev.onPositionsChange !== next.onPositionsChange) return false

  for (let i = 0; i < prev.tasks.length; i += 1) {
    if (prev.tasks[i] !== next.tasks[i]) return false
  }

  return true
}

export const BoardColumn = memo(BoardColumnBase, areBoardColumnPropsEqual)
