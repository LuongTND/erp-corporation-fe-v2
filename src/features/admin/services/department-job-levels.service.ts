import { apiCall } from '@/lib/api'
import type { DepartmentJobLevelResponse, QueryResult } from '../types/admin.types'

export const departmentJobLevelsService = {
  list: (departmentId?: string) =>
    apiCall.get<QueryResult<DepartmentJobLevelResponse>>('/api/hrm/department-job-levels', {
      params: departmentId ? { departmentId } : undefined,
    }),

  create: (data: { departmentId: string; jobLevelId: string; bonusPolicyId?: string }) =>
    apiCall.post<string>('/api/hrm/department-job-levels', data),

  update: (id: string, data: { departmentId: string; jobLevelId: string; bonusPolicyId?: string }) =>
    apiCall.put<void>(`/api/hrm/department-job-levels/${id}`, data),

  delete: (id: string) =>
    apiCall.delete<void>(`/api/hrm/department-job-levels/${id}`),
}
