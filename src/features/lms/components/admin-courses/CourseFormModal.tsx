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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { courseSchema, type CourseSchema } from '../../schemas/course.schema'
import type { AdminCourse } from '../../types/admin.types'

const CATEGORIES = ['Leadership', 'Compliance', 'Technical', 'Soft Skills', 'Onboarding', 'Finance'] as const
const LEVELS = [
  { value: 'Beginner', label: 'Cơ bản' },
  { value: 'Intermediate', label: 'Trung cấp' },
  { value: 'Advanced', label: 'Nâng cao' },
] as const

interface CourseFormModalProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly editingCourse?: AdminCourse | null
  readonly onSubmit: (data: CourseSchema) => void
}

export function CourseFormModal({
  open,
  onOpenChange,
  editingCourse,
  onSubmit,
}: CourseFormModalProps) {
  const isEditing = !!editingCourse

  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      category: '',
      instructor: '',
      duration: '',
      level: 'Beginner',
      description: '',
      isInternal: true,
      status: 'draft',
    },
  })

  // Populate form when editing an existing course
  useEffect(() => {
    if (editingCourse) {
      form.reset({
        title: editingCourse.title,
        category: editingCourse.category,
        instructor: editingCourse.instructor,
        duration: editingCourse.duration,
        level: 'Beginner',
        description: '',
        isInternal: editingCourse.isInternal,
        status: editingCourse.status,
      })
    } else {
      form.reset({
        title: '',
        category: '',
        instructor: '',
        duration: '',
        level: 'Beginner',
        description: '',
        isInternal: true,
        status: 'draft',
      })
    }
  }, [editingCourse, form])

  const handleSubmit = (data: CourseSchema) => {
    onSubmit(data)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Chỉnh sửa Khoá học' : 'Tạo Khoá học Mới'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="course-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            {/* Title — full width */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Tiêu đề khoá học</FormLabel>
                  <FormControl>
                    <Input placeholder="vd: Strategic Leadership Fundamentals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Level */}
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cấp độ</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn cấp độ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEVELS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Instructor */}
            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giảng viên</FormLabel>
                  <FormControl>
                    <Input placeholder="vd: Dr. Sarah Chen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời lượng</FormLabel>
                  <FormControl>
                    <Input placeholder="vd: 4h 30m" {...field} />
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
                  <FormLabel>Mô tả khoá học</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả nội dung, mục tiêu và đối tượng học viên..."
                      className="min-h-[96px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái xuất bản</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Nháp</SelectItem>
                      <SelectItem value="published">Đã xuất bản</SelectItem>
                      <SelectItem value="archived">Đã lưu trữ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* isInternal toggle */}
            <FormField
              control={form.control}
              name="isInternal"
              render={({ field }) => (
                <FormItem className="flex items-end gap-3 pb-0.5">
                  <FormControl>
                    <Switch
                      id="course-is-internal"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label htmlFor="course-is-internal" className="cursor-pointer text-sm">
                    {field.value ? 'Đào tạo nội bộ' : 'Đào tạo khách hàng'}
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
          <Button type="submit" form="course-form">
            {isEditing ? 'Lưu thay đổi' : 'Tạo khoá học'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
