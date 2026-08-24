import { z } from 'zod'

export const labelSchema = z.object({
  name: z.string().min(1, 'Tên nhãn không được để trống').max(50, 'Tối đa 50 ký tự'),
  color: z.string().min(1, 'Chọn màu cho nhãn'),
  isActive: z.boolean(),
})

export type LabelFormValues = z.infer<typeof labelSchema>
