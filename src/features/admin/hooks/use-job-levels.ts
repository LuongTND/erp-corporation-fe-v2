import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { jobLevelsService } from '../services/job-levels.service'
import type { ListParams } from '../types/admin.types'

const KEY = 'job-levels'

export function useJobLevels(params?: ListParams) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => jobLevelsService.list(params),
  })
}

export function useCreateJobLevel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: jobLevelsService.create,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Job level created') },
    onError: (error) => { console.error(error); toast.error('Failed to create job level') },
  })
}

export function useUpdateJobLevel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof jobLevelsService.update>[1] }) =>
      jobLevelsService.update(id, data),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Job level updated') },
    onError: (error) => { console.error(error); toast.error('Failed to update job level') },
  })
}

export function useDeleteJobLevel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: jobLevelsService.delete,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Job level deleted') },
    onError: (error) => { console.error(error); toast.error('Failed to delete job level') },
  })
}
