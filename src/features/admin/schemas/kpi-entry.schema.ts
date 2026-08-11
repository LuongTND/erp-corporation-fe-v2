import { z } from 'zod'

export const upsertKpiEntrySchema = z.object({
  userId: z.string().min(1, 'User ID là bắt buộc'),
  kpiMetricId: z.string().min(1, 'KPI Metric là bắt buộc'),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2020),
  actualValue: z.coerce.number().min(0),
  score: z.coerce.number().min(0).max(100),
  note: z.string().max(500).optional(),
})
export type UpsertKpiEntryValues = z.infer<typeof upsertKpiEntrySchema>
