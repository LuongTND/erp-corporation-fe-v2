import { apiCall } from '@/lib/api'
import type { QueryResult, StoreHoursPayload, StoreHoursResponse, StorePortalResponse, StoreResponse } from '../types/admin.types'

export const storesService = {
  getStores: (params?: { searchText?: string; top?: number; skip?: number }) =>
    apiCall.get<QueryResult<StoreResponse>>('/api/stores', { params }),

  getStoresByRegion: (regionId: string) =>
    apiCall.get<QueryResult<StoreResponse>>('/api/stores', { params: { regionId, top: 200 } }),

  syncStores: () =>
    apiCall.post<number>('/api/stores/sync'),

  getStoreHours: (storeId: string) =>
    apiCall.get<StoreHoursResponse[]>(`/api/stores/${storeId}/store-hours`),

  upsertStoreHours: (payload: StoreHoursPayload) =>
    apiCall.put<void>(`/api/stores/${payload.storeId}/store-hours`, { hours: payload.hours }),

  toggleStoreActive: (storeId: string) =>
    apiCall.patch<boolean>(`/api/stores/${storeId}/toggle-active`),

  deleteStore: (storeId: string) =>
    apiCall.delete<void>(`/api/stores/${storeId}`),

  assignManager: (storeId: string, managerId: string | null) =>
    apiCall.patch<void>(`/api/stores/${storeId}/manager`, { managerId }),

  getMyStore: () =>
    apiCall.get<StorePortalResponse | null>('/api/store-manager/my-store'),
}
