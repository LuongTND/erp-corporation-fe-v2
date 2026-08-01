import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { departmentsService } from '../services/departments.service'
import type { ListParams } from '../types/admin.types'

const KEY = 'departments'

export function useDepartments(params?: ListParams) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => departmentsService.list(params),
  })
}

export function useCreateDepartment() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: departmentsService.create,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Department created') },
    onError: (error) => { console.error(error); toast.error('Failed to create department') },
  })
}

export function useUpdateDepartment() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof departmentsService.update>[1] }) =>
      departmentsService.update(id, data),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Department updated') },
    onError: (error) => { console.error(error); toast.error('Failed to update department') },
  })
}

export function useDeleteDepartment() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: departmentsService.delete,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Department deleted') },
    onError: (error) => { console.error(error); toast.error('Failed to delete department') },
  })
}
