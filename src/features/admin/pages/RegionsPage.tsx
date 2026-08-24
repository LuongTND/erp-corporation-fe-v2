import { useState } from 'react'
import { RefreshCw, Search, MapPin, Clock, Store, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useDebounce } from '@/hooks/use-debounce'
import { useRegions, useSyncRegions, useRegionHours, useUpsertRegionHours, useAssignRegionManager } from '../hooks/use-regions'
import { useStoresByRegion, useStoreHours, useUpsertStoreHours } from '../hooks/use-stores'
import { useEmployees } from '../hooks/use-employees'
import { RegionHoursDialog, AssignManagerDialog } from '../components/RegionsPage'
import { StoreHoursDialog } from '../components/StoresPage'
import type { RegionResponse, StoreResponse } from '../types/admin.types'

export default function RegionsPage() {
  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<RegionResponse | null>(null)
  const [hoursRegion, setHoursRegion] = useState<RegionResponse | null>(null)
  const [hoursStore, setHoursStore] = useState<StoreResponse | null>(null)
  const [managerRegion, setManagerRegion] = useState<RegionResponse | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useRegions({ searchText: debouncedSearch || undefined })
  const sync = useSyncRegions()

  const { data: storesData, isLoading: isStoresLoading } = useStoresByRegion(selectedRegion?.id ?? null)
  const { data: regionHours = [], isLoading: isRegionHoursLoading } = useRegionHours(hoursRegion?.id ?? null)
  const { data: storeHours = [], isLoading: isStoreHoursLoading } = useStoreHours(hoursStore?.id ?? null)

  const upsertRegionHours = useUpsertRegionHours()
  const upsertStoreHours = useUpsertStoreHours()
  const assignManager = useAssignRegionManager()
  const { data: employees = [] } = useEmployees()

  const regions = data?.items ?? []
  const stores = storesData?.items ?? []

  function handleSearch(value: string) {
    setSearch(value)
    setSelectedRegion(null)
  }

  function handleSelectRegion(region: RegionResponse) {
    setSelectedRegion(prev => prev?.id === region.id ? null : region)
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="shrink-0 border-b bg-card px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Khu vực</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading
                ? <Skeleton className="h-4 w-36 inline-block" />
                : `${regions.length} khu vực đã đồng bộ`}
            </p>
          </div>
          <Button onClick={() => sync.mutate()} disabled={sync.isPending} size="sm" className="gap-1.5">
            <RefreshCw className={cn('h-3.5 w-3.5', sync.isPending && 'animate-spin')} />
            {sync.isPending ? 'Đang đồng bộ...' : 'Đồng bộ POS'}
          </Button>
        </div>
      </div>

      {/* Master-Detail */}
      <div className="flex-1 min-h-0 max-w-7xl w-full mx-auto flex gap-0">
        {/* Left panel — region list */}
        <div className="w-72 shrink-0 border-r flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Tìm khu vực..."
                className="pl-8 h-8 text-sm"
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="p-2 space-y-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-lg px-3 py-2.5 flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : regions.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Chưa có khu vực nào
              </div>
            ) : (
              <div className="p-2 space-y-0.5">
                {regions.map(region => {
                  const isSelected = selectedRegion?.id === region.id
                  return (
                    <button
                      key={region.id}
                      onClick={() => handleSelectRegion(region)}
                      className={cn(
                        'w-full rounded-lg px-3 py-2.5 flex items-center gap-3 text-left transition-colors duration-150 cursor-pointer',
                        isSelected
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted/60 text-foreground',
                      )}
                    >
                      <div className={cn(
                        'h-8 w-8 shrink-0 rounded-lg flex items-center justify-center',
                        isSelected ? 'bg-primary/15' : 'bg-muted',
                      )}>
                        <MapPin className={cn('h-4 w-4', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{region.name}</p>
                        <p className={cn('text-xs mt-0.5', isSelected ? 'text-primary/70' : 'text-muted-foreground')}>
                          {region.storeCount} cửa hàng · {region.code}
                        </p>
                        {region.managerName
                          ? <p className={cn('text-[10px] mt-0.5 font-medium truncate', isSelected ? 'text-primary/60' : 'text-muted-foreground')}>
                              {region.managerName}
                            </p>
                          : <p className="text-[10px] mt-0.5 text-amber-600 dark:text-amber-400">Chưa có quản lý</p>
                        }
                      </div>
                      {isSelected && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary" />}
                    </button>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right panel — detail */}
        <div className="flex-1 min-w-0 flex flex-col">
          {selectedRegion == null ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <p className="text-sm">Chọn khu vực để xem chi tiết</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Detail header */}
              <div className="shrink-0 px-6 py-4 border-b flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-violet-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold">{selectedRegion.name}</h2>
                      <Badge
                        variant="secondary"
                        className={cn('text-[10px]', selectedRegion.isActive
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'text-muted-foreground')}
                      >
                        {selectedRegion.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Mã: <span className="font-mono">{selectedRegion.code}</span> · {selectedRegion.storeCount} cửa hàng
                      {selectedRegion.managerName && <> · Quản lý: <span className="font-medium text-foreground">{selectedRegion.managerName}</span></>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline" size="sm"
                    className="gap-1.5 text-xs"
                    disabled={assignManager.isPending}
                    onClick={() => setManagerRegion(selectedRegion)}
                  >
                    Gán quản lý
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => setHoursRegion(selectedRegion)}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Giờ mặc định
                  </Button>
                </div>
              </div>

              {/* Store list */}
              <ScrollArea className="flex-1">
                <div className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Store className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Cửa hàng trong khu vực
                    </span>
                  </div>

                  {isStoresLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-lg border px-4 py-3 flex items-center gap-3">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-20 ml-auto" />
                          <Skeleton className="h-7 w-7" />
                        </div>
                      ))}
                    </div>
                  ) : stores.length === 0 ? (
                    <div className="rounded-lg border border-dashed px-6 py-10 text-center">
                      <Store className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">Khu vực chưa có cửa hàng nào</p>
                      <p className="text-xs text-muted-foreground mt-1">Gán cửa hàng vào khu vực từ POS rồi đồng bộ lại</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {stores.map(store => (
                        <div
                          key={store.id}
                          className="rounded-lg border bg-card px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors duration-150"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{store.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 font-mono">{store.code}</p>
                          </div>
                          <Badge
                            variant={store.todayIsClosed === true ? 'destructive' : 'secondary'}
                            className={cn(
                              'text-[10px] shrink-0',
                              store.todayIsClosed !== true && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
                            )}
                          >
                            {store.todayIsClosed === true ? 'Hôm nay: Nghỉ' : 'Hôm nay: Mở'}
                          </Badge>
                          <Button
                            variant="ghost" size="icon"
                            className={cn(
                              'h-7 w-7 shrink-0 cursor-pointer',
                              store.todayIsClosed === true && 'text-destructive hover:text-destructive',
                            )}
                            onClick={() => setHoursStore(store)}
                            title="Xem giờ mở cửa"
                            aria-label={`Xem giờ mở cửa ${store.name}`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <RegionHoursDialog
        open={hoursRegion !== null}
        regionName={hoursRegion?.name ?? ''}
        regionHours={regionHours}
        isLoading={isRegionHoursLoading}
        isSaving={upsertRegionHours.isPending}
        onOpenChange={open => { if (!open) setHoursRegion(null) }}
        onSave={async hours => {
          if (!hoursRegion) return
          await upsertRegionHours.mutateAsync({ regionId: hoursRegion.id, hours })
          setHoursRegion(null)
        }}
      />

      <StoreHoursDialog
        open={hoursStore !== null}
        storeName={hoursStore?.name ?? ''}
        storeHours={storeHours}
        isLoading={isStoreHoursLoading}
        isSaving={upsertStoreHours.isPending}
        onOpenChange={open => { if (!open) setHoursStore(null) }}
        onSave={async hours => {
          if (!hoursStore) return
          await upsertStoreHours.mutateAsync({ storeId: hoursStore.id, hours })
          setHoursStore(null)
        }}
      />

      <AssignManagerDialog
        region={managerRegion}
        users={employees}
        isSaving={assignManager.isPending}
        onOpenChange={open => { if (!open) setManagerRegion(null) }}
        onAssign={(regionId, managerId) => {
          assignManager.mutate({ regionId, managerId }, {
            onSuccess: () => setManagerRegion(null),
          })
        }}
      />
    </div>
  )
}
