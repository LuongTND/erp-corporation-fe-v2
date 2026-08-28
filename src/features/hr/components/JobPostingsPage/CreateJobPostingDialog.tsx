import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CreateJobPostingPayload } from '../../types/recruitment.types'

const schema = z.object({
  recruitmentRequestId: z.string().min(1, 'Vui lòng chọn phiếu'),
  title: z.string().min(1, 'Bắt buộc').max(200),
  channel: z.enum(['Facebook', 'PaidBoard']),
  estimatedCost: z.coerce.number().min(0).optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateJobPostingPayload) => void
  isPending: boolean
  approvedRequests: { id: string; code: string; jobPositionName: string }[]
}

export function CreateJobPostingDialog({ open, onOpenChange, onSubmit, isPending, approvedRequests }: Props) {
  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { channel: 'Facebook' },
  })

  const channel = watch('channel')

  useEffect(() => {
    if (!open) reset({ channel: 'Facebook' })
  }, [open, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 animation-duration-250">
        <DialogHeader>
          <DialogTitle>Tạo tin tuyển dụng</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>Phiếu đề xuất <span className="text-destructive">*</span></Label>
            <Controller
              name="recruitmentRequestId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Chọn phiếu đã duyệt" />
                  </SelectTrigger>
                  <SelectContent align="start" sideOffset={4} className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 animation-duration-200">
                    {approvedRequests.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.code} — {r.jobPositionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.recruitmentRequestId && (
              <p className="text-xs text-destructive">{errors.recruitmentRequestId.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Tiêu đề tin <span className="text-destructive">*</span></Label>
            <Input {...register('title')} placeholder="Tuyển nhân viên bán hàng..." />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Kênh đăng <span className="text-destructive">*</span></Label>
            <Controller
              name="channel"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" sideOffset={4} className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 animation-duration-200">
                    <SelectItem value="Facebook">Facebook (miễn phí)</SelectItem>
                    <SelectItem value="PaidBoard">Kênh trả phí</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {channel === 'PaidBoard' && (
            <div className="flex flex-col gap-1.5">
              <Label>Chi phí dự kiến (₫)</Label>
              <Input
                type="number"
                min={0}
                {...register('estimatedCost')}
                placeholder="5000000"
              />
              {errors.estimatedCost && <p className="text-xs text-destructive">{errors.estimatedCost.message}</p>}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Huỷ
            </Button>
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending ? 'Đang tạo...' : 'Tạo tin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
