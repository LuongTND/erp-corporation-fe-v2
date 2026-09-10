import { useState } from 'react'
import { CheckCircle2, Clock, ExternalLink, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/config/routes'
import type { WorkflowTask, WorkflowTaskStatus } from '@/features/hr/types/workflow.types'

const ENTITY_LINK_MAP: Record<string, (id: string) => string> = {
  RecruitmentRequest: (id) => ROUTES.HR.RECRUITMENT_DETAIL.replace(':id', id),
}

const STATUS_CONFIG: Record<WorkflowTaskStatus, { label: string; icon: React.ReactNode; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  Pending:  { label: 'Chờ duyệt', icon: <Clock className="h-3.5 w-3.5" />,        variant: 'secondary' },
  Approved: { label: 'Đã duyệt', icon: <CheckCircle2 className="h-3.5 w-3.5" />, variant: 'default' },
  Rejected: { label: 'Từ chối',  icon: <XCircle className="h-3.5 w-3.5" />,       variant: 'destructive' },
}

interface Props {
  task: WorkflowTask
  onApprove: (instanceId: string, note?: string) => Promise<void>
  onReject: (instanceId: string, note: string) => Promise<void>
  isApprovePending: boolean
  isRejectPending: boolean
}

export function TaskCard({ task, onApprove, onReject, isApprovePending, isRejectPending }: Props) {
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [note, setNote] = useState('')

  const cfg = STATUS_CONFIG[task.status]

  async function handleApprove() {
    await onApprove(task.instanceId, note.trim() || undefined)
    setApproveOpen(false)
    setNote('')
  }

  async function handleReject() {
    await onReject(task.instanceId, note.trim())
    setRejectOpen(false)
    setNote('')
  }

  function openApprove() { setNote(''); setApproveOpen(true) }
  function openReject()  { setNote(''); setRejectOpen(true) }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-medium text-foreground">{task.stepName}</CardTitle>
            <Badge variant={cfg.variant} className="gap-1 shrink-0">
              {cfg.icon}
              {cfg.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Loại: <span className="font-medium text-foreground">{task.entityType}</span>
            {ENTITY_LINK_MAP[task.entityType] && (
              <Link
                to={ENTITY_LINK_MAP[task.entityType](task.entityId)}
                className="inline-flex items-center text-primary hover:underline"
                title="Xem phiếu"
              >
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Bước: <span className="font-medium text-foreground">{task.stepOrder}</span>
          </p>
          {task.note && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.note}</p>
          )}
          <p className="text-xs text-muted-foreground pt-1">
            {task.actedAt
              ? `Xử lý: ${new Date(task.actedAt).toLocaleDateString('vi-VN')}`
              : `Tạo: ${new Date(task.createdAt).toLocaleDateString('vi-VN')}`}
          </p>

          {task.status === 'Pending' && (
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="h-7 text-xs flex-1 cursor-pointer" onClick={openApprove}>
                Duyệt
              </Button>
              <Button size="sm" variant="destructive" className="h-7 text-xs flex-1 cursor-pointer" onClick={openReject}>
                Từ chối
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250">
          <DialogHeader>
            <DialogTitle>Xác nhận duyệt</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-sm">Ghi chú (không bắt buộc)</Label>
            <Textarea
              placeholder="Nhập ghi chú..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)} className="cursor-pointer">Hủy</Button>
            <Button onClick={handleApprove} disabled={isApprovePending} className="cursor-pointer">
              {isApprovePending ? 'Đang xử lý...' : 'Duyệt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250">
          <DialogHeader>
            <DialogTitle>Từ chối phiếu</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-sm">Lý do từ chối <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Nhập lý do từ chối..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} className="cursor-pointer">Hủy</Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejectPending || !note.trim()}
              className="cursor-pointer"
            >
              {isRejectPending ? 'Đang xử lý...' : 'Từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
