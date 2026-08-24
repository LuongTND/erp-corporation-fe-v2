import { apiCall } from '@/lib/api'
import type { LabelResponse } from '../types/admin.types'

export const labelsService = {
  list: (params?: { search?: string; isActive?: boolean }) =>
    apiCall.get<LabelResponse[]>('/api/labels', { params }),

  create: (data: { name: string; color: string }) =>
    apiCall.post<string>('/api/labels', data),

  update: (id: string, data: { name: string; color: string; isActive: boolean }) =>
    apiCall.put<void>(`/api/labels/${id}`, data),

  delete: (id: string) =>
    apiCall.delete<void>(`/api/labels/${id}`),

  assignToUser: (userId: string, labelId: string) =>
    apiCall.post<void>(`/api/users/${userId}/labels/${labelId}`, {}),

  removeFromUser: (userId: string, labelId: string) =>
    apiCall.delete<void>(`/api/users/${userId}/labels/${labelId}`),
}
