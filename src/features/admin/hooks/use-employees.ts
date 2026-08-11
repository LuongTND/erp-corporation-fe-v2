import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { employeesService } from '../services/employees.service'

const KEY = 'employees'

export function useEmployees(search?: string, jobLevelId?: string, options?: { enabled?: boolean }, status?: string, departmentId?: string) {
  return useQuery({
    queryKey: [KEY, search, jobLevelId, status, departmentId],
    queryFn: () => employeesService.list(search, jobLevelId, status, departmentId),
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
