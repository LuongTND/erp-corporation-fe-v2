import { Badge } from '@/components/ui/badge'
import { INTERVIEW_RULE_CONTEXT_LABELS, type InterviewRuleContext } from '../../types/admin.types'

const contextVariant: Record<InterviewRuleContext, 'default' | 'secondary' | 'outline'> = {
  StoreRetail: 'default',
  Office: 'secondary',
  Production: 'outline',
}

export function InterviewRuleContextBadge({ context }: { context: InterviewRuleContext }) {
  return (
    <Badge variant={contextVariant[context]}>
      {INTERVIEW_RULE_CONTEXT_LABELS[context]}
    </Badge>
  )
}
