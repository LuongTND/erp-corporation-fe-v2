import { apiCall } from '@/lib/api'
import type { ListParams, QueryResult, RoleResponse } from '../types/admin.types'

export const rolesService = {
  list: (params?: ListParams) =>
    apiCall.get<QueryResult<RoleResponse>>('/api/roles', { params }),

  getById: (id: string) =>
    apiCall.get<RoleResponse>(`/api/roles/${id}`),

  create: (data: { roleName: string; description?: string }) =>
    apiCall.post<string>('/api/roles', data),

  update: (id: string, data: { roleName: string; description?: string }) =>
    apiCall.put<void>(`/api/roles/${id}`, data),

  delete: (id: string) =>
    apiCall.delete<void>(`/api/roles/${id}`),

  assignPermissions: (id: string, permissionIds: string[]) =>
    apiCall.put<void>(`/api/roles/${id}/permissions`, { permissionIds }),
}
