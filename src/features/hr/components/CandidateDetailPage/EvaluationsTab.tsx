import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { CandidateEvaluation } from '../../types/recruitment.types'

interface EvaluationsTabProps {
  evaluations: CandidateEvaluation[]
  isLoading: boolean
  canEvaluate: boolean
  onEvaluate: () => void
}

export function EvaluationsTab({ evaluations, isLoading, canEvaluate, onEvaluate }: EvaluationsTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {canEvaluate && (
        <div className="flex justify-end">
          <Button size="sm" className="cursor-pointer gap-2" onClick={onEvaluate}>
            <Star className="h-3.5 w-3.5" />
            Thêm đánh giá
          </Button>
        </div>
      )}
      {evaluations.length === 0 ? (
        <div className="rounded-lg border bg-card py-10 text-center text-sm text-muted-foreground">
          Chưa có đánh giá nào
        </div>
      ) : (
        <div className="space-y-3">
          {evaluations.map((ev) => (
            <div key={ev.id} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{ev.evaluatorName}</p>
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold">{ev.score}/10</span>
                </div>
              </div>
              <p className="text-sm text-foreground">{ev.recommendation}</p>
              {ev.note && <p className="text-xs text-muted-foreground">{ev.note}</p>}
              <p className="text-xs text-muted-foreground">
                {format(new Date(ev.evaluatedAt), 'HH:mm, dd/MM/yyyy', { locale: vi })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
