import { Button } from '@/components/ui/button'
import { ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react'
import type { Task } from '../../types/task.types'

interface TaskSheetHeaderProps {
  task?: Task | null
  onClose: () => void
  isUpdating?: boolean
}

export function TaskSheetHeader({ task, onClose, isUpdating = false }: TaskSheetHeaderProps) {
  return (
    <div className="h-12 flex items-center justify-between px-3 pt-2 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-accent"
        onClick={onClose}
        disabled={isUpdating}
      >
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Button>

      <div className="flex gap-1">
        {task && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
