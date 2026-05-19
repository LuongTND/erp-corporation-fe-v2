import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Settings } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import { taskPriorityService } from '@/features/task/mocks/task.mock'
import type { TaskPriorityDto } from '@/features/task/types/priority.types'
import type { PriorityLevel } from '@/features/task/types/priority.types'
import { PriorityForm } from './PriorityForm'
import { PriorityList } from './PriorityList'
import {
  priorityFormSchema,
  type PriorityFormData,
} from '@/features/task/schemas/priority.schema'

interface PriorityManagerDialogProps {
  children?: React.ReactNode
}

export function PriorityManagerDialog({ children }: PriorityManagerDialogProps) {
  const [open, setOpen] = useState(false)
  const [priorities, setPriorities] = useState<TaskPriorityDto[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingPriority, setEditingPriority] = useState<TaskPriorityDto | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const isFormOpen = showCreateForm || !!editingPriority

  const form = useForm<PriorityFormData>({
    resolver: zodResolver(priorityFormSchema),
    defaultValues: {
      name: '',
      code: '',
      level: 3,
      color: '#808080',
    },
  })

  useEffect(() => {
    if (open && !hasLoaded) loadPriorities()
  }, [open, hasLoaded])

  const loadPriorities = async () => {
    try {
      setIsFetching(true)
      const data = await taskPriorityService.getAllForDropdown()
      setPriorities(data)
      setHasLoaded(true)
    } catch {
      toast.error('Lỗi tải dữ liệu')
    } finally {
      setIsFetching(false)
    }
  }

  const closeForm = useCallback(() => {
    setEditingPriority(null)
    setShowCreateForm(false)
    form.reset()
  }, [form])

  const handleCreatePriority = useCallback(
    async (data: PriorityFormData) => {
      try {
        setIsSubmitting(true)
        const newPriority = await taskPriorityService.create({
          ...data,
          level: data.level as PriorityLevel,
          isSystem: true,
          isActive: true,
        })
        setPriorities((prev) => [...prev, newPriority])
        setHasLoaded(true)
        closeForm()
        toast.success('Đã tạo thành công')
      } catch {
        toast.error('Lỗi khi tạo')
      } finally {
        setIsSubmitting(false)
      }
    },
    [closeForm],
  )

  const handleUpdatePriority = useCallback(
    async (data: PriorityFormData) => {
      if (!editingPriority) return
      try {
        setIsSubmitting(true)
        const updatedPriority = await taskPriorityService.update(editingPriority.id, {
          priorityId: editingPriority.id,
          ...data,
          level: data.level as PriorityLevel,
        })
        setPriorities((prev) =>
          prev.map((p) => (p.id === editingPriority.id ? updatedPriority : p)),
        )
        setHasLoaded(true)
        closeForm()
        toast.success('Đã cập nhật')
      } catch {
        toast.error('Lỗi cập nhật')
      } finally {
        setIsSubmitting(false)
      }
    },
    [closeForm, editingPriority],
  )

  const handleDeletePriority = useCallback(async (priorityId: string) => {
    try {
      setIsSubmitting(true)
      await taskPriorityService.toggleActive(priorityId)
      setPriorities((prev) =>
        prev.map((p) => (p.id === priorityId ? { ...p, isActive: !p.isActive } : p)),
      )
      toast.success('Đã thay đổi trạng thái')
    } catch {
      toast.error('Lỗi thao tác')
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const handleEdit = useCallback(
    (priority: TaskPriorityDto) => {
      setEditingPriority(priority)
      setShowCreateForm(false)
      form.reset({
        name: priority.name,
        code: priority.code,
        level: priority.level,
        color: priority.color,
      })
    },
    [form],
  )

  const handleCreateNewClick = useCallback(() => {
    setEditingPriority(null)
    setShowCreateForm(true)
    form.reset({ name: '', code: '', level: 3, color: '#6366f1' })
  }, [form])

  const onSubmit = useCallback(
    (data: PriorityFormData) => {
      if (editingPriority) {
        handleUpdatePriority(data)
        return
      }
      handleCreatePriority(data)
    },
    [editingPriority, handleCreatePriority, handleUpdatePriority],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Priority
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[800px] h-[600px] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/60 shadow-2xl transition-all duration-300">
        <DialogHeader className="px-6 py-4 border-b bg-background/50 shrink-0 flex flex-row items-center justify-between h-20">
          <div className="flex flex-col justify-center h-full">
            <DialogTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
              {isFormOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -ml-2 mr-1"
                  onClick={closeForm}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              {isFormOpen
                ? editingPriority
                  ? 'Chỉnh sửa độ ưu tiên'
                  : 'Tạo độ ưu tiên mới'
                : 'Cấu hình độ ưu tiên'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isFormOpen
                ? 'Điền thông tin chi tiết bên dưới'
                : 'Quản lý danh sách và màu sắc mức độ ưu tiên'}
            </p>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden relative">
          <div
            className={cn(
              'absolute inset-0 flex flex-col bg-secondary/5 transition-all duration-300 ease-in-out',
              isFormOpen ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100 z-10',
            )}
          >
            <PriorityList
              priorities={priorities}
              isFetching={isFetching}
              isSubmitting={isSubmitting}
              onCreateNew={handleCreateNewClick}
              onEdit={handleEdit}
              onToggleActive={handleDeletePriority}
            />
          </div>

          <div
            className={cn(
              'absolute inset-0 flex flex-col bg-background transition-all duration-300 ease-in-out z-20',
              isFormOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
            )}
          >
            <PriorityForm
              form={form}
              isSubmitting={isSubmitting}
              isEditing={!!editingPriority}
              onCancel={closeForm}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
