import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type {
  InterviewRuleConfigResponse,
  CreateInterviewRuleConfigPayload,
  UpdateInterviewRuleConfigPayload,
  InterviewRuleConfigListParams,
  ResolvedInterviewRule,
} from '../types/admin.types'

export const interviewRuleConfigService = {
  getAll: (params?: InterviewRuleConfigListParams) =>
    apiCall.get<InterviewRuleConfigResponse[]>(API_ROUTES.INTERVIEW_RULE_CONFIGS.BASE, { params }),

  create: (data: CreateInterviewRuleConfigPayload) =>
    apiCall.post<InterviewRuleConfigResponse>(API_ROUTES.INTERVIEW_RULE_CONFIGS.BASE, data),

  update: (id: string, data: UpdateInterviewRuleConfigPayload) =>
    apiCall.put<InterviewRuleConfigResponse>(API_ROUTES.INTERVIEW_RULE_CONFIGS.GET_BY_ID(id), data),

  resolve: (candidateId: string) =>
    apiCall.get<ResolvedInterviewRule>(API_ROUTES.INTERVIEW_RULE_CONFIGS.RESOLVE, { params: { candidateId } }),
}
