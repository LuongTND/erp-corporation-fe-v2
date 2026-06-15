import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import * as React from 'react'
import type { Task } from '../../../types/task.types'
import { KanbanCardContent } from './KanbanCardContent'
import { KanbanCardMedia } from './KanbanCardMedia'

interface BoardCardProps {
  task: Task
  isGhost?: boolean
  onTaskClick?: (task: Task) => void
}

function BoardCardBase({ task, isGhost, onTaskClick }: BoardCardProps) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: task.id,
    data: { type: 'Task', task },
  })

  const handleClick = () => {
    if (isDragging || isGhost) return
    onTaskClick?.(task)
  }

  return (
    <div
      ref={setNodeRef}
      data-task-id={String(task.id)}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        'relative group/card touch-none mb-2 w-full outline-none',
        isGhost ? 'opacity-30 pointer-events-none' : isDragging ? 'opacity-30' : 'opacity-100',
      )}
    >
      <Card
        className={cn(
          'flex flex-col gap-2 p-3 rounded-lg border-border bg-card shadow-sm transition-all',
          'hover:bg-accent/50 hover:shadow-md',
          'cursor-pointer overflow-hidden',
        )}
      >
        {task.image && <KanbanCardMedia src={task.image} alt={task.title} />}
        <KanbanCardContent task={task} />
      </Card>
    </div>
  )
}

interface KanbanCardOverlayProps {
  task: Task
  isSimple?: boolean
}

export function KanbanCardOverlay({ task, isSimple }: KanbanCardOverlayProps) {
  return (
    <Card
      className={cn(
        'flex flex-col gap-2 p-3 rounded-lg border-border bg-card shadow-sm transition-all',
        'hover:bg-accent/50 hover:shadow-md',
        'cursor-pointer overflow-hidden',
        isSimple
          ? 'cursor-grabbing shadow-md ring-1 ring-primary/60 z-50 opacity-100'
          : 'cursor-grabbing shadow-xl ring-2 ring-primary rotate-2 scale-105 z-50 opacity-100',
      )}
    >
      {isSimple ? (
        <div className="text-sm font-medium text-foreground leading-tight line-clamp-3">
          {task.title}
        </div>
      ) : (
        <>
          {task.image && <KanbanCardMedia src={task.image} alt={task.title} />}
          <KanbanCardContent task={task} />
        </>
      )}
    </Card>
  )
}

function areBoardCardPropsEqual(prev: BoardCardProps, next: BoardCardProps) {
  if (prev.isGhost !== next.isGhost) return false
  if (prev.onTaskClick !== next.onTaskClick) return false
  if (prev.task === next.task) return true
  return (
    prev.task.id === next.task.id &&
    prev.task.title === next.task.title &&
    prev.task.tag === next.task.tag &&
    prev.task.image === next.task.image
  )
}

export const BoardCard = React.memo(BoardCardBase, areBoardCardPropsEqual)
