import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2, Eye, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { AdminCourse, CourseStatus } from '../../types/admin.types'

const STATUS_CONFIG: Record<CourseStatus, { label: string; className: string }> = {
  published: { label: 'Đã xuất bản', className: 'bg-[#EAF3DE] text-[#3B6D11] hover:bg-[#EAF3DE]' },
  draft: { label: 'Nháp', className: 'bg-[#F0F0EE] text-[#6B6B6B] hover:bg-[#F0F0EE]' },
  archived: { label: 'Đã lưu trữ', className: 'bg-[#E8F4FD] text-[#1A6EA8] hover:bg-[#E8F4FD]' },
}

interface CourseTableProps {
  readonly courses: AdminCourse[]
  readonly onEdit: (course: AdminCourse) => void
  readonly onDelete: (courseId: string) => void
}

export function CourseTable({ courses, onEdit, onDelete }: CourseTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleAll = () => {
    setSelectedIds((prev) =>
      prev.size === courses.length ? new Set() : new Set(courses.map((c) => c.id))
    )
  }

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const isAllSelected = courses.length > 0 && selectedIds.size === courses.length

  return (
    <div className="rounded-lg border border-border bg-card">
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
          <span className="text-sm text-muted-foreground">
            Đã chọn <span className="font-semibold text-foreground">{selectedIds.size}</span> khoá học
          </span>
          <Button variant="destructive" size="sm" className="ml-auto gap-1.5">
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Xoá đã chọn
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={toggleAll}
                aria-label="Chọn tất cả"
              />
            </TableHead>
            <TableHead>Khoá học</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Giảng viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Học viên</TableHead>
            <TableHead>Tỷ lệ hoàn thành</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => {
            const statusConfig = STATUS_CONFIG[course.status]
            const isSelected = selectedIds.has(course.id)

            return (
              <TableRow
                key={course.id}
                className={cn(isSelected && 'bg-accent/50')}
                data-state={isSelected ? 'selected' : undefined}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleOne(course.id)}
                    aria-label={`Chọn ${course.title}`}
                  />
                </TableCell>

                <TableCell>
                  <div className="min-w-0">
                    <p className="truncate max-w-[260px] text-sm font-medium text-foreground">
                      {course.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {course.totalLessons} bài học · {course.duration}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-muted-foreground">{course.category}</span>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-foreground">{course.instructor}</span>
                </TableCell>

                <TableCell>
                  <Badge className={cn('border-0 text-xs font-medium', statusConfig.className)}>
                    {statusConfig.label}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <span className="flex items-center justify-end gap-1 text-sm text-foreground">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                    {course.enrolledCount.toLocaleString()}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={course.completionRate}
                      className="h-1.5 w-24"
                      aria-label={`Tỷ lệ hoàn thành: ${course.completionRate}%`}
                    />
                    <span className="text-xs text-muted-foreground">{course.completionRate}%</span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      course.isInternal
                        ? 'border-primary/30 text-primary'
                        : 'border-border text-muted-foreground'
                    )}
                  >
                    {course.isInternal ? 'Nội bộ' : 'Khách hàng'}
                  </Badge>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Tuỳ chọn cho ${course.title}`}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-3.5 w-3.5" aria-hidden />
                        Xem trước
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onSelect={() => onEdit(course)}>
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onSelect={() => onDelete(course.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Xoá khoá học
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {courses.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
          <p className="text-sm">Không có khoá học nào phù hợp với bộ lọc.</p>
        </div>
      )}
    </div>
  )
}
