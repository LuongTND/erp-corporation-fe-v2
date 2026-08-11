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
import { useCreateJobLevel, useDeleteJobLevel, useJobLevels, useUpdateJobLevel, useEmployeesByJobLevel, useUnassignJobLevel } from '../hooks/use-job-levels'
import { jobLevelSchema, type JobLevelFormValues } from '../schemas/admin.schemas'
import type { JobLevelResponse } from '../types/admin.types'
import { JobLevelDialog, EmployeesSheet, JobLevelTable } from '../components/JobLevelsPage'

export default function JobLevelsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editLevel, setEditLevel] = useState<JobLevelResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<JobLevelResponse | null>(null)
  const [sheetLevel, setSheetLevel] = useState<JobLevelResponse | null>(null)

  const { data, isLoading } = useJobLevels({ Top: 100, NeedTotalCount: true })
  const create = useCreateJobLevel()
  const update = useUpdateJobLevel()
  const deleteJobLevel = useDeleteJobLevel()
  const { data: sheetEmployees = [], isLoading: isLoadingEmployees } = useEmployeesByJobLevel(sheetLevel?.id ?? null)
  const unassign = useUnassignJobLevel()

  const form = useForm<JobLevelFormValues>({ resolver: zodResolver(jobLevelSchema) })

  useEffect(() => {
    if (dialogOpen) {
      form.reset({
        levelName: editLevel?.levelName ?? '',
        levelOrder: editLevel?.levelOrder ?? 1,
        defaultScopeType: editLevel?.defaultScopeType ?? 'All',
        description: editLevel?.description ?? '',
      })
    }
  }, [dialogOpen, editLevel, form])

  const onSubmit = (values: JobLevelFormValues) => {
    if (editLevel) {
      update.mutate({ id: editLevel.id, data: values }, { onSuccess: () => setDialogOpen(false) })
    } else {
      create.mutate(values, { onSuccess: () => setDialogOpen(false) })
    }
  }

  const onUnassign = (ids: string[]) => Promise.all(ids.map(id => unassign.mutateAsync(id)))

  const levels = (data?.items ?? []).sort((a, b) => a.levelOrder - b.levelOrder)

  const openCreate = () => { setEditLevel(undefined); setDialogOpen(true) }
  const openEdit = (level: JobLevelResponse) => { setEditLevel(level); setDialogOpen(true) }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Job Levels', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Cấp bậc</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{data?.totalCount ?? 0} cấp bậc</p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Thêm cấp bậc
          </Button>
        </div>

        <JobLevelTable
          levels={levels}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onViewEmployees={setSheetLevel}
        />
      </div>

      <JobLevelDialog
        open={dialogOpen}
        isEdit={!!editLevel}
        form={form}
        onSubmit={onSubmit}
        onOpenChange={setDialogOpen}
        isPending={create.isPending || update.isPending}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa cấp bậc?</AlertDialogTitle>
            <AlertDialogDescription>
              Cấp bậc <span className="font-semibold text-foreground">"{deleteTarget?.levelName}"</span> sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { deleteJobLevel.mutate(deleteTarget!.id); setDeleteTarget(null) }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EmployeesSheet
        level={sheetLevel}
        open={!!sheetLevel}
        onOpenChange={v => { if (!v) setSheetLevel(null) }}
        employees={sheetEmployees}
        isLoadingEmployees={isLoadingEmployees}
        onUnassign={onUnassign}
        isUnassigning={unassign.isPending}
      />
    </div>
  )
}
