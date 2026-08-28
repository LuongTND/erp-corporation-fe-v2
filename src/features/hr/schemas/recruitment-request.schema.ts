import { z } from 'zod'

export const createRecruitmentRequestSchema = z.object({
  context: z.enum(['Store', 'Production']),
  jobPositionId: z.string().min(1, 'Vui lòng chọn vị trí'),
  quantity: z.coerce.number().int().min(1, 'Tối thiểu 1').max(100, 'Tối đa 100'),
  reason: z.string().max(500, 'Tối đa 500 ký tự').optional(),
  storeId: z.string().optional(),
  departmentId: z.string().optional(),
})

export type CreateRecruitmentRequestFormValues = z.infer<typeof createRecruitmentRequestSchema>

export const approvalActionSchema = z.object({
  note: z.string().max(1000, 'Tối đa 1000 ký tự').optional(),
})

export const rejectionActionSchema = z.object({
  note: z.string().min(1, 'Vui lòng nhập lý do').max(1000, 'Tối đa 1000 ký tự'),
})

export type ApprovalActionFormValues = z.infer<typeof approvalActionSchema>
export type RejectionActionFormValues = z.infer<typeof rejectionActionSchema>
