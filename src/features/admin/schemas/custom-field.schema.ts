import { z } from 'zod'

const optionSchema = z.object({
  id: z.string().optional(),
  value: z.string().min(1, 'Bắt buộc'),
  label: z.string().min(1, 'Bắt buộc'),
  sortOrder: z.number(),
  isActive: z.boolean(),
})

export const customFieldSchema = z.object({
  code: z.string().min(1).max(50).regex(/^[A-Za-z0-9_]+$/, 'Chỉ chữ, số, dấu _'),
  name: z.string().min(1).max(200),
  fieldType: z.enum(['Text', 'Number', 'Date', 'Select', 'MultiSelect', 'Checkbox', 'TextArea']),
  module: z.string().min(1).max(50),
  isRequired: z.boolean(),
  sortOrder: z.coerce.number(),
  placeholder: z.string().max(200).optional(),
  helpText: z.string().max(500).optional(),
  group: z.string().max(100).optional(),
  options: z.array(optionSchema).optional(),
})

export type CustomFieldFormValues = z.infer<typeof customFieldSchema>
