import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  useDepartmentJobLevels,
  useCreateDepartmentJobLevel,
  useUpdateDepartmentJobLevel,
  useDeleteDepartmentJobLevel,
} from '../hooks/use-department-job-levels'
import { useDepartments } from '../hooks/use-departments'
import { useJobLevels } from '../hooks/use-job-levels'
import { departmentJobLevelSchema, type DepartmentJobLevelFormValues } from '../schemas/admin.schemas'
import type { DepartmentJobLevelResponse } from '../types/admin.types'
import { DepartmentJobLevelTable, DepartmentJobLevelDialog } from '../components/DepartmentJobLevelsPage'

export default function DepartmentJobLevelsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<DepartmentJobLevelResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<DepartmentJobLevelResponse | null>(null)

  const { data, isLoading } = useDepartmentJobLevels()
  const { data: departmentsData } = useDepartments({ Top: 200 })
  const { data: jobLevelsData } = useJobLevels({ Top: 200 })
  const create = useCreateDepartmentJobLevel()
  const update = useUpdateDepartmentJobLevel()
  const del = useDeleteDepartmentJobLevel()

  const form = useForm<DepartmentJobLevelFormValues>({ resolver: zodResolver(departmentJobLevelSchema) })

  useEffect(() => {
    if (dialogOpen) {
      form.reset({
        departmentId: editItem?.departmentId ?? '',
        jobLevelId: editItem?.jobLevelId ?? '',
      })
    }
  }, [dialogOpen, editItem, form])

  const onSubmit = (values: DepartmentJobLevelFormValues) => {
    if (editItem) {
      update.mutate({ id: editItem.id, data: values }, { onSuccess: () => setDialogOpen(false) })
    } else {
      create.mutate(values, { onSuccess: () => setDialogOpen(false) })
    }
  }

  const items = data?.items ?? []
  const departments = departmentsData?.items ?? []
  const jobLevels = jobLevelsData?.items ?? []

  const openCreate = () => { setEditItem(undefined); setDialogOpen(true) }
  const openEdit = (item: DepartmentJobLevelResponse) => { setEditItem(item); setDialogOpen(true) }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Vị trí công việc', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Vị trí công việc</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{data?.totalCount ?? 0} vị trí</p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Thêm vị trí
          </Button>
        </div>

        <DepartmentJobLevelTable
          items={items}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      </div>

      <DepartmentJobLevelDialog
        open={dialogOpen}
        isEdit={!!editItem}
        form={form}
        departments={departments}
        jobLevels={jobLevels}
        onSubmit={onSubmit}
        onOpenChange={setDialogOpen}
        isPending={create.isPending || update.isPending}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vị trí công việc?</AlertDialogTitle>
            <AlertDialogDescription>
              Vị trí <span className="font-semibold text-foreground">"{deleteTarget?.departmentName} — {deleteTarget?.jobLevelName}"</span> sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { del.mutate(deleteTarget!.id); setDeleteTarget(null) }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
