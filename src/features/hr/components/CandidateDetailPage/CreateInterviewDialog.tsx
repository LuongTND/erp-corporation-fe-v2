import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createInterviewSchema, type CreateInterviewFormData } from '../../schemas/interview.schema'
import { INTERVIEW_LOCATION_LABELS, type ResolvedInterviewRule } from '../../types/recruitment.types'

interface CreateInterviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateInterviewFormData) => void
  isPending: boolean
  resolvedRule?: ResolvedInterviewRule | null
}

const LOCATIONS = ['AtStore', 'AtOffice', 'AtFactory', 'Remote'] as const

export function CreateInterviewDialog({ open, onOpenChange, onSubmit, isPending, resolvedRule }: CreateInterviewDialogProps) {
  const form = useForm<CreateInterviewFormData>({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: { interviewerId: '', scheduledAt: '', location: 'AtOffice', locationNote: '', notes: '' },
  })

  useEffect(() => {
    if (open && resolvedRule) {
      form.setValue('location', resolvedRule.location)
    }
    if (!open) {
      form.reset()
    }
  }, [open, resolvedRule, form])

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) form.reset(); onOpenChange(open) }}>
      <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250">
        <DialogHeader>
          <DialogTitle>Tạo lịch phỏng vấn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="interviewerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người phỏng vấn (ID)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập ID người phỏng vấn" {...field} />
                  </FormControl>
                  {resolvedRule && (
                    <p className="text-xs text-muted-foreground">
                      Gợi ý role: <span className="font-mono">{resolvedRule.interviewerRoleKey}</span>
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa điểm</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent align="start" sideOffset={4} className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 animation-duration-200">
                      {LOCATIONS.map((loc) => (
                        <SelectItem key={loc} value={loc}>{INTERVIEW_LOCATION_LABELS[loc]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú địa điểm</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Tầng 2, phòng họp A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ghi chú thêm..." rows={3} {...field} />
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
                {isPending ? 'Đang lưu...' : 'Tạo lịch'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
