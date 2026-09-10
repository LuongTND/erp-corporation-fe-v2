import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
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
    apiCall.get<EmploymentContractResponse[]>(API_ROUTES.CONTRACTS.LIST(userId)),

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
    return apiCall.post<string>(API_ROUTES.CONTRACTS.CREATE(userId), form)
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
    return apiCall.post<string>(API_ROUTES.CONTRACTS.RENEW(userId, contractId), form)
  },

  terminate: (userId: string, contractId: string, data: TerminateContractPayload) =>
    apiCall.post<void>(API_ROUTES.CONTRACTS.TERMINATE(userId, contractId), data),

  salaryComparison: (userId: string) =>
    apiCall.get<ContractSalaryComparisonResponse>(API_ROUTES.CONTRACTS.SALARY_COMPARISON(userId)),

  generate: async (userId: string, contractId: string, dynamicData: Record<string, string>): Promise<Blob> => {
    const { api } = await import('@/lib/axios')
    const res = await api.post(API_ROUTES.CONTRACTS.GENERATE(userId, contractId), { dynamicData }, { responseType: 'blob' })
    return res.data
  },

  listExpiring: (days = 30) =>
    apiCall.get<EmploymentContractResponse[]>(API_ROUTES.CONTRACTS.EXPIRING, { params: { days } }),
}

export const contractTemplatesService = {
  list: () =>
    apiCall.get<ContractTemplateResponse[]>(API_ROUTES.CONTRACT_TEMPLATES.BASE),

  upload: (name: string, description: string | undefined, file: File) => {
    const form = new FormData()
    form.append('name', name)
    if (description) form.append('description', description)
    form.append('file', file)
    return apiCall.post<ContractTemplateResponse>(API_ROUTES.CONTRACT_TEMPLATES.BASE, form)
  },

  download: async (id: string): Promise<Blob> => {
    const { api } = await import('@/lib/axios')
    const res = await api.get(API_ROUTES.CONTRACT_TEMPLATES.DOWNLOAD(id), { responseType: 'blob' })
    return res.data
  },

  delete: (id: string) =>
    apiCall.delete<void>(API_ROUTES.CONTRACT_TEMPLATES.GET_BY_ID(id)),
}
