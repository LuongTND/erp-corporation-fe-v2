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
import { useEmployeeTypes, useCreateEmployeeType, useUpdateEmployeeType, useDeleteEmployeeType } from '../hooks/use-employee-types'
import { employeeTypeSchema, type EmployeeTypeFormValues } from '../schemas/admin.schemas'
import type { EmployeeTypeResponse } from '../types/admin.types'
import { EmployeeTypeDialog, EmployeeTypeTable } from '../components/EmployeeTypesPage'

export default function EmployeeTypesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<EmployeeTypeResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<EmployeeTypeResponse | null>(null)

  const { data, isLoading } = useEmployeeTypes({ Top: 100, NeedTotalCount: true })
  const create = useCreateEmployeeType()
  const update = useUpdateEmployeeType()
  const del = useDeleteEmployeeType()

  const form = useForm<EmployeeTypeFormValues>({ resolver: zodResolver(employeeTypeSchema) })

  useEffect(() => {
    if (dialogOpen) {
      form.reset({
        name: editItem?.name ?? '',
        code: editItem?.code ?? '',
        description: editItem?.description ?? '',
        isActive: editItem?.isActive ?? true,
      })
    }
  }, [dialogOpen, editItem, form])

  const onSubmit = (values: EmployeeTypeFormValues) => {
    if (editItem) {
      update.mutate({ id: editItem.id, data: values }, { onSuccess: () => setDialogOpen(false) })
    } else {
      create.mutate({ name: values.name, code: values.code, description: values.description }, { onSuccess: () => setDialogOpen(false) })
    }
  }

  const openCreate = () => { setEditItem(undefined); setDialogOpen(true) }
  const openEdit = (item: EmployeeTypeResponse) => { setEditItem(item); setDialogOpen(true) }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Loại nhân sự', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Loại nhân sự</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{data?.totalCount ?? 0} loại</p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Thêm loại
          </Button>
        </div>

        <EmployeeTypeTable
          items={data?.items ?? []}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      </div>

      <EmployeeTypeDialog
        open={dialogOpen}
        isEdit={!!editItem}
        form={form}
        onSubmit={onSubmit}
        onOpenChange={setDialogOpen}
        isPending={create.isPending || update.isPending}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa loại nhân sự?</AlertDialogTitle>
            <AlertDialogDescription>
              Loại nhân sự <span className="font-semibold text-foreground">"{deleteTarget?.name}"</span> sẽ bị xóa. Không thể xóa nếu còn nhân viên đang sử dụng.
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
