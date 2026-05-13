/**
 * Schema validation cho task forms
 * Sử dụng Zod để validate form data trước khi submit
 */

import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'in-review', 'done', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.date().optional(),
  estimatedHours: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
})

export type CreateTaskSchemaType = z.infer<typeof createTaskSchema>
