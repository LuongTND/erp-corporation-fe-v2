import { apiCall } from '@/lib/api'
import type { CounterPayload, CounterResponse, QueryResult } from '../types/admin.types'

export const countersService = {
  list: (params?: { storeId?: string; searchText?: string; top?: number }) =>
    apiCall.get<QueryResult<CounterResponse>>('/api/counters', { params }),

  create: (data: CounterPayload) =>
    apiCall.post<string>('/api/counters', data),

  update: (id: string, data: { name: string; code: string }) =>
    apiCall.put<void>(`/api/counters/${id}`, { ...data, counterId: id }),

  toggleActive: (id: string) =>
    apiCall.patch<boolean>(`/api/counters/${id}/toggle-active`),

  delete: (id: string) =>
    apiCall.delete<void>(`/api/counters/${id}`),
}
