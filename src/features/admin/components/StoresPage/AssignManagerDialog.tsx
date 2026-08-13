import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { useDebounce } from '@/hooks/use-debounce'
import type { StoreResponse, UserSummaryResponse } from '../../types/admin.types'

interface AssignManagerDialogProps {
  readonly store: StoreResponse | null
  readonly users: UserSummaryResponse[]
  readonly isSaving: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onAssign: (storeId: string, managerId: string | null) => void
}

export function AssignManagerDialog({ store, users, isSaving, onOpenChange, onAssign }: AssignManagerDialogProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 200)

  const filtered = debouncedSearch
    ? users.filter(u =>
        u.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.employeeCode.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : users

  return (
    <Dialog open={store !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gán quản lý — {store?.name}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Tìm nhân sự..."
            className="pl-8 h-8 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="max-h-64 overflow-y-auto flex flex-col gap-0.5">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Không tìm thấy nhân sự</p>
          ) : filtered.map(u => (
            <button
              key={u.id}
              type="button"
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm cursor-pointer transition-colors hover:bg-accent ${store?.managerId === u.id ? 'bg-primary/10 text-primary font-medium' : ''}`}
              onClick={() => { if (store) onAssign(store.id, u.id) }}
              disabled={isSaving}
            >
              <span className="font-medium">{u.fullName}</span>
              <span className="text-muted-foreground text-xs">{u.employeeCode}</span>
            </button>
          ))}
        </div>

        <DialogFooter className="flex gap-2">
          {store?.managerId && (
            <Button
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={() => { if (store) onAssign(store.id, null) }}
            >
              Gỡ quản lý
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
