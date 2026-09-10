import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WorkflowTask, WorkflowTaskStatus } from '../../types/workflow.types'

const STATUS_CONFIG: Record<WorkflowTaskStatus, { icon: typeof Clock; color: string; label: string }> = {
  Pending: { icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', label: 'Chờ duyệt' },
  Approved: { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', label: 'Đã duyệt' },
  Rejected: { icon: XCircle, color: 'text-red-600 dark:text-red-400', label: 'Từ chối' },
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function ApprovalHistoryTimeline({ tasks }: { tasks: WorkflowTask[] }) {
  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có lịch sử duyệt</p>
  }

  return (
    <ol className="space-y-4">
      {tasks.map((task, index) => {
        const cfg = STATUS_CONFIG[task.status]
        const Icon = cfg.icon
        const dateLabel = task.actedAt ? formatDateTime(task.actedAt) : formatDateTime(task.createdAt)

        return (
          <li key={task.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', cfg.color)} />
              {index < tasks.length - 1 && (
                <div className="w-px flex-1 bg-border mt-1.5" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 pb-4 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground">{task.stepName}</span>
                <span className={cn('text-xs font-medium', cfg.color)}>{cfg.label}</span>
                <span className="text-xs text-muted-foreground">· {dateLabel}</span>
              </div>
              {task.note && (
                <p className="text-sm text-muted-foreground mt-0.5 italic">"{task.note}"</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
