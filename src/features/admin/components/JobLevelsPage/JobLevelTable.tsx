import { Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { SCOPE_TYPE_LABELS, type JobLevelResponse, type ScopeType } from '../../types/admin.types'

const SCOPE_BADGE_STYLE: Record<ScopeType, string> = {
  Own: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  Team: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  Department: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800',
  All: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
}

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
            <TableHead>Phạm vi</TableHead>
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
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                Không có chức danh nào
              </TableCell>
            </TableRow>
          ) : (
            levels.map((level) => (
              <TableRow key={level.id}>
                <TableCell className="text-muted-foreground text-sm tabular-nums">{level.levelOrder}</TableCell>
                <TableCell className="font-medium">{level.levelName}</TableCell>
                <TableCell>
                  <Badge className={SCOPE_BADGE_STYLE[level.defaultScopeType]}>
                    {SCOPE_TYPE_LABELS[level.defaultScopeType]}
                  </Badge>
                </TableCell>
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
