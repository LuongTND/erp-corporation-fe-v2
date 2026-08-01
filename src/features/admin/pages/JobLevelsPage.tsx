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
import { Textarea } from '@/components/ui/textarea'
import { jobLevelSchema, type JobLevelFormValues } from '../schemas/admin.schemas'
import { useCreateJobLevel, useDeleteJobLevel, useJobLevels, useUpdateJobLevel } from '../hooks/use-job-levels'
import { SCOPE_TYPE_LABELS, type JobLevelResponse, type ScopeType } from '../types/admin.types'

// ── Job Level Dialog ──────────────────────────────────────────────────────────

function JobLevelDialog({
  open,
  jobLevel,
  onOpenChange,
}: {
  open: boolean
  jobLevel?: JobLevelResponse
  onOpenChange: (open: boolean) => void
}) {
  const create = useCreateJobLevel()
  const update = useUpdateJobLevel()
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<JobLevelFormValues>({
    resolver: zodResolver(jobLevelSchema),
  })

  useEffect(() => {
    if (open) {
      reset({
        levelName: jobLevel?.levelName ?? '',
        levelOrder: jobLevel?.levelOrder ?? 1,
        defaultScopeType: jobLevel?.defaultScopeType ?? 4,
        description: jobLevel?.description ?? '',
        baseSalaryMin: jobLevel?.baseSalaryMin,
        baseSalaryMax: jobLevel?.baseSalaryMax,
      })
    }
  }, [open, jobLevel, reset])

  const onSubmit = async (values: JobLevelFormValues) => {
    if (jobLevel) {
      await update.mutateAsync({ id: jobLevel.id, data: values })
    } else {
      await create.mutateAsync(values)
    }
    onOpenChange(false)
  }

  const isPending = create.isPending || update.isPending
  const scopeType = watch('defaultScopeType')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{jobLevel ? 'Edit Job Level' : 'Create Job Level'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="levelName">Name <span aria-hidden="true" className="text-destructive">*</span></Label>
              <Input id="levelName" {...register('levelName')} placeholder="e.g. Manager" />
              {errors.levelName && <p className="text-xs text-destructive">{errors.levelName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="levelOrder">Order <span aria-hidden="true" className="text-destructive">*</span></Label>
              <Input id="levelOrder" type="number" {...register('levelOrder')} min={1} />
              {errors.levelOrder && <p className="text-xs text-destructive">{errors.levelOrder.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Default Scope <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Select
              value={String(scopeType ?? 4)}
              onValueChange={(value) => setValue('defaultScopeType', Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(SCOPE_TYPE_LABELS) as [string, string][]).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="baseSalaryMin">Min Salary</Label>
              <Input id="baseSalaryMin" type="number" {...register('baseSalaryMin')} placeholder="0" min={0} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="baseSalaryMax">Max Salary</Label>
              <Input id="baseSalaryMax" type="number" {...register('baseSalaryMax')} placeholder="0" min={0} />
            </div>
          </div>
          {(errors.baseSalaryMin || errors.baseSalaryMax) && (
            <p className="text-xs text-destructive">{errors.baseSalaryMin?.message ?? errors.baseSalaryMax?.message}</p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={2} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : jobLevel ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const SCOPE_BADGE_STYLE: Record<ScopeType, string> = {
  1: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  2: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  3: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800',
  4: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
}

function formatSalary(value: number | undefined) {
  if (value == null) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
}

export default function JobLevelsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editLevel, setEditLevel] = useState<JobLevelResponse | undefined>()

  const { data, isLoading } = useJobLevels({ Top: 100, NeedTotalCount: true })
  const deleteJobLevel = useDeleteJobLevel()

  const levels = (data?.items ?? []).sort((a, b) => a.levelOrder - b.levelOrder)

  const openCreate = () => { setEditLevel(undefined); setDialogOpen(true) }
  const openEdit = (level: JobLevelResponse) => { setEditLevel(level); setDialogOpen(true) }

  const handleDelete = (level: JobLevelResponse) => {
    if (!confirm(`Delete job level "${level.levelName}"?`)) return
    deleteJobLevel.mutate(level.id)
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <HRPageHeader
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Job Levels', isActive: true },
        ]}
      />

      <main className="max-w-7xl mx-auto p-8 space-y-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Job Levels</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {data?.totalCount ?? 0} levels · controls default data scope
            </p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Level
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Default Scope</TableHead>
                <TableHead>Salary Range</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : levels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    No job levels found
                  </TableCell>
                </TableRow>
              ) : (
                levels.map((level) => (
                  <TableRow key={level.id}>
                    <TableCell className="text-muted-foreground text-sm tabular-nums">{level.levelOrder}</TableCell>
                    <TableCell className="font-medium">{level.levelName}</TableCell>
                    <TableCell>
                      <Badge className={SCOPE_BADGE_STYLE[level.defaultScopeType]}>
                        {SCOPE_TYPE_LABELS[level.defaultScopeType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {level.baseSalaryMin != null || level.baseSalaryMax != null
                        ? `${formatSalary(level.baseSalaryMin)} – ${formatSalary(level.baseSalaryMax)}`
                        : '—'
                      }
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {level.description ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => openEdit(level)}
                          aria-label={`Edit ${level.levelName}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(level)}
                          aria-label={`Delete ${level.levelName}`}
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

      <JobLevelDialog
        open={dialogOpen}
        jobLevel={editLevel}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
