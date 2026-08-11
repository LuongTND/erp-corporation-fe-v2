export interface KpiEntryResponse {
  id: string
  userId: string
  fullName: string
  kpiMetricId: string
  metricName: string
  month: number
  year: number
  actualValue: number
  score: number
  note?: string | null
}

export interface KpiSummaryResponse {
  userId: string
  fullName: string
  month: number
  year: number
  totalScore: number
  entries: KpiEntryResponse[]
}

export interface UpsertKpiEntryPayload {
  userId: string
  kpiMetricId: string
  month: number
  year: number
  actualValue: number
  score: number
  note?: string
}
