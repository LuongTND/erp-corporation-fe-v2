import { z } from 'zod'

export const courseSchema = z.object({
  title: z.string().min(5, 'Tiêu đề tối thiểu 5 ký tự').max(120, 'Tiêu đề tối đa 120 ký tự'),
  category: z.string().min(1, 'Vui lòng chọn danh mục'),
  instructor: z.string().min(2, 'Tên giảng viên tối thiểu 2 ký tự'),
  duration: z.string().min(1, 'Vui lòng nhập thời lượng (vd: 4h 30m)'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    errorMap: () => ({ message: 'Vui lòng chọn cấp độ' }),
  }),
  description: z.string().min(20, 'Mô tả tối thiểu 20 ký tự').max(1000),
  isInternal: z.boolean(),
  status: z.enum(['draft', 'published', 'archived']),
})

export type CourseSchema = z.infer<typeof courseSchema>
