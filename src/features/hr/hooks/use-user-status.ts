import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { employeesService } from '../services/employees.service'
import type { UpdateUserStatusFormValues } from '../schemas/update-user-status.schema'

export const userStatusKeys = {
  history: (userId: string) => ['user-status-history', userId] as const,
}

export function useUserStatusHistory(userId: string) {
  return useQuery({
    queryKey: userStatusKeys.history(userId),
    queryFn: () => employeesService.getStatusHistory(userId),
    enabled: !!userId,
  })
}

export function useUpdateUserStatus(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUserStatusFormValues) =>
      employeesService.updateStatus(userId, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: userStatusKeys.history(userId) })
      client.invalidateQueries({ queryKey: ['employee-detail', userId] })
      client.invalidateQueries({ queryKey: ['work-history', userId] })
      toast.success('Cập nhật trạng thái thành công')
    },
    onError: () => toast.error('Cập nhật trạng thái thất bại'),
  })
}
