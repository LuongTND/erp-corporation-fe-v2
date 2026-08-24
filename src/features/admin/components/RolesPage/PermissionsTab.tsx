import { useDeferredValue, useState } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, Search, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useDeletePermission, usePermissionsPaged } from '../../hooks/use-permissions'
import type { PermissionResponse } from '../../types/admin.types'

const PAGE_SIZE = 50

// ── Delete dialog ─────────────────────────────────────────────────────────────
function DeletePermissionDialog({
  permission,
  isDeleting,
  onDelete,
  children,
}: {
  permission: PermissionResponse
  isDeleting: boolean
  onDelete: () => void
  children: React.ReactNode
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Xóa quyền hạn
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm">
              <p>
                Xóa quyền{' '}
                <span className="font-mono font-medium text-foreground">{permission.permissionCode}</span>?
              </p>
              {permission.roleCount > 0 && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-destructive">
                  <p className="font-medium">
                    Cảnh báo: quyền này đang được gán cho {permission.roleCount} vai trò.
                  </p>
                  <p className="mt-0.5 text-xs text-destructive/80">
                    Xóa sẽ thu hồi quyền khỏi tất cả vai trò và người dùng liên quan.
                  </p>
                </div>
              )}
              <p className="text-muted-foreground">
                Quyền được sinh tự động từ API và có thể seed lại khi khởi động. Hành động này không thể hoàn tác trong phiên hiện tại.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {permission.roleCount > 0 ? `Xóa (ảnh hưởng ${permission.roleCount} vai trò)` : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ── Desktop row ───────────────────────────────────────────────────────────────
function PermissionRow({
  permission,
  isDeleting,
  onDelete,
}: {
  permission: PermissionResponse
  isDeleting: boolean
  onDelete: () => void
}) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{permission.permissionCode}</TableCell>
      <TableCell className="text-sm">{permission.permissionName}</TableCell>
      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
        {permission.description ?? '—'}
      </TableCell>
      <TableCell className="text-center">
        {permission.roleCount > 0 ? (
          <Badge variant="secondary" className="text-xs">{permission.roleCount} vai trò</Badge>
        ) : (
          <span className="text-xs text-muted-foreground/50">—</span>
        )}
      </TableCell>
      <TableCell>
        <DeletePermissionDialog permission={permission} isDeleting={isDeleting} onDelete={onDelete}>
          <Button
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label={`Xóa quyền ${permission.permissionCode}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </DeletePermissionDialog>
      </TableCell>
    </TableRow>
  )
}

// ── Mobile card ───────────────────────────────────────────────────────────────
function PermissionCard({
  permission,
  isDeleting,
  onDelete,
}: {
  permission: PermissionResponse
  isDeleting: boolean
  onDelete: () => void
}) {
  return (
    <div className="px-4 py-3 flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs text-muted-foreground truncate">{permission.permissionCode}</p>
        <p className="text-sm font-medium mt-0.5">{permission.permissionName}</p>
        {permission.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{permission.description}</p>
        )}
        {permission.roleCount > 0 && (
          <Badge variant="secondary" className="text-[10px] mt-1.5">{permission.roleCount} vai trò</Badge>
        )}
      </div>
      <DeletePermissionDialog permission={permission} isDeleting={isDeleting} onDelete={onDelete}>
        <Button
          variant="ghost"
          size="icon"
          disabled={isDeleting}
          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          aria-label={`Xóa quyền ${permission.permissionCode}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DeletePermissionDialog>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function PermissionsTab() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  // useDeferredValue: typing doesn't block UI, search fires after render settles
  const deferredSearch = useDeferredValue(search)

  const { data, isLoading, isFetching } = usePermissionsPaged({
    search: deferredSearch,
    skip: page * PAGE_SIZE,
    top: PAGE_SIZE,
  })

  const { mutate: deletePermission, isPending: isDeleting } = useDeletePermission()

  const items = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const from = totalCount === 0 ? 0 : page * PAGE_SIZE + 1
  const to = Math.min((page + 1) * PAGE_SIZE, totalCount)

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  const grouped = items.reduce<Record<string, PermissionResponse[]>>((acc, p) => {
    const parts = p.permissionCode.split(':')
    const group = parts.length >= 3 ? `${parts[0]}:${parts[1]}` : (parts[0] ?? 'other')
    ;(acc[group] ??= []).push(p)
    return acc
  }, {})
  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold">Quyền hạn</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Sinh tự động từ API · có thể seed lại nếu bị xóa
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Tìm mã, tên hoặc mô tả..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8 w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : totalCount === 0 ? (
        <div className="rounded-lg border bg-card py-12 text-center text-sm text-muted-foreground">
          {search
            ? `Không tìm thấy quyền phù hợp với "${search}"`
            : 'Không có quyền nào. Khởi động API để tự động tạo quyền.'}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className={`hidden md:block rounded-lg border bg-card overflow-auto max-h-full min-h-0 transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky top-0 z-10 bg-card w-[260px]">Mã quyền</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-card">Tên quyền</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-card hidden lg:table-cell">Mô tả</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-card w-28 text-center">Đang dùng</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-card w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGroups.map(([resource, perms]) => (
                  <>
                    <TableRow key={`grp-${resource}`} className="bg-muted/40 hover:bg-muted/40">
                      <TableCell colSpan={5} className="py-1.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {resource}
                          </span>
                          <Badge variant="secondary" className="text-[10px] h-4">{perms.length}</Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                    {perms.map((permission) => (
                      <PermissionRow
                        key={permission.id}
                        permission={permission}
                        isDeleting={isDeleting}
                        onDelete={() => deletePermission(permission.id)}
                      />
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className={`md:hidden space-y-3 transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
            {sortedGroups.map(([resource, perms]) => (
              <div key={resource} className="rounded-lg border bg-card overflow-hidden">
                <div className="px-4 py-2 bg-muted/40 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {resource}
                  </span>
                  <Badge variant="secondary" className="text-[10px] h-4">{perms.length}</Badge>
                </div>
                <div className="divide-y">
                  {perms.map((permission) => (
                    <PermissionCard
                      key={permission.id}
                      permission={permission}
                      isDeleting={isDeleting}
                      onDelete={() => deletePermission(permission.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{from}–{to} / {totalCount} quyền</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 tabular-nums">{page + 1} / {totalPages}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Trang sau"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
