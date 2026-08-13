import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { employeeTypesService } from '../services/employee-types.service'
import type { ListParams } from '../types/admin.types'

const KEY = 'employee-types'

export function useEmployeeTypes(params?: ListParams) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => employeeTypesService.list(params),
  })
}

export function useCreateEmployeeType() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: employeeTypesService.create,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Tạo loại nhân sự thành công') },
    onError: () => toast.error('Tạo loại nhân sự thất bại'),
  })
}

export function useUpdateEmployeeType() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof employeeTypesService.update>[1] }) =>
      employeeTypesService.update(id, data),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Cập nhật loại nhân sự thành công') },
    onError: () => toast.error('Cập nhật loại nhân sự thất bại'),
  })
}

export function useDeleteEmployeeType() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: employeeTypesService.delete,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Xóa loại nhân sự thành công') },
    onError: () => toast.error('Xóa loại nhân sự thất bại'),
  })
}

export function useAssignEmployeeType() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, employeeTypeId }: { userId: string; employeeTypeId: string | null }) =>
      employeeTypesService.assignToUser(userId, employeeTypeId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['users'] })
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Cập nhật loại nhân sự thành công')
    },
    onError: () => toast.error('Cập nhật loại nhân sự thất bại'),
  })
}
