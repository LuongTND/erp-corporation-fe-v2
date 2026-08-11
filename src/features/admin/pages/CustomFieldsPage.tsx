import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useCreateCustomField, useCustomFields, useDeleteCustomField, useUpdateCustomField } from '../hooks/use-custom-fields'
import { customFieldSchema, type CustomFieldFormValues } from '../schemas/custom-field.schema'
import type { CustomFieldDefinitionResponse } from '../types/admin.types'
import { CustomFieldDialog, CustomFieldTable } from '../components/CustomFieldsPage'

export default function CustomFieldsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDef, setEditDef] = useState<CustomFieldDefinitionResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<CustomFieldDefinitionResponse | null>(null)

  const { data: definitions = [], isLoading } = useCustomFields()
  const create = useCreateCustomField()
  const update = useUpdateCustomField()
  const deleteDef = useDeleteCustomField()

  const form = useForm<CustomFieldFormValues>({
    resolver: zodResolver(customFieldSchema),
    defaultValues: { fieldType: 'Text', isRequired: false, sortOrder: 0, module: 'Employee' },
  })

  useEffect(() => {
    if (dialogOpen) {
      form.reset(editDef ? {
        code: editDef.code,
        name: editDef.name,
        fieldType: editDef.fieldType,
        module: editDef.module,
        isRequired: editDef.isRequired,
        sortOrder: editDef.sortOrder,
        placeholder: editDef.placeholder ?? '',
        helpText: editDef.helpText ?? '',
        group: editDef.group ?? '',
        options: editDef.options.map(o => ({ ...o })),
      } : { fieldType: 'Text', isRequired: false, sortOrder: 0, module: 'Employee' })
    }
  }, [dialogOpen, editDef, form])

  const onSubmit = (values: CustomFieldFormValues) => {
    if (editDef) {
      update.mutate({ id: editDef.id, data: {
        name: values.name,
        isRequired: values.isRequired,
        isActive: true,
        sortOrder: values.sortOrder,
        placeholder: values.placeholder || undefined,
        helpText: values.helpText || undefined,
        group: values.group || undefined,
        options: values.options,
      }}, { onSuccess: () => setDialogOpen(false) })
    } else {
      create.mutate({
        code: values.code,
        name: values.name,
        fieldType: values.fieldType,
        module: values.module,
        isRequired: values.isRequired,
        sortOrder: values.sortOrder,
        placeholder: values.placeholder || undefined,
        helpText: values.helpText || undefined,
        group: values.group || undefined,
        options: values.options?.map((o, i) => ({ value: o.value, label: o.label, sortOrder: i })),
      }, { onSuccess: () => setDialogOpen(false) })
    }
  }

  const openCreate = () => { setEditDef(undefined); setDialogOpen(true) }
  const openEdit = (def: CustomFieldDefinitionResponse) => { setEditDef(def); setDialogOpen(true) }
  const confirmDelete = () => { if (deleteTarget) { deleteDef.mutate(deleteTarget.id); setDeleteTarget(null) } }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Trường tùy chỉnh', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Trường tùy chỉnh</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {definitions.length} trường · Quản lý các trường dữ liệu mở rộng cho nhân viên
            </p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Thêm trường
          </Button>
        </div>

        <CustomFieldTable
          definitions={definitions}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      </div>

      <CustomFieldDialog
        open={dialogOpen}
        isEdit={!!editDef}
        form={form}
        onSubmit={onSubmit}
        onOpenChange={setDialogOpen}
        isPending={create.isPending || update.isPending}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa trường "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này không thể hoàn tác nếu trường đã có dữ liệu. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Xóa trường
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
