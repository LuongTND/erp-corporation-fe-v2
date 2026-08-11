import { z } from 'zod'

export const editEmployeeSchema = z.object({
  fullName:               z.string().min(1, 'Họ và tên là bắt buộc').max(200, 'Tối đa 200 ký tự'),
  jobLevelId:             z.string().min(1, 'Cấp bậc là bắt buộc'),
  gender:                 z.string().optional(),
  dateOfBirth:            z.string().optional(),
  phoneNumber:            z.string().max(20, 'Tối đa 20 ký tự').optional(),
  permanentAddress:       z.string().optional(),
  currentAddress:         z.string().optional(),
  identityCardNumber:     z.string().max(20, 'Tối đa 20 ký tự').optional(),
  identityCardIssuedDate: z.string().optional(),
  identityCardIssuedPlace:z.string().optional(),
  passportNumber:         z.string().max(30, 'Tối đa 30 ký tự').optional(),
  passportExpiryDate:     z.string().optional(),
  dateOfJoin:             z.string().optional(),
  contractType:           z.string().optional(),
  taxCode:                z.string().max(20, 'Tối đa 20 ký tự').optional(),
  socialInsuranceCode:    z.string().max(30, 'Tối đa 30 ký tự').optional(),
  bankName:               z.string().max(100, 'Tối đa 100 ký tự').optional(),
  bankAccountNumber:      z.string().max(30, 'Tối đa 30 ký tự').optional(),
  bankBranch:             z.string().max(100, 'Tối đa 100 ký tự').optional(),
  customFieldValues:      z.record(z.string()).optional(),
})

export type EditEmployeeFormValues = z.infer<typeof editEmployeeSchema>
// ponytail: alias kept — EditEmployeeSheet imports both names
export type EditEmployeeEditEmployeeFormValues = EditEmployeeFormValues
