import { useQuery } from '@tanstack/react-query'
import { permissionsService } from '../services/permissions.service'
import type { ListParams } from '../types/admin.types'

const KEY = 'permissions'

export function usePermissions(params?: ListParams) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => permissionsService.list(params),
  })
}

export function useRolePermissionIds(roleId: string | undefined) {
  return useQuery({
    queryKey: [KEY, 'by-role', roleId],
    queryFn: () => permissionsService.getByRole(roleId!),
    enabled: !!roleId,
  })
}
