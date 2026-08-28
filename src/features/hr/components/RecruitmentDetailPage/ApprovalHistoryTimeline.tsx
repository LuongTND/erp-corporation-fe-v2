import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApprovalHistoryItem } from '../../types/recruitment.types'

const ACTION_CONFIG: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  Submitted: { icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', label: 'Nộp phiếu' },
  Approved: { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', label: 'Duyệt' },
  Rejected: { icon: XCircle, color: 'text-red-600 dark:text-red-400', label: 'Từ chối' },
  NeedMoreInfo: { icon: AlertCircle, color: 'text-orange-600 dark:text-orange-400', label: 'Yêu cầu bổ sung' },
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

interface ApprovalHistoryTimelineProps {
  history: ApprovalHistoryItem[]
}

export function ApprovalHistoryTimeline({ history }: ApprovalHistoryTimelineProps) {
  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có lịch sử duyệt</p>
  }

  return (
    <ol className="space-y-4">
      {history.map((item, index) => {
        const config = ACTION_CONFIG[item.action] ?? {
          icon: Clock,
          color: 'text-muted-foreground',
          label: item.action,
        }
        const Icon = config.icon

        return (
          <li key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', config.color)} />
              {index < history.length - 1 && (
                <div className="w-px flex-1 bg-border mt-1.5" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 pb-4 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn('text-sm font-medium', config.color)}>{config.label}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(item.occurredAt)}</span>
              </div>
              <span className="text-sm text-foreground">{item.actorName}</span>
              {item.note && (
                <p className="text-sm text-muted-foreground mt-0.5 italic">"{item.note}"</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
