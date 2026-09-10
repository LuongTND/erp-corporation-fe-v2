import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type {
  WorkflowTask,
  WorkflowTemplate,
  WorkflowEntityTypeItem,
  WorkflowApproverTypeItem,
  WorkflowScopeTypeItem,
  CreateWorkflowTemplatePayload,
  AddWorkflowStepPayload,
  UpdateWorkflowStepPayload,
} from '../types/workflow.types'

export const workflowService = {
  getMyTasks: (entityType?: string) =>
    apiCall.get<WorkflowTask[]>(API_ROUTES.WORKFLOW.MY_TASKS, { params: { entityType } }),

  getInstanceTasks: (instanceId: string) =>
    apiCall.get<WorkflowTask[]>(API_ROUTES.WORKFLOW.INSTANCE_TASKS(instanceId)),

  getTemplates: (entityType?: string) =>
    apiCall.get<WorkflowTemplate[]>(API_ROUTES.WORKFLOW.TEMPLATES, { params: { entityType } }),

  createTemplate: (payload: CreateWorkflowTemplatePayload) =>
    apiCall.post<string>(API_ROUTES.WORKFLOW.TEMPLATES, payload),

  deleteTemplate: (templateId: string) =>
    apiCall.delete(API_ROUTES.WORKFLOW.TEMPLATE(templateId)),

  addStep: (templateId: string, payload: AddWorkflowStepPayload) =>
    apiCall.post<string>(API_ROUTES.WORKFLOW.STEPS(templateId), payload),

  updateStep: (templateId: string, stepId: string, payload: UpdateWorkflowStepPayload) =>
    apiCall.put(API_ROUTES.WORKFLOW.STEP(templateId, stepId), payload),

  deleteStep: (templateId: string, stepId: string) =>
    apiCall.delete(API_ROUTES.WORKFLOW.STEP(templateId, stepId)),

  getEntityTypes: () =>
    apiCall.get<WorkflowEntityTypeItem[]>(API_ROUTES.WORKFLOW.ENTITY_TYPES),

  getScopeTypes: () =>
    apiCall.get<WorkflowScopeTypeItem[]>(API_ROUTES.WORKFLOW.SCOPE_TYPES),

  getApproverTypes: () =>
    apiCall.get<WorkflowApproverTypeItem[]>(API_ROUTES.WORKFLOW.APPROVER_TYPES),

  approveInstance: (instanceId: string, note?: string) =>
    apiCall.post(API_ROUTES.WORKFLOW.APPROVE(instanceId), { note }),

  rejectInstance: (instanceId: string, note: string) =>
    apiCall.post(API_ROUTES.WORKFLOW.REJECT(instanceId), { note }),

  cancelInstance: (instanceId: string) =>
    apiCall.post(API_ROUTES.WORKFLOW.CANCEL(instanceId)),
}
