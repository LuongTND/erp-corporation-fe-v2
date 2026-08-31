import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { rolesService } from '../services/roles.service'
import { usersService } from '../services/users.service'
import type { PermissionResponse, RoleResponse } from '../types/admin.types'
import { authService } from '@/features/auth/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'

const KEY = 'roles'
const USERS_KEY = 'users'

function beError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallback
  }
  return fallback
}

export function useRoles() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => rolesService.list(),
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
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Tạo vai trò thành công')
    },
    onError: (error) => {
      toast.error(beError(error, 'Tạo vai trò thất bại'))
    },
  })
}

export function useUpdateRole() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { displayName: string; description: string; defaultDataScope: string } }) =>
      rolesService.update(id, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Cập nhật vai trò thành công')
    },
    onError: (error) => {
      toast.error(beError(error, 'Cập nhật vai trò thất bại'))
    },
  })
}

export function useDeleteRole() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, force }: { id: string; force?: boolean }) =>
      rolesService.delete({ id, force }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Xóa vai trò thành công')
    },
    onError: (error) => {
      toast.error(beError(error, 'Xóa vai trò thất bại'))
    },
  })
}

export function useAssignPermissions() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, toAdd, toRemove }: { roleId: string; toAdd: string[]; toRemove: string[] }) =>
      rolesService.assignPermissions(roleId, toAdd, toRemove),
    onMutate: async ({ roleId, toAdd, toRemove }) => {
      await client.cancelQueries({ queryKey: [KEY] })
      const prev = client.getQueryData<RoleResponse[]>([KEY])
      const allPerms = client.getQueryData<PermissionResponse[]>(['permissions']) ?? []
      const permMap = new Map(allPerms.map((p) => [p.id, p]))
      client.setQueryData<RoleResponse[]>([KEY], (old) => {
        if (!old) return old
        return old.map((role) => {
          if (role.id !== roleId) return role
          const kept = role.permissions.filter((p) => !toRemove.includes(p.id))
          const added = toAdd.map((id) => permMap.get(id)).filter(Boolean) as PermissionResponse[]
          return { ...role, permissions: [...kept, ...added] }
        })
      })
      return { prev }
    },
    onError: (error, _, ctx) => {
      if (ctx?.prev) client.setQueryData([KEY], ctx.prev)
      toast.error(beError(error, 'Cập nhật quyền hạn thất bại'))
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Cập nhật quyền hạn thành công')
      // sync current user's permissions in case their own role was changed
      authService.getPermissions().then((perms) => {
        useAuthStore.getState().setPermissions(perms)
      }).catch(() => {/* non-critical */})
    },
  })
}

export function useAllUsers() {
  return useQuery({
    queryKey: [USERS_KEY],
    queryFn: () => usersService.list(),
  })
}

export function useRoleUsers(roleId: string | undefined) {
  return useQuery({
    queryKey: [KEY, roleId, 'users'],
    queryFn: () => rolesService.getUsersByRole(roleId!),
    enabled: !!roleId,
  })
}

export function useSyncRoleUsers() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, toAdd, toRemove }: { roleId: string; toAdd: string[]; toRemove: string[] }) =>
      rolesService.syncUsers(roleId, toAdd, toRemove),
    onSuccess: (_data, { roleId }) => {
      client.invalidateQueries({ queryKey: [KEY, roleId, 'users'] })
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Cập nhật người dùng thành công')
    },
    onError: (error) => {
      toast.error(beError(error, 'Cập nhật người dùng thất bại'))
    },
  })
}
