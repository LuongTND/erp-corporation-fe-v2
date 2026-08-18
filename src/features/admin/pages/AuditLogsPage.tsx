import { useState } from 'react'
import { X } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { useAuditLogs } from '../hooks/use-audit-logs'
import type { PermissionAuditLogFilter } from '../types/admin.types'

const PAGE_SIZE_OPTIONS = [15, 50, 100] as const

const ACTION_LABELS: Record<string, string> = {
  AssignRole: 'Gán vai trò',
  RevokeRole: 'Thu hồi vai trò',
  AssignPermissions: 'Cập nhật quyền',
}

const ACTION_STYLES: Record<string, string> = {
  AssignRole: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  RevokeRole: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  AssignPermissions: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(15)
  const [action, setAction] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const hasFilter = !!(action || from || to)

  const filter: PermissionAuditLogFilter = {
    action: action || undefined,
    from: from || undefined,
    to: to ? `${to}T23:59:59Z` : undefined,
    top: pageSize,
    skip: (page - 1) * pageSize,
  }

  const { data, isLoading } = useAuditLogs(filter)
  const items = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.ceil(totalCount / pageSize)
  const start = (page - 1) * pageSize

  function resetFilters() {
    setAction('')
    setFrom('')
    setTo('')
    setPage(1)
  }

  function handleFilterChange(fn: () => void) {
    fn()
    setPage(1)
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="shrink-0">
        <HRPageHeader
          breadcrumbs={[
            { label: 'Admin' },
            { label: 'Hệ thống' },
            { label: 'Nhật ký phân quyền', isActive: true },
          ]}
        />
      </div>

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Nhật ký phân quyền</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading ? 'Đang tải…' : `${totalCount} bản ghi`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={action || '_all'}
              onValueChange={(v) => handleFilterChange(() => setAction(v === '_all' ? '' : v))}
            >
              <SelectTrigger className="w-44 cursor-pointer">
                <SelectValue placeholder="Tất cả thao tác" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Tất cả thao tác</SelectItem>
                <SelectItem value="AssignRole">Gán vai trò</SelectItem>
                <SelectItem value="RevokeRole">Thu hồi vai trò</SelectItem>
                <SelectItem value="AssignPermissions">Cập nhật quyền</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={from}
              onChange={(e) => handleFilterChange(() => setFrom(e.target.value))}
              className="w-36"
            />
            <Input
              type="date"
              value={to}
              onChange={(e) => handleFilterChange(() => setTo(e.target.value))}
              className="w-36"
            />

            {hasFilter && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="cursor-pointer gap-1 text-muted-foreground">
                <X className="h-3.5 w-3.5" />
                Xoá bộ lọc
              </Button>
            )}
          </div>
        </div>

        {/* Table card */}
        <div className="rounded-lg border bg-card flex flex-col overflow-hidden [&>[data-slot=table-container]]:overflow-y-auto [&>[data-slot=table-container]]:max-h-[calc(100vh-280px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 z-10 bg-card w-44">Thời gian</TableHead>
                <TableHead className="sticky top-0 z-10 bg-card w-36">Thao tác</TableHead>
                <TableHead className="sticky top-0 z-10 bg-card">Người thực hiện</TableHead>
                <TableHead className="sticky top-0 z-10 bg-card">User được tác động</TableHead>
                <TableHead className="sticky top-0 z-10 bg-card w-40">Vai trò</TableHead>
                <TableHead className="sticky top-0 z-10 bg-card">Quyền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize > 15 ? 15 : pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    Không có nhật ký nào
                  </TableCell>
                </TableRow>
              ) : (
                items.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                      {new Date(log.occurredAt).toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs font-medium border-0', ACTION_STYLES[log.action])}>
                        {ACTION_LABELS[log.action] ?? log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{log.actorName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.targetUserName ?? '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.roleName}</TableCell>
                    <TableCell
                      className="text-xs text-muted-foreground max-w-[14rem] truncate"
                      title={log.permissionCodes ?? ''}
                    >
                      {log.permissionCodes ?? '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination bar inside card */}
          <div className="shrink-0 border-t border-border px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
              {isLoading ? (
                <Skeleton className="h-3.5 w-52 inline-block" />
              ) : (
                `Hiển thị ${totalCount === 0 ? 0 : Math.min(start + 1, totalCount)}–${Math.min(start + pageSize, totalCount)} trong ${totalCount} bản ghi`
              )}
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                <span>Hiển thị</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}
                >
                  <SelectTrigger className="h-7 w-16 text-xs cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((n) => (
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
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={cn('h-7 text-xs cursor-pointer', page === 1 && 'pointer-events-none opacity-40')}
                    />
                  </PaginationItem>

                  {buildPageNumbers(page, totalPages).map((item, idx) =>
                    item === 'ellipsis' ? (
                      <PaginationItem key={`e-${idx}`}>
                        <PaginationEllipsis className="h-7 w-7" />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          isActive={item === page}
                          onClick={() => setPage(item)}
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
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={cn('h-7 text-xs cursor-pointer', page >= totalPages && 'pointer-events-none opacity-40')}
                    />
                  </PaginationItem>
                </PaginationContent>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
