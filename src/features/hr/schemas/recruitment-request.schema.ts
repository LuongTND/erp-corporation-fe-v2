import { z } from 'zod'

export const createRecruitmentRequestSchema = z.object({
  requestContext: z.enum(['Store', 'Department']),
  positionTitle: z.string().min(1, 'Vui lòng nhập vị trí').max(200, 'Tối đa 200 ký tự'),
  headcount: z.coerce.number().int().min(1, 'Tối thiểu 1').max(100, 'Tối đa 100'),
  reason: z.string().min(1, 'Vui lòng nhập lý do').max(2000, 'Tối đa 2000 ký tự'),
  jobDescription: z.string().max(5000, 'Tối đa 5000 ký tự').optional(),
  requiredByDate: z.string().optional(),
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
