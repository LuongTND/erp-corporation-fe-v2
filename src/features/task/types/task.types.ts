// ==========================================
// 1. COMMON / SHARED TYPES
// ==========================================

export type Guid = string
export type ISODateString = string

export interface DictionaryItem {
  id: Guid
  code: string
  name: string
  color?: string
  isActive: boolean
}

export interface PagedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
}

export interface BaseQueryParams {
  page?: number
  pageSize?: number
  search?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: string
}

// ==========================================
// 2. TASK STATUS TYPES
// ==========================================

export interface TaskStatusDto {
  id: Guid
  code: string
  name: string
  color: string
  order: number
  isSystem: boolean
  isActive: boolean
  createdAtUtc: ISODateString
  modifiedAtUtc?: ISODateString
}

export interface CreateTaskStatusRequest {
  code: string
  name: string
  color?: string
  order: number
  isSystem?: boolean
  isActive?: boolean
}

export type UpdateTaskStatusRequest = Partial<CreateTaskStatusRequest>

// ==========================================
// 3. TASK ITEM TYPES (DOMAIN / API)
// ==========================================

export interface TaskItemDto {
  id: Guid
  code: string
  title: string
  description?: string

  projectId?: Guid
  projectName?: string
  departmentId?: Guid
  departmentName?: string

  creatorId: Guid
  creatorName?: string

  statusId: Guid
  statusName?: string
  priorityId: Guid
  priorityName?: string

  startDate?: ISODateString
  dueDate?: ISODateString
  completedAt?: ISODateString
  estimatedHours?: number
  actualHours?: number

  isActive: boolean
  createdAtUtc: ISODateString
  modifiedAtUtc?: ISODateString
}

export interface TaskItemDetailDto extends TaskItemDto {
  assignmentCount: number
  commentCount: number
  attachmentCount: number
}

export interface CreateTaskRequest {
  code: string
  title: string
  description?: string
  projectId?: Guid
  departmentId?: Guid
  creatorId?: Guid
  statusId: Guid
  priorityId: Guid
  startDate?: ISODateString
  dueDate?: ISODateString
  estimatedHours?: number
  isActive?: boolean
}

export interface UpdateTaskRequest {
  code?: string
  title?: string
  description?: string
  projectId?: Guid
  departmentId?: Guid
  statusId?: Guid
  priorityId?: Guid
  startDate?: ISODateString
  dueDate?: ISODateString
  estimatedHours?: number
  isActive?: boolean
}

export interface BulkCreateTaskRequest {
  tasks: CreateTaskRequest[]
}

export interface UpdateTaskItemStatusRequest {
  statusId: Guid
}

export interface UpdateTaskPriorityRequest {
  priorityId: Guid
}

export interface UpdateTaskProgressRequest {
  actualHours: number
}

export interface GetTasksQuery extends BaseQueryParams {
  projectId?: Guid
  departmentId?: Guid
  creatorId?: Guid
  statusId?: Guid
  priorityId?: Guid
  startDateFrom?: ISODateString
  startDateTo?: ISODateString
  dueDateFrom?: ISODateString
  dueDateTo?: ISODateString
}

// ==========================================
// 4. UI / KANBAN TYPES
// ==========================================

export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface CreateTaskPayload {
  title: string
  status?: TaskStatus
  priority?: TaskPriority
  description?: string
  dueDate?: ISODateString | Date
  startDate?: ISODateString | Date
  estimatedHours?: number
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>
export type TaskQueryParams = GetTasksQuery & { assignedToId?: Guid }

export type KanbanId = string | number

export interface KanbanColumn {
  id: KanbanId
  title: string
  color?: string
}

export interface KanbanTaskUI {
  id: KanbanId
  columnId: KanbanId
  title: string
  image?: string
  tag?: string
  code?: string
  priorityId?: Guid

  priority?: TaskPriority
  assigneeAvatar?: string
  commentsCount?: number
  attachmentsCount?: number
  dueDate?: ISODateString
}

// ==========================================
// ALIASES
// ==========================================

export type Id = KanbanId
export type Column = KanbanColumn

export interface Task extends KanbanTaskUI {
  status?: TaskStatus
  assignee?: string
  comments?: number
  files?: number
  date?: string
  startDate?: ISODateString
  description?: string
  progress?: number
}

export type TaskStatusQueryParams = BaseQueryParams
export type TaskItem = TaskItemDto
