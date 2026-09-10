import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { LabelResponse } from '../types/admin.types'

export const labelsService = {
  list: (params?: { search?: string; isActive?: boolean }) =>
    apiCall.get<LabelResponse[]>(API_ROUTES.LABELS.BASE, { params }),

  create: (data: { name: string; color: string }) =>
    apiCall.post<string>(API_ROUTES.LABELS.BASE, data),

  update: (id: string, data: { name: string; color: string; isActive: boolean }) =>
    apiCall.put<void>(API_ROUTES.LABELS.GET_BY_ID(id), data),

  delete: (id: string) =>
    apiCall.delete<void>(API_ROUTES.LABELS.GET_BY_ID(id)),

  assignToUser: (userId: string, labelId: string) =>
    apiCall.post<void>(API_ROUTES.USERS.LABELS(userId, labelId), {}),

  removeFromUser: (userId: string, labelId: string) =>
    apiCall.delete<void>(API_ROUTES.USERS.LABELS(userId, labelId)),
}
