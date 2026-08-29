import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { useAuthStore } from '@/stores/auth.store'
import { P } from '@/config/permissionCodes'
import { ROUTES } from '@/config/routes'
import {
  useCandidate,
  useInterviewSchedules,
  useCreateInterview,
  useCompleteInterview,
  useCancelInterview,
  useEvaluateCandidate,
  useResolveInterviewRule,
} from '../hooks/use-recruitment'
import {
  CandidateInfoCard,
  InterviewSchedulesTab,
  EvaluationsTab,
  CreateInterviewDialog,
  CompleteInterviewDialog,
  EvaluateCandidateDialog,
} from '../components/CandidateDetailPage'
import type { InterviewSchedule } from '../types/recruitment.types'
import type { CreateInterviewFormData, CompleteInterviewFormData, EvaluateCandidateFormData } from '../schemas/interview.schema'

const TABS = [
  { value: 'profile', label: 'Hồ sơ' },
  { value: 'interviews', label: 'Lịch phỏng vấn' },
  { value: 'evaluations', label: 'Đánh giá' },
]

export default function CandidateDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { hasPermission } = useAuthStore()

  const [activeTab, setActiveTab] = useState('profile')
  const [createInterviewOpen, setCreateInterviewOpen] = useState(false)
  const [completeTarget, setCompleteTarget] = useState<InterviewSchedule | null>(null)
  const [cancelTarget, setCancelTarget] = useState<InterviewSchedule | null>(null)
  const [evaluateOpen, setEvaluateOpen] = useState(false)

  const { data: candidate, isLoading: candidateLoading } = useCandidate(id)
  const { data: schedules = [], isLoading: schedulesLoading } = useInterviewSchedules(id)
  const { data: resolvedRule } = useResolveInterviewRule(id)

  const createInterview = useCreateInterview(id)
  const completeInterview = useCompleteInterview(id)
  const cancelInterview = useCancelInterview(id)
  const evaluateCandidate = useEvaluateCandidate()

  const canUploadCv = hasPermission(P.RECRUITMENT_CANDIDATE_UPLOAD_CV)
  const canCreateInterview = hasPermission(P.RECRUITMENT_CANDIDATE_ASSIGN)
  const canEvaluate = hasPermission(P.RECRUITMENT_CANDIDATE_EVALUATE)

  function handleCreateInterview(data: CreateInterviewFormData) {
    createInterview.mutate(data, { onSuccess: () => setCreateInterviewOpen(false) })
  }

  function handleCompleteInterview(data: CompleteInterviewFormData) {
    if (!completeTarget) return
    completeInterview.mutate(
      { scheduleId: completeTarget.id, data },
      { onSuccess: () => setCompleteTarget(null) },
    )
  }

  function handleCancelInterview() {
    if (!cancelTarget) return
    cancelInterview.mutate(
      { scheduleId: cancelTarget.id },
      { onSuccess: () => setCancelTarget(null) },
    )
  }

  function handleEvaluate(data: EvaluateCandidateFormData) {
    evaluateCandidate.mutate({ id, data }, { onSuccess: () => setEvaluateOpen(false) })
  }

  if (candidateLoading) {
    return (
      <div className="h-full flex flex-col bg-background text-foreground">
        <HRPageHeader />
        <div className="max-w-4xl w-full mx-auto px-4 md:px-8 py-5 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="h-full flex flex-col bg-background text-foreground">
        <HRPageHeader />
        <div className="max-w-4xl w-full mx-auto px-4 md:px-8 py-5">
          <p className="text-muted-foreground">Không tìm thấy ứng viên.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader />

      <div className="flex flex-col flex-1 min-h-0 max-w-4xl w-full mx-auto px-4 md:px-8 py-5 gap-4 overflow-auto">
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => navigate(ROUTES.HR.CANDIDATES)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{candidate.fullName}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Chi tiết ứng viên</p>
          </div>
        </div>

        <CandidateInfoCard
          candidate={candidate}
          canUploadCv={canUploadCv}
          // ponytail: upload CV UX TBD — needs file input dialog
          onUploadCv={() => undefined}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
          <TabsList className="shrink-0 w-full justify-start h-auto p-1 rounded-lg gap-0.5 overflow-x-auto bg-muted/50">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-sm text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-md px-3 py-2 font-medium whitespace-nowrap transition-colors cursor-pointer"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4 flex-1 min-h-0">
            <TabsContent value="profile">
              <div className="rounded-lg border bg-card p-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Phiếu tuyển dụng</p>
                    <p className="font-mono font-medium">{candidate.requestCode}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ngày thêm</p>
                    <p className="font-medium">
                      {new Intl.DateTimeFormat('vi-VN').format(new Date(candidate.createdAt))}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="interviews">
              <InterviewSchedulesTab
                schedules={schedules}
                isLoading={schedulesLoading}
                canCreate={canCreateInterview}
                canComplete={canEvaluate}
                canCancel={canCreateInterview}
                isActing={completeInterview.isPending || cancelInterview.isPending}
                onCreate={() => setCreateInterviewOpen(true)}
                onComplete={(s) => setCompleteTarget(s)}
                onCancel={(s) => setCancelTarget(s)}
              />
            </TabsContent>

            <TabsContent value="evaluations">
              <EvaluationsTab
                evaluations={candidate.evaluations}
                isLoading={false}
                canEvaluate={canEvaluate}
                onEvaluate={() => setEvaluateOpen(true)}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <CreateInterviewDialog
        open={createInterviewOpen}
        onOpenChange={setCreateInterviewOpen}
        onSubmit={handleCreateInterview}
        isPending={createInterview.isPending}
        resolvedRule={resolvedRule}
      />

      <CompleteInterviewDialog
        open={!!completeTarget}
        onOpenChange={(open) => { if (!open) setCompleteTarget(null) }}
        onSubmit={handleCompleteInterview}
        isPending={completeInterview.isPending}
      />

      <AlertDialog open={!!cancelTarget} onOpenChange={(open) => { if (!open) setCancelTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy lịch phỏng vấn?</AlertDialogTitle>
            <AlertDialogDescription>
              Lịch với {cancelTarget?.interviewerName} sẽ bị hủy. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Không</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              disabled={cancelInterview.isPending}
              onClick={handleCancelInterview}
            >
              {cancelInterview.isPending ? 'Đang hủy...' : 'Hủy lịch'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EvaluateCandidateDialog
        open={evaluateOpen}
        onOpenChange={setEvaluateOpen}
        onSubmit={handleEvaluate}
        isPending={evaluateCandidate.isPending}
      />
    </div>
  )
}
