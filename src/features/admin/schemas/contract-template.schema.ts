import { z } from 'zod'

export const uploadTemplateSchema = z.object({
  name: z.string().min(1, 'Tên mẫu không được để trống').max(200),
  description: z.string().max(500).optional(),
  file: z.any().refine((files) => files?.[0]?.name?.endsWith('.docx'), 'Chỉ hỗ trợ file .docx'),
})

export type UploadTemplateFormValues = z.infer<typeof uploadTemplateSchema>
