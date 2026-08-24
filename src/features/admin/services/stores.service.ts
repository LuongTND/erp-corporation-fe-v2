import { apiCall } from '@/lib/api'
import type { AddStoreMemberPayload, QueryResult, StoreHoursPayload, StoreHoursResponse, StoreMemberResponse, StorePortalResponse, StoreResponse } from '../types/admin.types'

export const storesService = {
  getStores: (params?: { searchText?: string; regionId?: string; top?: number; skip?: number }) =>
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

  getStoreMembers: (storeId: string) =>
    apiCall.get<StoreMemberResponse[]>(`/api/stores/${storeId}/members`),

  addStoreMember: (storeId: string, payload: AddStoreMemberPayload) =>
    apiCall.post<string>(`/api/stores/${storeId}/members`, payload),

  removeStoreMember: (storeId: string, userId: string) =>
    apiCall.delete<void>(`/api/stores/${storeId}/members/${userId}`),

  getMyStoreMembers: () =>
    apiCall.get<StoreMemberResponse[]>('/api/store-manager/my-store/members'),
}
