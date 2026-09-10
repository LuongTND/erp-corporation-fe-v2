import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { RecruitmentApproverConfigResponse, SetRecruitmentApproverPayload } from '../types/admin.types'

export const recruitmentApproverService = {
  list: () =>
    apiCall.get<RecruitmentApproverConfigResponse[]>(API_ROUTES.RECRUITMENT_APPROVER_CONFIGS.BASE),

  set: (data: SetRecruitmentApproverPayload) =>
    apiCall.post<string>(API_ROUTES.RECRUITMENT_APPROVER_CONFIGS.BASE, data),

  delete: (configId: string) =>
    apiCall.delete<void>(API_ROUTES.RECRUITMENT_APPROVER_CONFIGS.GET_BY_ID(configId)),
}
