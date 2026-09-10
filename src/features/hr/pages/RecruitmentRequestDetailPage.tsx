import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Ban, Check, X, MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { ApprovalHistoryTimeline, CandidatesTable } from '../components/RecruitmentDetailPage'
import { ApprovalActionDialog } from '../components/RecruitmentPage'
import { RequestStatusBadge } from '../components/RecruitmentPage'
import {
  useRecruitmentRequest,
  useApproveRecruitmentRequest,
  useApproveLevel1RecruitmentRequest,
  useRejectRecruitmentRequest,
  useRequestMoreInfo,
  useSubmitRecruitmentRequest,
  useCandidates,
  useHireCandidate,
  useRejectCandidate,
} from '../hooks/use-recruitment'
import { useWorkflowInstanceTasks, useCancelWorkflowInstance } from '../hooks/use-workflow'
import { useAuthStore } from '@/stores/auth.store'
import { P } from '@/config/permissionCodes'
import { ROUTES } from '@/config/routes'
import type { CandidateSummary } from '../types/recruitment.types'

type ActionType = 'approve' | 'approve-level1' | 'reject' | 'request-more-info' | 'cancel'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso))
}

export default function RecruitmentRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [actionDialog, setActionDialog] = useState<ActionType | null>(null)

  const { data: request, isLoading } = useRecruitmentRequest(id ?? '')
  const { data: candidates = [], isLoading: candidatesLoading } = useCandidates({ requestId: id })
  const { data: workflowTasks = [] } = useWorkflowInstanceTasks(request?.workflowInstanceId)

  const { hasPermission, user } = useAuthStore()
  const approveRequest = useApproveRecruitmentRequest()
  const approveLevel1Request = useApproveLevel1RecruitmentRequest()
  const rejectRequest = useRejectRecruitmentRequest()
  const requestMoreInfo = useRequestMoreInfo()
  const submitRequest = useSubmitRecruitmentRequest()
  const cancelWorkflow = useCancelWorkflowInstance()
  const hireCandidate = useHireCandidate()
  const rejectCandidate = useRejectCandidate()

  const isActingOnRequest =
    approveRequest.isPending || approveLevel1Request.isPending ||
    rejectRequest.isPending || requestMoreInfo.isPending || cancelWorkflow.isPending

  function handleActionConfirm(note?: string) {
    if (!id || !actionDialog) return
    if (actionDialog === 'approve') {
      approveRequest.mutate({ id, note }, { onSuccess: () => setActionDialog(null) })
    } else if (actionDialog === 'approve-level1') {
      approveLevel1Request.mutate({ id, note }, { onSuccess: () => setActionDialog(null) })
    } else if (actionDialog === 'reject') {
      rejectRequest.mutate({ id, note: note! }, { onSuccess: () => setActionDialog(null) })
    } else if (actionDialog === 'cancel') {
      cancelWorkflow.mutate(request!.workflowInstanceId!, { onSuccess: () => setActionDialog(null) })
    } else {
      requestMoreInfo.mutate({ id, note: note! }, { onSuccess: () => setActionDialog(null) })
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-background text-foreground">
        <HRPageHeader />
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 py-5 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="h-full flex flex-col bg-background text-foreground">
        <HRPageHeader />
        <div className="max-w-5xl w-full mx-auto px-4 md:px-8 py-5">
          <p className="text-muted-foreground">Không tìm thấy phiếu đề xuất.</p>
        </div>
      </div>
    )
  }

  const isPendingApproval = request.status === 'PendingLevel1Approval' || request.status === 'PendingLevel2Approval'
  const isOwner = request.requestedByUserId === user?.id
  const canCancel = isPendingApproval && isOwner && !!request.workflowInstanceId

  const canApproveLevel1 = request.status === 'PendingLevel1Approval' && hasPermission(P.RECRUITMENT_REQUEST_APPROVE_LEVEL1)
  const canApproveLevel2 = (request.status === 'Submitted' || request.status === 'PendingLevel2Approval') && hasPermission(P.RECRUITMENT_REQUEST_APPROVE)

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader />

      <div className="flex flex-col flex-1 min-h-0 max-w-5xl w-full mx-auto px-4 md:px-8 py-5 gap-4 overflow-auto">
        {/* Header */}
        <div className="flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              onClick={() => navigate(ROUTES.HR.RECRUITMENT)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{request.requestCode}</h1>
                <RequestStatusBadge status={request.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Tạo bởi {request.requestedByName} · {formatDate(request.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canCancel && (
              <Button
                variant="outline"
                className="cursor-pointer gap-2 text-destructive hover:text-destructive"
                disabled={isActingOnRequest}
                onClick={() => setActionDialog('cancel')}
              >
                <Ban className="h-4 w-4" />
                Hủy phiếu
              </Button>
            )}
            {request.status === 'Draft' && (
              <Button
                variant="outline"
                className="cursor-pointer gap-2"
                disabled={submitRequest.isPending}
                onClick={() => submitRequest.mutate(request.id)}
              >
                <Send className="h-4 w-4" />
                Nộp phiếu
              </Button>
            )}
            {canApproveLevel1 && (
              <>
                <Button variant="outline" className="cursor-pointer gap-2" disabled={isActingOnRequest} onClick={() => setActionDialog('request-more-info')}>
                  <MessageSquare className="h-4 w-4" />
                  Yêu cầu bổ sung
                </Button>
                <Button variant="destructive" className="cursor-pointer gap-2" disabled={isActingOnRequest} onClick={() => setActionDialog('reject')}>
                  <X className="h-4 w-4" />
                  Từ chối
                </Button>
                <Button className="cursor-pointer gap-2" disabled={isActingOnRequest} onClick={() => setActionDialog('approve-level1')}>
                  <Check className="h-4 w-4" />
                  Duyệt L1
                </Button>
              </>
            )}
            {canApproveLevel2 && (
              <>
                <Button variant="outline" className="cursor-pointer gap-2" disabled={isActingOnRequest} onClick={() => setActionDialog('request-more-info')}>
                  <MessageSquare className="h-4 w-4" />
                  Yêu cầu bổ sung
                </Button>
                <Button variant="destructive" className="cursor-pointer gap-2" disabled={isActingOnRequest} onClick={() => setActionDialog('reject')}>
                  <X className="h-4 w-4" />
                  Từ chối
                </Button>
                <Button className="cursor-pointer gap-2" disabled={isActingOnRequest} onClick={() => setActionDialog('approve')}>
                  <Check className="h-4 w-4" />
                  Duyệt
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Info card */}
        <Card className="shrink-0">
          <CardHeader>
            <CardTitle className="text-base">Thông tin phiếu đề xuất</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Khối</p>
              <p className="font-medium">{request.requestContext === 'Store' ? 'Cửa hàng' : 'Phòng ban'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Đơn vị</p>
              <p className="font-medium">{request.storeName ?? request.departmentName ?? '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Vị trí</p>
              <p className="font-medium">{request.positionTitle}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Số lượng</p>
              <p className="font-medium">{request.headcount}</p>
            </div>
            {request.reason && (
              <div className="col-span-2 md:col-span-3">
                <p className="text-muted-foreground">Lý do tuyển dụng</p>
                <p className="font-medium">{request.reason}</p>
              </div>
            )}
            {request.rejectionNote && (
              <div className="col-span-2 md:col-span-3">
                <p className="text-muted-foreground">Lý do từ chối</p>
                <p className="font-medium italic">{request.rejectionNote}</p>
              </div>
            )}
            {request.needMoreInfoNote && (
              <div className="col-span-2 md:col-span-3">
                <p className="text-muted-foreground">Yêu cầu bổ sung</p>
                <p className="font-medium italic">{request.needMoreInfoNote}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Candidates */}
        <Card className="flex flex-col min-h-0">
          <CardHeader className="shrink-0">
            <CardTitle className="text-base">
              Ứng viên ({candidates.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-0 pb-4 px-6">
            <CandidatesTable
              candidates={candidates}
              isLoading={candidatesLoading}
              canEvaluate={request.status === 'Approved'}
              onEvaluate={(_candidate: CandidateSummary) => {
                // ponytail: evaluate dialog — add when evaluate flow is specified
              }}
              onHire={(candidateId) => hireCandidate.mutate({ id: candidateId })}
              onReject={(candidateId) => rejectCandidate.mutate({ id: candidateId })}
              isActing={hireCandidate.isPending || rejectCandidate.isPending}
            />
          </CardContent>
        </Card>

        {/* Approval history */}
        <Card className="shrink-0">
          <CardHeader>
            <CardTitle className="text-base">Lịch sử duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalHistoryTimeline tasks={workflowTasks} />
          </CardContent>
        </Card>
      </div>

      {actionDialog && (
        <ApprovalActionDialog
          open={!!actionDialog}
          onOpenChange={(open) => { if (!open) setActionDialog(null) }}
          action={actionDialog}
          onConfirm={handleActionConfirm}
          isPending={isActingOnRequest}
        />
      )}
    </div>
  )
}
