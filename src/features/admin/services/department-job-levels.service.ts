import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { DepartmentJobLevelResponse, QueryResult } from '../types/admin.types'

export const departmentJobLevelsService = {
  list: (departmentId?: string) =>
    apiCall.get<QueryResult<DepartmentJobLevelResponse>>(API_ROUTES.DEPARTMENT_JOB_LEVELS.BASE, {
      params: departmentId ? { departmentId } : undefined,
    }),

  create: (data: { departmentId: string; jobLevelId: string; bonusPolicyId?: string }) =>
    apiCall.post<string>(API_ROUTES.DEPARTMENT_JOB_LEVELS.BASE, data),

  update: (id: string, data: { departmentId: string; jobLevelId: string; bonusPolicyId?: string }) =>
    apiCall.put<void>(API_ROUTES.DEPARTMENT_JOB_LEVELS.GET_BY_ID(id), data),

  delete: (id: string) =>
    apiCall.delete<void>(API_ROUTES.DEPARTMENT_JOB_LEVELS.GET_BY_ID(id)),
}
