import { memo } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import type { TaskPriorityDto } from '@/features/task/types/priority.types'

interface PriorityListProps {
  priorities: TaskPriorityDto[]
  isFetching: boolean
  isSubmitting: boolean
  onCreateNew: () => void
  onEdit: (priority: TaskPriorityDto) => void
  onToggleActive: (priorityId: string) => void
}

export function PriorityList({
  priorities,
  isFetching,
  isSubmitting,
  onCreateNew,
  onEdit,
  onToggleActive,
}: PriorityListProps) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="p-4 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Danh sách ({priorities.length})
          </span>
        </div>
        <Button
          onClick={onCreateNew}
          size="sm"
          className="h-9 shadow-sm"
          disabled={isFetching || isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0 w-full">
        <div className="grid grid-cols-1 gap-3 px-6 pb-6">
          {priorities.map((priority) => (
            <PriorityListItem
              key={priority.id}
              priority={priority}
              isFetching={isFetching}
              isSubmitting={isSubmitting}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
            />
          ))}

          {priorities.length === 0 && !isFetching && (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl border-muted bg-muted/20">
              <p className="text-muted-foreground font-medium mb-2">Chưa có priority nào</p>
              <Button variant="link" onClick={onCreateNew}>
                Tạo cái đầu tiên
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface PriorityListItemProps {
  priority: TaskPriorityDto
  isFetching: boolean
  isSubmitting: boolean
  onEdit: (priority: TaskPriorityDto) => void
  onToggleActive: (priorityId: string) => void
}

const PriorityListItem = memo(function PriorityListItem({
  priority,
  isFetching,
  isSubmitting,
  onEdit,
  onToggleActive,
}: PriorityListItemProps) {
  return (
    <div
      onClick={() => onEdit(priority)}
      className="group relative flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-background hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/50 group-hover:bg-primary/5 transition-colors">
          <div
            className="w-5 h-5 rounded-full shadow-sm ring-2 ring-background"
            style={{ backgroundColor: priority.color }}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-base">{priority.name}</span>
            {!priority.isActive && (
              <Badge variant="secondary" className="text-[10px] h-5">
                Ẩn
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Badge
              variant="outline"
              className="font-mono bg-transparent border-dashed text-[10px] h-5"
            >
              {priority.code}
            </Badge>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground" /> Level {priority.level}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-background hover:bg-primary/10 hover:text-primary border shadow-sm"
          disabled={isFetching || isSubmitting}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-background hover:bg-destructive/10 hover:text-destructive border shadow-sm"
          disabled={isFetching || isSubmitting}
          onClick={(event) => {
            event.stopPropagation()
            onToggleActive(priority.id)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
})
