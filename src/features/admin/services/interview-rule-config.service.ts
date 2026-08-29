import { apiCall } from '@/lib/api'
import type {
  InterviewRuleConfigResponse,
  CreateInterviewRuleConfigPayload,
  UpdateInterviewRuleConfigPayload,
  InterviewRuleConfigListParams,
  ResolvedInterviewRule,
} from '../types/admin.types'

const BASE = '/api/interview-rule-configs'

export const interviewRuleConfigService = {
  getAll: (params?: InterviewRuleConfigListParams) =>
    apiCall.get<InterviewRuleConfigResponse[]>(BASE, { params }),

  create: (data: CreateInterviewRuleConfigPayload) =>
    apiCall.post<InterviewRuleConfigResponse>(BASE, data),

  update: (id: string, data: UpdateInterviewRuleConfigPayload) =>
    apiCall.put<InterviewRuleConfigResponse>(`${BASE}/${id}`, data),

  resolve: (candidateId: string) =>
    apiCall.get<ResolvedInterviewRule>(`${BASE}/resolve`, { params: { candidateId } }),
}
