import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { completeInterviewSchema, type CompleteInterviewFormData } from '../../schemas/interview.schema'

interface CompleteInterviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CompleteInterviewFormData) => void
  isPending: boolean
}

export function CompleteInterviewDialog({ open, onOpenChange, onSubmit, isPending }: CompleteInterviewDialogProps) {
  const form = useForm<CompleteInterviewFormData>({
    resolver: zodResolver(completeInterviewSchema),
    defaultValues: { interviewResult: '' },
  })

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) form.reset(); onOpenChange(open) }}>
      <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250">
        <DialogHeader>
          <DialogTitle>Ghi nhận kết quả phỏng vấn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="interviewResult"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kết quả phỏng vấn</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả kết quả, nhận xét ứng viên..." rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={isPending}>
                {isPending ? 'Đang lưu...' : 'Lưu kết quả'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
