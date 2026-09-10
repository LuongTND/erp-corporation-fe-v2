import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { RoleResponse, UserSummaryResponse } from '../types/admin.types'

export const rolesService = {
  list: () =>
    apiCall.get<RoleResponse[]>(API_ROUTES.ROLES.BASE),

  getById: (id: string) =>
    apiCall.get<RoleResponse>(API_ROUTES.ROLES.GET_BY_ID(id)),

  create: (data: { roleName: string; displayName: string; description: string; defaultDataScope: string }) =>
    apiCall.post<string>(API_ROUTES.ROLES.BASE, data),

  update: (id: string, data: { displayName: string; description: string; defaultDataScope: string }) =>
    apiCall.put<void>(API_ROUTES.ROLES.GET_BY_ID(id), data),

  delete: ({ id, force }: { id: string; force?: boolean }) =>
    apiCall.delete<void>(`${API_ROUTES.ROLES.GET_BY_ID(id)}${force ? '?force=true' : ''}`),

  assignPermissions: (id: string, toAdd: string[], toRemove: string[]) =>
    apiCall.put<void>(API_ROUTES.ROLES.PERMISSIONS(id), { toAdd, toRemove }),

  getUsersByRole: (roleId: string) =>
    apiCall.get<UserSummaryResponse[]>(API_ROUTES.ROLES.USERS(roleId)),

  syncUsers: (roleId: string, toAdd: string[], toRemove: string[], expiresAt?: string | null) =>
    apiCall.put<void>(API_ROUTES.ROLES.USERS(roleId), { toAdd, toRemove, expiresAt: expiresAt ?? null }),
}
