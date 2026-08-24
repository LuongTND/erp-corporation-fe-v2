import { Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import type { DepartmentJobLevelResponse } from '../../types/admin.types'

interface DepartmentJobLevelTableProps {
  readonly items: DepartmentJobLevelResponse[]
  readonly isLoading: boolean
  readonly onEdit: (item: DepartmentJobLevelResponse) => void
  readonly onDelete: (item: DepartmentJobLevelResponse) => void
}

export function DepartmentJobLevelTable({ items, isLoading, onEdit, onDelete }: DepartmentJobLevelTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Phòng ban</TableHead>
            <TableHead>Cấp bậc</TableHead>
            <TableHead>Chính sách thưởng</TableHead>
            <TableHead>KPI Template</TableHead>
            <TableHead className="w-[80px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                Không có vị trí công việc nào
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell className="text-muted-foreground text-sm tabular-nums">{idx + 1}</TableCell>
                <TableCell className="font-medium">{item.departmentName}</TableCell>
                <TableCell>{item.jobLevelName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.bonusPolicyName ?? '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.kpiTemplateName ?? '—'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={() => onEdit(item)} aria-label="Sửa">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive cursor-pointer" onClick={() => onDelete(item)} aria-label="Xóa">
                      <Trash2 className="h-3.5 w-3.5" />
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
