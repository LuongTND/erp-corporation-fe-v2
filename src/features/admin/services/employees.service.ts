import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { CreateEmployeePayload, UserSummaryResponse } from '../types/admin.types'

export const employeesService = {
  list: (search?: string, jobLevelId?: string, status?: string, departmentId?: string, labelId?: string, storeId?: string, regionId?: string) =>
    apiCall.get<UserSummaryResponse[]>(API_ROUTES.USERS.BASE, { params: { ...(search ? { search } : {}), ...(jobLevelId ? { jobLevelId } : {}), ...(status ? { status } : {}), ...(departmentId ? { departmentId } : {}), ...(labelId ? { labelId } : {}), ...(storeId ? { storeId } : {}), ...(regionId && !storeId ? { regionId } : {}) } }),

  create: (data: CreateEmployeePayload) =>
    apiCall.post<string>(API_ROUTES.USERS.BASE, data),

  updateStatus: (userId: string, newStatus: string, note?: string) =>
    apiCall.patch<void>(API_ROUTES.USERS.STATUS(userId), { userId, newStatus, note }),

  lock: (userId: string, lock: boolean) =>
    apiCall.patch<void>(API_ROUTES.USERS.LOCK(userId), { userId, lock }),

  exportUsers: (search?: string, status?: string, departmentId?: string, labelId?: string, storeId?: string, regionId?: string) =>
    apiCall.get<Blob>(API_ROUTES.USERS.EXPORT, { params: { ...(search ? { search } : {}), ...(status ? { status } : {}), ...(departmentId ? { departmentId } : {}), ...(labelId ? { labelId } : {}), ...(storeId ? { storeId } : {}), ...(regionId && !storeId ? { regionId } : {}) }, responseType: 'blob' }),
}
