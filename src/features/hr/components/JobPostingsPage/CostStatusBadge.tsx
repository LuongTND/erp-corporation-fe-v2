import { Badge } from '@/components/ui/badge'
import { COST_STATUS_LABELS, type JobPostingCostStatus } from '../../types/recruitment.types'

const VARIANTS: Record<JobPostingCostStatus, string> = {
  NotRequired: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  PendingApproval: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  Approved: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

export function CostStatusBadge({ status }: { status: JobPostingCostStatus }) {
  return (
    <Badge className={`text-xs font-medium border-0 ${VARIANTS[status]}`}>
      {COST_STATUS_LABELS[status]}
    </Badge>
  )
}
