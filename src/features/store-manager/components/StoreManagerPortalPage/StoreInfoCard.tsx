import { MapPin, Phone, Store } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StorePortalResponse } from '@/features/admin/types/admin.types'

interface StoreInfoCardProps {
  readonly store: StorePortalResponse
}

export function StoreInfoCard({ store }: StoreInfoCardProps) {
  const hasInfo = store.regionName || store.address || store.phone

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Store className="h-4 w-4" />
          Thông tin cửa hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {!hasInfo && (
          <p className="text-muted-foreground italic">Chưa có thông tin</p>
        )}
        {store.regionName && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Khu vực: <span className="text-foreground font-medium">{store.regionName}</span></span>
          </div>
        )}
        {store.address && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{store.address}</span>
          </div>
        )}
        {store.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{store.phone}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
