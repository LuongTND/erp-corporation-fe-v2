import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import {
  useWorkflowTemplates,
  useCreateWorkflowTemplate,
  useDeleteWorkflowTemplate,
  useAddWorkflowStep,
  useUpdateWorkflowStep,
  useDeleteWorkflowStep,
  useWorkflowEntityTypes,
  useWorkflowScopeTypes,
  useWorkflowApproverTypes,
} from '@/features/hr/hooks/use-workflow'
import { useRegions } from '@/features/admin/hooks/use-regions'
import { useDepartments } from '@/features/admin/hooks/use-departments'
import { CreateTemplateDialog, TemplateCard } from '@/features/admin/components/WorkflowTemplatesPage'

export default function WorkflowTemplatesPage() {
  const [createOpen, setCreateOpen] = useState(false)

  const { data: templates = [], isLoading } = useWorkflowTemplates()
  const { data: entityTypes = [] } = useWorkflowEntityTypes()
  const { data: scopeTypes = [] } = useWorkflowScopeTypes()
  const { data: approverTypes = [] } = useWorkflowApproverTypes()
  const { data: regionsData } = useRegions()
  const { data: deptsData } = useDepartments()
  const createTemplate = useCreateWorkflowTemplate()
  const deleteTemplate = useDeleteWorkflowTemplate()
  const addStep = useAddWorkflowStep()
  const updateStep = useUpdateWorkflowStep()
  const deleteStep = useDeleteWorkflowStep()

  const scopeLabelMap = Object.fromEntries(scopeTypes.map(s => [s.value, s.label]))
  const regions = regionsData?.items ?? []
  const departments = deptsData?.items ?? []
  const regionNameMap = Object.fromEntries(regions.map(region => [region.id, region.name]))
  const deptNameMap = Object.fromEntries(departments.map(department => [department.id, department.departmentName]))

  function resolveScopeEntityName(scopeType: string, scopeEntityId?: string): string | undefined {
    if (!scopeEntityId) return undefined
    if (scopeType === 'Region') return regionNameMap[scopeEntityId]
    if (scopeType === 'Department') return deptNameMap[scopeEntityId]
    return undefined
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader />
      <div className="flex flex-col flex-1 min-h-0 max-w-5xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Workflow Templates</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Cấu hình luồng duyệt cho các loại phiếu</p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="cursor-pointer gap-2">
            <Plus className="h-4 w-4" /> Tạo template
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
          </div>
        ) : templates.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Chưa có template nào. Tạo template đầu tiên để cấu hình luồng duyệt.
          </div>
        ) : (
          <div className="space-y-3 overflow-auto flex-1">
            {templates.map(t => (
              <TemplateCard
                key={t.id}
                template={t}
                scopeLabel={scopeLabelMap[t.scopeType] ?? t.scopeType}
                scopeEntityName={resolveScopeEntityName(t.scopeType, t.scopeEntityId)}
                approverTypes={approverTypes}
                onDelete={() => deleteTemplate.mutate(t.id)}
                isDeletePending={deleteTemplate.isPending}
                onAddStep={(payload) => addStep.mutate({ templateId: t.id, payload })}
                isAddStepPending={addStep.isPending}
                onUpdateStep={(stepId, payload) => updateStep.mutateAsync({ templateId: t.id, stepId, payload }) as Promise<void>}
                isUpdateStepPending={updateStep.isPending}
                onDeleteStep={(stepId) => deleteStep.mutate({ templateId: t.id, stepId })}
                isDeleteStepPending={deleteStep.isPending}
              />
            ))}
          </div>
        )}
      </div>

      <CreateTemplateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(payload) => createTemplate.mutate(payload, { onSuccess: () => setCreateOpen(false) })}
        isPending={createTemplate.isPending}
        entityTypes={entityTypes}
        scopeTypes={scopeTypes}
        regions={regions}
        departments={departments}
      />
    </div>
  )
}
