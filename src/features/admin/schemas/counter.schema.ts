import { z } from 'zod'

export const createCounterSchema = z.object({
  storeId: z.string().uuid('Vui lòng chọn cửa hàng'),
  name: z.string().min(1, 'Tên quầy là bắt buộc').max(200),
  code: z.string().min(1, 'Mã quầy là bắt buộc').max(50),
})
export type CreateCounterFormValues = z.infer<typeof createCounterSchema>

export const updateCounterSchema = z.object({
  name: z.string().min(1, 'Tên quầy là bắt buộc').max(200),
  code: z.string().min(1, 'Mã quầy là bắt buộc').max(50),
})
export type UpdateCounterFormValues = z.infer<typeof updateCounterSchema>
