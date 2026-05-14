import * as z from 'zod'
import type { PriorityLevel } from '../types/priority.types'

export const priorityFormSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  code: z.string().min(1, 'Mã không được để trống'),
  level: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Màu hex không hợp lệ'),
}) satisfies z.ZodType<{
  name: string
  code: string
  level: PriorityLevel
  color: string
}>

export type PriorityFormData = z.infer<typeof priorityFormSchema>
