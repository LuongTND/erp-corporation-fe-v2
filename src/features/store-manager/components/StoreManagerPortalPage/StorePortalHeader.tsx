import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { StorePortalResponse } from '@/features/admin/types/admin.types'

interface StorePortalHeaderProps {
  readonly store: StorePortalResponse
}

export function StorePortalHeader({ store }: StorePortalHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{store.name}</h1>
          <Badge
            variant={store.isActive ? 'secondary' : 'destructive'}
            className={store.isActive ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : ''}
          >
            {store.isActive ? 'Hoạt động' : 'Ngưng'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 font-mono">{store.code}</p>
      </div>

      {store.todayHours && (
        <div className="flex items-center gap-1.5 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {store.todayHours.isClosed
            ? <span className="text-destructive font-medium">Hôm nay: Nghỉ</span>
            : <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {store.todayHours.openTime} – {store.todayHours.closeTime}
              </span>}
        </div>
      )}
    </div>
  )
}
