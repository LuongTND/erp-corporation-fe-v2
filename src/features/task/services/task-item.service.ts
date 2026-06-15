import { api } from '@/lib/axios'
import { API_ROUTES } from '@/config/api-routes'
import type {
  TaskItemDto,
  TaskItemDetailDto,
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksQuery,
  UpdateTaskItemStatusRequest,
  UpdateTaskPriorityRequest,
  UpdateTaskProgressRequest,
  BulkCreateTaskRequest,
  PagedResponse,
} from '../types/task.types'
import type { SortOption } from '../types/toolbar.types'

const mapSortOptionToBackend = (sortOption?: SortOption): string => {
  switch (sortOption) {
    case 'CreatedAtUtc':
      return 'createdat'
    case 'Title':
      return 'title'
    case 'DueDate':
      return 'duedate'
    default:
      return 'createdat'
  }
}

const buildTasksParams = (query?: GetTasksQuery, overrides?: Partial<GetTasksQuery>) => ({
  page: overrides?.page ?? query?.page ?? 1,
  pageSize: overrides?.pageSize ?? query?.pageSize ?? 10,
  search: query?.search,
  isActive: query?.isActive,
  projectId: query?.projectId,
  departmentId: query?.departmentId,
  creatorId: query?.creatorId,
  statusId: overrides?.statusId ?? query?.statusId,
  priorityId: query?.priorityId,
  startDateFrom: query?.startDateFrom,
  startDateTo: query?.startDateTo,
  dueDateFrom: query?.dueDateFrom,
  dueDateTo: query?.dueDateTo,
  sortBy: overrides?.sortBy
    ? mapSortOptionToBackend(overrides.sortBy as SortOption)
    : query?.sortBy
      ? mapSortOptionToBackend(query.sortBy as SortOption)
      : 'createdat',
  sortOrder: overrides?.sortOrder ?? query?.sortOrder ?? 'desc',
})

export const taskItemService = {
  getTasksByStatusId: async (statusId: string, query?: Omit<GetTasksQuery, 'statusId'>) => {
    const startPage = query?.page ?? 1
    const pageSize = query?.pageSize ?? 50
    const allItems: TaskItemDto[] = []
    let totalCount = 0
    let page = startPage

    while (true) {
      const response = await api.get<PagedResponse<TaskItemDto>>(API_ROUTES.TASK_ITEMS.GET_ALL, {
        params: buildTasksParams(query, { statusId, page, pageSize }),
      })

      if (page === startPage) totalCount = response.data.totalCount
      allItems.push(...response.data.items)

      const isLastPage =
        response.data.items.length < pageSize || allItems.length >= totalCount
      if (isLastPage) break
      page += 1
    }

    return {
      items: allItems,
      page: startPage,
      pageSize,
      totalCount: totalCount || allItems.length,
    }
  },

  getAll: async (query?: GetTasksQuery) => {
    const response = await api.get<PagedResponse<TaskItemDto>>(API_ROUTES.TASK_ITEMS.GET_ALL, {
      params: buildTasksParams(query),
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<TaskItemDetailDto>(API_ROUTES.TASK_ITEMS.GET_BY_ID(id))
    return response.data
  },

  getByCode: async (code: string) => {
    const response = await api.get<TaskItemDto>(API_ROUTES.TASK_ITEMS.GET_BY_CODE(code))
    return response.data
  },

  create: async (data: CreateTaskRequest) => {
    const response = await api.post<TaskItemDto>(API_ROUTES.TASK_ITEMS.CREATE, data)
    return response.data
  },

  update: async (id: string, data: UpdateTaskRequest) => {
    const response = await api.put<TaskItemDto>(API_ROUTES.TASK_ITEMS.UPDATE(id), data)
    return response.data
  },

  toggleActive: async (id: string) => {
    const response = await api.post<TaskItemDto>(API_ROUTES.TASK_ITEMS.TOGGLE_ACTIVE(id))
    return response.data
  },

  updateStatus: async (id: string, data: UpdateTaskItemStatusRequest) => {
    const response = await api.put<TaskItemDto>(API_ROUTES.TASK_ITEMS.UPDATE_STATUS(id), data)
    return response.data
  },

  updatePriority: async (id: string, data: UpdateTaskPriorityRequest) => {
    const response = await api.put<TaskItemDto>(API_ROUTES.TASK_ITEMS.UPDATE_PRIORITY(id), data)
    return response.data
  },

  updateProgress: async (id: string, data: UpdateTaskProgressRequest) => {
    const response = await api.put<TaskItemDto>(API_ROUTES.TASK_ITEMS.UPDATE_PROGRESS(id), data)
    return response.data
  },

  complete: async (id: string) => {
    const response = await api.post<TaskItemDto>(API_ROUTES.TASK_ITEMS.COMPLETE(id))
    return response.data
  },

  getMyTasks: async (employeeId: string, query?: GetTasksQuery) => {
    const response = await api.get<PagedResponse<TaskItemDto>>(
      API_ROUTES.TASK_ITEMS.GET_MY_TASKS(employeeId),
      { params: buildTasksParams(query) },
    )
    return response.data
  },

  getByProjectId: async (projectId: string, query?: GetTasksQuery) => {
    const response = await api.get<PagedResponse<TaskItemDto>>(
      API_ROUTES.TASK_ITEMS.GET_BY_PROJECT(projectId),
      { params: buildTasksParams(query) },
    )
    return response.data
  },

  getByDepartmentId: async (departmentId: string, query?: GetTasksQuery) => {
    const response = await api.get<PagedResponse<TaskItemDto>>(
      API_ROUTES.TASK_ITEMS.GET_BY_DEPARTMENT(departmentId),
      { params: buildTasksParams(query) },
    )
    return response.data
  },

  getOverdueTasks: async (query?: GetTasksQuery) => {
    const response = await api.get<PagedResponse<TaskItemDto>>(API_ROUTES.TASK_ITEMS.GET_OVERDUE, {
      params: buildTasksParams(query, { sortBy: 'DueDate', sortOrder: 'asc' }),
    })
    return response.data
  },

  getUpcomingTasks: async (query?: GetTasksQuery) => {
    const response = await api.get<PagedResponse<TaskItemDto>>(
      API_ROUTES.TASK_ITEMS.GET_UPCOMING,
      { params: buildTasksParams(query, { sortBy: 'DueDate', sortOrder: 'asc' }) },
    )
    return response.data
  },

  bulkCreate: async (data: BulkCreateTaskRequest) => {
    const response = await api.post<TaskItemDto[]>(API_ROUTES.TASK_ITEMS.BULK_CREATE, data)
    return response.data
  },

  duplicate: async (id: string) => {
    const response = await api.post<TaskItemDto>(API_ROUTES.TASK_ITEMS.DUPLICATE(id))
    return response.data
  },
}
