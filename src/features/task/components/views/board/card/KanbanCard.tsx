import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import * as React from 'react'
import type { Task } from '@/features/task/types/task.types'
import { TaskContextMenu } from '@/features/task/components/shared/TaskContextMenu'
import { TaskMenuActions } from './KanbanCardMenu'
import { Calendar } from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function priorityColor(priority?: string): string {
  const p = (priority ?? '').toLowerCase()
  if (p === 'high' || p === 'urgent') return '#c64545'
  if (p === 'medium') return '#d4a017'
  return '#1A6EA8'
}

function DueDateChip({ date }: { date?: string }) {
  if (!date) return null
  const d = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  const isOverdue = d < today
  const isToday = d.getTime() === today.getTime()

  let color = '#8e8b82'
  if (isToday)   color = '#cc785c'
  if (isOverdue) color = '#c64545'

  return (
    <span className="flex items-center gap-0.5 text-[11px]" style={{ color }}>
      <Calendar className="h-3 w-3 shrink-0" />
      {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
    </span>
  )
}

// ── KanbanCardMedia ───────────────────────────────────────────────────────────

function KanbanCardMedia({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[2/1] rounded-md overflow-hidden mb-2" style={{ border: '0.5px solid #e6dfd8' }}>
      <img src={src} alt={alt} className="object-cover w-full h-full" loading="lazy" />
    </div>
  )
}

// ── BoardCardBase ─────────────────────────────────────────────────────────────

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
  const [hovered, setHovered] = React.useState(false)

  const handleClick = () => {
    if (isDragging || isGhost) return
    onTaskClick?.(task)
  }

  return (
    <TaskContextMenu task={task}>
    <div
      ref={setNodeRef}
      data-task-id={String(task.id)}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative touch-none mb-2 w-full outline-none rounded-lg cursor-pointer group/card',
        isGhost ? 'opacity-30 pointer-events-none' : isDragging ? 'opacity-50' : 'opacity-100',
      )}
      style={{ transition: 'box-shadow 150ms ease' }}
    >
      <div
        className="flex flex-col gap-2 p-3 rounded-lg"
        style={{
          backgroundColor: '#FFFFFF',
          border: '0.5px solid #e6dfd8',
          boxShadow: isDragging
            ? '0 8px 24px rgba(0,0,0,0.12)'
            : hovered
              ? '0 2px 8px rgba(0,0,0,0.08)'
              : 'none',
        }}
      >
        {task.image && <KanbanCardMedia src={task.image} alt={task.title} />}

        {/* Title */}
        <p className="text-[13px] leading-snug" style={{ color: '#141413' }}>
          {task.title}
        </p>

        {/* Footer meta */}
        <div className="flex items-center gap-2">
          {/* Priority dot */}
          {task.priority && (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: priorityColor(task.priority) }}
              title={task.priority}
            />
          )}

          <DueDateChip date={task.date} />

          <div className="flex-1" />

          {/* Assignee avatar */}
          {task.assignee && (
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0"
              style={{ backgroundColor: '#cc785c' }}
              title={task.assignee}
            >
              {task.assignee.charAt(0).toUpperCase()}
            </span>
          )}

          {/* Menu (visible on hover) */}
          <div onClick={(e) => e.stopPropagation()}>
            <TaskMenuActions task={task} />
          </div>
        </div>
      </div>
    </div>
    </TaskContextMenu>
  )
}

// ── KanbanCardOverlay ─────────────────────────────────────────────────────────

interface KanbanCardOverlayProps {
  task: Task
  isSimple?: boolean
}

export function KanbanCardOverlay({ task, isSimple }: KanbanCardOverlayProps) {
  return (
    <div
      className="flex flex-col gap-2 p-3 rounded-lg cursor-grabbing"
      style={{
        backgroundColor: '#FFFFFF',
        border: '0.5px solid #e6dfd8',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        transform: isSimple ? 'none' : 'rotate(2deg) scale(1.03)',
        opacity: 1,
      }}
    >
      <p className="text-[13px] leading-snug" style={{ color: '#141413' }}>
        {task.title}
      </p>
    </div>
  )
}

// ── Memoized export ───────────────────────────────────────────────────────────

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
