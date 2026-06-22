import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { Learner, LearnerEnrollment, EnrollmentStatus } from '../../types/admin.types'

const ENROLLMENT_STATUS_CONFIG: Record<EnrollmentStatus, { label: string; className: string }> = {
  enrolled: { label: 'Đang học', className: 'bg-[#FEF6E4] text-[#B7770D] hover:bg-[#FEF6E4]' },
  completed: { label: 'Hoàn thành', className: 'bg-[#EAF3DE] text-[#3B6D11] hover:bg-[#EAF3DE]' },
  dropped: { label: 'Đã bỏ học', className: 'bg-[#FDECEA] text-[#C0392B] hover:bg-[#FDECEA]' },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

interface LearnerDetailSheetProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly learner: Learner | null
  readonly enrollments: LearnerEnrollment[]
}

export function LearnerDetailSheet({
  open,
  onOpenChange,
  learner,
  enrollments,
}: LearnerDetailSheetProps) {
  if (!learner) return null

  const completionRate =
    learner.enrolledCourses > 0
      ? Math.round((learner.completedCourses / learner.enrolledCourses) * 100)
      : 0

  const initials = getInitials(learner.name)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[520px] overflow-y-auto sm:max-w-[520px]">
        <SheetHeader>
          <SheetTitle>Chi tiết Học viên</SheetTitle>
        </SheetHeader>

        {/* Profile section */}
        <div className="mt-6 flex items-center gap-4">
          <Avatar className="h-14 w-14 shrink-0">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground">{learner.name}</p>
            <p className="text-sm text-muted-foreground">{learner.email}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {learner.department}
              </Badge>
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
            </div>
          </div>
        </div>

        <Separator className="my-5" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Khoá học đã đăng ký', value: learner.enrolledCourses },
            { label: 'Khoá học hoàn thành', value: learner.completedCourses },
            { label: 'Giờ học tích luỹ', value: `${learner.hoursLearned}h` },
            { label: 'Hoạt động gần nhất', value: learner.lastActive },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-border bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-lg font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Overall completion rate */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Tỷ lệ hoàn thành chung</span>
            <span className="text-sm font-semibold text-primary">{completionRate}%</span>
          </div>
          <Progress
            value={completionRate}
            className="h-2"
            aria-label={`Tỷ lệ hoàn thành: ${completionRate}%`}
          />
        </div>

        <Separator className="my-5" />

        {/* Enrollments table */}
        <p className="mb-3 text-sm font-semibold text-foreground">Danh sách khoá học đã đăng ký</p>

        {enrollments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Học viên chưa đăng ký khoá học nào.</p>
        ) : (
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khoá học</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => {
                  const statusConfig = ENROLLMENT_STATUS_CONFIG[enrollment.status]
                  return (
                    <TableRow key={enrollment.courseId}>
                      <TableCell>
                        <p className="max-w-[180px] truncate text-xs font-medium text-foreground">
                          {enrollment.courseTitle}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{enrollment.category}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Progress
                            value={enrollment.progress}
                            className="h-1.5 w-16"
                            aria-label={`${enrollment.progress}%`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {enrollment.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn('border-0 text-[10px] font-medium', statusConfig.className)}
                        >
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
