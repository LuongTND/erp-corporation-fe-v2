import { z } from 'zod'

const fileRequired = z
  .any()
  .refine(
    (val) => (val instanceof File && val.size > 0) || (val instanceof FileList && val.length > 0),
    'Vui lòng chọn file hợp đồng',
  )

export const createContractSchema = z.object({
  type: z.string().min(1, 'Loại hợp đồng là bắt buộc'),
  startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  endDate: z.string().optional(),
  salary: z.number({ invalid_type_error: 'Lương là bắt buộc' }).min(0, 'Lương phải >= 0'),
  salaryForSocialInsurance: z.number().min(0).optional().or(z.nan().transform(() => undefined)),
  positionTitle: z.string().max(200).optional(),
  signedDate: z.string().optional(),
  templateId: z.string().uuid().optional().or(z.literal('')),
  file: fileRequired,
})
export type CreateContractFormValues = z.infer<typeof createContractSchema>

export const renewContractSchema = z.object({
  type: z.string().min(1, 'Loại hợp đồng là bắt buộc'),
  startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  endDate: z.string().optional(),
  salary: z.number({ invalid_type_error: 'Lương là bắt buộc' }).min(0),
  salaryForSocialInsurance: z.number().min(0).optional().or(z.nan().transform(() => undefined)),
  positionTitle: z.string().max(200).optional(),
  signedDate: z.string().optional(),
  file: fileRequired,
})
export type RenewContractFormValues = z.infer<typeof renewContractSchema>
