import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { P } from '@/config/permissionCodes'
import {
  useInterviewRuleConfigs,
  useCreateInterviewRuleConfig,
  useUpdateInterviewRuleConfig,
} from '../hooks/use-interview-rule-config'
import {
  InterviewRuleConfigDialog,
  InterviewRuleConfigsTable,
} from '../components/InterviewRuleConfigsPage'
import type { InterviewRuleConfigResponse } from '../types/admin.types'
import type { CreateInterviewRuleConfigFormData } from '../schemas/interview-rule-config.schema'

export default function InterviewRuleConfigsPage() {
  const { hasPermission } = useAuthStore()
  const canManage = hasPermission(P.INTERVIEW_RULE_CONFIGS_MANAGE)

  const { data: configs = [], isLoading } = useInterviewRuleConfigs()
  const createMutation = useCreateInterviewRuleConfig()
  const updateMutation = useUpdateInterviewRuleConfig()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<InterviewRuleConfigResponse | null>(null)

  function handleEdit(cfg: InterviewRuleConfigResponse) {
    setEditing(cfg)
    setDialogOpen(true)
  }

  function handleNew() {
    setEditing(null)
    setDialogOpen(true)
  }

  function handleSubmit(data: CreateInterviewRuleConfigFormData) {
    const payload = {
      ...data,
      regionId: data.regionId || undefined,
      departmentId: data.departmentId || undefined,
      schedulerRoleKey: data.schedulerRoleKey || undefined,
      notifyRoleKey: data.notifyRoleKey || undefined,
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload }, { onSuccess: () => setDialogOpen(false) })
    } else {
      createMutation.mutate(payload, { onSuccess: () => setDialogOpen(false) })
    }
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Cấu hình rule phỏng vấn</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quy tắc tự động phân công người phỏng vấn theo ngữ cảnh và địa điểm
          </p>
        </div>
        {canManage && (
          <Button onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo rule
          </Button>
        )}
      </div>

      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Đang tải...</div>
        ) : (
          <InterviewRuleConfigsTable
            configs={configs}
            canManage={canManage}
            onEdit={handleEdit}
          />
        )}
      </div>

      <InterviewRuleConfigDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
