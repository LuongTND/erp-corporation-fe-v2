import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { employeesService } from '../services/employees.service'
import type { UpdateEmployeePayload } from '../types/user-detail.types'

export const employeeDetailKey = (id: string) => ['employee-detail', id]

export function useEmployeeDetail(userId: string) {
  return useQuery({
    queryKey: employeeDetailKey(userId),
    queryFn: () => employeesService.getDetail(userId),
    enabled: !!userId,
  })
}

export function useUpsertCustomFields(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (values: { definitionId: string; value: string }[]) =>
      employeesService.upsertCustomFields(userId, values),
    onSuccess: () => client.invalidateQueries({ queryKey: employeeDetailKey(userId) }),
    onError: () => toast.error('Cập nhật trường tùy chỉnh thất bại'),
  })
}

export function useUpdateEmployee(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateEmployeePayload) => employeesService.update(userId, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: employeeDetailKey(userId) })
      toast.success('Cập nhật thông tin thành công')
    },
    onError: () => toast.error('Cập nhật thất bại'),
  })
}

export function useUploadAvatar(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => employeesService.uploadAvatar(userId, file),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: employeeDetailKey(userId) })
      toast.success('Cập nhật ảnh đại diện thành công')
    },
    onError: () => toast.error('Upload ảnh thất bại'),
  })
}
