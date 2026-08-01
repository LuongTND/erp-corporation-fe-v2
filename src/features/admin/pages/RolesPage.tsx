import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2, Plus, Shield, Trash2 } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { roleSchema, type RoleFormValues } from '../schemas/admin.schemas'
import { useAssignPermissions, useCreateRole, useDeleteRole, useRoles, useUpdateRole } from '../hooks/use-roles'
import { usePermissions, useRolePermissionIds } from '../hooks/use-permissions'
import type { RoleResponse } from '../types/admin.types'

// ── Role Dialog (Create / Edit) ───────────────────────────────────────────────

function RoleDialog({
  open,
  role,
  onOpenChange,
}: {
  open: boolean
  role?: RoleResponse
  onOpenChange: (open: boolean) => void
}) {
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { roleName: role?.roleName ?? '', description: role?.description ?? '' },
  })

  useEffect(() => {
    if (open) reset({ roleName: role?.roleName ?? '', description: role?.description ?? '' })
  }, [open, role, reset])

  const onSubmit = async (values: RoleFormValues) => {
    if (role) {
      await updateRole.mutateAsync({ id: role.id, data: values })
    } else {
      await createRole.mutateAsync(values)
    }
    onOpenChange(false)
  }

  const isPending = createRole.isPending || updateRole.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Create Role'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="roleName">Role Name <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Input id="roleName" {...register('roleName')} placeholder="e.g. hr-manager" />
            {errors.roleName && <p className="text-xs text-destructive">{errors.roleName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={3} placeholder="Optional description" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : role ? 'Save Changes' : 'Create Role'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Permissions Sheet ─────────────────────────────────────────────────────────

function PermissionsSheet({
  open,
  role,
  onOpenChange,
}: {
  open: boolean
  role: RoleResponse | undefined
  onOpenChange: (open: boolean) => void
}) {
  const { data: allPermissions, isLoading: loadingAll } = usePermissions({ Top: 200, NeedTotalCount: false })
  const { data: rolePermissions, isLoading: loadingRole } = useRolePermissionIds(role?.id)
  const assignPermissions = useAssignPermissions()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (rolePermissions) setSelected(new Set(rolePermissions.map((p) => p.id)))
  }, [rolePermissions])

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSave = async () => {
    if (!role) return
    await assignPermissions.mutateAsync({ roleId: role.id, permissionIds: [...selected] })
    onOpenChange(false)
  }

  // Group by resource (prefix before ':')
  const grouped = (allPermissions?.items ?? []).reduce<Record<string, NonNullable<typeof allPermissions>['items']>>((acc, p) => {
    const resource = p.permissionCode.split(':')[0] ?? 'other'
    ;(acc[resource] ??= []).push(p)
    return acc
  }, {})

  const isLoading = loadingAll || loadingRole

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:max-w-[480px] flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions — {role?.roleName}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
          ) : (
            Object.entries(grouped).map(([resource, permissions]) => (
              <div key={resource}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{resource}</p>
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center gap-3 cursor-pointer rounded-md px-3 py-2 hover:bg-accent transition-colors"
                    >
                      <Checkbox
                        checked={selected.has(permission.id)}
                        onCheckedChange={() => toggle(permission.id)}
                        id={permission.id}
                      />
                      <span className="text-sm font-mono">{permission.permissionCode}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={assignPermissions.isPending}>
            {assignPermissions.isPending ? 'Saving...' : 'Save Permissions'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RolesPage() {
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editRole, setEditRole] = useState<RoleResponse | undefined>()
  const [permSheet, setPermSheet] = useState<RoleResponse | undefined>()

  const { data, isLoading } = useRoles({ Top: 100, SearchText: search || undefined, NeedTotalCount: true })
  const deleteRole = useDeleteRole()

  const openCreate = () => { setEditRole(undefined); setDialogOpen(true) }
  const openEdit = (role: RoleResponse) => { setEditRole(role); setDialogOpen(true) }

  const handleDelete = (role: RoleResponse) => {
    if (!confirm(`Delete role "${role.roleName}"?`)) return
    deleteRole.mutate(role.id)
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <HRPageHeader
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Roles & Permissions', isActive: true },
        ]}
      />

      <main className="max-w-7xl mx-auto p-8 space-y-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Roles</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {data?.totalCount ?? 0} roles total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <Button onClick={openCreate} size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Create Role
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (data?.items ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                (data?.items ?? []).map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.roleName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{role.description ?? '—'}</TableCell>
                    <TableCell>
                      {role.isSystemRole
                        ? <Badge variant="secondary">System</Badge>
                        : <Badge variant="outline">Custom</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      {role.isActive
                        ? <Badge className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 dark:text-green-400">Active</Badge>
                        : <Badge variant="destructive">Inactive</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setPermSheet(role)}
                        >
                          <Shield className="h-3.5 w-3.5 mr-1" />
                          Perms
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => openEdit(role)}
                          aria-label={`Edit ${role.roleName}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(role)}
                          disabled={role.isSystemRole}
                          aria-label={`Delete ${role.roleName}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <RoleDialog
        open={dialogOpen}
        role={editRole}
        onOpenChange={setDialogOpen}
      />

      <PermissionsSheet
        open={!!permSheet}
        role={permSheet}
        onOpenChange={(open) => { if (!open) setPermSheet(undefined) }}
      />
    </div>
  )
}
