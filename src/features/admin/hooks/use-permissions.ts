import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { permissionsService } from '../services/permissions.service'
import type { PermissionsListParams } from '../services/permissions.service'
import type { PermissionResponse } from '../types/admin.types'

const KEY = 'permissions'

const STALE_MS = 10 * 60 * 1000  // permissions are system data, rarely change
const GC_MS = 60 * 60 * 1000

// For PermissionsSheet — needs full flat list, cached long
export function usePermissions() {
  return useQuery({
    queryKey: [KEY, 'all'],
    queryFn: async (): Promise<PermissionResponse[]> => {
      const result = await permissionsService.list()
      return result.items as PermissionResponse[]
    },
    staleTime: STALE_MS,
    gcTime: GC_MS,
    refetchOnWindowFocus: false,
  })
}

// For PermissionsTab — paginated + search, server-side
export function usePermissionsPaged(params: Required<PermissionsListParams>) {
  return useQuery({
    queryKey: [KEY, 'paged', params],
    queryFn: () => permissionsService.list(params),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
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
