import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { INTERVIEW_STATUS_LABELS, type InterviewScheduleStatus } from '../../types/recruitment.types'

const STATUS_CLASS: Record<InterviewScheduleStatus, string> = {
  Scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  Completed: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
  NoShow: 'bg-red-50 text-red-700 border-red-200',
}

export function InterviewStatusBadge({ status }: { status: InterviewScheduleStatus }) {
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', STATUS_CLASS[status])}>
      {INTERVIEW_STATUS_LABELS[status]}
    </Badge>
  )
}
