import { useQuery } from '@tanstack/react-query'
import { employeesService } from '../services/employees.service'

const KEY = 'hr-employee-list'

export function useEmployeeList(search?: string, status?: string, departmentId?: string) {
  return useQuery({
    queryKey: [KEY, search, status, departmentId],
    queryFn: () => employeesService.getList(search, status, departmentId),
    staleTime: 30_000,
  })
}
