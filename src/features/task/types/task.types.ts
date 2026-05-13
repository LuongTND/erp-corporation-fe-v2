/**
 * Task Feature Types
 * Định nghĩa tất cả types liên quan đến task management
 */

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done' | 'cancelled'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo?: User
  createdBy: User
  dueDate?: Date
  startDate?: Date
  endDate?: Date
  estimatedHours?: number
  actualHours?: number
  progress: number // 0-100
  tags?: string[]
  attachments?: Attachment[]
  comments?: Comment[]
  createdAt: Date
  updatedAt: Date
  projectId?: string
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedBy: User
  uploadedAt: Date
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignedToId?: string
  dueDate?: Date
  estimatedHours?: number
  tags?: string[]
  projectId?: string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assignedToId?: string
  dueDate?: Date
  progress?: number
  actualHours?: number
  tags?: string[]
}

export interface TaskFilter {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assignedToId?: string
  createdById?: string
  dueDateFrom?: Date
  dueDateTo?: Date
  tags?: string[]
}

export interface TaskQueryParams extends TaskFilter {
  skip?: number
  take?: number
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'status'
  sortOrder?: 'asc' | 'desc'
}
