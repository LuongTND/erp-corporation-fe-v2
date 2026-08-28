import { Badge } from '@/components/ui/badge'
import { CANDIDATE_STAGE_LABELS, type CandidateStage } from '../../types/recruitment.types'

const STAGE_VARIANTS: Record<CandidateStage, string> = {
  New: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Screening: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  StoreInterview: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  ProductionInterview: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Offer: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  Hired: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

export function CandidateStageBadge({ stage }: { stage: CandidateStage }) {
  return (
    <Badge className={`text-xs font-medium border-0 ${STAGE_VARIANTS[stage]}`}>
      {CANDIDATE_STAGE_LABELS[stage]}
    </Badge>
  )
}
