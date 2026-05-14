import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import type { ColumnPositionSnapshot, DropHint } from '../../../hooks/use-kanban-dnd'
import type { Id, Task, TaskItemDto } from '../../../types/task.types'
import { BoardCard } from '../card/KanbanCard'
import { useColumnMeasurements } from '../../../hooks/use-column-measurements'
import { useDropIndicator } from '../../../hooks/use-drop-indicator'
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
            className="group/btn w-full h-10 gap-0 border border-dashed border-border/30 hover:border-primary/20 bg-transparent hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-all duration-300 justify-start px-3"
          >
            <Plus className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
            <span className="ml-2 text-sm font-medium">Tạo Task</span>
          </Button>
        }
      />
    </div>
  )
}
