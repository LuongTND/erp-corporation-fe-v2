import { useState } from 'react'
import { Plus, Trash2, UserCheck } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRecruitmentApprovers, useSetRecruitmentApprover, useDeleteRecruitmentApprover } from '../hooks/use-recruitment-approver'
import { useEmployees } from '../hooks/use-employees'
import { useDepartments } from '../hooks/use-departments'
import type { RecruitmentApproverConfigResponse } from '../types/admin.types'

export default function RecruitmentApproverConfigsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<RecruitmentApproverConfigResponse | null>(null)

  const [approverId, setApproverId] = useState('')
  const [departmentId, setDepartmentId] = useState('__global__')
  const [note, setNote] = useState('')

  const { data: configs = [], isLoading } = useRecruitmentApprovers()
  const { data: employees = [] } = useEmployees()
  const { data: deptResult } = useDepartments({ Top: 200 })
  const departments = deptResult?.items ?? []

  const setConfig = useSetRecruitmentApprover()
  const deleteConfig = useDeleteRecruitmentApprover()

  const openCreate = () => {
    setApproverId('')
    setDepartmentId('__global__')
    setNote('')
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!approverId) return
    setConfig.mutate(
      {
        approverId,
        departmentId: departmentId === '__global__' ? undefined : departmentId,
        note: note || undefined,
      },
      { onSuccess: () => setDialogOpen(false) },
    )
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Cấu hình người duyệt tuyển dụng', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-4xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Người duyệt tuyển dụng</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{configs.length} cấu hình</p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5 cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            Thêm người duyệt
          </Button>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người duyệt</TableHead>
                <TableHead>Phạm vi (Phòng ban)</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : configs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-muted-foreground text-sm">
                    Chưa có cấu hình nào
                  </TableCell>
                </TableRow>
              ) : (
                configs.map((cfg) => (
                  <TableRow key={cfg.id} className="hover:bg-muted/40 transition-colors duration-150">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm">{cfg.approverName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {cfg.departmentName
                        ? <Badge variant="secondary" className="text-xs">{cfg.departmentName}</Badge>
                        : <span className="text-xs text-muted-foreground italic">Toàn công ty</span>
                      }
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{cfg.note ?? '—'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 cursor-pointer text-destructive hover:text-destructive"
                        aria-label="Xoá cấu hình"
                        onClick={() => setDeleteTarget(cfg)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Thêm người duyệt tuyển dụng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Người duyệt *</Label>
              <Select value={approverId} onValueChange={setApproverId}>
                <SelectTrigger className="h-9 cursor-pointer">
                  <SelectValue placeholder="Chọn nhân viên..." />
                </SelectTrigger>
                <SelectContent align="start" sideOffset={4}>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.fullName}
                      {e.employeeCode && <span className="text-muted-foreground ml-1.5 text-xs">({e.employeeCode})</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Phòng ban áp dụng</Label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger className="h-9 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" sideOffset={4}>
                  <SelectItem value="__global__">Toàn công ty</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.departmentName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Ghi chú</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tùy chọn..."
                className="h-9"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} disabled={setConfig.isPending} className="cursor-pointer">
              Hủy
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!approverId || setConfig.isPending} className="cursor-pointer">
              {setConfig.isPending ? 'Đang lưu…' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá cấu hình?</AlertDialogTitle>
            <AlertDialogDescription>
              Người duyệt <span className="font-semibold text-foreground">"{deleteTarget?.approverName}"</span>
              {deleteTarget?.departmentName && <> cho phòng <span className="font-semibold text-foreground">"{deleteTarget.departmentName}"</span></>}
              {' '}sẽ bị xoá.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { deleteConfig.mutate(deleteTarget!.id); setDeleteTarget(null) }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
