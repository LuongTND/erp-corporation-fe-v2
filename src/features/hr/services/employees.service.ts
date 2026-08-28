import { apiCall } from '@/lib/api'
import { api } from '@/lib/axios'
import { API_ROUTES } from '@/config/api-routes'
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
    apiCall.get<EmployeeDocumentResponse[]>(API_ROUTES.EMPLOYEE_DOCUMENTS.LIST(userId)),

  uploadDocument: (userId: string, payload: UploadDocumentPayload) => {
    const form = new FormData()
    form.append('file', payload.file)
    form.append('category', payload.category)
    if (payload.customName) form.append('customName', payload.customName)
    if (payload.issuedDate) form.append('issuedDate', payload.issuedDate)
    if (payload.expiryDate) form.append('expiryDate', payload.expiryDate)
    if (payload.notes) form.append('notes', payload.notes)
    if (payload.isVisibleToEmployee !== undefined) form.append('isVisibleToEmployee', String(payload.isVisibleToEmployee))
    return apiCall.post<EmployeeDocumentResponse>(API_ROUTES.EMPLOYEE_DOCUMENTS.UPLOAD(userId), form, {
      headers: { 'Content-Type': undefined },
    })
  },

  deleteDocument: (userId: string, documentId: string) =>
    apiCall.delete<void>(API_ROUTES.EMPLOYEE_DOCUMENTS.DELETE(userId, documentId)),

  toggleDocumentVisibility: (userId: string, documentId: string, isVisibleToEmployee: boolean) =>
    apiCall.patch<void>(API_ROUTES.EMPLOYEE_DOCUMENTS.TOGGLE_VISIBILITY(userId, documentId), JSON.stringify(isVisibleToEmployee), {
      headers: { 'Content-Type': 'application/json' },
    }),

  getMyDocuments: () =>
    apiCall.get<EmployeeDocumentResponse[]>(API_ROUTES.MY_DOCUMENTS.LIST),

  uploadMyDocument: (payload: UploadDocumentPayload) => {
    const form = new FormData()
    form.append('file', payload.file)
    form.append('category', payload.category)
    if (payload.customName) form.append('customName', payload.customName)
    if (payload.issuedDate) form.append('issuedDate', payload.issuedDate)
    if (payload.expiryDate) form.append('expiryDate', payload.expiryDate)
    if (payload.notes) form.append('notes', payload.notes)
    return apiCall.post<EmployeeDocumentResponse>(API_ROUTES.MY_DOCUMENTS.UPLOAD, form, {
      headers: { 'Content-Type': undefined },
    })
  },

  deleteMyDocument: (documentId: string) =>
    apiCall.delete<void>(API_ROUTES.MY_DOCUMENTS.DELETE(documentId)),

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

  exportUsers: async (search?: string, status?: string, departmentId?: string, labelId?: string, storeId?: string, regionId?: string): Promise<Blob> => {
    const res = await api.get('/api/users/export', {
      params: { ...(search ? { search } : {}), ...(status ? { status } : {}), ...(departmentId ? { departmentId } : {}), ...(labelId ? { labelId } : {}), ...(storeId ? { storeId } : {}), ...(regionId && !storeId ? { regionId } : {}) },
      responseType: 'blob',
    })
    return res.data
  },
}
