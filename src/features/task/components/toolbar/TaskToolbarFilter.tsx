import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ListFilter } from 'lucide-react'

const STATUS_OPTIONS = [
  { id: 'todo', label: 'Cần làm' },
  { id: 'in_progress', label: 'Đang làm' },
  { id: 'done', label: 'Hoàn thành' },
]

const PRIORITY_OPTIONS = [
  { id: 'high', label: 'Cao' },
  { id: 'medium', label: 'Trung bình' },
  { id: 'low', label: 'Thấp' },
]

interface TaskToolbarFilterProps {
  selectedStatusIds?: string[]
  selectedPriorityIds?: string[]
  onFilterChange: (type: 'status' | 'priority', ids: string[]) => void
}

export function TaskToolbarFilter({
  selectedStatusIds = [],
  selectedPriorityIds = [],
  onFilterChange,
}: TaskToolbarFilterProps) {
  const iconSize = 'h-4 w-4'

  const handleToggle = (type: 'status' | 'priority', id: string) => {
    const currentIds = type === 'status' ? selectedStatusIds : selectedPriorityIds
    const newIds = currentIds.includes(id)
      ? currentIds.filter((item) => item !== id)
      : [...currentIds, id]
    onFilterChange(type, newIds)
  }

  const clearFilters = () => {
    onFilterChange('status', [])
    onFilterChange('priority', [])
  }

  const hasFilters = selectedStatusIds.length > 0 || selectedPriorityIds.length > 0

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant={hasFilters ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <ListFilter className={iconSize} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Bộ lọc</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
        {STATUS_OPTIONS.map((status) => (
          <DropdownMenuCheckboxItem
            key={status.id}
            checked={selectedStatusIds.includes(status.id)}
            onCheckedChange={() => handleToggle('status', status.id)}
          >
            {status.label}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Độ ưu tiên</DropdownMenuLabel>
        {PRIORITY_OPTIONS.map((priority) => (
          <DropdownMenuCheckboxItem
            key={priority.id}
            checked={selectedPriorityIds.includes(priority.id)}
            onCheckedChange={() => handleToggle('priority', priority.id)}
          >
            {priority.label}
          </DropdownMenuCheckboxItem>
        ))}

        {hasFilters && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel
              className="text-center text-xs font-normal text-destructive cursor-pointer hover:bg-destructive/10 rounded-sm py-1.5"
              onClick={clearFilters}
            >
              Xóa bộ lọc
            </DropdownMenuLabel>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
