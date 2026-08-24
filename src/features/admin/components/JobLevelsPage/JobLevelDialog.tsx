import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { JobLevelFormValues } from '../../schemas/admin.schemas'

interface JobLevelDialogProps {
  open: boolean
  isEdit: boolean
  form: UseFormReturn<JobLevelFormValues>
  onSubmit: (values: JobLevelFormValues) => void
  onOpenChange: (open: boolean) => void
  isPending: boolean
}

export function JobLevelDialog({ open, isEdit, form, onSubmit, onOpenChange, isPending }: JobLevelDialogProps) {
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa chức danh' : 'Tạo chức danh'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="levelName">Tên chức danh <span aria-hidden="true" className="text-destructive">*</span></Label>
              <Input id="levelName" {...register('levelName')} placeholder="vd: Manager" />
              {errors.levelName && <p className="text-xs text-destructive">{errors.levelName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="levelOrder">Thứ tự <span aria-hidden="true" className="text-destructive">*</span></Label>
              <Input id="levelOrder" type="number" {...register('levelOrder')} min={1} />
              {errors.levelOrder && <p className="text-xs text-destructive">{errors.levelOrder.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" {...register('description')} rows={2} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
