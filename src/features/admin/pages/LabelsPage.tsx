import { useState } from 'react'
import { Plus } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useLabels, useCreateLabel, useUpdateLabel, useDeleteLabel } from '../hooks/use-labels'
import { LabelTable, LabelDialog } from '../components/LabelsPage'
import type { LabelResponse } from '../types/admin.types'
import type { LabelFormValues } from '../schemas/label.schema'

export default function LabelsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<LabelResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<LabelResponse | null>(null)

  const { data: labels = [], isLoading } = useLabels()
  const create = useCreateLabel()
  const update = useUpdateLabel()
  const del = useDeleteLabel()

  const openCreate = () => { setEditItem(undefined); setDialogOpen(true) }
  const openEdit = (label: LabelResponse) => { setEditItem(label); setDialogOpen(true) }

  const onSave = (values: LabelFormValues) => {
    if (editItem) {
      update.mutate(
        { id: editItem.id, data: { name: values.name, color: values.color, isActive: values.isActive } },
        { onSuccess: () => setDialogOpen(false) }
      )
    } else {
      create.mutate({ name: values.name, color: values.color }, { onSuccess: () => setDialogOpen(false) })
    }
  }

  const onToggleActive = (label: LabelResponse) => {
    update.mutate({ id: label.id, data: { name: label.name, color: label.color, isActive: !label.isActive } })
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Nhãn nhân viên', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-4xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Nhãn nhân viên</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{labels.length} nhãn</p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5 cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            Tạo nhãn
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Đang tải…</div>
        ) : (
          <LabelTable
            labels={labels}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onToggleActive={onToggleActive}
          />
        )}
      </div>

      <LabelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editItem}
        onSave={onSave}
        isPending={create.isPending || update.isPending}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa nhãn?</AlertDialogTitle>
            <AlertDialogDescription>
              Nhãn <span className="font-semibold text-foreground">"{deleteTarget?.name}"</span> sẽ bị xóa và gỡ khỏi tất cả nhân viên.
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
