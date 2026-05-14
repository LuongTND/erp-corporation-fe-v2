import { api } from '@/lib/axios'
import { API_ROUTES } from '@/config/api-routes'
import type {
  TaskStatusDto,
  CreateTaskStatusRequest,
  UpdateTaskStatusRequest,
  TaskStatusQueryParams,
  PagedResponse,
} from '../types/task.types'

export const taskStatusService = {
  getAll: async (params?: TaskStatusQueryParams) => {
    const response = await api.get<PagedResponse<TaskStatusDto>>(API_ROUTES.TASK_STATUSES.GET_ALL, {
      params: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        search: params?.search,
        isActive: params?.isActive,
      },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<TaskStatusDto>(API_ROUTES.TASK_STATUSES.GET_BY_ID(id))
    return response.data
  },

  getByCode: async (code: string) => {
    const response = await api.get<TaskStatusDto>(API_ROUTES.TASK_STATUSES.GET_BY_CODE(code))
    return response.data
  },

  create: async (data: CreateTaskStatusRequest) => {
    const response = await api.post<TaskStatusDto>(API_ROUTES.TASK_STATUSES.CREATE, data)
    return response.data
  },

  update: async (id: string, data: UpdateTaskStatusRequest) => {
    const response = await api.put<TaskStatusDto>(API_ROUTES.TASK_STATUSES.UPDATE(id), data)
    return response.data
  },

  toggleActive: async (id: string) => {
    const response = await api.post<TaskStatusDto>(API_ROUTES.TASK_STATUSES.TOGGLE_ACTIVE(id))
    return response.data
  },

  getAllForDropdown: async () => {
    const response = await api.get<TaskStatusDto[]>(API_ROUTES.TASK_STATUSES.GET_ALL_FOR_DROPDOWN)
    return response.data
  },
}
