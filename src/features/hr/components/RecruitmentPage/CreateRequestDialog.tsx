import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { StorePortalResponse } from '@/features/admin/types/admin.types'
import { createRecruitmentRequestSchema } from '../../schemas/recruitment-request.schema'
import type { CreateRecruitmentRequestFormValues } from '../../schemas/recruitment-request.schema'
import type { CreateRecruitmentRequestPayload } from '../../types/recruitment.types'

interface CreateRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateRecruitmentRequestPayload) => void
  isPending: boolean
  myStore: StorePortalResponse | null
}

export function CreateRequestDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  myStore,
}: CreateRequestDialogProps) {
  const form = useForm<CreateRecruitmentRequestFormValues>({
    resolver: zodResolver(createRecruitmentRequestSchema),
    defaultValues: {
      requestContext: 'Store',
      positionTitle: '',
      headcount: 1,
      reason: '',
      jobDescription: '',
      requiredByDate: '',
      storeId: '',
      departmentId: '',
    },
  })

  function handleSubmit(values: CreateRecruitmentRequestFormValues) {
    onSubmit({
      requestContext: 'Store',
      storeId: myStore?.id,
      positionTitle: values.positionTitle,
      headcount: values.headcount,
      reason: values.reason,
      jobDescription: values.jobDescription || undefined,
      requiredByDate: values.requiredByDate || undefined,
    })
  }

  function handleOpenChange(open: boolean) {
    if (!open) form.reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250"
      >
        <DialogHeader>
          <DialogTitle>Tạo phiếu đề xuất tuyển dụng</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Cửa hàng</FormLabel>
              <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-muted text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{myStore?.name ?? 'Đang tải...'}</span>
              </div>
            </FormItem>

            <FormField
              control={form.control}
              name="positionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí tuyển dụng <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Nhân viên bán hàng" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="headcount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng cần tuyển <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={100} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do tuyển dụng <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lý do tuyển dụng..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả công việc</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả yêu cầu và nhiệm vụ..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredByDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cần trước ngày</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending || !myStore} className="cursor-pointer">
                {isPending ? 'Đang tạo...' : 'Tạo phiếu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
