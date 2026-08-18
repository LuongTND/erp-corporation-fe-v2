import { apiCall } from '@/lib/api'
import type { EmployeeTypeResponse, ListParams, QueryResult } from '../types/admin.types'

export const employeeTypesService = {
  list: (params?: ListParams) =>
    apiCall.get<QueryResult<EmployeeTypeResponse>>('/api/employee-types', { params }),

  create: (data: { name: string; code: string; description?: string }) =>
    apiCall.post<string>('/api/employee-types', data),

  update: (id: string, data: { name: string; code: string; description?: string; isActive: boolean }) =>
    apiCall.put<void>(`/api/employee-types/${id}`, data),

  delete: (id: string) =>
    apiCall.delete<void>(`/api/employee-types/${id}`),

  assignToUser: (userId: string, employeeTypeId: string | null) =>
    apiCall.patch<void>(`/api/users/${userId}/employee-type`, { employeeTypeId }),
}
