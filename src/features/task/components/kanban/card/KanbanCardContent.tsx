import { FileText } from 'lucide-react'
import type { Task } from '../../../types/task.types'
import { TaskMenuActions } from './KanbanCardMenu'

interface KanbanCardContentProps {
  task: Task
}

export function KanbanCardContent({ task }: KanbanCardContentProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 overflow-hidden">
          <FileText className="h-3.5 w-3.5 mt-0.5 text-muted-foreground/70 shrink-0" />
          <span className="text-sm font-medium text-foreground leading-tight line-clamp-3">
            {task.title}
          </span>
        </div>
        <TaskMenuActions />
      </div>
      <div className="mt-1" />
    </>
  )
}
