import { z } from 'zod'

const orderProductSchema = z.object({
  productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
  quantity: z
    .number({ invalid_type_error: 'Số lượng phải là số' })
    .min(1, 'Số lượng tối thiểu là 1')
    .max(10000),
})

export const createOrderSchema = z.object({
  products: z
    .array(orderProductSchema)
    .min(1, 'Vui lòng chọn ít nhất 1 sản phẩm'),
  shippingAddress: z.string().min(10, 'Địa chỉ giao hàng tối thiểu 10 ký tự'),
  note: z.string().max(500).optional(),
})

export type CreateOrderSchema = z.infer<typeof createOrderSchema>
