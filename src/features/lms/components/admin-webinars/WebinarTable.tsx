import { MoreHorizontal, Pencil, Play, Trash2, Video } from 'lucide-react'
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
import type { Webinar, WebinarStatus } from '../../types/admin.types'

const STATUS_CONFIG: Record<WebinarStatus, { label: string; className: string }> = {
  upcoming: { label: 'Sắp diễn ra', className: 'bg-[#E8F4FD] text-[#1A6EA8] hover:bg-[#E8F4FD]' },
  live: { label: '🔴 Trực tiếp', className: 'bg-[#FDECEA] text-[#C0392B] hover:bg-[#FDECEA]' },
  ended: { label: 'Đã kết thúc', className: 'bg-[#F0F0EE] text-[#6B6B6B] hover:bg-[#F0F0EE]' },
  cancelled: { label: 'Đã huỷ', className: 'bg-[#FDECEA] text-[#C0392B] hover:bg-[#FDECEA]' },
}

interface WebinarTableProps {
  readonly webinars: Webinar[]
  readonly onEdit: (webinar: Webinar) => void
  readonly onDelete: (webinarId: string) => void
}

export function WebinarTable({ webinars, onEdit, onDelete }: WebinarTableProps) {
  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const attendanceRate = (webinar: Webinar) => {
    if (webinar.registeredCount === 0 || webinar.status === 'upcoming' || webinar.status === 'live') {
      return null
    }
    return Math.round((webinar.attendedCount / webinar.registeredCount) * 100)
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Thời lượng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Đăng ký / Tối đa</TableHead>
            <TableHead className="text-right">Tham dự</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {webinars.map((webinar) => {
            const statusConfig = STATUS_CONFIG[webinar.status]
            const rate = attendanceRate(webinar)

            return (
              <TableRow key={webinar.id}>
                <TableCell>
                  <p className="max-w-[220px] truncate text-sm font-medium text-foreground">
                    {webinar.title}
                  </p>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-muted-foreground">{webinar.host}</span>
                </TableCell>

                <TableCell>
                  <span className="text-xs text-foreground">{formatDate(webinar.scheduledAt)}</span>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-muted-foreground">{webinar.durationMinutes} phút</span>
                </TableCell>

                <TableCell>
                  <Badge className={cn('border-0 text-xs font-medium', statusConfig.className)}>
                    {statusConfig.label}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-sm text-foreground">
                    {webinar.registeredCount.toLocaleString()} / {webinar.maxCapacity.toLocaleString()}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  {rate !== null ? (
                    <span className="text-sm text-foreground">{rate}%</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      webinar.isInternal
                        ? 'border-primary/30 text-primary'
                        : 'border-border text-muted-foreground'
                    )}
                  >
                    {webinar.isInternal ? 'Nội bộ' : 'Khách hàng'}
                  </Badge>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Tuỳ chọn cho ${webinar.title}`}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {webinar.recordingUrl && (
                        <DropdownMenuItem className="gap-2">
                          <Play className="h-3.5 w-3.5" aria-hidden />
                          Xem bản ghi
                        </DropdownMenuItem>
                      )}
                      {webinar.status === 'live' && (
                        <DropdownMenuItem className="gap-2">
                          <Video className="h-3.5 w-3.5" aria-hidden />
                          Tham gia phòng
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="gap-2" onSelect={() => onEdit(webinar)}>
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onSelect={() => onDelete(webinar.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Xoá webinar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {webinars.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
          <p className="text-sm">Không tìm thấy webinar nào.</p>
        </div>
      )}
    </div>
  )
}
