import { Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import type { JobLevelResponse } from '../../types/admin.types'

interface JobLevelTableProps {
  levels: JobLevelResponse[]
  isLoading: boolean
  onEdit: (level: JobLevelResponse) => void
  onDelete: (level: JobLevelResponse) => void
  onViewEmployees: (level: JobLevelResponse) => void
}

export function JobLevelTable({ levels, isLoading, onEdit, onDelete, onViewEmployees }: JobLevelTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead className="w-[100px]">Nhân sự</TableHead>
            <TableHead>Mô tả</TableHead>
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
          ) : levels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                Không có chức danh nào
              </TableCell>
            </TableRow>
          ) : (
            levels.map((level) => (
              <TableRow key={level.id}>
                <TableCell className="text-muted-foreground text-sm tabular-nums">{level.levelOrder}</TableCell>
                <TableCell className="font-medium">{level.levelName}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => onViewEmployees(level)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-muted hover:bg-muted/70 transition-colors cursor-pointer"
                    aria-label={`Xem ${level.employeeCount} nhân sự`}
                  >
                    {level.employeeCount}
                  </button>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {level.description ?? '—'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(level)} aria-label={`Sửa ${level.levelName}`}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => onDelete(level)} aria-label={`Xóa ${level.levelName}`}>
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
