export type PriorityLevel = 1 | 2 | 3 | 4 | 5

export interface TaskPriorityDto {
  id: string
  name: string
  code: string
  level: PriorityLevel
  color: string
  isActive: boolean
  isSystem?: boolean
  createdAt?: string
  createdAtUtc?: string
  modifiedAtUtc?: string
}

export interface CreatePriorityRequest {
  name: string
  code: string
  level: PriorityLevel
  color: string
  isActive?: boolean
  isSystem?: boolean
}

export interface UpdatePriorityRequest {
  priorityId: string
  name?: string
  code?: string
  level?: PriorityLevel
  color?: string
  isActive?: boolean
}

export interface TaskPriorityQueryParams {
  page?: number
  pageSize?: number
  search?: string
  isActive?: boolean
}
