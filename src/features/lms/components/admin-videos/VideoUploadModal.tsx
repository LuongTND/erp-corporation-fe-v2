import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadCloud } from 'lucide-react'
import { z } from 'zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AdminCourse } from '../../types/admin.types'

const videoUploadSchema = z.object({
  title: z.string().min(3, 'Tiêu đề tối thiểu 3 ký tự'),
  courseId: z.string().min(1, 'Vui lòng chọn khoá học'),
  description: z.string().max(300).optional(),
})

type VideoUploadSchema = z.infer<typeof videoUploadSchema>

interface VideoUploadModalProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly courses: AdminCourse[]
  readonly onSubmit: (data: VideoUploadSchema) => void
}

export function VideoUploadModal({
  open,
  onOpenChange,
  courses,
  onSubmit,
}: VideoUploadModalProps) {
  const form = useForm<VideoUploadSchema>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: { title: '', courseId: '', description: '' },
  })

  const handleSubmit = (data: VideoUploadSchema) => {
    onSubmit(data)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tải lên Video Đào tạo</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="video-upload-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Drop zone UI (static — hooks into real upload in production) */}
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 py-8 text-center">
              <UploadCloud className="h-8 w-8 text-muted-foreground" aria-hidden />
              <p className="text-sm font-medium text-foreground">Kéo thả file video vào đây</p>
              <p className="text-xs text-muted-foreground">Hoặc click để chọn file — MP4, MOV, WebM · tối đa 5 GB</p>
              <Button type="button" variant="outline" size="sm" className="mt-1">
                Chọn file
              </Button>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề video</FormLabel>
                  <FormControl>
                    <Input placeholder="vd: React Hooks — useCallback chuyên sâu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gắn vào khoá học</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khoá học" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả (tuỳ chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn về nội dung video..."
                      className="min-h-[72px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button type="submit" form="video-upload-form" className="gap-1.5">
            <UploadCloud className="h-4 w-4" aria-hidden />
            Tải lên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
