import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import type { VideoAsset, VideoStatus } from '../../types/admin.types'

const STATUS_CONFIG: Record<VideoStatus, { label: string; className: string }> = {
  ready: { label: 'Sẵn sàng', className: 'bg-[#EAF3DE] text-[#3B6D11] hover:bg-[#EAF3DE]' },
  processing: { label: 'Đang xử lý', className: 'bg-[#FEF6E4] text-[#B7770D] hover:bg-[#FEF6E4]' },
  error: { label: 'Lỗi', className: 'bg-[#FDECEA] text-[#C0392B] hover:bg-[#FDECEA]' },
}

interface VideoTableProps {
  readonly videos: VideoAsset[]
  readonly onEdit: (video: VideoAsset) => void
  readonly onDelete: (videoId: string) => void
}

export function VideoTable({ videos, onEdit, onDelete }: VideoTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead>Tên video</TableHead>
            <TableHead>Khoá học</TableHead>
            <TableHead>Thời lượng</TableHead>
            <TableHead>Dung lượng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Lượt xem</TableHead>
            <TableHead>% Đã xem TB</TableHead>
            <TableHead>Ngày tải lên</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => {
            const statusConfig = STATUS_CONFIG[video.status]
            return (
              <TableRow key={video.id}>
                <TableCell>
                  <p className="max-w-[220px] truncate text-sm font-medium text-foreground">
                    {video.title}
                  </p>
                </TableCell>

                <TableCell>
                  <p className="max-w-[180px] truncate text-xs text-muted-foreground">
                    {video.courseName}
                  </p>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-foreground">{video.duration}</span>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-muted-foreground">{video.fileSize}</span>
                </TableCell>

                <TableCell>
                  <Badge className={cn('border-0 text-xs font-medium', statusConfig.className)}>
                    {statusConfig.label}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-sm text-foreground">
                    {video.views.toLocaleString()}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={video.watchedPercent}
                      className="h-1.5 w-20"
                      aria-label={`${video.watchedPercent}% đã xem trung bình`}
                    />
                    <span className="text-xs text-muted-foreground">{video.watchedPercent}%</span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs text-muted-foreground">{video.uploadedAt}</span>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Tuỳ chọn cho ${video.title}`}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-3.5 w-3.5" aria-hidden />
                        Xem video
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onSelect={() => onEdit(video)}>
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onSelect={() => onDelete(video.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Xoá video
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
          <p className="text-sm">Không tìm thấy video nào.</p>
        </div>
      )}
    </div>
  )
}
