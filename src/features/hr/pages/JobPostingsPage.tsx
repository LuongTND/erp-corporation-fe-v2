import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { useAuthStore } from '@/stores/auth.store'
import { P } from '@/config/permissionCodes'
import { JobPostingsTable, CreateJobPostingDialog } from '../components/JobPostingsPage'
import {
  useJobPostings,
  useCreateJobPosting,
  useApprovePostingCost,
  useRejectPostingCost,
} from '../hooks/use-recruitment'
import type { CreateJobPostingPayload, JobPostingCostStatus } from '../types/recruitment.types'

type CostFilter = JobPostingCostStatus | 'all'

export default function JobPostingsPage() {
  const [costStatusFilter, setCostStatusFilter] = useState<CostFilter>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const hasPermission = useAuthStore((s) => s.hasPermission)

  const { data: postings = [], isLoading } = useJobPostings({
    costStatus: costStatusFilter === 'all' ? undefined : costStatusFilter,
  })

  const createPosting = useCreateJobPosting()
  const approveCost = useApprovePostingCost()
  const rejectCost = useRejectPostingCost()

  const canCreate = hasPermission(P.RECRUITMENT_POSTING_MANAGE)
  const canApprove = hasPermission(P.RECRUITMENT_POSTING_PAID_APPROVE)
  const isActing = approveCost.isPending || rejectCost.isPending

  function handleCreate(data: CreateJobPostingPayload) {
    createPosting.mutate(data, { onSuccess: () => setCreateOpen(false) })
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Tin tuyển dụng</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Quản lý tin đăng và chi phí kênh tuyển</p>
          </div>
          {canCreate && (
            <Button onClick={() => setCreateOpen(true)} className="cursor-pointer gap-2">
              <Plus className="h-4 w-4" />
              Tạo tin
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Select
            value={costStatusFilter}
            onValueChange={(v) => setCostStatusFilter(v as CostFilter)}
          >
            <SelectTrigger className="w-[200px] cursor-pointer">
              <SelectValue placeholder="Trạng thái chi phí" />
            </SelectTrigger>
            <SelectContent
              align="start"
              sideOffset={4}
              className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 animation-duration-200"
            >
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="NotRequired">Không cần duyệt</SelectItem>
              <SelectItem value="PendingApproval">Chờ duyệt CP</SelectItem>
              <SelectItem value="Approved">Đã duyệt CP</SelectItem>
              <SelectItem value="Rejected">Từ chối CP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-h-0">
          <JobPostingsTable
            postings={postings}
            isLoading={isLoading}
            canApprove={canApprove}
            isActing={isActing}
            onApprove={(id) => approveCost.mutate(id)}
            onReject={(id) => rejectCost.mutate({ id })}
          />
        </div>
      </div>

      <CreateJobPostingDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isPending={createPosting.isPending}
        // ponytail: approved requests list — empty until useRecruitmentRequests with status=Approved is wired here
        approvedRequests={[]}
      />
    </div>
  )
}
