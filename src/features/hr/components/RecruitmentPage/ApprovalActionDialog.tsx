import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { approvalActionSchema, rejectionActionSchema } from '../../schemas/recruitment-request.schema'
import type { ApprovalActionFormValues, RejectionActionFormValues } from '../../schemas/recruitment-request.schema'

type ActionType = 'approve' | 'approve-level1' | 'reject' | 'request-more-info'

interface ApprovalActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: ActionType
  onConfirm: (note?: string) => void
  isPending: boolean
}

const ACTION_CONFIG: Record<ActionType, { title: string; label: string; requireNote: boolean; confirmLabel: string; confirmVariant: 'default' | 'destructive' }> = {
  approve: {
    title: 'Duyệt phiếu đề xuất',
    label: 'Ghi chú (tuỳ chọn)',
    requireNote: false,
    confirmLabel: 'Duyệt',
    confirmVariant: 'default',
  },
  'approve-level1': {
    title: 'Duyệt L1',
    label: 'Ghi chú (tuỳ chọn)',
    requireNote: false,
    confirmLabel: 'Duyệt L1',
    confirmVariant: 'default',
  },
  reject: {
    title: 'Từ chối phiếu đề xuất',
    label: 'Lý do từ chối',
    requireNote: true,
    confirmLabel: 'Từ chối',
    confirmVariant: 'destructive',
  },
  'request-more-info': {
    title: 'Yêu cầu bổ sung thông tin',
    label: 'Thông tin cần bổ sung',
    requireNote: true,
    confirmLabel: 'Gửi yêu cầu',
    confirmVariant: 'default',
  },
}

export function ApprovalActionDialog({
  open,
  onOpenChange,
  action,
  onConfirm,
  isPending,
}: ApprovalActionDialogProps) {
  const config = ACTION_CONFIG[action]
  const schema = config.requireNote ? rejectionActionSchema : approvalActionSchema
  type FormValues = typeof config.requireNote extends true ? RejectionActionFormValues : ApprovalActionFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { note: '' },
  })

  function handleSubmit(values: FormValues) {
    onConfirm(values.note || undefined)
  }

  function handleOpenChange(open: boolean) {
    if (!open) form.reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[420px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250"
      >
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{config.label}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={config.requireNote ? 'Bắt buộc nhập...' : 'Nhập ghi chú...'}
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
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
              <Button
                type="submit"
                variant={config.confirmVariant}
                disabled={isPending}
                className="cursor-pointer"
              >
                {isPending ? 'Đang xử lý...' : config.confirmLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
