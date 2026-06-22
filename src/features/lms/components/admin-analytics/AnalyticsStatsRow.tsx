import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { AnalyticsStat } from '../../types/admin.types'

interface AnalyticsStatsRowProps {
  readonly stats: AnalyticsStat[]
}

export function AnalyticsStatsRow({ stats }: AnalyticsStatsRowProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border">
          <CardContent className="px-5 py-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
            <div className="mt-1.5 flex items-center gap-1">
              {stat.deltaPositive ? (
                <TrendingUp className="h-3.5 w-3.5 text-[#3B6D11]" aria-hidden />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-[#C0392B]" aria-hidden />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  stat.deltaPositive ? 'text-[#3B6D11]' : 'text-[#C0392B]'
                )}
              >
                {stat.delta}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
