import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { departmentSchema, type DepartmentFormValues } from '../schemas/admin.schemas'
import { useCreateDepartment, useDeleteDepartment, useDepartments, useUpdateDepartment } from '../hooks/use-departments'
import type { DepartmentResponse } from '../types/admin.types'

// ── Department Dialog ─────────────────────────────────────────────────────────

function DepartmentDialog({
  open,
  department,
  allDepartments,
  onOpenChange,
}: {
  open: boolean
  department?: DepartmentResponse
  allDepartments: DepartmentResponse[]
  onOpenChange: (open: boolean) => void
}) {
  const create = useCreateDepartment()
  const update = useUpdateDepartment()
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
  })

  useEffect(() => {
    if (open) {
      reset({
        departmentName: department?.departmentName ?? '',
        departmentCode: department?.departmentCode ?? '',
        parentDepartmentId: department?.parentDepartmentId ?? '',
        managerId: '',
      })
    }
  }, [open, department, reset])

  const onSubmit = async (values: DepartmentFormValues) => {
    const payload = {
      departmentName: values.departmentName,
      departmentCode: values.departmentCode,
      parentDepartmentId: values.parentDepartmentId || undefined,
      managerId: values.managerId || undefined,
    }
    if (department) {
      await update.mutateAsync({ id: department.id, data: payload })
    } else {
      await create.mutateAsync(payload)
    }
    onOpenChange(false)
  }

  const isPending = create.isPending || update.isPending
  const parentId = watch('parentDepartmentId')
  const parents = allDepartments.filter((d) => d.id !== department?.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{department ? 'Edit Department' : 'Create Department'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="departmentName">Name <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Input id="departmentName" {...register('departmentName')} placeholder="e.g. HR Department" />
            {errors.departmentName && <p className="text-xs text-destructive">{errors.departmentName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="departmentCode">Code <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Input id="departmentCode" {...register('departmentCode')} placeholder="e.g. HR-01" />
            {errors.departmentCode && <p className="text-xs text-destructive">{errors.departmentCode.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="parentDepartmentId">Parent Department</Label>
            <Select
              value={parentId ?? ''}
              onValueChange={(value) => setValue('parentDepartmentId', value)}
            >
              <SelectTrigger id="parentDepartmentId">
                <SelectValue placeholder="None (root)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (root)</SelectItem>
                {parents.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.departmentName} ({d.departmentCode})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : department ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DepartmentsPage() {
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDept, setEditDept] = useState<DepartmentResponse | undefined>()

  const { data, isLoading } = useDepartments({ Top: 200, SearchText: search || undefined, NeedTotalCount: true })
  const deleteDepartment = useDeleteDepartment()

  const departments = data?.items ?? []

  const openCreate = () => { setEditDept(undefined); setDialogOpen(true) }
  const openEdit = (dept: DepartmentResponse) => { setEditDept(dept); setDialogOpen(true) }

  const handleDelete = (dept: DepartmentResponse) => {
    if (!confirm(`Delete department "${dept.departmentName}"?`)) return
    deleteDepartment.mutate(dept.id)
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <HRPageHeader
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Departments', isActive: true },
        ]}
      />

      <main className="max-w-7xl mx-auto p-8 space-y-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Departments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{data?.totalCount ?? 0} departments</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <Button onClick={openCreate} size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add Department
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
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
              ) : departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.departmentName}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{dept.departmentCode}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{dept.parentDepartmentName ?? '—'}</TableCell>
                    <TableCell>
                      {dept.isActive
                        ? <Badge className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 dark:text-green-400">Active</Badge>
                        : <Badge variant="destructive">Inactive</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => openEdit(dept)}
                          aria-label={`Edit ${dept.departmentName}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(dept)}
                          aria-label={`Delete ${dept.departmentName}`}
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

      <DepartmentDialog
        open={dialogOpen}
        department={editDept}
        allDepartments={departments}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
