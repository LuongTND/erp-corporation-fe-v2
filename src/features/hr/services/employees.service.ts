import { apiCall } from '@/lib/api'
import { api } from '@/lib/axios'
import type { UserSummaryResponse } from '@/features/admin/types/admin.types'
import type { UserDetailDto, UpdateEmployeePayload } from '../types/user-detail.types'
import type { UserStatusHistoryItem } from '../types/user-status.types'
import type { UpdateUserStatusFormValues } from '../schemas/update-user-status.schema'
import type { EmployeeDocumentResponse, UploadDocumentPayload } from '../types/employee-document.types'
import type { WorkHistoryItem, WorkHistoryChangeType } from '../types/work-history.types'

export const employeesService = {
  getList: (search?: string, status?: string, departmentId?: string) =>
    apiCall.get<UserSummaryResponse[]>('/api/users', {
      params: {
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(departmentId ? { departmentId } : {}),
      },
    }),

  getDetail: (userId: string) =>
    apiCall.get<UserDetailDto>(`/api/users/${userId}`),

  update: (userId: string, data: UpdateEmployeePayload) =>
    apiCall.put<void>(`/api/users/${userId}`, data),

  upsertCustomFields: (userId: string, values: { definitionId: string; value: string }[]) =>
    apiCall.patch<void>(`/api/users/${userId}/custom-fields`, values),

  updateStatus: (userId: string, data: UpdateUserStatusFormValues) =>
    apiCall.patch<void>(`/api/users/${userId}/status`, data),

  getStatusHistory: (userId: string) =>
    apiCall.get<UserStatusHistoryItem[]>(`/api/users/${userId}/status-history`),

  getDocuments: (userId: string) =>
    apiCall.get<EmployeeDocumentResponse[]>(`/api/users/${userId}/documents`),

  uploadDocument: (userId: string, payload: UploadDocumentPayload) => {
    const form = new FormData()
    form.append('file', payload.file)
    form.append('category', payload.category)
    if (payload.customName) form.append('customName', payload.customName)
    if (payload.issuedDate) form.append('issuedDate', payload.issuedDate)
    if (payload.expiryDate) form.append('expiryDate', payload.expiryDate)
    if (payload.notes) form.append('notes', payload.notes)
    return apiCall.post<EmployeeDocumentResponse>(`/api/users/${userId}/documents`, form, {
      headers: { 'Content-Type': undefined },
    })
  },

  deleteDocument: (userId: string, documentId: string) =>
    apiCall.delete<void>(`/api/users/${userId}/documents/${documentId}`),

  uploadAvatar: (userId: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiCall.post<string>(`/api/users/${userId}/avatar`, form, {
      headers: { 'Content-Type': undefined },
    })
  },

  getWorkHistory: (userId: string, changeType?: WorkHistoryChangeType) =>
    apiCall.get<WorkHistoryItem[]>(`/api/users/${userId}/work-history`, {
      params: changeType ? { changeType } : {},
    }),

  lockEmployee: (userId: string, lock: boolean) =>
    apiCall.patch<void>(`/api/users/${userId}/lock`, { userId, lock }),

  exportUsers: async (search?: string, status?: string, departmentId?: string): Promise<Blob> => {
    const res = await api.get('/api/users/export', {
      params: { ...(search ? { search } : {}), ...(status ? { status } : {}), ...(departmentId ? { departmentId } : {}) },
      responseType: 'blob',
    })
    return res.data
  },
}
