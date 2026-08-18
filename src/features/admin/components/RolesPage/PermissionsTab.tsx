import { useState } from 'react'
import { Trash2 } from 'lucide-react'
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
import { useDeletePermission } from '../../hooks/use-permissions'
import type { PermissionResponse } from '../../types/admin.types'

interface PermissionsTabProps {
  permissions: PermissionResponse[]
  isLoading: boolean
}

export function PermissionsTab({ permissions, isLoading }: PermissionsTabProps) {
  const [search, setSearch] = useState('')
  const { mutate: deletePermission, isPending: isDeleting } = useDeletePermission()

  // ponytail: BE has no search param — filter client-side
  const filtered = permissions.filter(
    (p) => !search || p.permissionCode.toLowerCase().includes(search.toLowerCase()),
  )

  const grouped = filtered.reduce<Record<string, PermissionResponse[]>>((acc, p) => {
    const resource = p.permissionCode.split(':')[0] ?? 'other'
    ;(acc[resource] ??= []).push(p)
    return acc
  }, {})

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Quyền hạn</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Tự động từ API · {filtered.length} quyền</p>
        </div>
        <Input
          placeholder="Tìm quyền hạn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-56"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="rounded-lg border bg-card py-12 text-center text-sm text-muted-foreground">
          Không có quyền nào. Khởi động API để tự động tạo quyền.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([resource, perms]) => (
            <div key={resource} className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
              <div className="px-4 py-3 border-b bg-muted/30 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{resource}</span>
                <Badge variant="secondary" className="text-[10px]">{perms.length}</Badge>
              </div>
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card">
                  <TableRow>
                    <TableHead>Mã quyền</TableHead>
                    <TableHead>Hành động</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {perms.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-sm">{p.permissionCode}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.permissionCode.split(':')[1] ?? ''}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.description ?? '—'}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isDeleting}
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xóa quyền hạn</AlertDialogTitle>
                              <AlertDialogDescription>
                                Xóa quyền <span className="font-mono font-medium text-foreground">{p.permissionCode}</span>?
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePermission(p.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
