import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { EmployeeTypeResponse, ListParams, QueryResult } from '../types/admin.types'

export const employeeTypesService = {
  list: (params?: ListParams) =>
    apiCall.get<QueryResult<EmployeeTypeResponse>>(API_ROUTES.EMPLOYEE_TYPES.BASE, { params }),

  create: (data: { name: string; code: string; description?: string }) =>
    apiCall.post<string>(API_ROUTES.EMPLOYEE_TYPES.BASE, data),

  update: (id: string, data: { name: string; code: string; description?: string; isActive: boolean }) =>
    apiCall.put<void>(API_ROUTES.EMPLOYEE_TYPES.GET_BY_ID(id), data),

  delete: (id: string) =>
    apiCall.delete<void>(API_ROUTES.EMPLOYEE_TYPES.GET_BY_ID(id)),

  assignToUser: (userId: string, employeeTypeId: string | null) =>
    apiCall.patch<void>(API_ROUTES.USERS.EMPLOYEE_TYPE(userId), { employeeTypeId }),
}
