import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { departmentJobLevelsService } from '../services/department-job-levels.service'

const KEY = 'department-job-levels'

export function useDepartmentJobLevels(departmentId?: string) {
  return useQuery({
    queryKey: [KEY, departmentId],
    queryFn: () => departmentJobLevelsService.list(departmentId),
  })
}

export function useCreateDepartmentJobLevel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: departmentJobLevelsService.create,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Tạo vị trí công việc thành công') },
    onError: () => toast.error('Tạo vị trí công việc thất bại'),
  })
}

export function useUpdateDepartmentJobLevel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof departmentJobLevelsService.update>[1] }) =>
      departmentJobLevelsService.update(id, data),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Cập nhật vị trí công việc thành công') },
    onError: () => toast.error('Cập nhật vị trí công việc thất bại'),
  })
}

export function useDeleteDepartmentJobLevel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: departmentJobLevelsService.delete,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Xóa vị trí công việc thành công') },
    onError: () => toast.error('Xóa vị trí công việc thất bại'),
  })
}
