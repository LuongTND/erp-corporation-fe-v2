import { apiCall } from '@/lib/api'
import type { CreateEmployeePayload, UserSummaryResponse } from '../types/admin.types'

export const employeesService = {
  list: (search?: string, jobLevelId?: string, status?: string, departmentId?: string, labelId?: string, storeId?: string, regionId?: string) =>
    apiCall.get<UserSummaryResponse[]>('/api/users', { params: { ...(search ? { search } : {}), ...(jobLevelId ? { jobLevelId } : {}), ...(status ? { status } : {}), ...(departmentId ? { departmentId } : {}), ...(labelId ? { labelId } : {}), ...(storeId ? { storeId } : {}), ...(regionId && !storeId ? { regionId } : {}) } }),

  create: (data: CreateEmployeePayload) =>
    apiCall.post<string>('/api/users', data),

  updateStatus: (userId: string, newStatus: string, note?: string) =>
    apiCall.patch<void>(`/api/users/${userId}/status`, { userId, newStatus, note }),

  lock: (userId: string, lock: boolean) =>
    apiCall.patch<void>(`/api/users/${userId}/lock`, { userId, lock }),

  exportUsers: (search?: string, status?: string, departmentId?: string, labelId?: string, storeId?: string, regionId?: string) =>
    apiCall.get<Blob>('/api/users/export', { params: { ...(search ? { search } : {}), ...(status ? { status } : {}), ...(departmentId ? { departmentId } : {}), ...(labelId ? { labelId } : {}), ...(storeId ? { storeId } : {}), ...(regionId && !storeId ? { regionId } : {}) }, responseType: 'blob' }),
}
