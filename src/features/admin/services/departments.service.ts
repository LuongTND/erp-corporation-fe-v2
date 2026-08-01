import { apiCall } from '@/lib/api'
import type { DepartmentResponse, ListParams, QueryResult } from '../types/admin.types'

export const departmentsService = {
  list: (params?: ListParams) =>
    apiCall.get<QueryResult<DepartmentResponse>>('/api/departments', { params }),

  create: (data: { departmentName: string; departmentCode: string; parentDepartmentId?: string; managerId?: string }) =>
    apiCall.post<string>('/api/departments', data),

  update: (id: string, data: { departmentName: string; departmentCode: string; parentDepartmentId?: string; managerId?: string }) =>
    apiCall.put<void>(`/api/departments/${id}`, data),

  delete: (id: string) =>
    apiCall.delete<void>(`/api/departments/${id}`),
}
