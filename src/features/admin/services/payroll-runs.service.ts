import { apiCall } from '@/lib/api'
import type {
  CreatePayrollRunPayload,
  PayrollRunDetailResponse,
  PayrollRunResponse,
  UpdatePayrollEntryPayload,
} from '../types/payroll-run.types'

export const payrollRunsService = {
  list: (params?: { year?: number }) =>
    apiCall.get<PayrollRunResponse[]>('/api/hrm/payroll-runs', { params }),

  getById: (id: string) =>
    apiCall.get<PayrollRunDetailResponse>(`/api/hrm/payroll-runs/${id}`),

  create: (data: CreatePayrollRunPayload) =>
    apiCall.post<string>('/api/hrm/payroll-runs', data),

  updateEntry: (entryId: string, data: UpdatePayrollEntryPayload) =>
    apiCall.put<void>(`/api/hrm/payroll-runs/entries/${entryId}`, data),

  finalize: (id: string) =>
    apiCall.post<void>(`/api/hrm/payroll-runs/${id}/finalize`, {}),
}
