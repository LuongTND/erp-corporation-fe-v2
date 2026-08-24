import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeesService } from '../services/employees.service'
import type { WorkHistoryChangeType } from '../types/work-history.types'

export function useWorkHistory(userId: string, changeType?: WorkHistoryChangeType, enabled = true) {
  return useQuery({
    queryKey: ['work-history', userId, changeType],
    queryFn: () => employeesService.getWorkHistory(userId, changeType),
    enabled: !!userId && enabled,
  })
}

export function useLockEmployee(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (lock: boolean) => employeesService.lockEmployee(userId, lock),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employee', userId] }),
  })
}
