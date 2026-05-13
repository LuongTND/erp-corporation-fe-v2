/**
 * Task Service
 * Xử lý tất cả API calls liên quan đến task
 */

import { api as axios } from '@/lib/axios'
import type {
  CreateTaskPayload,
  Task,
  TaskQueryParams,
  UpdateTaskPayload,
} from '../types/task.types'

const API_BASE = '/api/tasks'

export const taskService = {
  // Get tasks with filters
  getTasks: (params?: TaskQueryParams) =>
    axios.get<{ data: Task[]; total: number }>(`${API_BASE}`, { params }),

  // Get single task
  getTaskById: (id: string) =>
    axios.get<Task>(`${API_BASE}/${id}`),

  // Create task
  createTask: (data: CreateTaskPayload) =>
    axios.post<Task>(`${API_BASE}`, data),

  // Update task
  updateTask: (id: string, data: UpdateTaskPayload) =>
    axios.put<Task>(`${API_BASE}/${id}`, data),

  // Delete task
  deleteTask: (id: string) =>
    axios.delete(`${API_BASE}/${id}`),

  // Bulk update status
  updateTaskStatus: (ids: string[], status: string) =>
    axios.patch(`${API_BASE}/bulk/status`, { ids, status }),

  // Get tasks by user
  getMyTasks: (params?: Omit<TaskQueryParams, 'assignedToId'>) =>
    axios.get<{ data: Task[]; total: number }>(`${API_BASE}/my`, { params }),

  // Get assigned tasks
  getAssignedTasks: (userId: string, params?: TaskQueryParams) =>
    axios.get<{ data: Task[]; total: number }>(`${API_BASE}/assigned/${userId}`, {
      params,
    }),

  // Add comment
  addComment: (taskId: string, content: string) =>
    axios.post(`${API_BASE}/${taskId}/comments`, { content }),

  // Add attachment
  uploadAttachment: (taskId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(`${API_BASE}/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
