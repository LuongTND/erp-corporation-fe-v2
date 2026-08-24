import { apiCall } from '@/lib/api'
import type { PermissionResponse, QueryResult } from '../types/admin.types'

export interface PermissionsListParams {
  search?: string
  skip?: number
  top?: number
}

export const permissionsService = {
  list: (params?: PermissionsListParams) =>
    apiCall.get<QueryResult<PermissionResponse>>('/api/permissions', { params }),

  getByRole: (roleId: string) =>
    apiCall.get<PermissionResponse[]>(`/api/roles/${roleId}/permissions`),

  delete: (id: string) =>
    apiCall.delete(`/api/permissions/${id}`),
}
