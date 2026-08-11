import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { kpiEntriesService } from '../services/kpi-entries.service'
import type { UpsertKpiEntryPayload } from '../types/kpi-entry.types'

const KEY = 'kpi-entries'

export function useKpiEntries(params: { month: number; year: number; userId?: string; kpiMetricId?: string }) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => kpiEntriesService.list(params),
  })
}

export function useKpiSummary(params: { userId: string; month: number; year: number } | null) {
  return useQuery({
    queryKey: [KEY, 'summary', params],
    queryFn: () => kpiEntriesService.summary(params!),
    enabled: !!params,
  })
}

export function useUpsertKpiEntry() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (data: UpsertKpiEntryPayload) => kpiEntriesService.upsert(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Lưu điểm KPI thành công')
    },
    onError: () => toast.error('Lưu điểm KPI thất bại'),
  })
}
