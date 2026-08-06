import { apiCall } from '@/lib/api'
import type { UserDetailDto, UpdateEmployeePayload } from '../types/user-detail.types'

export const employeesService = {
  getDetail: (userId: string) =>
    apiCall.get<UserDetailDto>(`/api/users/${userId}`),

  update: (userId: string, data: UpdateEmployeePayload) =>
    apiCall.put<void>(`/api/users/${userId}`, data),

  upsertCustomFields: (userId: string, values: { definitionId: string; value: string }[]) =>
    apiCall.patch<void>(`/api/users/${userId}/custom-fields`, values),
}
