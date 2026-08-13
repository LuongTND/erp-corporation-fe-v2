import { z } from 'zod'

export const roleSchema = z.object({
  roleName: z.string().min(1, 'Tên role là bắt buộc').max(100, 'Tối đa 100 ký tự'),
  displayName: z.string().min(1, 'Tên hiển thị là bắt buộc').max(100, 'Tối đa 100 ký tự'),
  description: z.string().max(500, 'Tối đa 500 ký tự').optional(),
})
export type RoleFormValues = z.infer<typeof roleSchema>

export const departmentSchema = z.object({
  departmentName: z.string().min(1, 'Tên phòng ban là bắt buộc').max(255),
  departmentCode: z.string().min(1, 'Mã phòng ban là bắt buộc').max(50),
  parentDepartmentId: z.string().uuid().optional().or(z.literal('')),
  managerId: z.string().uuid().optional().or(z.literal('')),
  isActive: z.boolean(),
})
export type DepartmentFormValues = z.infer<typeof departmentSchema>

export const storeSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string().min(1).max(50),
  address: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
  isActive: z.boolean().default(true),
})
export type StoreFormValues = z.infer<typeof storeSchema>

export const createEmployeeSchema = z.object({
  fullName: z.string().min(1, 'Họ tên là bắt buộc').max(255),
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ').max(255),
  jobLevelId: z.string().uuid('Cấp bậc là bắt buộc'),
  dateOfJoin: z.string().min(1, 'Ngày vào làm là bắt buộc'),
  employeeCode: z.string().max(50).optional().or(z.literal('')),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  dateOfBirth: z.string().optional().or(z.literal('')),
  identityCardNumber: z.string().max(20).optional().or(z.literal('')),
  identityCardIssuedDate: z.string().optional().or(z.literal('')),
  identityCardIssuedPlace: z.string().max(255).optional().or(z.literal('')),
  phoneNumber: z.string().max(20).optional().or(z.literal('')),
  permanentAddress: z.string().max(500).optional().or(z.literal('')),
  currentAddress: z.string().max(500).optional().or(z.literal('')),
  taxCode: z.string().max(20).optional().or(z.literal('')),
  socialInsuranceCode: z.string().max(20).optional().or(z.literal('')),
  managerId: z.string().uuid().optional().or(z.literal('')),
  contractType: z.enum(['Probation', 'FullTime', 'PartTime', 'Seasonal', 'Freelance']).optional(),
  bankName: z.string().max(200).optional().or(z.literal('')),
  bankAccountNumber: z.string().max(50).optional().or(z.literal('')),
  customFieldValues: z.record(z.string()).optional(),
})
export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>

export const jobLevelSchema = z.object({
  levelName: z.string().min(1, 'Tên cấp bậc là bắt buộc').max(100),
  levelOrder: z.coerce.number().int().min(1, 'Thứ tự phải ≥ 1'),
  defaultScopeType: z.enum(['Own', 'Team', 'Department', 'All']),
  description: z.string().max(500).optional(),
})
export type JobLevelFormValues = z.infer<typeof jobLevelSchema>

export const employeeTypeSchema = z.object({
  name: z.string().min(1, 'Tên loại nhân sự là bắt buộc').max(100),
  code: z.string().min(1, 'Mã là bắt buộc').max(50).regex(/^[A-Z0-9_-]+$/, 'Mã chỉ gồm chữ hoa, số, gạch dưới, gạch ngang'),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
})
export type EmployeeTypeFormValues = z.infer<typeof employeeTypeSchema>
