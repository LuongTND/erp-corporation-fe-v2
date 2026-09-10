import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { workflowService } from '../services/workflow.service'
import type { CreateWorkflowTemplatePayload, AddWorkflowStepPayload, UpdateWorkflowStepPayload } from '../types/workflow.types'

function beError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) return error.response?.data?.message || fallback
  return fallback
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export function useMyWorkflowTasks(entityType?: string) {
  return useQuery({
    queryKey: ['workflow-my-tasks', entityType],
    queryFn: () => workflowService.getMyTasks(entityType),
  })
}

export function useWorkflowInstanceTasks(instanceId: string | undefined) {
  return useQuery({
    queryKey: ['workflow-instance-tasks', instanceId],
    queryFn: () => workflowService.getInstanceTasks(instanceId!),
    enabled: !!instanceId,
  })
}

// ── Templates ─────────────────────────────────────────────────────────────────

export function useWorkflowTemplates(entityType?: string) {
  return useQuery({
    queryKey: ['workflow-templates', entityType],
    queryFn: () => workflowService.getTemplates(entityType),
  })
}

export function useWorkflowEntityTypes() {
  return useQuery({ queryKey: ['workflow-entity-types'], queryFn: () => workflowService.getEntityTypes(), staleTime: Infinity })
}

export function useWorkflowScopeTypes() {
  return useQuery({ queryKey: ['workflow-scope-types'], queryFn: () => workflowService.getScopeTypes(), staleTime: Infinity })
}

export function useWorkflowApproverTypes() {
  return useQuery({ queryKey: ['workflow-approver-types'], queryFn: () => workflowService.getApproverTypes(), staleTime: Infinity })
}

function useInvalidateTemplates() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ['workflow-templates'] })
}

export function useCreateWorkflowTemplate() {
  const invalidate = useInvalidateTemplates()
  return useMutation({
    mutationFn: (payload: CreateWorkflowTemplatePayload) => workflowService.createTemplate(payload),
    onSuccess: () => { invalidate(); toast.success('Tạo template thành công') },
    onError: (e) => toast.error(beError(e, 'Tạo template thất bại')),
  })
}

export function useDeleteWorkflowTemplate() {
  const invalidate = useInvalidateTemplates()
  return useMutation({
    mutationFn: (templateId: string) => workflowService.deleteTemplate(templateId),
    onSuccess: () => { invalidate(); toast.success('Xóa template thành công') },
    onError: (e) => toast.error(beError(e, 'Xóa template thất bại')),
  })
}

export function useAddWorkflowStep() {
  const invalidate = useInvalidateTemplates()
  return useMutation({
    mutationFn: ({ templateId, payload }: { templateId: string; payload: AddWorkflowStepPayload }) =>
      workflowService.addStep(templateId, payload),
    onSuccess: () => { invalidate(); toast.success('Thêm bước thành công') },
    onError: (e) => toast.error(beError(e, 'Thêm bước thất bại')),
  })
}

export function useUpdateWorkflowStep() {
  const invalidate = useInvalidateTemplates()
  return useMutation({
    mutationFn: ({ templateId, stepId, payload }: { templateId: string; stepId: string; payload: UpdateWorkflowStepPayload }) =>
      workflowService.updateStep(templateId, stepId, payload),
    onSuccess: () => { invalidate(); toast.success('Cập nhật bước thành công') },
    onError: (e) => toast.error(beError(e, 'Cập nhật bước thất bại')),
  })
}

export function useDeleteWorkflowStep() {
  const invalidate = useInvalidateTemplates()
  return useMutation({
    mutationFn: ({ templateId, stepId }: { templateId: string; stepId: string }) =>
      workflowService.deleteStep(templateId, stepId),
    onSuccess: () => { invalidate(); toast.success('Xóa bước thành công') },
    onError: (e) => toast.error(beError(e, 'Xóa bước thất bại')),
  })
}

// ── Instance actions ───────────────────────────────────────────────────────────

function useInvalidateMyTasks() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ['workflow-my-tasks'] })
}

export function useApproveWorkflowTask() {
  const invalidate = useInvalidateMyTasks()
  return useMutation({
    mutationFn: ({ instanceId, note }: { instanceId: string; note?: string }) =>
      workflowService.approveInstance(instanceId, note),
    onSuccess: () => { invalidate(); toast.success('Duyệt thành công') },
    onError: (e) => toast.error(beError(e, 'Duyệt thất bại')),
  })
}

export function useRejectWorkflowTask() {
  const invalidate = useInvalidateMyTasks()
  return useMutation({
    mutationFn: ({ instanceId, note }: { instanceId: string; note: string }) =>
      workflowService.rejectInstance(instanceId, note),
    onSuccess: () => { invalidate(); toast.success('Từ chối thành công') },
    onError: (e) => toast.error(beError(e, 'Từ chối thất bại')),
  })
}

export function useCancelWorkflowInstance() {
  const invalidate = useInvalidateMyTasks()
  return useMutation({
    mutationFn: (instanceId: string) => workflowService.cancelInstance(instanceId),
    onSuccess: () => { invalidate(); toast.success('Hủy phiếu thành công') },
    onError: (e) => toast.error(beError(e, 'Hủy phiếu thất bại')),
  })
}
