import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { departmentSchema, type DepartmentFormValues } from '../../schemas/admin.schemas'
import { useCreateDepartment, useUpdateDepartment } from '../../hooks/use-departments'
import type { DepartmentResponse } from '../../types/admin.types'

interface DepartmentDialogProps {
  open: boolean
  department?: DepartmentResponse
  allDepartments: DepartmentResponse[]
  onOpenChange: (open: boolean) => void
}

export function DepartmentDialog({ open, department, allDepartments, onOpenChange }: DepartmentDialogProps) {
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
          <DialogTitle>{department ? 'Chỉnh sửa phòng ban' : 'Tạo phòng ban'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="departmentName">Tên phòng ban <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Input id="departmentName" {...register('departmentName')} placeholder="vd: Phòng Nhân sự" />
            {errors.departmentName && <p className="text-xs text-destructive">{errors.departmentName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="departmentCode">Mã phòng ban <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Input id="departmentCode" {...register('departmentCode')} placeholder="vd: HR-01" />
            {errors.departmentCode && <p className="text-xs text-destructive">{errors.departmentCode.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="parentDepartmentId">Phòng ban cấp trên</Label>
            <Select
              value={parentId ?? ''}
              onValueChange={(value) => setValue('parentDepartmentId', value)}
            >
              <SelectTrigger id="parentDepartmentId">
                <SelectValue placeholder="Không có (gốc)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Không có (gốc)</SelectItem>
                {parents.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.departmentName} ({d.departmentCode})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : department ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
