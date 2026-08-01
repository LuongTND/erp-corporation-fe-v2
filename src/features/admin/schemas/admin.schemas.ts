import { z } from 'zod'

export const roleSchema = z.object({
  roleName: z.string().min(1, 'Role name is required').max(100),
  description: z.string().max(500).optional(),
})
export type RoleFormValues = z.infer<typeof roleSchema>

export const departmentSchema = z.object({
  departmentName: z.string().min(1, 'Department name is required').max(255),
  departmentCode: z.string().min(1, 'Department code is required').max(50),
  parentDepartmentId: z.string().uuid().optional().or(z.literal('')),
  managerId: z.string().uuid().optional().or(z.literal('')),
})
export type DepartmentFormValues = z.infer<typeof departmentSchema>

export const jobLevelSchema = z.object({
  levelName: z.string().min(1, 'Level name is required').max(100),
  levelOrder: z.coerce.number().int().min(1, 'Order must be ≥ 1'),
  defaultScopeType: z.coerce.number().int().min(1).max(4),
  description: z.string().max(500).optional(),
  baseSalaryMin: z.coerce.number().min(0).optional(),
  baseSalaryMax: z.coerce.number().min(0).optional(),
})
export type JobLevelFormValues = z.infer<typeof jobLevelSchema>
