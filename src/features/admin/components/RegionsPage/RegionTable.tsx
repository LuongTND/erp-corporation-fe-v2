import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination'
import type { RegionResponse } from '../../types/admin.types'

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

interface RegionTableProps {
  readonly regions: RegionResponse[]
  readonly isLoading: boolean
  readonly pageSize: number
  readonly totalCount: number
  readonly currentPage: number
  readonly totalPages: number
  readonly start: number
  readonly onRegionHours: (region: RegionResponse) => void
  readonly onPageChange: (page: number) => void
  readonly onPageSizeChange: (size: number) => void
}

export function RegionTable({
  regions, isLoading,
  pageSize, totalCount, currentPage, totalPages, start,
  onRegionHours, onPageChange, onPageSizeChange,
}: RegionTableProps) {
  return (
    <div className="rounded-lg border bg-card flex flex-col overflow-hidden [&>[data-slot=table-container]]:overflow-y-auto [&>[data-slot=table-container]]:max-h-[calc(100vh-280px)]">
      <div className="contents">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-card">Tên khu vực</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-36">Mã</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-28">Trạng thái</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize > 10 ? 10 : pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-7 w-8" /></TableCell>
                </TableRow>
              ))
            ) : regions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground text-sm">
                  Chưa có khu vực nào được đồng bộ
                </TableCell>
              </TableRow>
            ) : (
              regions.map(region => (
                <TableRow key={region.id}>
                  <TableCell className="font-medium">{region.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">{region.code}</TableCell>
                  <TableCell>
                    <Badge
                      variant={region.isActive ? 'secondary' : 'secondary'}
                      className={region.isActive
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'text-muted-foreground'}
                    >
                      {region.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => onRegionHours(region)}
                      title="Giờ mở cửa mặc định"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
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
            `Hiển thị ${totalCount === 0 ? 0 : Math.min(start + 1, totalCount)}–${Math.min(start + pageSize, totalCount)} trong ${totalCount} khu vực`
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
