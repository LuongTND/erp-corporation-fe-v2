import { z } from 'zod'

export const createPayrollRunSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2020),
  note: z.string().max(1000).optional(),
})
export type CreatePayrollRunValues = z.infer<typeof createPayrollRunSchema>

export const updatePayrollEntrySchema = z.object({
  hoursWorked: z.coerce.number().min(0),
  bonusAmount: z.coerce.number().min(0),
  socialInsurance: z.coerce.number().optional().nullable(),
  healthInsurance: z.coerce.number().optional().nullable(),
  unemploymentIns: z.coerce.number().optional().nullable(),
  personalIncomeTax: z.coerce.number().optional().nullable(),
  note: z.string().max(500).optional(),
})
export type UpdatePayrollEntryValues = z.infer<typeof updatePayrollEntrySchema>
