import { Clock, Store } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyStore, useMyStoreMembers } from '@/features/admin/hooks/use-stores'
import {
  CountersCard, MembersCard, StoreInfoCard, StorePortalHeader,
} from '../components/StoreManagerPortalPage'

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export default function StoreManagerPortalPage() {
  const { data: store, isLoading } = useMyStore()
  const { data: members = [], isLoading: isMembersLoading } = useMyStoreMembers()

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

  return (
    <div className="h-full flex flex-col bg-background text-foreground overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
        <StorePortalHeader store={store} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StoreInfoCard store={store} />
          <CountersCard counters={store.counters} />
        </div>

        <MembersCard members={members} isLoading={isMembersLoading} />

        <div className="flex gap-1.5 items-center text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Hôm nay: <span className="font-medium text-foreground">{DAY_NAMES[new Date().getDay()]}</span></span>
        </div>
      </div>
    </div>
  )
}
