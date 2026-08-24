import { Edit2, Power, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { CounterResponse } from '../../types/admin.types'

interface CounterTableProps {
  readonly counters: CounterResponse[]
  readonly isLoading: boolean
  readonly isToggling: boolean
  readonly isDeleting: boolean
  readonly filterStoreName?: string
  readonly onEdit: (counter: CounterResponse) => void
  readonly onToggleActive: (id: string) => void
  readonly onDelete: (id: string) => void
}

export function CounterTable({ counters, isLoading, isToggling, isDeleting, filterStoreName, onEdit, onToggleActive, onDelete }: CounterTableProps) {
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
                {filterStoreName ? `Chưa có quầy trong ${filterStoreName}` : 'Chưa có quầy nào'}
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
                    <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => onEdit(counter)} title="Sửa" aria-label="Sửa quầy">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost" size="icon"
                          title={counter.isActive ? 'Ngưng hoạt động' : 'Kích hoạt'}
                          aria-label={counter.isActive ? 'Ngưng hoạt động quầy' : 'Kích hoạt quầy'}
                          className={cn('cursor-pointer', counter.isActive
                            ? 'text-amber-600 hover:text-amber-600 hover:bg-amber-500/10'
                            : 'text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10')}
                          disabled={isToggling}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 animation-duration-250">
                        <AlertDialogHeader>
                          <AlertDialogTitle>{counter.isActive ? 'Ngưng hoạt động quầy?' : 'Kích hoạt quầy?'}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {counter.isActive
                              ? <>Quầy <span className="font-semibold text-foreground">"{counter.name}"</span> sẽ ngưng hoạt động.</>
                              : <>Quầy <span className="font-semibold text-foreground">"{counter.name}"</span> sẽ được kích hoạt lại.</>}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            className={counter.isActive ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}
                            onClick={() => onToggleActive(counter.id)}
                          >
                            {counter.isActive ? 'Ngưng' : 'Kích hoạt'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost" size="icon"
                          className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                          aria-label="Xóa quầy"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 animation-duration-250">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xóa quầy?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Quầy <span className="font-semibold text-foreground">"{counter.name}"</span> sẽ bị xóa vĩnh viễn.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            onClick={() => onDelete(counter.id)}
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
  )
}
