/**
 * TaskCard Component
 * Card hiển thị một task
 * - Priority badge
 * - Status indicator
 * - Assigned user
 * - Progress bar
 */

import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import type { Task, TaskPriority, TaskStatus } from '../types/task.types'

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}

const statusColors: Record<TaskStatus, string> = {
  todo: 'bg-gray-200',
  'in-progress': 'bg-blue-200',
  'in-review': 'bg-purple-200',
  done: 'bg-green-200',
  cancelled: 'bg-red-200',
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="flex-1 font-semibold text-card-foreground">{task.title}</h3>
        <Badge className={task.priority ? priorityColors[task.priority] : ''}>{task.priority}</Badge>
      </div>

      {/* Description */}
      {task.description && (
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {task.description}
        </p>
      )}

      {/* Progress Bar */}
      {task.progress !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium">{task.progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${task.status ? statusColors[task.status] : ''}`}
          />
          <span className="text-xs text-muted-foreground capitalize">
            {task.status?.replace('-', ' ')}
          </span>
        </div>

        {task.dueDate && (
          <span className="text-xs text-muted-foreground">
            {format(new Date(task.dueDate), 'MMM d', { locale: vi })}
          </span>
        )}
      </div>

      {/* Assigned To */}
      {task.assignee && (
        <div className="mt-3 flex items-center gap-2 border-t pt-3">
          <img
            src={task.assigneeAvatar || 'https://via.placeholder.com/24'}
            alt={task.assignee}
            className="h-6 w-6 rounded-full"
          />
          <span className="text-xs text-muted-foreground">{task.assignee}</span>
        </div>
      )}
    </div>
  )
}
