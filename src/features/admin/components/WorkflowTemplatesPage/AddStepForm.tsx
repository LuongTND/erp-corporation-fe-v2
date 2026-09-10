import { useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ApproverPicker } from './ApproverPicker'
import type { AddWorkflowStepPayload, WorkflowApproverTypeItem } from '@/features/hr/types/workflow.types'

interface Props {
  nextOrder: number
  approverTypes: WorkflowApproverTypeItem[]
  onAdd: (payload: AddWorkflowStepPayload) => void
  isPending: boolean
}

export function AddStepForm({ nextOrder, approverTypes, onAdd, isPending }: Props) {
  const [open, setOpen] = useState(false)
  const [stepName, setStepName] = useState('')
  const [approverType, setApproverType] = useState(() => approverTypes[0]?.value ?? '')
  const [approverId, setApproverId] = useState<string | undefined>()

  function handleAdd() {
    if (!stepName.trim()) return
    onAdd({ stepOrder: nextOrder, stepName: stepName.trim(), approverType: String(approverType), approverId })
    setStepName('')
    setApproverId(undefined)
    setOpen(false)
  }

  if (!open) {
    return (
      <Button variant="ghost" size="sm" className="w-full cursor-pointer text-muted-foreground gap-1.5 mt-1" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" /> Thêm bước
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-md border border-dashed">
      <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{nextOrder}</span>
      <Input
        className="h-7 text-sm flex-1"
        placeholder="Tên bước..."
        value={stepName}
        onChange={(e) => setStepName(e.target.value)}
        autoFocus
        onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setOpen(false) }}
      />
      <Select value={String(approverType)} onValueChange={(v) => { setApproverType(v); setApproverId(undefined) }}>
        <SelectTrigger className="h-7 text-xs w-40 shrink-0"><SelectValue /></SelectTrigger>
        <SelectContent align="start">
          {approverTypes.map(at => <SelectItem key={String(at.value)} value={String(at.value)}>{at.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <ApproverPicker approverType={String(approverType)} value={approverId} onChange={setApproverId} />
      <Button size="icon" variant="ghost" className="h-7 w-7 cursor-pointer" onClick={handleAdd} disabled={isPending || !stepName.trim()}>
        <Check className="h-3.5 w-3.5 text-green-600" />
      </Button>
      <Button size="icon" variant="ghost" className="h-7 w-7 cursor-pointer" onClick={() => setOpen(false)}>
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  )
}
