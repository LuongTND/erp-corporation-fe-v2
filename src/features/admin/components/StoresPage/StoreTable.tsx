import { useState } from 'react'
import { Clock, MoreHorizontal, Power, Trash2, UserCog, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination'
import type { StoreResponse } from '../../types/admin.types'

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

interface StoreTableProps {
  readonly stores: StoreResponse[]
  readonly isLoading: boolean
  readonly isDeleting: boolean
  readonly isToggling: boolean
  readonly filterRegionName?: string
  readonly pageSize: number
  readonly totalCount: number
  readonly currentPage: number
  readonly totalPages: number
  readonly start: number
  readonly onStoreHours: (store: StoreResponse) => void
  readonly onAssignManager: (store: StoreResponse) => void
  readonly onManageMembers: (store: StoreResponse) => void
  readonly onToggleActive: (storeId: string) => void
  readonly onDelete: (storeId: string) => void
  readonly onPageChange: (page: number) => void
  readonly onPageSizeChange: (size: number) => void
}

export function StoreTable({
  stores, isLoading, isDeleting, isToggling, filterRegionName,
  pageSize, totalCount, currentPage, totalPages, start,
  onStoreHours, onAssignManager, onManageMembers, onToggleActive, onDelete, onPageChange, onPageSizeChange,
}: StoreTableProps) {
  return (
    <div className="rounded-lg border bg-card flex flex-col overflow-hidden [&>[data-slot=table-container]]:overflow-y-auto [&>[data-slot=table-container]]:max-h-[calc(100vh-280px)]">
      <div className="contents">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-card">Tên cửa hàng</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-36">Mã</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card">Địa chỉ</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-36">SĐT</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-44">Quản lý</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-40">Trạng thái</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize > 10 ? 10 : pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-7 w-7" /></TableCell>
                </TableRow>
              ))
            ) : stores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                  {filterRegionName ? `Không tìm thấy cửa hàng trong ${filterRegionName}` : 'Chưa có cửa hàng nào được đồng bộ'}
                </TableCell>
              </TableRow>
            ) : (
              stores.map(store => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">{store.code}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{store.address ?? '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{store.phone ?? '—'}</TableCell>
                  <TableCell className="text-sm">
                    {store.managerName
                      ? <span className="text-foreground">{store.managerName}</span>
                      : (
                        <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-600 dark:text-amber-400">
                          Chưa gán
                        </Badge>
                      )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge
                        variant={store.isActive ? 'secondary' : 'destructive'}
                        className={cn('text-[10px]', store.isActive && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400')}
                      >
                        {store.isActive ? 'Hoạt động' : 'Ngưng'}
                      </Badge>
                      {store.todayIsClosed !== null && (
                        <Badge variant="outline" className="text-[10px]">
                          {store.todayIsClosed ? 'Hôm nay: Nghỉ' : 'Hôm nay: Mở'}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StoreActions
                      store={store}
                      isDeleting={isDeleting}
                      isToggling={isToggling}
                      onStoreHours={onStoreHours}
                      onAssignManager={onAssignManager}
                      onManageMembers={onManageMembers}
                      onToggleActive={onToggleActive}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="shrink-0 border-t border-border px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
          {isLoading ? (
            <Skeleton className="h-3.5 w-44 inline-block" />
          ) : (
            `Hiển thị ${totalCount === 0 ? 0 : Math.min(start + 1, totalCount)}–${Math.min(start + pageSize, totalCount)} trong ${totalCount} cửa hàng`
          )}
        </p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
            <span>Hiển thị</span>
            <Select value={String(pageSize)} onValueChange={v => onPageSizeChange(Number(v))}>
              <SelectTrigger className="h-7 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" sideOffset={4}>
                {PAGE_SIZE_OPTIONS.map(n => (
                  <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>/ trang</span>
          </div>

          {totalPages > 1 && (
            <PaginationContent className="gap-0.5">
              <PaginationItem>
                <PaginationPrevious
                  text="Trước"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={`h-7 text-xs cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-40' : ''}`}
                />
              </PaginationItem>
              {buildPageNumbers(currentPage, totalPages).map((item, idx) =>
                item === 'ellipsis' ? (
                  <PaginationItem key={`e-${idx}`}>
                    <PaginationEllipsis className="h-7 w-7" />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      isActive={item === currentPage}
                      onClick={() => onPageChange(item)}
                      className="h-7 w-7 text-xs cursor-pointer"
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  text="Sau"
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  className={`h-7 text-xs cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}`}
                />
              </PaginationItem>
            </PaginationContent>
          )}
        </div>
      </div>
    </div>
  )
}

interface StoreActionsProps {
  readonly store: StoreResponse
  readonly isDeleting: boolean
  readonly isToggling: boolean
  readonly onStoreHours: (store: StoreResponse) => void
  readonly onAssignManager: (store: StoreResponse) => void
  readonly onManageMembers: (store: StoreResponse) => void
  readonly onToggleActive: (storeId: string) => void
  readonly onDelete: (storeId: string) => void
}

function StoreActions({ store, isDeleting, isToggling, onStoreHours, onAssignManager, onManageMembers, onToggleActive, onDelete }: StoreActionsProps) {
  const [confirm, setConfirm] = useState<'toggle' | 'delete' | null>(null)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={4} className="w-44 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 animation-duration-200">
          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => onStoreHours(store)}>
            <Clock className="h-3.5 w-3.5" />
            Giờ mở cửa
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => onManageMembers(store)}>
            <Users className="h-3.5 w-3.5" />
            Nhân sự biên chế
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => onAssignManager(store)}>
            <UserCog className="h-3.5 w-3.5" />
            Gán quản lý
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn('cursor-pointer gap-2', store.isActive ? 'text-amber-600 focus:text-amber-600' : 'text-emerald-600 focus:text-emerald-600')}
            disabled={isToggling}
            onClick={() => setConfirm('toggle')}
          >
            <Power className="h-3.5 w-3.5" />
            {store.isActive ? 'Ngưng hoạt động' : 'Kích hoạt'}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
            disabled={isDeleting}
            onClick={() => setConfirm('delete')}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Xóa cửa hàng
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirm === 'toggle'} onOpenChange={open => { if (!open) setConfirm(null) }}>
        <AlertDialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 animation-duration-250">
          <AlertDialogHeader>
            <AlertDialogTitle>{store.isActive ? 'Ngưng hoạt động cửa hàng?' : 'Kích hoạt cửa hàng?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {store.isActive
                ? <>Cửa hàng <span className="font-medium text-foreground">{store.name}</span> sẽ ngưng hoạt động.</>
                : <>Cửa hàng <span className="font-medium text-foreground">{store.name}</span> sẽ được kích hoạt lại.</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className={store.isActive ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}
              onClick={() => { onToggleActive(store.id); setConfirm(null) }}
            >
              {store.isActive ? 'Ngưng' : 'Kích hoạt'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirm === 'delete'} onOpenChange={open => { if (!open) setConfirm(null) }}>
        <AlertDialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 animation-duration-250">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa cửa hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa <span className="font-medium text-foreground">{store.name}</span>?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { onDelete(store.id); setConfirm(null) }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
