import { apiCall } from '@/lib/api'
import type {
  ContractTemplateResponse,
  EmploymentContractResponse,
  ContractSalaryComparisonResponse,
  CreateContractPayload,
  RenewContractPayload,
  TerminateContractPayload,
} from '../types/admin.types'

export const contractsService = {
  list: (userId: string) =>
    apiCall.get<EmploymentContractResponse[]>(`/api/hrm/users/${userId}/contracts`),

  create: ({ userId, file, ...rest }: CreateContractPayload) => {
    const form = new FormData()
    form.append('type', rest.type)
    form.append('startDate', rest.startDate)
    if (rest.endDate) form.append('endDate', rest.endDate)
    form.append('salary', String(rest.salary))
    if (rest.salaryForSocialInsurance != null) form.append('salaryForSocialInsurance', String(rest.salaryForSocialInsurance))
    if (rest.positionTitle) form.append('positionTitle', rest.positionTitle)
    if (rest.signedDate) form.append('signedDate', rest.signedDate)
    if (rest.templateId) form.append('templateId', rest.templateId)
    form.append('file', file)
    return apiCall.post<string>(`/api/hrm/users/${userId}/contracts`, form)
  },

  renew: (userId: string, contractId: string, { file, ...rest }: RenewContractPayload) => {
    const form = new FormData()
    form.append('type', rest.type)
    form.append('startDate', rest.startDate)
    if (rest.endDate) form.append('endDate', rest.endDate)
    form.append('salary', String(rest.salary))
    if (rest.salaryForSocialInsurance != null) form.append('salaryForSocialInsurance', String(rest.salaryForSocialInsurance))
    if (rest.positionTitle) form.append('positionTitle', rest.positionTitle)
    if (rest.signedDate) form.append('signedDate', rest.signedDate)
    form.append('file', file)
    return apiCall.post<string>(`/api/hrm/users/${userId}/contracts/${contractId}/renew`, form)
  },

  terminate: (userId: string, contractId: string, data: TerminateContractPayload) =>
    apiCall.post<void>(`/api/hrm/users/${userId}/contracts/${contractId}/terminate`, data),

  salaryComparison: (userId: string) =>
    apiCall.get<ContractSalaryComparisonResponse>(`/api/hrm/users/${userId}/contracts/salary-comparison`),

  generate: async (userId: string, contractId: string, dynamicData: Record<string, string>): Promise<Blob> => {
    const { api } = await import('@/lib/axios')
    const res = await api.post(`/api/hrm/users/${userId}/contracts/${contractId}/generate`, { dynamicData }, { responseType: 'blob' })
    return res.data
  },

  listExpiring: (days = 30) =>
    apiCall.get<EmploymentContractResponse[]>('/api/hrm/contracts/expiring', { params: { days } }),
}

export const contractTemplatesService = {
  list: () =>
    apiCall.get<ContractTemplateResponse[]>('/api/hrm/contract-templates'),

  upload: (name: string, description: string | undefined, file: File) => {
    const form = new FormData()
    form.append('name', name)
    if (description) form.append('description', description)
    form.append('file', file)
    return apiCall.post<ContractTemplateResponse>('/api/hrm/contract-templates', form)
  },

  download: async (id: string): Promise<Blob> => {
    const { api } = await import('@/lib/axios')
    const res = await api.get(`/api/hrm/contract-templates/${id}/download`, { responseType: 'blob' })
    return res.data
  },


  delete: (id: string) =>
    apiCall.delete<void>(`/api/hrm/contract-templates/${id}`),
}
