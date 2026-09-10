import { useState } from 'react'
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StepRow } from './StepRow'
import { AddStepForm } from './AddStepForm'
import type { AddWorkflowStepPayload, UpdateWorkflowStepPayload, WorkflowApproverTypeItem, WorkflowTemplate } from '@/features/hr/types/workflow.types'

interface Props {
  template: WorkflowTemplate
  scopeLabel: string
  scopeEntityName?: string
  approverTypes: WorkflowApproverTypeItem[]
  onDelete: () => void
  isDeletePending: boolean
  onAddStep: (payload: AddWorkflowStepPayload) => void
  isAddStepPending: boolean
  onUpdateStep: (stepId: string, payload: UpdateWorkflowStepPayload) => Promise<void>
  isUpdateStepPending: boolean
  onDeleteStep: (stepId: string) => void
  isDeleteStepPending: boolean
}

export function TemplateCard({
  template, scopeLabel, scopeEntityName, approverTypes,
  onDelete, isDeletePending,
  onAddStep, isAddStepPending,
  onUpdateStep, isUpdateStepPending,
  onDeleteStep, isDeleteStepPending,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const sortedSteps = [...template.steps].sort((a, b) => a.stepOrder - b.stepOrder)
  const nextOrder = sortedSteps.length > 0 ? sortedSteps[sortedSteps.length - 1].stepOrder + 1 : 1
  const scopeBadgeLabel = scopeEntityName ? `${scopeLabel} · ${scopeEntityName}` : scopeLabel

  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 flex-1 text-left cursor-pointer" onClick={() => setExpanded(v => !v)}>
            {expanded
              ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            <CardTitle className="text-sm font-semibold">{template.name}</CardTitle>
          </button>
          <Badge variant="secondary" className="text-xs shrink-0">{scopeBadgeLabel}</Badge>
          <Badge variant={template.isActive ? 'default' : 'outline'} className="text-xs shrink-0">
            {template.isActive ? 'Đang dùng' : 'Tắt'}
          </Badge>
          <span className="text-xs text-muted-foreground shrink-0">{template.steps.length} bước</span>
          <Button
            size="icon" variant="ghost"
            className="h-7 w-7 cursor-pointer text-destructive hover:text-destructive"
            disabled={isDeletePending}
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0 px-4 pb-3 space-y-1">
          {sortedSteps.map(step => (
            <StepRow
              key={step.id}
              step={step}
              templateId={template.id}
              approverTypes={approverTypes}
              onUpdate={onUpdateStep}
              onDelete={onDeleteStep}
              isUpdatePending={isUpdateStepPending}
              isDeletePending={isDeleteStepPending}
            />
          ))}
          <AddStepForm nextOrder={nextOrder} approverTypes={approverTypes} onAdd={onAddStep} isPending={isAddStepPending} />
        </CardContent>
      )}
    </Card>
  )
}
