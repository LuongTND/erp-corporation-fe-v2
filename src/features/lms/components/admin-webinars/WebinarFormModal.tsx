import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { webinarSchema, type WebinarSchema } from '../../schemas/webinar.schema'
import type { Webinar } from '../../types/admin.types'

interface WebinarFormModalProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly editingWebinar?: Webinar | null
  readonly onSubmit: (data: WebinarSchema) => void
}

export function WebinarFormModal({
  open,
  onOpenChange,
  editingWebinar,
  onSubmit,
}: WebinarFormModalProps) {
  const isEditing = !!editingWebinar

  const form = useForm<WebinarSchema>({
    resolver: zodResolver(webinarSchema),
    defaultValues: {
      title: '',
      host: '',
      scheduledAt: '',
      durationMinutes: 60,
      maxCapacity: 100,
      isInternal: true,
      description: '',
    },
  })

  useEffect(() => {
    if (editingWebinar) {
      // Convert ISO datetime to datetime-local input format
      const localDatetime = editingWebinar.scheduledAt.slice(0, 16)
      form.reset({
        title: editingWebinar.title,
        host: editingWebinar.host,
        scheduledAt: localDatetime,
        durationMinutes: editingWebinar.durationMinutes,
        maxCapacity: editingWebinar.maxCapacity,
        isInternal: editingWebinar.isInternal,
        description: '',
      })
    } else {
      form.reset({
        title: '',
        host: '',
        scheduledAt: '',
        durationMinutes: 60,
        maxCapacity: 100,
        isInternal: true,
        description: '',
      })
    }
  }, [editingWebinar, form])

  const handleSubmit = (data: WebinarSchema) => {
    onSubmit(data)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Chỉnh sửa Webinar' : 'Tạo Webinar Mới'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="webinar-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            {/* Title — full width */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Tiêu đề webinar</FormLabel>
                  <FormControl>
                    <Input placeholder="vd: Kỹ năng Lãnh đạo cho Quản lý Cấp trung" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Host */}
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host / Diễn giả</FormLabel>
                  <FormControl>
                    <Input placeholder="vd: Dr. Nguyễn Văn An" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Scheduled At */}
            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày & giờ tổ chức</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời lượng (phút)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={15}
                      max={480}
                      {...field}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max Capacity */}
            <FormField
              control={form.control}
              name="maxCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sức chứa tối đa</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description — full width */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Mô tả webinar</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nội dung, mục tiêu, đối tượng tham dự..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* isInternal toggle */}
            <FormField
              control={form.control}
              name="isInternal"
              render={({ field }) => (
                <FormItem className="col-span-2 flex items-center gap-3">
                  <FormControl>
                    <Switch
                      id="webinar-is-internal"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label htmlFor="webinar-is-internal" className="cursor-pointer text-sm">
                    {field.value ? 'Webinar nội bộ (nhân viên)' : 'Webinar khách hàng / đối tác'}
                  </Label>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button type="submit" form="webinar-form">
            {isEditing ? 'Lưu thay đổi' : 'Tạo webinar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
