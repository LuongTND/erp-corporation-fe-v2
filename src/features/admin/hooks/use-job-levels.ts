import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { jobLevelsService } from '../services/job-levels.service'
import { employeesService as adminEmployeesService } from '../services/employees.service'
import type { ListParams, UserSummaryResponse } from '../types/admin.types'

const KEY = 'job-levels'
const EMPLOYEES_KEY = 'employees'

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
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Tạo cấp bậc thành công') },
    onError: (error) => { console.error(error); toast.error('Tạo cấp bậc thất bại') },
  })
}

export function useUpdateJobLevel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof jobLevelsService.update>[1] }) =>
      jobLevelsService.update(id, data),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Cập nhật cấp bậc thành công') },
    onError: (error) => { console.error(error); toast.error('Cập nhật cấp bậc thất bại') },
  })
}

export function useDeleteJobLevel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: jobLevelsService.delete,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Xóa cấp bậc thành công') },
    onError: (error) => { console.error(error); toast.error('Xóa cấp bậc thất bại') },
  })
}

export function useEmployeesByJobLevel(jobLevelId: string | null) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, { jobLevelId }],
    queryFn: () => adminEmployeesService.list(undefined, jobLevelId!),
    enabled: !!jobLevelId,
  })
}

export function useUnassignJobLevel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => jobLevelsService.unassignJobLevel(userId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      client.invalidateQueries({ queryKey: [EMPLOYEES_KEY] })
      toast.success('Đã gỡ cấp bậc')
    },
    onError: () => toast.error('Gỡ cấp bậc thất bại'),
  })
}
