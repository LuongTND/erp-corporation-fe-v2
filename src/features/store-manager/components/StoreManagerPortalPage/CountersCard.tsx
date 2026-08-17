import { LayoutGrid } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CounterResponse } from '@/features/admin/types/admin.types'

interface CountersCardProps {
  readonly counters: CounterResponse[]
}

export function CountersCard({ counters }: CountersCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          Quầy ({counters.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {counters.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Chưa có quầy nào</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {counters.map(counter => (
              <Badge key={counter.id} variant="outline" className="text-xs">
                {counter.name} <span className="ml-1 text-muted-foreground font-mono">{counter.code}</span>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
