import { apiCall } from '@/lib/api'
import type { ListParams, PermissionResponse, QueryResult } from '../types/admin.types'

export const permissionsService = {
  list: (params?: ListParams) =>
    apiCall.get<QueryResult<PermissionResponse>>('/api/permissions', { params }),

  getByRole: (roleId: string) =>
    apiCall.get<PermissionResponse[]>(`/api/roles/${roleId}/permissions`),
}
