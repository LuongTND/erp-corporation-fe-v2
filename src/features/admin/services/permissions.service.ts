import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { PermissionResponse, QueryResult } from '../types/admin.types'

export interface PermissionsListParams {
  search?: string
  skip?: number
  top?: number
}

export const permissionsService = {
  list: (params?: PermissionsListParams) =>
    apiCall.get<QueryResult<PermissionResponse>>(API_ROUTES.PERMISSIONS.BASE, { params }),

  getByRole: (roleId: string) =>
    apiCall.get<PermissionResponse[]>(API_ROUTES.ROLES.PERMISSIONS(roleId)),

  delete: (id: string) =>
    apiCall.delete(API_ROUTES.PERMISSIONS.GET_BY_ID(id)),
}
