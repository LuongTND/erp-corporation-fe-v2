import { Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { EmployeeTypeResponse } from '../../types/admin.types'

interface Props {
  items: EmployeeTypeResponse[]
  isLoading: boolean
  onEdit: (item: EmployeeTypeResponse) => void
  onDelete: (item: EmployeeTypeResponse) => void
}

export function EmployeeTypeTable({ items, isLoading, onEdit, onDelete }: Props) {
  if (isLoading) return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
    </div>
  )

  if (!items.length) return (
    <div className="text-center py-16 text-muted-foreground text-sm">Chưa có loại nhân sự nào</div>
  )

  return (
    <div className="rounded-lg border overflow-auto max-h-full min-h-0">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Mã</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[100px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{item.code}</code></TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{item.description ?? '—'}</TableCell>
              <TableCell>
                {item.isActive
                  ? <Badge variant="outline" className="text-green-600 border-green-300 gap-1"><CheckCircle2 className="h-3 w-3" />Hoạt động</Badge>
                  : <Badge variant="outline" className="text-muted-foreground gap-1"><XCircle className="h-3 w-3" />Tắt</Badge>
                }
              </TableCell>
              <TableCell>
                <div className="flex gap-1 justify-end">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(item)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
