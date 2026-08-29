import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { useAuthStore } from '@/stores/auth.store'
import { P } from '@/config/permissionCodes'
import { ROUTES } from '@/config/routes'
import { CandidatesTable } from '../components/CandidatesPage'
import {
  useCandidates,
  useScreenCandidate,
  useAssignCandidateToStore,
  useAssignCandidateToProduction,
  useEvaluateCandidate,
  useHireCandidate,
  useRejectCandidate,
} from '../hooks/use-recruitment'
import type { CandidateStage } from '../types/recruitment.types'

type StageFilter = CandidateStage | 'all'

export default function CandidatesListPage() {
  const [stageFilter, setStageFilter] = useState<StageFilter>('all')
  const navigate = useNavigate()
  const hasPermission = useAuthStore((s) => s.hasPermission)

  const { data: candidates = [], isLoading } = useCandidates({
    stage: stageFilter === 'all' ? undefined : stageFilter,
  })

  const screen = useScreenCandidate()
  const assignStore = useAssignCandidateToStore()
  const assignProd = useAssignCandidateToProduction()
  const evaluate = useEvaluateCandidate()
  const hire = useHireCandidate()
  const reject = useRejectCandidate()

  const isActing =
    screen.isPending || assignStore.isPending || assignProd.isPending ||
    evaluate.isPending || hire.isPending || reject.isPending

  const permissions = {
    canScreen: hasPermission(P.RECRUITMENT_CANDIDATE_SCREEN),
    canAssign: hasPermission(P.RECRUITMENT_CANDIDATE_ASSIGN),
    canEvaluate: hasPermission(P.RECRUITMENT_CANDIDATE_EVALUATE),
    canHire: hasPermission(P.RECRUITMENT_CANDIDATE_HIRE),
    canReject: hasPermission(P.RECRUITMENT_CANDIDATE_REJECT),
  }

  // ponytail: evaluate opens detail page — no inline dialog, add evaluate dialog when UX is clarified
  function handleEvaluate(id: string) {
    void id
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Ứng viên</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Danh sách ứng viên theo phiếu tuyển dụng</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Select
            value={stageFilter}
            onValueChange={(v) => setStageFilter(v as StageFilter)}
          >
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="Giai đoạn" />
            </SelectTrigger>
            <SelectContent
              align="start"
              sideOffset={4}
              className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 animation-duration-200"
            >
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="New">Mới</SelectItem>
              <SelectItem value="Screening">Sơ loại</SelectItem>
              <SelectItem value="StoreInterview">PV cửa hàng</SelectItem>
              <SelectItem value="ProductionInterview">PV sản xuất</SelectItem>
              <SelectItem value="Offer">Đề nghị</SelectItem>
              <SelectItem value="Hired">Đã tuyển</SelectItem>
              <SelectItem value="Rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-h-0">
          <CandidatesTable
            candidates={candidates}
            isLoading={isLoading}
            permissions={permissions}
            isActing={isActing}
            onViewDetail={(id) => navigate(ROUTES.HR.CANDIDATE_DETAIL.replace(':id', id))}
            onScreen={(id) => screen.mutate(id)}
            onAssignStore={(id) => assignStore.mutate(id)}
            onAssignProduction={(id) => assignProd.mutate(id)}
            onEvaluate={handleEvaluate}
            onHire={(id) => hire.mutate(id)}
            onReject={(id) => reject.mutate({ id })}
          />
        </div>
      </div>
    </div>
  )
}
