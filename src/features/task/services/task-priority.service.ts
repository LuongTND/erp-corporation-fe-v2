import { api } from '@/lib/axios'
import { API_ROUTES } from '@/config/api-routes'
import type {
  TaskPriorityDto,
  CreatePriorityRequest,
  UpdatePriorityRequest,
  TaskPriorityQueryParams,
} from '../types/priority.types'
import type { PagedResponse } from '../types/task.types'

export const taskPriorityService = {
  getAll: async (params?: TaskPriorityQueryParams) => {
    const response = await api.get<PagedResponse<TaskPriorityDto>>(
      API_ROUTES.TASK_PRIORITIES.GET_ALL,
      {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          search: params?.search,
          isActive: params?.isActive,
        },
      },
    )
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<TaskPriorityDto>(API_ROUTES.TASK_PRIORITIES.GET_BY_ID(id))
    return response.data
  },

  getByCode: async (code: string) => {
    const response = await api.get<TaskPriorityDto>(API_ROUTES.TASK_PRIORITIES.GET_BY_CODE(code))
    return response.data
  },

  create: async (data: CreatePriorityRequest) => {
    const response = await api.post<TaskPriorityDto>(API_ROUTES.TASK_PRIORITIES.CREATE, data)
    return response.data
  },

  update: async (id: string, data: UpdatePriorityRequest) => {
    const response = await api.put<TaskPriorityDto>(API_ROUTES.TASK_PRIORITIES.UPDATE(id), data)
    return response.data
  },

  toggleActive: async (id: string) => {
    const response = await api.post<TaskPriorityDto>(API_ROUTES.TASK_PRIORITIES.TOGGLE_ACTIVE(id))
    return response.data
  },

  getAllForDropdown: async () => {
    const response = await api.get<TaskPriorityDto[]>(
      API_ROUTES.TASK_PRIORITIES.GET_ALL_FOR_DROPDOWN,
    )
    return response.data
  },
}
