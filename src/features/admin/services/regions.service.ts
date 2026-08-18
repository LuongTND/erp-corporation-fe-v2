import { apiCall } from '@/lib/api'
import type { QueryResult, RegionHoursPayload, RegionHoursResponse, RegionResponse } from '../types/admin.types'

export const regionsService = {
  getRegions: (params?: { searchText?: string; top?: number; skip?: number }) =>
    apiCall.get<QueryResult<RegionResponse>>('/api/regions', { params }),

  syncRegions: () =>
    apiCall.post<number>('/api/regions/sync'),

  getRegionHours: (regionId: string) =>
    apiCall.get<RegionHoursResponse[]>(`/api/regions/${regionId}/region-hours`),

  upsertRegionHours: (payload: RegionHoursPayload) =>
    apiCall.put<void>(`/api/regions/${payload.regionId}/region-hours`, { hours: payload.hours }),
}
