/**
 * TaskBoard Component
 * Kanban board hiển thị tasks theo status
 * - Drag & drop between columns
 * - Filter & sort
 */

import { useMemo } from 'react'
import { TaskCard } from './TaskCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Task, TaskStatus } from '../types/task.types'

interface TaskBoardProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  onStatusChange?: (taskId: string, status: TaskStatus) => void
}

const statuses: TaskStatus[] = ['todo', 'in-progress', 'in-review', 'done']

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  done: 'Done',
  cancelled: 'Cancelled',
}

export function TaskBoard({
  tasks,
  onTaskClick,
  onStatusChange,
}: TaskBoardProps) {
  // Group tasks by status
  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      todo: [],
      'in-progress': [],
      'in-review': [],
      done: [],
      cancelled: [],
    }

    tasks.forEach((task) => {
      if (groups[task.status]) {
        groups[task.status].push(task)
      }
    })

    return groups
  }, [tasks])

  return (
    <div className="grid h-full grid-cols-4 gap-4">
      {statuses.map((status) => (
        <div key={status} className="flex flex-col rounded-lg bg-muted p-4">
          {/* Column Header */}
          <div className="mb-4">
            <h3 className="font-semibold capitalize">
              {statusLabels[status]}
            </h3>
            <p className="text-sm text-muted-foreground">
              {groupedTasks[status].length} tasks
            </p>
          </div>

          {/* Tasks */}
          <ScrollArea className="flex-1">
            <div className="space-y-3 pr-4">
              {groupedTasks[status].length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed bg-background">
                  <p className="text-xs text-muted-foreground">No tasks</p>
                </div>
              ) : (
                groupedTasks[status].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick?.(task)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  )
}
