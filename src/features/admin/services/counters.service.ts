import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { CounterPayload, CounterResponse, QueryResult } from '../types/admin.types'

export const countersService = {
  list: (params?: { storeId?: string; searchText?: string; top?: number }) =>
    apiCall.get<QueryResult<CounterResponse>>(API_ROUTES.COUNTERS.BASE, { params }),

  create: (data: CounterPayload) =>
    apiCall.post<string>(API_ROUTES.COUNTERS.BASE, data),

  update: (id: string, data: { name: string; code: string }) =>
    apiCall.put<void>(API_ROUTES.COUNTERS.GET_BY_ID(id), { ...data, counterId: id }),

  toggleActive: (id: string) =>
    apiCall.patch<boolean>(API_ROUTES.COUNTERS.TOGGLE_ACTIVE(id)),

  delete: (id: string) =>
    apiCall.delete<void>(API_ROUTES.COUNTERS.GET_BY_ID(id)),
}
