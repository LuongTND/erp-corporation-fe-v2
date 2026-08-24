import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebounce } from '@/hooks/use-debounce'
import { useStores } from '../hooks/use-stores'
import { useCounters, useCreateCounter, useUpdateCounter, useToggleCounterActive, useDeleteCounter } from '../hooks/use-counters'
import { CounterTable, CounterDialog } from '../components/CountersPage'
import type { CounterResponse } from '../types/admin.types'

export default function CountersPage() {
  const [search, setSearch] = useState('')
  const [selectedStoreId, setSelectedStoreId] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editCounter, setEditCounter] = useState<CounterResponse | undefined>()

  const debouncedSearch = useDebounce(search, 300)
  const { data: storesData, isLoading: isLoadingStores } = useStores()
  const stores = storesData?.items ?? []

  const { data, isLoading } = useCounters({
    storeId: selectedStoreId || undefined,
    searchText: debouncedSearch || undefined,
  })
  const counters = data?.items ?? []

  const create = useCreateCounter()
  const update = useUpdateCounter()
  const toggle = useToggleCounterActive()
  const del = useDeleteCounter()

  const openCreate = () => { setEditCounter(undefined); setDialogOpen(true) }
  const openEdit = (counter: CounterResponse) => { setEditCounter(counter); setDialogOpen(true) }

  const handleSubmit = (values: { storeId: string; name: string; code: string }) => {
    if (editCounter) {
      update.mutate({ id: editCounter.id, data: { name: values.name, code: values.code } },
        { onSuccess: () => setDialogOpen(false) })
    } else {
      create.mutate(values, { onSuccess: () => setDialogOpen(false) })
    }
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Quầy</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading
                ? <Skeleton className="h-4 w-32 inline-block" />
                : selectedStoreId
                  ? `${counters.length} quầy trong ${stores.find(s => s.id === selectedStoreId)?.name ?? 'cửa hàng'}`
                  : `${counters.length} quầy`}
            </p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Thêm quầy
          </Button>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Select value={selectedStoreId} onValueChange={setSelectedStoreId} disabled={isLoadingStores}>
            <SelectTrigger className="h-8 w-52 text-sm">
              <SelectValue placeholder="Tất cả cửa hàng" />
            </SelectTrigger>
            <SelectContent align="start" sideOffset={4}>
              <SelectItem value="">Tất cả cửa hàng</SelectItem>
              {stores.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Tìm tên hoặc mã quầy..."
              className="pl-8 h-8 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <CounterTable
          counters={counters}
          isLoading={isLoading}
          isToggling={toggle.isPending}
          isDeleting={del.isPending}
          filterStoreName={selectedStoreId ? stores.find(s => s.id === selectedStoreId)?.name : undefined}
          onEdit={openEdit}
          onToggleActive={id => toggle.mutate(id)}
          onDelete={id => del.mutate(id)}
        />
      </div>

      <CounterDialog
        open={dialogOpen}
        editCounter={editCounter}
        stores={stores}
        defaultStoreId={selectedStoreId || undefined}
        isPending={create.isPending || update.isPending}
        onSubmit={handleSubmit}
        onOpenChange={setDialogOpen}
      />

    </div>
  )
}
