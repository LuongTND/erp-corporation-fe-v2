import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { QueryResult, RegionHoursPayload, RegionHoursResponse, RegionResponse } from '../types/admin.types'

export const regionsService = {
  getRegions: (params?: { searchText?: string; top?: number; skip?: number }) =>
    apiCall.get<QueryResult<RegionResponse>>(API_ROUTES.REGIONS.BASE, { params }),

  syncRegions: () =>
    apiCall.post<number>(API_ROUTES.REGIONS.SYNC),

  getRegionHours: (regionId: string) =>
    apiCall.get<RegionHoursResponse[]>(API_ROUTES.REGIONS.HOURS(regionId)),

  upsertRegionHours: (payload: RegionHoursPayload) =>
    apiCall.put<void>(API_ROUTES.REGIONS.HOURS(payload.regionId), { hours: payload.hours }),

  assignManager: (regionId: string, managerId: string | null) =>
    apiCall.patch<void>(API_ROUTES.REGIONS.MANAGER(regionId), { managerId }),
}
