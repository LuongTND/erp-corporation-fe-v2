/**
 * useTasks Hook
 * Custom hook để fetch & manage tasks
 * Hỗ trợ caching, filtering, sorting
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { taskService } from '../services/task.service'
import type { CreateTaskPayload, TaskQueryParams, UpdateTaskPayload } from '../types/task.types'

export function useTasks(params?: TaskQueryParams) {
  const queryClient = useQueryClient()

  // Fetch tasks
  const tasksQuery = useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskService.getTasks(params),
    staleTime: 1000 * 60, // 1 minute
  })

  // Create task
  const createMutation = useMutation({
    mutationFn: (data: CreateTaskPayload) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // Update task
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskPayload }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // Delete task
  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return {
    tasks: tasksQuery.data?.data.data ?? [],
    total: tasksQuery.data?.data.total ?? 0,
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    createTask: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTask: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTask: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}

// Hook để get my tasks
export function useMyTasks(params?: Omit<TaskQueryParams, 'assignedToId'>) {
  return useQuery({
    queryKey: ['my-tasks', params],
    queryFn: () => taskService.getMyTasks(params),
    staleTime: 1000 * 60,
  })
}
