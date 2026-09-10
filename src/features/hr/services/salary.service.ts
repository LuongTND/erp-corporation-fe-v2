import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { SalaryRecord, SetSalaryPayload } from '../types/salary.types'

export const salaryService = {
  getCurrent: (userId: string) =>
    apiCall.get<SalaryRecord | null>(API_ROUTES.SALARY.CURRENT(userId)),

  getHistory: (userId: string) =>
    apiCall.get<SalaryRecord[]>(API_ROUTES.SALARY.HISTORY(userId)),

  set: (userId: string, data: SetSalaryPayload) =>
    apiCall.post<string>(API_ROUTES.SALARY.SET(userId), data),
}
