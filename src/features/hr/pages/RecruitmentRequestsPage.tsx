import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import {
  RequestsTable,
  CreateRequestDialog,
} from '../components/RecruitmentPage'
import {
  useRecruitmentRequests,
  useCreateRecruitmentRequest,
  useSubmitRecruitmentRequest,
} from '../hooks/use-recruitment'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useMyStore } from '@/features/admin/hooks/use-stores'
import { P } from '@/config/permissionCodes'
import type { RecruitmentRequestStatus, RecruitmentContext, CreateRecruitmentRequestPayload } from '../types/recruitment.types'

export default function RecruitmentRequestsPage() {
  const { user, hasPermission } = useAuth()
  const isStoreManager = hasPermission(P.STORE_MANAGER_VIEW)
  const { data: myStore } = useMyStore()

  const [createOpen, setCreateOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<RecruitmentRequestStatus | 'all'>('all')
  const [contextFilter, setContextFilter] = useState<RecruitmentContext | 'all'>('all')

  const { data, isLoading } = useRecruitmentRequests({
    status: statusFilter === 'all' ? undefined : statusFilter,
    requestContext: contextFilter === 'all' ? undefined : contextFilter,
    requestedByUserId: isStoreManager && user ? user.id : undefined,
  })
  const requests = data?.items ?? []

  const createRequest = useCreateRecruitmentRequest()
  const submitRequest = useSubmitRecruitmentRequest()

  function handleCreate(data: CreateRecruitmentRequestPayload) {
    createRequest.mutate(data, {
      onSuccess: () => setCreateOpen(false),
    })
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Phiếu đề xuất tuyển dụng</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Quản lý các phiếu đề xuất tuyển dụng</p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="cursor-pointer gap-2">
            <Plus className="h-4 w-4" />
            Tạo phiếu
          </Button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as RecruitmentRequestStatus | 'all')}
          >
            <SelectTrigger className="w-[160px] cursor-pointer">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent
              align="start"
              sideOffset={4}
              className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 animation-duration-200"
            >
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Draft">Nháp</SelectItem>
              <SelectItem value="Submitted">Đã nộp</SelectItem>
              <SelectItem value="PendingLevel1Approval">Chờ duyệt L1</SelectItem>
              <SelectItem value="PendingLevel2Approval">Chờ duyệt L2</SelectItem>
              <SelectItem value="Approved">Đã duyệt</SelectItem>
              <SelectItem value="Rejected">Từ chối</SelectItem>
              <SelectItem value="NeedMoreInfo">Cần bổ sung</SelectItem>
              <SelectItem value="Cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={contextFilter}
            onValueChange={(value) => setContextFilter(value as RecruitmentContext | 'all')}
          >
            <SelectTrigger className="w-[140px] cursor-pointer">
              <SelectValue placeholder="Khối" />
            </SelectTrigger>
            <SelectContent
              align="start"
              sideOffset={4}
              className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 animation-duration-200"
            >
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Store">Cửa hàng</SelectItem>
              <SelectItem value="Department">Sản xuất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <RequestsTable
          requests={requests}
          isLoading={isLoading}
          onSubmit={(id) => submitRequest.mutate(id)}
          isSubmitting={submitRequest.isPending}
        />
      </div>

      <CreateRequestDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isPending={createRequest.isPending}
        myStore={myStore ?? null}
      />
    </div>
  )
}
