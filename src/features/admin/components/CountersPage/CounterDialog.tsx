import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCounterSchema, updateCounterSchema } from '../../schemas/counter.schema'
import type { CreateCounterFormValues, UpdateCounterFormValues } from '../../schemas/counter.schema'
import type { CounterResponse, StoreResponse } from '../../types/admin.types'

type CounterFormValues = CreateCounterFormValues | UpdateCounterFormValues

interface CounterDialogProps {
  readonly open: boolean
  readonly editCounter?: CounterResponse
  readonly stores: StoreResponse[]
  readonly defaultStoreId?: string
  readonly isPending: boolean
  readonly onSubmit: (values: { storeId: string; name: string; code: string }) => void
  readonly onOpenChange: (open: boolean) => void
}

export function CounterDialog({ open, editCounter, stores, defaultStoreId, isPending, onSubmit, onOpenChange }: CounterDialogProps) {
  const isEdit = !!editCounter
  const schema = isEdit ? updateCounterSchema : createCounterSchema

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CounterFormValues>({
    resolver: zodResolver(schema),
  })

  const storeId = watch('storeId' as keyof CounterFormValues) as string | undefined

  useEffect(() => {
    if (open) {
      reset({
        storeId: editCounter?.storeId ?? defaultStoreId ?? stores[0]?.id ?? '',
        name: editCounter?.name ?? '',
        code: editCounter?.code ?? '',
      } as CounterFormValues)
    }
  }, [open, editCounter, defaultStoreId, stores, reset])

  function handleFormSubmit(values: CounterFormValues) {
    onSubmit({
      storeId: (values as CreateCounterFormValues).storeId ?? editCounter?.storeId ?? '',
      name: values.name,
      code: values.code,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa quầy' : 'Thêm quầy'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Cửa hàng <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Select
              value={storeId ?? ''}
              onValueChange={v => setValue('storeId' as keyof CounterFormValues, v as never)}
              disabled={isEdit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn cửa hàng..." />
              </SelectTrigger>
              <SelectContent align="start" sideOffset={4}>
                {stores.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {'storeId' in errors && errors.storeId && (
              <p className="text-xs text-destructive">{errors.storeId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="counter-name">Tên quầy <span aria-hidden="true" className="text-destructive">*</span></Label>
              <Input id="counter-name" {...register('name')} placeholder="vd: Quầy 1" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="counter-code">Mã quầy <span aria-hidden="true" className="text-destructive">*</span></Label>
              <Input id="counter-code" {...register('code')} placeholder="vd: Q1" />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isPending} className="gap-1.5">
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isPending ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
