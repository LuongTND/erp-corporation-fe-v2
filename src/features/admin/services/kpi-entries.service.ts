import { apiCall } from '@/lib/api'
import type { KpiEntryResponse, KpiSummaryResponse, UpsertKpiEntryPayload } from '../types/kpi-entry.types'

export const kpiEntriesService = {
  list: (params: { month: number; year: number; userId?: string; kpiMetricId?: string }) =>
    apiCall.get<KpiEntryResponse[]>('/api/hrm/kpi-entries', { params }),

  summary: (params: { userId: string; month: number; year: number }) =>
    apiCall.get<KpiSummaryResponse>('/api/hrm/kpi-entries/summary', { params }),

  upsert: (data: UpsertKpiEntryPayload) =>
    apiCall.post<string>('/api/hrm/kpi-entries', data),
}
