import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { RoleFormValues } from '../../schemas/admin.schemas'
import { SCOPE_TYPE_LABELS, type ScopeType } from '../../types/admin.types'

interface RoleDialogProps {
  open: boolean
  isEdit: boolean
  form: UseFormReturn<RoleFormValues>
  onSubmit: (values: RoleFormValues) => void
  onOpenChange: (open: boolean) => void
  isPending: boolean
}

export function RoleDialog({ open, isEdit, form, onSubmit, onOpenChange, isPending }: RoleDialogProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form
  const scopeValue = watch('defaultDataScope')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa vai trò' : 'Tạo vai trò'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="roleName">Tên role (code) <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Input id="roleName" {...register('roleName')} placeholder="vd: hr-manager" disabled={isEdit} className="font-mono" />
            {errors.roleName && <p className="text-xs text-destructive">{errors.roleName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Tên hiển thị <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Input id="displayName" {...register('displayName')} placeholder="vd: HR Manager" />
            {errors.displayName && <p className="text-xs text-destructive">{errors.displayName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Phạm vi dữ liệu mặc định <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Select
              value={scopeValue ?? 'Own'}
              onValueChange={(v) => setValue('defaultDataScope', v as ScopeType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" sideOffset={4}>
                {(Object.entries(SCOPE_TYPE_LABELS) as [string, string][]).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" {...register('description')} rows={3} placeholder="Mô tả (tùy chọn)" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo vai trò'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
