import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { evaluateCandidateSchema, type EvaluateCandidateFormData } from '../../schemas/interview.schema'

interface EvaluateCandidateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EvaluateCandidateFormData) => void
  isPending: boolean
}

export function EvaluateCandidateDialog({ open, onOpenChange, onSubmit, isPending }: EvaluateCandidateDialogProps) {
  const form = useForm<EvaluateCandidateFormData>({
    resolver: zodResolver(evaluateCandidateSchema),
    defaultValues: { score: 5, recommendation: '', note: '' },
  })

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) form.reset(); onOpenChange(open) }}>
      <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250">
        <DialogHeader>
          <DialogTitle>Đánh giá ứng viên</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm (1–10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recommendation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khuyến nghị</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Phù hợp, Không phù hợp, Cần xem xét thêm..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhận xét chi tiết..." rows={4} {...field} />
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
                {isPending ? 'Đang lưu...' : 'Lưu đánh giá'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
