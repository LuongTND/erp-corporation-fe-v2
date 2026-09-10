import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { UserSummaryResponse } from '../types/admin.types'

export const usersService = {
  list: (search?: string) =>
    apiCall.get<UserSummaryResponse[]>(API_ROUTES.USERS.BASE, { params: search ? { search } : undefined }),

  assignRole: (userId: string, roleId: string) =>
    apiCall.post<string>(API_ROUTES.USERS.ROLES(userId), { roleId, expiresAt: null }),

  revokeRole: (userId: string, roleId: string) =>
    apiCall.delete<void>(API_ROUTES.USERS.ROLE(userId, roleId)),
}
