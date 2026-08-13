import { Clock, Power, Trash2, UserCog } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
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
  readonly pageSize: number
  readonly totalCount: number
  readonly currentPage: number
  readonly totalPages: number
  readonly start: number
  readonly onStoreHours: (store: StoreResponse) => void
  readonly onAssignManager: (store: StoreResponse) => void
  readonly onToggleActive: (storeId: string) => void
  readonly onDelete: (storeId: string) => void
  readonly onPageChange: (page: number) => void
  readonly onPageSizeChange: (size: number) => void
}

export function StoreTable({
  stores, isLoading, isDeleting, isToggling,
  pageSize, totalCount, currentPage, totalPages, start,
  onStoreHours, onAssignManager, onToggleActive, onDelete, onPageChange, onPageSizeChange,
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
              <TableHead className="sticky top-0 z-10 bg-card w-40">Quản lý</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-28">Trạng thái</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-28" />
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
                  <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-7 w-20" /></TableCell>
                </TableRow>
              ))
            ) : stores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                  Chưa có cửa hàng nào được đồng bộ
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
                      : <span className="text-muted-foreground italic">Chưa có</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={store.isActive ? 'secondary' : 'destructive'}
                        className={cn('text-[10px] w-fit', store.isActive && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400')}
                      >
                        {store.isActive ? 'Hoạt động' : 'Ngưng'}
                      </Badge>
                      {store.todayIsClosed !== null && (
                        <Badge variant="outline" className="text-[10px] w-fit">
                          {store.todayIsClosed ? 'Hôm nay: Nghỉ' : 'Hôm nay: Mở'}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => onAssignManager(store)}
                        title="Gán quản lý"
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => onStoreHours(store)}
                        title="Giờ mở cửa"
                        className={cn(store.todayIsClosed === true && 'text-destructive hover:text-destructive')}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost" size="icon"
                            title={store.isActive ? 'Ngưng hoạt động' : 'Kích hoạt'}
                            className={cn(store.isActive
                              ? 'text-amber-600 hover:text-amber-600 hover:bg-amber-500/10'
                              : 'text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10')}
                            disabled={isToggling}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{store.isActive ? 'Ngưng hoạt động cửa hàng' : 'Kích hoạt cửa hàng'}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {store.isActive
                                ? <>Bạn có chắc muốn ngưng hoạt động <span className="font-medium text-foreground">{store.name}</span>? Nhân viên sẽ không thể chấm công tại cửa hàng này.</>
                                : <>Bạn có chắc muốn kích hoạt lại <span className="font-medium text-foreground">{store.name}</span>?</>}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              className={store.isActive
                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'}
                              onClick={() => onToggleActive(store.id)}
                            >
                              {store.isActive ? 'Ngưng' : 'Kích hoạt'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost" size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
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
                              onClick={() => onDelete(store.id)}
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
              <SelectContent>
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
