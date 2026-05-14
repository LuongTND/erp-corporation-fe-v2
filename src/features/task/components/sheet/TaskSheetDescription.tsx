import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Task } from '../../types/task.types'

interface TaskSheetDescriptionProps {
  description: string
  setDescription: (value: string) => void
  task?: Task | null
}

export function TaskSheetDescription({ description, setDescription, task }: TaskSheetDescriptionProps) {
  return (
    <div className="min-h-[200px]">
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={task ? 'Thêm mô tả chi tiết...' : 'Nhập mô tả cho task mới...'}
        className={cn(
          'min-h-[200px] w-full resize-none border-none shadow-none focus-visible:ring-0',
          'bg-transparent p-0',
          'text-sm text-foreground placeholder:text-muted-foreground/50',
        )}
      />
    </div>
  )
}
