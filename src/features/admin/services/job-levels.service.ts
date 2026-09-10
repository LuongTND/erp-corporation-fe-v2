import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { JobLevelResponse, ListParams, QueryResult } from '../types/admin.types'

export const jobLevelsService = {
  list: (params?: ListParams) =>
    apiCall.get<QueryResult<JobLevelResponse>>(API_ROUTES.JOB_LEVELS.BASE, { params }),

  create: (data: { levelName: string; levelOrder: number; description?: string }) =>
    apiCall.post<string>(API_ROUTES.JOB_LEVELS.BASE, data),

  update: (id: string, data: { levelName: string; levelOrder: number; description?: string }) =>
    apiCall.put<void>(API_ROUTES.JOB_LEVELS.GET_BY_ID(id), data),

  delete: (id: string) =>
    apiCall.delete<void>(API_ROUTES.JOB_LEVELS.GET_BY_ID(id)),

  unassignJobLevel: (userId: string) =>
    apiCall.delete<void>(API_ROUTES.USERS.JOB_LEVEL(userId)),
}
