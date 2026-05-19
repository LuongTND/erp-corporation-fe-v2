import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { SortOption, SortOrder } from '@/features/task/types/task.types'
import { ArrowUpDown, Check } from 'lucide-react'

interface TaskToolbarSortProps {
  sortBy?: SortOption
  sortOrder?: SortOrder
  onSortChange: (field: SortOption, order: SortOrder) => void
}

export function TaskToolbarSort({ sortBy, sortOrder, onSortChange }: TaskToolbarSortProps) {
  const iconSize = 'h-4 w-4'

  const isActive = (field: SortOption, order: SortOrder) =>
    sortBy === field && sortOrder === order

  const SortItem = ({
    field,
    order,
    label,
  }: {
    field: SortOption
    order: SortOrder
    label: string
  }) => (
    <DropdownMenuItem onClick={() => onSortChange(field, order)} className="justify-between">
      {label}
      {isActive(field, order) && <Check className="h-4 w-4 ml-2" />}
    </DropdownMenuItem>
  )

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <ArrowUpDown className={iconSize} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Sắp xếp</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-48">
        <SortItem field="CreatedAtUtc" order="desc" label="Mới nhất" />
        <SortItem field="CreatedAtUtc" order="asc" label="Cũ nhất" />

        <DropdownMenuItem disabled className="h-px bg-muted my-1 p-0 focus:bg-muted" />

        <SortItem field="Title" order="asc" label="Tên A-Z" />
        <SortItem field="Title" order="desc" label="Tên Z-A" />

        <DropdownMenuItem disabled className="h-px bg-muted my-1 p-0 focus:bg-muted" />

        <SortItem field="DueDate" order="asc" label="Hạn sớm nhất" />
        <SortItem field="DueDate" order="desc" label="Hạn muộn nhất" />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
