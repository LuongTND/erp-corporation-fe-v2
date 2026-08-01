import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { rolesService } from '../services/roles.service'
import type { ListParams } from '../types/admin.types'

const KEY = 'roles'

export function useRoles(params?: ListParams) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => rolesService.list(params),
  })
}

export function useRolePermissions(roleId: string | undefined) {
  return useQuery({
    queryKey: [KEY, roleId, 'permissions'],
    queryFn: () => rolesService.getById(roleId!),
    enabled: !!roleId,
  })
}

export function useCreateRole() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: rolesService.create,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Role created') },
    onError: (error) => { console.error(error); toast.error('Failed to create role') },
  })
}

export function useUpdateRole() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { roleName: string; description?: string } }) =>
      rolesService.update(id, data),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Role updated') },
    onError: (error) => { console.error(error); toast.error('Failed to update role') },
  })
}

export function useDeleteRole() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: rolesService.delete,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Role deleted') },
    onError: (error) => { console.error(error); toast.error('Failed to delete role') },
  })
}

export function useAssignPermissions() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      rolesService.assignPermissions(roleId, permissionIds),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Permissions updated') },
    onError: (error) => { console.error(error); toast.error('Failed to update permissions') },
  })
}
