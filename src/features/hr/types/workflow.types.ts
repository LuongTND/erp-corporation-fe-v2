// ── Dropdown option types (from BE) ──────────────────────────────────────────

export interface WorkflowEntityTypeItem  { value: string; label: string }
export interface WorkflowScopeTypeItem   { value: string; label: string }
export interface WorkflowApproverTypeItem { value: string; label: string }

// ── Template types ────────────────────────────────────────────────────────────

export interface WorkflowTemplateStep {
  id: string
  stepOrder: number
  stepName: string
  approverType: string
  approverId?: string
  approverName?: string
}

export interface WorkflowTemplate {
  id: string
  name: string
  entityType: string
  isActive: boolean
  scopeType: string
  scopeEntityId?: string
  createdAt: string
  steps: WorkflowTemplateStep[]
}

export interface CreateWorkflowTemplatePayload {
  name: string
  entityType: string
  scopeType: string
  scopeEntityId?: string
}

export interface AddWorkflowStepPayload {
  stepOrder: number
  stepName: string
  approverType: string
  approverId?: string
}

export interface UpdateWorkflowStepPayload {
  stepName: string
  approverType: string
  approverId?: string
}

// ── Task types ────────────────────────────────────────────────────────────────

export type WorkflowTaskStatus = 'Pending' | 'Approved' | 'Rejected'

export interface WorkflowTask {
  id: string
  instanceId: string
  entityType: string
  entityId: string
  stepOrder: number
  stepName: string
  status: WorkflowTaskStatus
  note?: string
  actedAt?: string
  createdAt: string
}
