import { useState } from 'react'
import { Plus, Trash2, UserCheck } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRecruitmentApprovers, useSetRecruitmentApprover, useDeleteRecruitmentApprover } from '../hooks/use-recruitment-approver'
import { useEmployees } from '../hooks/use-employees'
import { useDepartments } from '../hooks/use-departments'
import { AddApproverDialog, DeleteApproverDialog } from '../components/RecruitmentApproverConfigsPage'
import type { RecruitmentApproverConfigResponse, SetRecruitmentApproverPayload } from '../types/admin.types'

export default function RecruitmentApproverConfigsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<RecruitmentApproverConfigResponse | null>(null)

  const { data: configs = [], isLoading } = useRecruitmentApprovers()
  const { data: employees = [] } = useEmployees()
  const { data: departmentResult } = useDepartments({ Top: 200 })
  const departments = departmentResult?.items ?? []

  const setConfig = useSetRecruitmentApprover()
  const deleteConfig = useDeleteRecruitmentApprover()

  const handleSave = (payload: SetRecruitmentApproverPayload) => {
    setConfig.mutate(payload, { onSuccess: () => setDialogOpen(false) })
  }

  const handleDelete = (id: string) => {
    deleteConfig.mutate(id)
    setDeleteTarget(null)
  }

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Cấu hình người duyệt tuyển dụng', isActive: true }]} />

      <div className="flex flex-1 flex-col gap-4 min-h-0 w-full max-w-4xl mx-auto px-4 py-5 md:px-8">
        <div className="flex shrink-0 items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Người duyệt tuyển dụng</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{configs.length} cấu hình</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} size="sm" className="cursor-pointer gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Thêm người duyệt
          </Button>
        </div>

        <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead>Người duyệt</TableHead>
                <TableHead>Phạm vi (Phòng ban)</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: 4 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : configs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                    Chưa có cấu hình nào
                  </TableCell>
                </TableRow>
              ) : (
                configs.map((config) => (
                  <TableRow key={config.id} className="transition-colors duration-150 hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="text-sm font-medium">{config.approverName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {config.departmentName
                        ? <Badge variant="secondary" className="text-xs">{config.departmentName}</Badge>
                        : <span className="text-xs italic text-muted-foreground">Toàn công ty</span>
                      }
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{config.note ?? '—'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 cursor-pointer text-destructive hover:text-destructive"
                        aria-label="Xoá cấu hình"
                        onClick={() => setDeleteTarget(config)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddApproverDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employees={employees}
        departments={departments}
        isPending={setConfig.isPending}
        onSave={handleSave}
      />

      <DeleteApproverDialog
        target={deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
