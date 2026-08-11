import { z } from 'zod'
import { USER_STATUS } from '../types/user-status.types'

export const updateUserStatusSchema = z.object({
  newStatus: z.enum(Object.values(USER_STATUS) as [string, ...string[]]),
  note: z.string().max(500).optional(),
})

export type UpdateUserStatusFormValues = z.infer<typeof updateUserStatusSchema>
