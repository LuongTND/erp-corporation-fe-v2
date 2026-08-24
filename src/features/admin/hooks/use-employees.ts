import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { employeesService } from '../services/employees.service'

const KEY = 'employees'

export function useEmployees(search?: string, jobLevelId?: string, options?: { enabled?: boolean }, status?: string, departmentId?: string, labelId?: string, storeId?: string, regionId?: string) {
  return useQuery({
    queryKey: [KEY, search, jobLevelId, status, departmentId, labelId, storeId, regionId],
    queryFn: () => employeesService.list(search, jobLevelId, status, departmentId, labelId, storeId, regionId),
    enabled: options?.enabled ?? true,
    staleTime: 60_000,
  })
}

export function useCreateEmployee() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: employeesService.create,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Tạo nhân sự thành công') },
    onError: (error) => { console.error(error); toast.error('Tạo nhân sự thất bại') },
  })
}

export function useUpdateUserStatus() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, newStatus, note }: { userId: string; newStatus: string; note?: string }) =>
      employeesService.updateStatus(userId, newStatus, note),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Cập nhật trạng thái thành công') },
    onError: (error) => { console.error(error); toast.error('Cập nhật trạng thái thất bại') },
  })
}

export function useLockEmployee() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, lock }: { userId: string; lock: boolean }) =>
      employeesService.lock(userId, lock),
    onSuccess: (_, { lock }) => { client.invalidateQueries({ queryKey: [KEY] }); toast.success(lock ? 'Đã khoá tài khoản' : 'Đã mở khoá tài khoản') },
    onError: (error) => { console.error(error); toast.error('Thao tác thất bại') },
  })
}
