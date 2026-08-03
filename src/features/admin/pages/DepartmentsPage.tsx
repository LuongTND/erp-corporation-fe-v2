import { useState } from 'react'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteDepartment, useDepartments } from '../hooks/use-departments'
import type { DepartmentResponse } from '../types/admin.types'
import { DepartmentDialog } from '../components/DepartmentsPage/DepartmentDialog'

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
    if (!confirm(`Xóa phòng ban "${dept.departmentName}"?`)) return
    deleteDepartment.mutate(dept.id)
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Departments', isActive: true }]} />

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Phòng ban</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{data?.totalCount ?? 0} phòng ban</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Tìm phòng ban..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <Button onClick={openCreate} size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Thêm phòng ban
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Mã</TableHead>
                <TableHead>Trực thuộc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[80px] text-right">Thao tác</TableHead>
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
                    Không có phòng ban nào
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
                        ? <Badge className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 dark:text-green-400">Hoạt động</Badge>
                        : <Badge variant="destructive">Vô hiệu</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(dept)} aria-label={`Edit ${dept.departmentName}`}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete(dept)} aria-label={`Delete ${dept.departmentName}`}>
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
