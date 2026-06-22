import { z } from 'zod'

export const webinarSchema = z.object({
  title: z.string().min(5, 'Tiêu đề tối thiểu 5 ký tự').max(120),
  host: z.string().min(2, 'Tên host tối thiểu 2 ký tự'),
  scheduledAt: z.string().min(1, 'Vui lòng chọn ngày giờ'),
  durationMinutes: z
    .number({ invalid_type_error: 'Phải là số' })
    .min(15, 'Tối thiểu 15 phút')
    .max(480, 'Tối đa 480 phút'),
  maxCapacity: z
    .number({ invalid_type_error: 'Phải là số' })
    .min(1, 'Tối thiểu 1 người')
    .max(10000),
  isInternal: z.boolean(),
  description: z.string().min(10, 'Mô tả tối thiểu 10 ký tự').max(500),
})

export type WebinarSchema = z.infer<typeof webinarSchema>
