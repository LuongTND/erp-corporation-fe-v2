/**
 * TaskForm Component
 * Form để create/edit task
 */

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useTaskForm } from '../hooks/use-task-form'
import type { Task, TaskPriority, TaskStatus } from '../types/task.types'

const PRIORITY_OPTIONS: TaskPriority[] = ['low', 'medium', 'high', 'urgent']
const STATUS_OPTIONS: TaskStatus[] = ['todo', 'in-progress', 'in-review', 'done', 'cancelled']

interface TaskFormProps {
  initialData?: Task
  onSuccess?: () => void
  onCancel?: () => void
}

export function TaskForm({
  initialData,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useTaskForm({
    initialData,
    onSuccess,
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <Label htmlFor="title">Tiêu đề *</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Nhập tiêu đề task"
          disabled={isSubmitting}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Nhập mô tả task"
          disabled={isSubmitting}
          rows={4}
        />
      </div>

      {/* Priority */}
      <div>
        <Label htmlFor="priority">Độ ưu tiên *</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => handleChange('priority', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div>
        <Label htmlFor="status">Trạng thái *</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange('status', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Due Date */}
      <div>
        <Label htmlFor="dueDate">Ngày đến hạn</Label>
        <Input
          id="dueDate"
          type="date"
          value={
            formData.dueDate
              ? new Date(formData.dueDate).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) =>
            handleChange('dueDate', e.target.value ? new Date(e.target.value) : undefined)
          }
          disabled={isSubmitting}
        />
      </div>

      {/* Estimated Hours */}
      <div>
        <Label htmlFor="estimatedHours">Giờ ước tính</Label>
        <Input
          id="estimatedHours"
          type="number"
          min="0"
          value={formData.estimatedHours || ''}
          onChange={(e) =>
            handleChange('estimatedHours', e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="0"
          disabled={isSubmitting}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu Task'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </form>
  )
}
