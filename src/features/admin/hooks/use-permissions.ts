import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { permissionsService } from '../services/permissions.service'

const KEY = 'permissions'

export function usePermissions() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => permissionsService.list(),
  })
}

export function useDeletePermission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => permissionsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export function useRolePermissionIds(roleId: string | undefined) {
  return useQuery({
    queryKey: [KEY, 'by-role', roleId],
    queryFn: () => permissionsService.getByRole(roleId!),
    enabled: !!roleId,
  })
}
