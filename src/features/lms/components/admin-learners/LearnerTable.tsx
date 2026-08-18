import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'
import type { Learner, LearnerStatus } from '../../types/admin.types'

const STATUS_CONFIG: Record<LearnerStatus, { label: string; className: string }> = {
  active: { label: 'Đang hoạt động', className: 'bg-[#EAF3DE] text-[#3B6D11] hover:bg-[#EAF3DE]' },
  inactive: { label: 'Không hoạt động', className: 'bg-[#F0F0EE] text-[#6B6B6B] hover:bg-[#F0F0EE]' },
  suspended: { label: 'Đã khoá', className: 'bg-[#FDECEA] text-[#C0392B] hover:bg-[#FDECEA]' },
}

// Derive initials from full name for avatar fallback
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

interface LearnerTableProps {
  readonly learners: Learner[]
  readonly onViewDetail: (learner: Learner) => void
  readonly onDelete: (learnerId: string) => void
}

export function LearnerTable({ learners, onViewDetail, onDelete }: LearnerTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead>Học viên</TableHead>
            <TableHead>Phòng ban</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Đã đăng ký</TableHead>
            <TableHead className="text-right">Hoàn thành</TableHead>
            <TableHead className="text-right">Giờ học</TableHead>
            <TableHead>Hoạt động gần nhất</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {learners.map((learner) => {
            const statusConfig = STATUS_CONFIG[learner.status]
            const initials = getInitials(learner.name)

            return (
              <TableRow
                key={learner.id}
                className="cursor-pointer"
                onClick={() => onViewDetail(learner)}
              >
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{learner.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{learner.email}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-muted-foreground">{learner.department}</span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      learner.role === 'internal'
                        ? 'border-primary/30 text-primary'
                        : 'border-border text-muted-foreground'
                    )}
                  >
                    {learner.role === 'internal' ? 'Nội bộ' : 'Khách hàng'}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge className={cn('border-0 text-xs font-medium', statusConfig.className)}>
                    {statusConfig.label}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-sm text-foreground">{learner.enrolledCourses}</span>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-sm text-foreground">{learner.completedCourses}</span>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-sm text-foreground">{learner.hoursLearned}h</span>
                </TableCell>

                <TableCell>
                  <span className="text-xs text-muted-foreground">{learner.lastActive}</span>
                </TableCell>

                <TableCell onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Tuỳ chọn cho ${learner.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onSelect={() => onViewDetail(learner)}>
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onSelect={() => onDelete(learner.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Xoá học viên
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {learners.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
          <p className="text-sm">Không tìm thấy học viên nào.</p>
        </div>
      )}
    </div>
  )
}
