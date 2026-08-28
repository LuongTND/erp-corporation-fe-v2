import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RECRUITMENT_STATUS_LABELS } from '../../types/recruitment.types'
import type { RecruitmentRequestStatus } from '../../types/recruitment.types'

const STATUS_VARIANTS: Record<RecruitmentRequestStatus, string> = {
  Draft: 'bg-muted text-muted-foreground',
  Submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  NeedMoreInfo: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
}

interface RequestStatusBadgeProps {
  status: RecruitmentRequestStatus
  className?: string
}

export function RequestStatusBadge({ status, className }: RequestStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('text-xs font-medium border-0', STATUS_VARIANTS[status], className)}>
      {RECRUITMENT_STATUS_LABELS[status]}
    </Badge>
  )
}
