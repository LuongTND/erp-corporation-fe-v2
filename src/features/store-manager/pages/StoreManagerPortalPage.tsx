import { MapPin, Phone, Store, Users, LayoutGrid, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyStore } from '@/features/admin/hooks/use-stores'

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export default function StoreManagerPortalPage() {
  const { data: store, isLoading } = useMyStore()

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-medium">Bạn chưa được gán quản lý cửa hàng nào</p>
          <p className="text-sm text-muted-foreground mt-1">Liên hệ Admin để được phân công</p>
        </div>
      </div>
    )
  }

  const todayIdx = new Date().getDay()

  return (
    <div className="h-full flex flex-col bg-background text-foreground overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
        {/* Header */}
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

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Store info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="h-4 w-4" />
                Thông tin cửa hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
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
              {!store.address && !store.phone && !store.regionName && (
                <p className="text-muted-foreground italic">Chưa có thông tin</p>
              )}
            </CardContent>
          </Card>

          {/* Counters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Quầy ({store.counters.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {store.counters.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Chưa có quầy nào</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {store.counters.map(c => (
                    <Badge key={c.id} variant="outline" className="text-xs">
                      {c.name} <span className="ml-1 text-muted-foreground font-mono">{c.code}</span>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Employees placeholder — pending HRM-026 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Nhân sự cửa hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Chức năng gắn nhân sự vào cửa hàng đang được phát triển (HRM-026).
            </p>
          </CardContent>
        </Card>

        {/* Today indicator */}
        <div className="flex gap-1.5 items-center text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Hôm nay: <span className="font-medium text-foreground">{DAY_NAMES[todayIdx]}</span></span>
        </div>
      </div>
    </div>
  )
}
