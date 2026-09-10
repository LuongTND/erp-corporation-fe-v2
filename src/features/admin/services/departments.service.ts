import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type {
  AddBulkDepartmentMembersPayload,
  AddDepartmentMemberPayload,
  DepartmentMemberResponse,
  DepartmentResponse,
  DepartmentTreeResponse,
  ListParams,
  QueryResult,
  UpdateDepartmentMemberPayload,
} from '../types/admin.types'

export const departmentsService = {
  list: (params?: ListParams) =>
    apiCall.get<QueryResult<DepartmentResponse>>(API_ROUTES.DEPARTMENTS.BASE, { params }),

  create: (data: { departmentName: string; departmentCode: string; parentDepartmentId?: string; managerId?: string }) =>
    apiCall.post<string>(API_ROUTES.DEPARTMENTS.BASE, data),

  update: (id: string, data: { departmentName: string; departmentCode: string; parentDepartmentId?: string; managerId?: string; isActive: boolean }) =>
    apiCall.put<void>(API_ROUTES.DEPARTMENTS.GET_BY_ID(id), data),

  delete: (id: string) =>
    apiCall.delete<void>(API_ROUTES.DEPARTMENTS.GET_BY_ID(id)),

  tree: () =>
    apiCall.get<DepartmentTreeResponse[]>(API_ROUTES.DEPARTMENTS.TREE),

  getMembers: (departmentId: string) =>
    apiCall.get<DepartmentMemberResponse[]>(API_ROUTES.DEPARTMENTS.MEMBERS(departmentId)),

  addMember: (userId: string, data: AddDepartmentMemberPayload) =>
    apiCall.post<string>(API_ROUTES.USERS.DEPARTMENTS(userId), data),

  addMembers: (departmentId: string, data: AddBulkDepartmentMembersPayload) =>
    apiCall.post<number>(API_ROUTES.DEPARTMENTS.MEMBERS_BULK(departmentId), data),

  updateMember: (userId: string, departmentId: string, data: UpdateDepartmentMemberPayload) =>
    apiCall.put<void>(API_ROUTES.USERS.DEPARTMENT(userId, departmentId), data),

  removeMember: (userId: string, departmentId: string) =>
    apiCall.delete<void>(API_ROUTES.USERS.DEPARTMENT(userId, departmentId)),
}
