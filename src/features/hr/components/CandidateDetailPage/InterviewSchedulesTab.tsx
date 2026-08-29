import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Plus, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { INTERVIEW_LOCATION_LABELS, type InterviewSchedule } from '../../types/recruitment.types'
import { InterviewStatusBadge } from './InterviewStatusBadge'

interface InterviewSchedulesTabProps {
  schedules: InterviewSchedule[]
  isLoading: boolean
  canCreate: boolean
  canComplete: boolean
  canCancel: boolean
  isActing: boolean
  onCreate: () => void
  onComplete: (schedule: InterviewSchedule) => void
  onCancel: (schedule: InterviewSchedule) => void
}

function formatDateTime(iso: string) {
  return format(new Date(iso), 'HH:mm, dd/MM/yyyy', { locale: vi })
}

export function InterviewSchedulesTab({
  schedules,
  isLoading,
  canCreate,
  canComplete,
  canCancel,
  isActing,
  onCreate,
  onComplete,
  onCancel,
}: InterviewSchedulesTabProps) {
  return (
    <div className="space-y-4">
      {canCreate && (
        <div className="flex justify-end">
          <Button size="sm" className="cursor-pointer gap-2" onClick={onCreate}>
            <Plus className="h-3.5 w-3.5" />
            Tạo lịch phỏng vấn
          </Button>
        </div>
      )}
      <div className="rounded-lg border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-card">Người PV</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card">Thời gian</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card">Địa điểm</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-[120px]">Trạng thái</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  Chưa có lịch phỏng vấn nào
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/40 transition-colors duration-150">
                  <TableCell className="text-sm font-medium">{s.interviewerName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(s.scheduledAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{INTERVIEW_LOCATION_LABELS[s.location]}</div>
                    {s.locationNote && <div className="text-xs">{s.locationNote}</div>}
                  </TableCell>
                  <TableCell><InterviewStatusBadge status={s.status} /></TableCell>
                  <TableCell>
                    {s.status === 'Scheduled' && (
                      <div className="flex items-center gap-1 justify-end">
                        {canComplete && (
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 cursor-pointer"
                            title="Ghi nhận kết quả" disabled={isActing}
                            onClick={() => onComplete(s)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          </Button>
                        )}
                        {canCancel && (
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 cursor-pointer"
                            title="Hủy lịch" disabled={isActing}
                            onClick={() => onCancel(s)}
                          >
                            <XCircle className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {schedules.some((s) => s.interviewResult) && (
        <div className="space-y-2">
          {schedules.filter((s) => s.interviewResult).map((s) => (
            <div key={s.id} className="rounded-lg border bg-muted/30 p-3 text-sm">
              <p className="font-medium text-xs text-muted-foreground mb-1">
                Kết quả — {s.interviewerName} ({formatDateTime(s.scheduledAt)})
              </p>
              <p className="text-foreground whitespace-pre-wrap">{s.interviewResult}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
