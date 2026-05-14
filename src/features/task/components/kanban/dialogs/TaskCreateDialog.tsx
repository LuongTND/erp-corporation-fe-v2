import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CalendarIcon, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { taskItemService, taskStatusService, taskPriorityService } from '@/features/task/mocks/task.mock'
import type { TaskItemDto, TaskStatusDto, CreateTaskRequest } from '@/features/task/types/task.types'
import type { TaskPriorityDto } from '@/features/task/types/priority.types'
import { useAuthStore } from '@/stores/auth.store'

const taskFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().optional(),
  statusId: z.string().min(1, 'Vui lòng chọn trạng thái'),
  priorityId: z.string().min(1, 'Vui lòng chọn độ ưu tiên'),
  dueDate: z.date().optional(),
  startDate: z.date().optional(),
  estimatedHours: z.number().min(0, 'Số giờ ước tính phải >= 0').optional(),
})

type TaskFormData = z.infer<typeof taskFormSchema>

let cachedStatuses: TaskStatusDto[] | null = null
let cachedPriorities: TaskPriorityDto[] | null = null

interface TaskCreateDialogProps {
  children?: React.ReactNode
  defaultStatusId?: string
  onTaskCreated?: (task?: TaskItemDto) => void
  trigger?: React.ReactNode
}

export function TaskCreateDialog({
  children,
  defaultStatusId,
  onTaskCreated,
  trigger,
}: TaskCreateDialogProps) {
  const user = useAuthStore((s) => s.user)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statuses, setStatuses] = useState<TaskStatusDto[]>(cachedStatuses ?? [])
  const [priorities, setPriorities] = useState<TaskPriorityDto[]>(cachedPriorities ?? [])
  const [loadingData, setLoadingData] = useState(false)

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      statusId: defaultStatusId || '',
      priorityId: '',
      estimatedHours: undefined,
    },
  })

  const loadData = useCallback(async () => {
    if (cachedStatuses && cachedPriorities) {
      setStatuses(cachedStatuses)
      setPriorities(cachedPriorities)
      setLoadingData(false)
      return
    }

    try {
      setLoadingData(true)
      const [statusData, priorityData] = await Promise.all([
        taskStatusService.getAllForDropdown(),
        taskPriorityService.getAllForDropdown(),
      ])

      cachedStatuses = statusData
      cachedPriorities = priorityData
      setStatuses(statusData)
      setPriorities(priorityData)

      if (!defaultStatusId && statusData.length > 0) {
        const activeStatus = statusData.find((s) => s.isActive) || statusData[0]
        form.setValue('statusId', activeStatus.id)
      }

      if (priorityData.length > 0) {
        const activePriority = priorityData.find((p) => p.isActive) || priorityData[0]
        form.setValue('priorityId', activePriority.id)
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
      toast.error('Không thể tải dữ liệu trạng thái và ưu tiên')
    } finally {
      setLoadingData(false)
    }
  }, [defaultStatusId, form])

  useEffect(() => {
    if (open) loadData()
  }, [open, loadData])

  useEffect(() => {
    if (defaultStatusId) form.setValue('statusId', defaultStatusId)
  }, [defaultStatusId, form])

  const generateTaskCode = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    return `TASK-${timestamp}-${random}`
  }

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      setLoading(true)

      const taskData: CreateTaskRequest = {
        code: generateTaskCode(),
        title: data.title,
        description: data.description,
        statusId: data.statusId,
        priorityId: data.priorityId,
        creatorId: user?.id ?? 'user-mock',
        dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
        startDate: data.startDate ? data.startDate.toISOString() : undefined,
        estimatedHours: data.estimatedHours,
        isActive: true,
      }

      const newTask = await taskItemService.create(taskData)
      toast.success('Đã tạo task thành công')
      setOpen(false)
      form.reset()
      onTaskCreated?.(newTask)
    } catch (error) {
      console.error('Lỗi khi tạo task:', error)
      toast.error('Không thể tạo task. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const selectedStatusId = useWatch({ control: form.control, name: 'statusId' })
  const selectedPriorityId = useWatch({ control: form.control, name: 'priorityId' })

  const selectedStatus = useMemo(
    () => statuses.find((s) => s.id === selectedStatusId),
    [statuses, selectedStatusId],
  )
  const selectedPriority = useMemo(
    () => priorities.find((p) => p.id === selectedPriorityId),
    [priorities, selectedPriorityId],
  )

  const activeStatuses = useMemo(() => statuses.filter((s) => s.isActive), [statuses])
  const activePriorities = useMemo(
    () =>
      priorities.filter((p) => p.isActive).sort((a, b) => b.level - a.level),
    [priorities],
  )

  if (loadingData && open) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button size="sm" className="h-8 gap-1 px-3">
            <Plus className="h-3.5 w-3.5" />
            <span className="font-medium">Tạo Task</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Task mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo task mới. Các trường có dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateTask)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề task..." {...field} className="text-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về task..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="statusId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái">
                            {selectedStatus && (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: selectedStatus.color }}
                                />
                                {selectedStatus.name}
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeStatuses.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: status.color }}
                              />
                              {status.name}
                            </div>
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
                name="priorityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Độ ưu tiên *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn độ ưu tiên">
                            {selectedPriority && (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: selectedPriority.color }}
                                />
                                <div className="flex items-center gap-1">
                                  {selectedPriority.name}
                                  <Badge variant="outline" className="text-xs px-1">
                                    {selectedPriority.level}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activePriorities.map((priority) => (
                          <SelectItem key={priority.id} value={priority.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: priority.color }}
                              />
                              <div className="flex items-center gap-1">
                                {priority.name}
                                <Badge variant="outline" className="text-xs px-1">
                                  {priority.level}
                                </Badge>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày đến hạn</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="estimatedHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số giờ ước tính</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      step="0.5"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseFloat(e.target.value)
                        field.onChange(value)
                      }}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
