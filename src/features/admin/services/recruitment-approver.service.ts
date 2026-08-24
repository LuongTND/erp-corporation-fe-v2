import { apiCall } from '@/lib/api'
import type { RecruitmentApproverConfigResponse, SetRecruitmentApproverPayload } from '../types/admin.types'

export const recruitmentApproverService = {
  list: () =>
    apiCall.get<RecruitmentApproverConfigResponse[]>('/api/recruitment/approver-configs'),

  set: (data: SetRecruitmentApproverPayload) =>
    apiCall.post<string>('/api/recruitment/approver-configs', data),

  delete: (configId: string) =>
    apiCall.delete<void>(`/api/recruitment/approver-configs/${configId}`),
}
