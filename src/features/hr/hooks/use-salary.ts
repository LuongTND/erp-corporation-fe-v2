import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { salaryService } from '../services/salary.service'
import type { SetSalaryPayload } from '../types/salary.types'

export const salaryKeys = {
  current: (id: string) => ['salary-current', id],
  history: (id: string) => ['salary-history', id],
}

export function useCurrentSalary(userId: string, enabled = true) {
  return useQuery({
    queryKey: salaryKeys.current(userId),
    queryFn: () => salaryService.getCurrent(userId),
    enabled: !!userId && enabled,
  })
}

export function useSalaryHistory(userId: string, enabled = true) {
  return useQuery({
    queryKey: salaryKeys.history(userId),
    queryFn: () => salaryService.getHistory(userId),
    enabled: !!userId && enabled,
  })
}

export function useSetSalary(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (data: SetSalaryPayload) => salaryService.set(userId, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: salaryKeys.current(userId) })
      client.invalidateQueries({ queryKey: salaryKeys.history(userId) })
      client.invalidateQueries({ queryKey: ['work-history', userId] })
      toast.success('Cập nhật lương thành công')
    },
    onError: () => toast.error('Cập nhật lương thất bại'),
  })
}
