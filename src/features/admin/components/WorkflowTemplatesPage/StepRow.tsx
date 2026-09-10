import { useState } from 'react'
import { Check, GripVertical, Loader2, Pencil, Trash2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ApproverPicker } from './ApproverPicker'
import type { UpdateWorkflowStepPayload, WorkflowApproverTypeItem, WorkflowTemplateStep } from '@/features/hr/types/workflow.types'

interface Props {
  step: WorkflowTemplateStep
  templateId: string
  approverTypes: WorkflowApproverTypeItem[]
  onUpdate: (stepId: string, payload: UpdateWorkflowStepPayload) => Promise<void>
  onDelete: (stepId: string) => void
  isUpdatePending: boolean
  isDeletePending: boolean
}

export function StepRow({ step, templateId, approverTypes, onUpdate, onDelete, isUpdatePending, isDeletePending }: Props) {
  const [editing, setEditing] = useState(false)
  const [stepName, setStepName] = useState(step.stepName)
  const [approverType, setApproverType] = useState(step.approverType)
  const [approverId, setApproverId] = useState<string | undefined>(step.approverId)

  async function handleSave() {
    await onUpdate(step.id, { stepName: stepName.trim(), approverType, approverId })
    setEditing(false)
  }

  function handleCancel() {
    setStepName(step.stepName)
    setApproverType(step.approverType)
    setApproverId(step.approverId)
    setEditing(false)
  }

  const approverLabel = approverTypes.find(at => String(at.value) === step.approverType)?.label ?? step.approverType

  if (editing) {
    return (
      <div className="flex items-center gap-2 py-2 px-3 rounded-md border bg-muted/40">
        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{step.stepOrder}</span>
        <Input className="h-7 text-sm flex-1" value={stepName} onChange={(e) => setStepName(e.target.value)} autoFocus />
        <Select value={approverType} onValueChange={(v) => { setApproverType(v); setApproverId(undefined) }}>
          <SelectTrigger className="h-7 text-xs w-40 shrink-0"><SelectValue /></SelectTrigger>
          <SelectContent align="start">
            {approverTypes.map(at => <SelectItem key={String(at.value)} value={String(at.value)}>{at.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <ApproverPicker approverType={approverType} value={approverId} onChange={setApproverId} />
        <Button size="icon" variant="ghost" className="h-7 w-7 cursor-pointer" onClick={handleSave} disabled={isUpdatePending}>
          {isUpdatePending
            ? <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            : <Check className="h-3.5 w-3.5 text-green-600" />}
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 cursor-pointer" onClick={handleCancel}>
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-muted/40 transition-colors group">
      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{step.stepOrder}</span>
      <span className="text-sm flex-1">{step.stepName}</span>
      <Badge variant="outline" className="text-xs shrink-0">{approverLabel}</Badge>
      <ApproverPicker readOnly approverType={step.approverType} value={step.approverId} onChange={() => {}} />
      <Button size="icon" variant="ghost" className="h-7 w-7 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setEditing(true)}>
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" variant="ghost" className="h-7 w-7 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive" disabled={isDeletePending} onClick={() => onDelete(step.id)}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
