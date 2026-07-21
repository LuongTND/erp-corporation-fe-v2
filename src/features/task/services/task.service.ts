import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type {
  CreatePriorityRequest,
  TaskPriorityDto,
  UpdatePriorityRequest,
} from '../types/priority.types'
import type {
  ActivityAction,
  ActivityEntry,
  CreateTaskRequest,
  CreateTaskStatusRequest,
  CustomPropDef,
  CustomPropValue,
  DependencyType,
  TaskAttachment,
  TaskDependenciesView,
  TaskItemDto,
  TaskStatusDto,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from '../types/task.types'

type PagedResult<T> = { items: T[]; page: number; pageSize: number; totalCount: number }
type PageParams = { page?: number; pageSize?: number }

// ─── Task Status ──────────────────────────────────────────────────────────────

export const taskStatusService = {
  getAllForDropdown: () =>
    apiCall.get<TaskStatusDto[]>(API_ROUTES.TASK_STATUSES.GET_ALL_FOR_DROPDOWN),

  getAll: (params?: PageParams) =>
    apiCall.get<PagedResult<TaskStatusDto>>(API_ROUTES.TASK_STATUSES.GET_ALL, { params }),

  getById: (id: string) =>
    apiCall.get<TaskStatusDto>(API_ROUTES.TASK_STATUSES.GET_BY_ID(id)),

  getByCode: (code: string) =>
    apiCall.get<TaskStatusDto>(API_ROUTES.TASK_STATUSES.GET_BY_CODE(code)),

  create: (data: CreateTaskStatusRequest) =>
    apiCall.post<TaskStatusDto>(API_ROUTES.TASK_STATUSES.CREATE, data),

  update: (id: string, data: UpdateTaskStatusRequest) =>
    apiCall.put<TaskStatusDto>(API_ROUTES.TASK_STATUSES.UPDATE(id), data),

  toggleActive: (id: string) =>
    apiCall.patch<TaskStatusDto>(API_ROUTES.TASK_STATUSES.TOGGLE_ACTIVE(id)),
}

// ─── Task Priority ────────────────────────────────────────────────────────────

export const taskPriorityService = {
  getAllForDropdown: () =>
    apiCall.get<TaskPriorityDto[]>(API_ROUTES.TASK_PRIORITIES.GET_ALL_FOR_DROPDOWN),

  getAll: (params?: PageParams) =>
    apiCall.get<PagedResult<TaskPriorityDto>>(API_ROUTES.TASK_PRIORITIES.GET_ALL, { params }),

  getById: (id: string) =>
    apiCall.get<TaskPriorityDto>(API_ROUTES.TASK_PRIORITIES.GET_BY_ID(id)),

  getByCode: (code: string) =>
    apiCall.get<TaskPriorityDto>(API_ROUTES.TASK_PRIORITIES.GET_BY_CODE(code)),

  create: (data: CreatePriorityRequest) =>
    apiCall.post<TaskPriorityDto>(API_ROUTES.TASK_PRIORITIES.CREATE, data),

  update: (id: string, data: UpdatePriorityRequest) =>
    apiCall.put<TaskPriorityDto>(API_ROUTES.TASK_PRIORITIES.UPDATE(id), data),

  toggleActive: (id: string) =>
    apiCall.patch<TaskPriorityDto>(API_ROUTES.TASK_PRIORITIES.TOGGLE_ACTIVE(id)),
}

// ─── Task Item ────────────────────────────────────────────────────────────────

export const taskItemService = {
  getAll: (params?: PageParams) =>
    apiCall.get<PagedResult<TaskItemDto>>(API_ROUTES.TASK_ITEMS.GET_ALL, { params }),

  getById: (id: string) =>
    apiCall.get<TaskItemDto>(API_ROUTES.TASK_ITEMS.GET_BY_ID(id)),

  getByCode: (code: string) =>
    apiCall.get<TaskItemDto>(API_ROUTES.TASK_ITEMS.GET_BY_CODE(code)),

  getTasksByStatusId: (statusId: string, params?: PageParams) =>
    apiCall.get<PagedResult<TaskItemDto>>(API_ROUTES.TASK_ITEMS.GET_ALL, {
      params: { statusId, ...params },
    }),

  getMyTasks: (employeeId: string, params?: PageParams) =>
    apiCall.get<PagedResult<TaskItemDto>>(API_ROUTES.TASK_ITEMS.GET_MY_TASKS(employeeId), {
      params,
    }),

  getByProjectId: (projectId: string, params?: PageParams) =>
    apiCall.get<PagedResult<TaskItemDto>>(API_ROUTES.TASK_ITEMS.GET_BY_PROJECT(projectId), {
      params,
    }),

  getByDepartmentId: (departmentId: string, params?: PageParams) =>
    apiCall.get<PagedResult<TaskItemDto>>(
      API_ROUTES.TASK_ITEMS.GET_BY_DEPARTMENT(departmentId),
      { params },
    ),

  getOverdueTasks: (params?: PageParams) =>
    apiCall.get<PagedResult<TaskItemDto>>(API_ROUTES.TASK_ITEMS.GET_OVERDUE, { params }),

  getUpcomingTasks: (params?: PageParams) =>
    apiCall.get<PagedResult<TaskItemDto>>(API_ROUTES.TASK_ITEMS.GET_UPCOMING, { params }),

  create: (data: CreateTaskRequest) =>
    apiCall.post<TaskItemDto>(API_ROUTES.TASK_ITEMS.CREATE, data),

  update: (id: string, data: UpdateTaskRequest) =>
    apiCall.put<TaskItemDto>(API_ROUTES.TASK_ITEMS.UPDATE(id), data),

  toggleActive: (id: string) =>
    apiCall.patch<TaskItemDto>(API_ROUTES.TASK_ITEMS.TOGGLE_ACTIVE(id)),

  updateStatus: (id: string, data: { statusId: string }) =>
    apiCall.patch<TaskItemDto>(API_ROUTES.TASK_ITEMS.UPDATE_STATUS(id), data),

  updatePriority: (id: string, data: { priorityId: string }) =>
    apiCall.patch<TaskItemDto>(API_ROUTES.TASK_ITEMS.UPDATE_PRIORITY(id), data),

  updateProgress: (id: string, data: { actualHours: number }) =>
    apiCall.patch<TaskItemDto>(API_ROUTES.TASK_ITEMS.UPDATE_PROGRESS(id), data),

  complete: (id: string) =>
    apiCall.patch<TaskItemDto>(API_ROUTES.TASK_ITEMS.COMPLETE(id)),

  duplicate: (id: string) =>
    apiCall.post<TaskItemDto>(API_ROUTES.TASK_ITEMS.DUPLICATE(id)),

  bulkCreate: (data: CreateTaskRequest[]) =>
    apiCall.post<TaskItemDto[]>(API_ROUTES.TASK_ITEMS.BULK_CREATE, data),
}

// ─── Attachment ───────────────────────────────────────────────────────────────

const TASK_ATTACHMENTS = (id: string) => `/api/tasks/${id}/attachments`

export const taskAttachmentService = {
  getByTaskId: (taskId: string) =>
    apiCall.get<TaskAttachment[]>(TASK_ATTACHMENTS(taskId)),

  upload: (taskId: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiCall.post<TaskAttachment>(TASK_ATTACHMENTS(taskId), form)
  },

  delete: (taskId: string, attachmentId: string) =>
    apiCall.delete<void>(`${TASK_ATTACHMENTS(taskId)}/${attachmentId}`),
}

// ─── Dependency ───────────────────────────────────────────────────────────────

const TASK_DEPS = (id: string) => `/api/tasks/${id}/dependencies`

export const taskDependencyService = {
  getByTaskId: (taskId: string) =>
    apiCall.get<TaskDependenciesView>(TASK_DEPS(taskId)),

  add: (fromTaskId: string, toTaskId: string, type: DependencyType) =>
    apiCall.post(TASK_DEPS(fromTaskId), { toTaskId, type }),

  removeByTaskIds: (fromTaskId: string, toTaskId: string, type: DependencyType) =>
    apiCall.delete(`${TASK_DEPS(fromTaskId)}/${toTaskId}`, { params: { type } }),
}

// ─── Activity ─────────────────────────────────────────────────────────────────

const TASK_ACTIVITIES = (id: string) => `/api/tasks/${id}/activities`

export const taskActivityService = {
  getByTaskId: (taskId: string) =>
    apiCall.get<ActivityEntry[]>(TASK_ACTIVITIES(taskId)),

  add: (
    taskId: string,
    action: ActivityAction,
    userId: string,
    userName: string,
    meta?: ActivityEntry['meta'],
  ) => apiCall.post<ActivityEntry>(TASK_ACTIVITIES(taskId), { action, userId, userName, meta }),
}

// ─── CSV helpers (re-exported from mock for offline/dev use) ─────────────────
export { exportTasksToCSV, importTasksFromCSV } from '../mocks/task.mock'

// ─── Custom Property ──────────────────────────────────────────────────────────

export const customPropertyService = {
  getDefs: () =>
    apiCall.get<CustomPropDef[]>('/api/tasks/custom-properties'),

  createDef: (def: Omit<CustomPropDef, 'id'>) =>
    apiCall.post<CustomPropDef>('/api/tasks/custom-properties', def),

  deleteDef: (id: string) =>
    apiCall.delete<void>(`/api/tasks/custom-properties/${id}`),

  getValues: (taskId: string) =>
    apiCall.get<CustomPropValue[]>(`/api/tasks/${taskId}/custom-properties`),

  setValue: (taskId: string, defId: string, value: string | number | boolean) =>
    apiCall.put<void>(`/api/tasks/${taskId}/custom-properties`, { defId, value }),
}
