import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateRole, useUpdateRole, useDeleteRole, useAssignPermissions, useAllUsers, useRoleUsers, useSyncRoleUsers } from '../../hooks/use-roles'
import { roleSchema, type RoleFormValues } from '../../schemas/admin.schemas'
import type { PermissionResponse, RoleResponse } from '../../types/admin.types'
import { RoleDeleteDialog } from './RoleDeleteDialog'
import { RoleDialog } from './RoleDialog'
import { RolesTable } from './RolesTable'
import { RolesToolbar, type TypeFilter } from './RolesToolbar'
import { PermissionsSheet } from './PermissionsSheet'
import { AssignUsersSheet } from './AssignUsersSheet'

interface RolesTabProps {
  roles: RoleResponse[]
  isLoading: boolean
  allPermissions: PermissionResponse[]
  isPermissionsLoading: boolean
}

export function RolesTab({ roles, isLoading, allPermissions, isPermissionsLoading }: RolesTabProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editRole, setEditRole] = useState<RoleResponse | undefined>()
  const [permSheet, setPermSheet] = useState<RoleResponse | undefined>()
  const [usersSheet, setUsersSheet] = useState<RoleResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<RoleResponse | null>(null)

  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const deleteRole = useDeleteRole()
  const assignPerms = useAssignPermissions()
  const { data: allUsers = [], isLoading: usersLoading } = useAllUsers()
  const { data: roleUsers = [], isLoading: roleUsersLoading } = useRoleUsers(usersSheet?.id)
  const syncUsers = useSyncRoleUsers()

  const form = useForm<RoleFormValues>({ resolver: zodResolver(roleSchema) })

  useEffect(() => {
    if (dialogOpen) {
      form.reset({
        roleName: editRole?.roleName ?? '',
        displayName: editRole?.displayName ?? '',
        description: editRole?.description ?? '',
        defaultDataScope: editRole?.defaultDataScope ?? 'Own',
      })
    }
  }, [dialogOpen, editRole, form])

  const onRoleSubmit = (values: RoleFormValues) => {
    if (editRole) {
      updateRole.mutate({ id: editRole.id, data: { displayName: values.displayName, description: values.description ?? '', defaultDataScope: values.defaultDataScope } }, {
        onSuccess: () => setDialogOpen(false),
      })
    } else {
      createRole.mutate({ roleName: values.roleName, displayName: values.displayName, description: values.description ?? '', defaultDataScope: values.defaultDataScope }, {
        onSuccess: () => setDialogOpen(false),
      })
    }
  }

  const onDelete = () => {
    if (!deleteTarget) return
    deleteRole.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
  }

  const isFiltering = typeFilter !== 'all' || search.trim().length > 0

  const filtered = roles.filter((r) => {
    if (search) {
      const q = search.toLowerCase()
      const match = r.roleName.toLowerCase().includes(q)
        || (r.displayName ?? '').toLowerCase().includes(q)
        || (r.description ?? '').toLowerCase().includes(q)
      if (!match) return false
    }
    if (typeFilter === 'system' && !r.isSystemRole) return false
    if (typeFilter === 'custom' && r.isSystemRole) return false
    return true
  })

  return (
    <div className="space-y-5">
      <RolesToolbar
        count={filtered.length}
        search={search}
        typeFilter={typeFilter}
        onSearchChange={setSearch}
        onTypeFilterChange={setTypeFilter}
        onCreateClick={() => { setEditRole(undefined); setDialogOpen(true) }}
      />

      <RolesTable
        roles={filtered}
        isLoading={isLoading}
        isFiltering={isFiltering}
        onEdit={(role) => { setEditRole(role); setDialogOpen(true) }}
        onDelete={setDeleteTarget}
        onPermissions={setPermSheet}
        onUsers={setUsersSheet}
      />

      <RoleDialog
        open={dialogOpen}
        isEdit={!!editRole}
        form={form}
        onSubmit={onRoleSubmit}
        onOpenChange={setDialogOpen}
        isPending={createRole.isPending || updateRole.isPending}
      />

      <PermissionsSheet
        open={!!permSheet}
        role={roles.find((r) => r.id === permSheet?.id)}
        onOpenChange={(open) => { if (!open) setPermSheet(undefined) }}
        allPermissions={allPermissions}
        isPermissionsLoading={isPermissionsLoading}
        onAssign={(payload) => assignPerms.mutate(payload, {
          onSuccess: () => setPermSheet(undefined),
        })}
        isAssigning={assignPerms.isPending}
      />

      <AssignUsersSheet
        open={!!usersSheet}
        role={usersSheet}
        onOpenChange={(open) => { if (!open) setUsersSheet(undefined) }}
        allUsers={allUsers}
        roleUsers={roleUsers}
        isLoading={usersLoading || roleUsersLoading}
        onSync={(payload) => syncUsers.mutate(payload, { onSuccess: () => setUsersSheet(undefined) })}
        isSyncing={syncUsers.isPending}
      />

      <RoleDeleteDialog
        role={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDelete={onDelete}
        isPending={deleteRole.isPending}
      />
    </div>
  )
}
