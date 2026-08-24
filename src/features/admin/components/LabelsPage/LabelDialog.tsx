import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { labelSchema, type LabelFormValues } from '../../schemas/label.schema'
import type { LabelResponse } from '../../types/admin.types'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#0ea5e9', '#a16207', '#16a34a',
]

interface LabelDialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly initial?: LabelResponse
  readonly onSave: (values: LabelFormValues) => void
  readonly isPending?: boolean
}

export function LabelDialog({ open, onOpenChange, initial, onSave, isPending }: LabelDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<LabelFormValues>({
    resolver: zodResolver(labelSchema),
    defaultValues: { name: '', color: PRESET_COLORS[0], isActive: true },
  })

  const selectedColor = watch('color')
  const isActive = watch('isActive')

  useEffect(() => {
    if (open) {
      reset(initial
        ? { name: initial.name, color: initial.color, isActive: initial.isActive }
        : { name: '', color: PRESET_COLORS[0], isActive: true }
      )
    }
  }, [open, initial, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{initial ? 'Chỉnh sửa nhãn' : 'Tạo nhãn mới'}</DialogTitle>
        </DialogHeader>

        <form id="label-form" onSubmit={handleSubmit(onSave)} className="space-y-4 pt-1">
          {/* Preview */}
          <div className="flex justify-center">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-all"
              style={{ backgroundColor: `${selectedColor}22`, color: selectedColor, borderColor: `${selectedColor}44` }}
            >
              {watch('name') || 'Xem trước'}
            </span>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="label-name" className="text-xs font-medium">Tên nhãn</Label>
            <Input
              id="label-name"
              placeholder="VD: Nhân sự tiềm năng"
              {...register('name')}
              className="h-8 text-sm"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Color swatches */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Màu nhãn</Label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue('color', c, { shouldValidate: true })}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    backgroundColor: c,
                    outline: selectedColor === c ? `2px solid ${c}` : 'none',
                    outlineOffset: selectedColor === c ? '2px' : '0',
                  }}
                  aria-label={c}
                />
              ))}
            </div>
            {errors.color && <p className="text-xs text-destructive">{errors.color.message}</p>}
          </div>

          {/* isActive (only for edit) */}
          {initial && (
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Hoạt động</Label>
              <Switch
                checked={isActive}
                onCheckedChange={(v) => setValue('isActive', v)}
              />
            </div>
          )}
        </form>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isPending} className="cursor-pointer">
            Hủy
          </Button>
          <Button type="submit" form="label-form" size="sm" disabled={isPending} className="cursor-pointer">
            {isPending ? 'Đang lưu…' : initial ? 'Cập nhật' : 'Tạo nhãn'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
