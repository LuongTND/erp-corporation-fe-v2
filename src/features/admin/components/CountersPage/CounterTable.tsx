import { Edit2, Power, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { CounterResponse } from '../../types/admin.types'

interface CounterTableProps {
  readonly counters: CounterResponse[]
  readonly isLoading: boolean
  readonly isToggling: boolean
  readonly isDeleting: boolean
  readonly onEdit: (counter: CounterResponse) => void
  readonly onToggleActive: (id: string) => void
  readonly onDelete: (counter: CounterResponse) => void
}

export function CounterTable({ counters, isLoading, isToggling, isDeleting, onEdit, onToggleActive, onDelete }: CounterTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead>Tên quầy</TableHead>
            <TableHead className="w-36">Mã</TableHead>
            <TableHead>Cửa hàng</TableHead>
            <TableHead className="w-28">Trạng thái</TableHead>
            <TableHead className="w-24 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }).map((__, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : counters.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                Chưa có quầy nào
              </TableCell>
            </TableRow>
          ) : (
            counters.map(counter => (
              <TableRow key={counter.id}>
                <TableCell className="font-medium">{counter.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground font-mono">{counter.code}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{counter.storeName}</TableCell>
                <TableCell>
                  <Badge
                    variant={counter.isActive ? 'secondary' : 'destructive'}
                    className={cn('text-[10px] w-fit', counter.isActive && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400')}
                  >
                    {counter.isActive ? 'Hoạt động' : 'Ngưng'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(counter)} title="Sửa">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      title={counter.isActive ? 'Ngưng hoạt động' : 'Kích hoạt'}
                      className={cn(counter.isActive
                        ? 'text-amber-600 hover:text-amber-600 hover:bg-amber-500/10'
                        : 'text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10')}
                      disabled={isToggling}
                      onClick={() => onToggleActive(counter.id)}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={isDeleting}
                      onClick={() => onDelete(counter)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
