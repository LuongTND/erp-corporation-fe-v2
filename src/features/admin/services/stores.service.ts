import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { AddStoreMemberPayload, QueryResult, StoreHoursPayload, StoreHoursResponse, StoreMemberResponse, StorePortalResponse, StoreResponse } from '../types/admin.types'

export const storesService = {
  getStores: (params?: { searchText?: string; regionId?: string; top?: number; skip?: number }) =>
    apiCall.get<QueryResult<StoreResponse>>(API_ROUTES.STORES.BASE, { params }),

  getStoresByRegion: (regionId: string) =>
    apiCall.get<QueryResult<StoreResponse>>(API_ROUTES.STORES.BASE, { params: { regionId, top: 200 } }),

  syncStores: () =>
    apiCall.post<number>(API_ROUTES.STORES.SYNC),

  getStoreHours: (storeId: string) =>
    apiCall.get<StoreHoursResponse[]>(API_ROUTES.STORES.HOURS(storeId)),

  upsertStoreHours: (payload: StoreHoursPayload) =>
    apiCall.put<void>(API_ROUTES.STORES.HOURS(payload.storeId), { hours: payload.hours }),

  toggleStoreActive: (storeId: string) =>
    apiCall.patch<boolean>(API_ROUTES.STORES.TOGGLE_ACTIVE(storeId)),

  deleteStore: (storeId: string) =>
    apiCall.delete<void>(API_ROUTES.STORES.GET_BY_ID(storeId)),

  assignManager: (storeId: string, managerId: string | null) =>
    apiCall.patch<void>(API_ROUTES.STORES.MANAGER(storeId), { managerId }),

  getMyStore: () =>
    apiCall.get<StorePortalResponse | null>(API_ROUTES.STORE_MANAGER.MY_STORE),

  getStoreMembers: (storeId: string) =>
    apiCall.get<StoreMemberResponse[]>(API_ROUTES.STORES.MEMBERS(storeId)),

  addStoreMember: (storeId: string, payload: AddStoreMemberPayload) =>
    apiCall.post<string>(API_ROUTES.STORES.MEMBERS(storeId), payload),

  removeStoreMember: (storeId: string, userId: string) =>
    apiCall.delete<void>(API_ROUTES.STORES.MEMBER(storeId, userId)),

  getMyStoreMembers: () =>
    apiCall.get<StoreMemberResponse[]>(API_ROUTES.STORE_MANAGER.MY_STORE_MEMBERS),
}
