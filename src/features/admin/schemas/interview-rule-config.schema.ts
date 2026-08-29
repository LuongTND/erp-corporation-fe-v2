import { z } from 'zod'

export const createInterviewRuleConfigSchema = z.object({
  name: z.string().min(1, 'Nhập tên rule'),
  context: z.enum(['StoreRetail', 'Office', 'Production']),
  regionId: z.string().optional(),
  departmentId: z.string().optional(),
  interviewerRoleKey: z.string().min(1, 'Nhập role người phỏng vấn'),
  location: z.enum(['AtStore', 'AtOffice', 'AtFactory', 'Remote']),
  schedulerRoleKey: z.string().optional(),
  notifyRoleKey: z.string().optional(),
  priority: z.number().int().min(1),
  isActive: z.boolean(),
})

export type CreateInterviewRuleConfigFormData = z.infer<typeof createInterviewRuleConfigSchema>
