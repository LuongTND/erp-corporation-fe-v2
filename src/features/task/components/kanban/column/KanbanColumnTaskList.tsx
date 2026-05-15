import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import type { ColumnPositionSnapshot, DropHint } from '../../../hooks/use-kanban-dnd'
import type { Id, Task, TaskItemDto } from '../../../types/task.types'
import { BoardCard } from '../card/KanbanCard'
import { useColumnMeasurements, useDropIndicator } from '../../../hooks/use-kanban-column'
import { TaskCreateDialog } from '../dialogs/TaskCreateDialog'

interface ColumnTaskListProps {
  tasks: Task[]
  columnId: Id
  dropHint?: DropHint
  activeId?: Id | null
  isDragging?: boolean
  onTaskClick?: (task: Task) => void
  onTaskCreated?: (task?: TaskItemDto) => void
  onPositionsChange?: (columnId: Id, snapshot: ColumnPositionSnapshot) => void
}

export function ColumnTaskList({
  tasks,
  columnId,
  dropHint,
  activeId,
  isDragging,
  onTaskClick,
  onTaskCreated,
  onPositionsChange,
}: ColumnTaskListProps) {
  const showHint = dropHint?.columnId === columnId
  const hintIndex = showHint ? dropHint?.index ?? 0 : null
  const effectiveTasks = useMemo(() => {
    if (!activeId || !showHint) return tasks
    return tasks.filter((task) => task.id !== activeId)
  }, [activeId, showHint, tasks])

  const shouldMeasure = Boolean(isDragging || showHint)

  const { listRef, positionMapRef } = useColumnMeasurements({
    columnId,
    tasks,
    onPositionsChange,
    isDragging,
    shouldMeasure,
  })

  const indicatorStyle = useDropIndicator({
    listRef,
    positionMapRef,
    showHint,
    hintIndex,
    tasks,
    effectiveTasks,
  })

  const taskRows = useMemo(
    () =>
      tasks.map((task) => (
        <Fragment key={task.id}>
          <BoardCard task={task} onTaskClick={onTaskClick} isGhost={task.id === activeId} />
        </Fragment>
      )),
    [tasks, activeId, onTaskClick],
  )

  return (
    <div ref={listRef} style={{ position: 'relative' }} className="flex flex-col p-3 min-h-full">
      {taskRows}

      {showHint && indicatorStyle ? (
        <div className="my-2 h-0.5 rounded-full bg-primary/60" style={indicatorStyle} />
      ) : null}

      <TaskCreateDialog
        defaultStatusId={columnId as string}
        onTaskCreated={onTaskCreated}
        trigger={
          <Button
            variant="ghost"
            className="w-full h-8 justify-start px-3 gap-1.5 rounded-md bg-transparent hover:bg-[#ede8e0] text-[#8e8b82] hover:text-[#6c6a64] border border-dashed border-[#e6dfd8] hover:border-[#cc785c]/40 transition-colors duration-150"
          >
            <Plus className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[12px] font-medium">Tạo Task</span>
          </Button>
        }
      />
    </div>
  )
}
