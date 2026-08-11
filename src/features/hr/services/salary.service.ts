import { apiCall } from '@/lib/api'
import type { SalaryRecord, SetSalaryPayload } from '../types/salary.types'

export const salaryService = {
  getCurrent: (userId: string) =>
    apiCall.get<SalaryRecord | null>(`/api/hrm/users/${userId}/salary/current`),

  getHistory: (userId: string) =>
    apiCall.get<SalaryRecord[]>(`/api/hrm/users/${userId}/salary/history`),

  set: (userId: string, data: SetSalaryPayload) =>
    apiCall.post<string>(`/api/hrm/users/${userId}/salary`, data),
}
