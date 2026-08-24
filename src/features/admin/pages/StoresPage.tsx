import { useState } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/use-debounce'
import { useStores, useSyncStores, useStoreHours, useUpsertStoreHours, useDeleteStore, useToggleStoreActive, useAssignStoreManager, useStoreMembers, useAddStoreMember, useRemoveStoreMember } from '../hooks/use-stores'
import { useRegions } from '../hooks/use-regions'
import { AssignManagerDialog, StoreHoursDialog, StoreMembersDialog, StoreTable } from '../components/StoresPage'
import type { StoreResponse } from '../types/admin.types'
import { useEmployees } from '../hooks/use-employees'

export default function StoresPage() {
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState<string>('')
  const [hoursStore, setHoursStore] = useState<StoreResponse | null>(null)
  const [managerStore, setManagerStore] = useState<StoreResponse | null>(null)
  const [membersStore, setMembersStore] = useState<StoreResponse | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useStores({
    searchText: debouncedSearch || undefined,
    regionId: regionFilter || undefined,
  })
  const { data: regionsData } = useRegions()
  const sync = useSyncStores()
  const deleteStore = useDeleteStore()
  const toggleActive = useToggleStoreActive()
  const assignManager = useAssignStoreManager()
  const addMember = useAddStoreMember()
  const removeMember = useRemoveStoreMember()
  const { data: storeHours = [], isLoading: isHoursLoading } = useStoreHours(hoursStore?.id ?? null)
  const { data: storeMembers = [], isLoading: isMembersLoading } = useStoreMembers(membersStore?.id ?? null)
  const { data: employees = [] } = useEmployees()
  const upsert = useUpsertStoreHours()

  const stores = data?.items ?? []
  const regions = regionsData?.items ?? []
  const filterRegionName = regionFilter ? regions.find(r => r.id === regionFilter)?.name : undefined
  const totalCount = stores.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const paginated = stores.slice(start, start + pageSize)

  function handleSearch(value: string) { setSearch(value); setPage(1) }
  function handleRegionFilter(value: string) { setRegionFilter(value); setPage(1) }

  const handleSaveHours = async (hours: { dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }[]) => {
    if (!hoursStore) return
    await upsert.mutateAsync({ storeId: hoursStore.id, hours })
    setHoursStore(null)
  }

  const handleAssignManager = (storeId: string, managerId: string | null) => {
    assignManager.mutate({ storeId, managerId }, {
      onSuccess: () => setManagerStore(null),
    })
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Cửa hàng</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading
                ? <Skeleton className="h-4 w-32 inline-block" />
                : filterRegionName
                  ? `${totalCount} cửa hàng trong ${filterRegionName}`
                  : `${totalCount} cửa hàng`}
            </p>
          </div>
          <Button onClick={() => sync.mutate()} disabled={sync.isPending} size="sm" className="gap-1.5">
            <RefreshCw className={cn('h-3.5 w-3.5', sync.isPending && 'animate-spin')} />
            {sync.isPending ? 'Đang đồng bộ...' : 'Đồng bộ POS'}
          </Button>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Select value={regionFilter} onValueChange={handleRegionFilter}>
            <SelectTrigger className="h-8 w-44 text-sm">
              <SelectValue placeholder="Tất cả khu vực" />
            </SelectTrigger>
            <SelectContent align="start" sideOffset={4}>
              <SelectItem value="">Tất cả khu vực</SelectItem>
              {regions.map(r => (
                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Tìm tên hoặc địa chỉ..."
              className="pl-8 h-8 text-sm"
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <StoreTable
          stores={paginated}
          isLoading={isLoading}
          isDeleting={deleteStore.isPending}
          isToggling={toggleActive.isPending}
          filterRegionName={filterRegionName}
          pageSize={pageSize}
          totalCount={totalCount}
          currentPage={safePage}
          totalPages={totalPages}
          start={start}
          onStoreHours={setHoursStore}
          onAssignManager={setManagerStore}
          onManageMembers={setMembersStore}
          onToggleActive={storeId => toggleActive.mutate(storeId)}
          onDelete={storeId => deleteStore.mutate(storeId)}
          onPageChange={setPage}
          onPageSizeChange={size => { setPageSize(size); setPage(1) }}
        />
      </div>

      <StoreHoursDialog
        open={hoursStore !== null}
        storeName={hoursStore?.name ?? ''}
        storeHours={storeHours}
        isLoading={isHoursLoading}
        isSaving={upsert.isPending}
        onOpenChange={open => { if (!open) setHoursStore(null) }}
        onSave={handleSaveHours}
      />

      <AssignManagerDialog
        store={managerStore}
        users={employees}
        isSaving={assignManager.isPending}
        onOpenChange={open => { if (!open) setManagerStore(null) }}
        onAssign={handleAssignManager}
      />

      <StoreMembersDialog
        store={membersStore}
        members={storeMembers}
        allUsers={employees}
        isLoading={isMembersLoading}
        isAdding={addMember.isPending}
        isRemoving={removeMember.isPending}
        onOpenChange={open => { if (!open) setMembersStore(null) }}
        onAdd={(storeId, userId, isHomeStore) =>
          addMember.mutate({ storeId, payload: { userId, startDate: new Date().toISOString().slice(0, 10), isHomeStore } })
        }
        onRemove={(storeId, userId) => removeMember.mutate({ storeId, userId })}
      />
    </div>
  )
}
