import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { RegionResponse, DepartmentResponse } from '@/features/admin/types/admin.types'
import type { CreateWorkflowTemplatePayload, WorkflowEntityTypeItem, WorkflowScopeTypeItem } from '@/features/hr/types/workflow.types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateWorkflowTemplatePayload) => void
  isPending: boolean
  entityTypes: WorkflowEntityTypeItem[]
  scopeTypes: WorkflowScopeTypeItem[]
  regions: RegionResponse[]
  departments: DepartmentResponse[]
}

export function CreateTemplateDialog({ open, onOpenChange, onSubmit, isPending, entityTypes, scopeTypes, regions, departments }: Props) {
  const [name, setName] = useState('')
  const [entityType, setEntityType] = useState(() => entityTypes[0]?.value ?? '')
  const [scopeType, setScopeType] = useState(() => scopeTypes[0]?.value ?? '')
  const [scopeEntityId, setScopeEntityId] = useState('')

  const needsEntity = scopeType === 'Region' || scopeType === 'Department'

  function handleScopeChange(val: string) {
    setScopeType(val)
    setScopeEntityId('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      name: name.trim(),
      entityType,
      scopeType: scopeType as never,
      scopeEntityId: needsEntity ? scopeEntityId : undefined,
    })
  }

  const canSubmit = !isPending && !!name.trim() && !!entityType && !!scopeType && (!needsEntity || !!scopeEntityId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250">
        <DialogHeader>
          <DialogTitle>Tạo workflow template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="wf-name">Tên template</Label>
            <Input
              id="wf-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Duyệt tuyển dụng cửa hàng"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Loại đối tượng</Label>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent align="start">
                {entityTypes.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Phạm vi áp dụng</Label>
            <Select value={scopeType} onValueChange={handleScopeChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent align="start">
                {scopeTypes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {scopeType === 'Region' && (
            <div className="space-y-1.5">
              <Label>Vùng áp dụng <span className="text-destructive">*</span></Label>
              <Select value={scopeEntityId} onValueChange={setScopeEntityId}>
                <SelectTrigger><SelectValue placeholder="Chọn vùng..." /></SelectTrigger>
                <SelectContent align="start">
                  {regions.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {scopeType === 'Department' && (
            <div className="space-y-1.5">
              <Label>Phòng ban áp dụng <span className="text-destructive">*</span></Label>
              <Select value={scopeEntityId} onValueChange={setScopeEntityId}>
                <SelectTrigger><SelectValue placeholder="Chọn phòng ban..." /></SelectTrigger>
                <SelectContent align="start">
                  {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.departmentName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={!canSubmit}>Tạo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
