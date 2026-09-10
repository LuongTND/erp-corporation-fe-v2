import { Inbox } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import {
  useMyWorkflowTasks,
  useApproveWorkflowTask,
  useRejectWorkflowTask,
} from '../hooks/use-workflow'
import { TaskCard } from '@/features/admin/components/WorkflowMyTasksPage'

export default function WorkflowMyTasksPage() {
  const { data: tasks, isLoading } = useMyWorkflowTasks('RecruitmentRequest')
  const approve = useApproveWorkflowTask()
  const reject = useRejectWorkflowTask()

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="shrink-0">
          <h1 className="text-xl font-semibold">Nhiệm vụ của tôi</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Các phiếu đề xuất đang chờ bạn xét duyệt</p>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
          </div>
        ) : !tasks?.length ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Inbox className="h-12 w-12 opacity-40" />
            <p className="text-sm">Không có nhiệm vụ nào</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onApprove={(instanceId, note) => approve.mutateAsync({ instanceId, note })}
                onReject={(instanceId, note) => reject.mutateAsync({ instanceId, note })}
                isApprovePending={approve.isPending}
                isRejectPending={reject.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
