import { Badge } from '@/components/ui/badge'

interface ScoreBadgeProps {
  score: number
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const color =
    score >= 80 ? 'bg-green-500/15 text-green-400 border-green-500/30' :
    score >= 60 ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
    'bg-red-500/15 text-red-400 border-red-500/30'
  return <Badge variant="outline" className={color}>{score.toFixed(1)}</Badge>
}
