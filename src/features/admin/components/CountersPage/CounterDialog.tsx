import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CounterResponse, StoreResponse } from '../../types/admin.types'

interface CounterFormValues {
  storeId: string
  name: string
  code: string
}

interface CounterDialogProps {
  readonly open: boolean
  readonly editCounter?: CounterResponse
  readonly stores: StoreResponse[]
  readonly defaultStoreId?: string
  readonly isPending: boolean
  readonly onSubmit: (values: CounterFormValues) => void
  readonly onOpenChange: (open: boolean) => void
}

export function CounterDialog({ open, editCounter, stores, defaultStoreId, isPending, onSubmit, onOpenChange }: CounterDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CounterFormValues>()
  const storeId = watch('storeId')

  useEffect(() => {
    if (open) {
      reset({
        storeId: editCounter?.storeId ?? defaultStoreId ?? stores[0]?.id ?? '',
        name: editCounter?.name ?? '',
        code: editCounter?.code ?? '',
      })
    }
  }, [open, editCounter, defaultStoreId, stores, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editCounter ? 'Sửa quầy' : 'Thêm quầy'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Cửa hàng <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Select value={storeId} onValueChange={v => setValue('storeId', v)} disabled={!!editCounter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn cửa hàng..." />
              </SelectTrigger>
              <SelectContent>
                {stores.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Tên quầy <span aria-hidden="true" className="text-destructive">*</span></Label>
              <Input id="name" {...register('name', { required: 'Bắt buộc' })} placeholder="vd: Quầy 1" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="code">Mã quầy <span aria-hidden="true" className="text-destructive">*</span></Label>
              <Input id="code" {...register('code', { required: 'Bắt buộc' })} placeholder="vd: Q1" />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : editCounter ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
