import { apiCall } from '@/lib/api'
import type { CreateEmployeePayload, UserSummaryResponse } from '../types/admin.types'

export const employeesService = {
  list: (search?: string, jobLevelId?: string, status?: string, departmentId?: string) =>
    apiCall.get<UserSummaryResponse[]>('/api/users', { params: { ...(search ? { search } : {}), ...(jobLevelId ? { jobLevelId } : {}), ...(status ? { status } : {}), ...(departmentId ? { departmentId } : {}) } }),

  create: (data: CreateEmployeePayload) =>
    apiCall.post<string>('/api/users', data),
}
