import { cn } from '@/lib/utils'
import { Plus, Settings } from 'lucide-react'
import * as React from 'react'

import type { TaskItemDto } from '@/features/task/types/task.types'
import type { SortOption, SortOrder, TaskFilterParams } from '@/features/task/types/task.types'

import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { TaskCreateDialog } from '../views/board/dialogs/TaskCreateDialog'
import { PriorityManagerDialog } from '../views/board/priority-manager/PriorityManagerDialog'
import { TaskToolbarFilter } from './TaskToolbarFilter'
import { TaskToolbarSearch } from './TaskToolbarSearch'
import { TaskToolbarSort } from './TaskToolbarSort'

interface TaskToolbarProps {
  onCreateTask?: (task?: TaskItemDto) => void
  onSearch?: (value: string) => void
  onFilterChange?: (params: TaskFilterParams) => void
}

export function TaskToolbar({ onCreateTask, onSearch, onFilterChange }: TaskToolbarProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [filters, setFilters] = React.useState<TaskFilterParams>({
    search: '',
    statusIds: [],
    priorityIds: [],
    sortBy: 'CreatedAtUtc',
    sortOrder: 'desc',
  })

  React.useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  React.useEffect(() => {
    onFilterChange?.(filters)
  }, [filters, onFilterChange])

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }))
    onSearch?.(value)
  }

  const handleSortChange = (field: SortOption, order: SortOrder) => {
    setFilters((prev) => ({ ...prev, sortBy: field, sortOrder: order }))
  }

  const handleFilterMenuChange = (type: 'status' | 'priority', ids: string[]) => {
    setFilters((prev) => ({
      ...prev,
      [type === 'status' ? 'statusIds' : 'priorityIds']: ids,
    }))
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-14 items-center justify-between w-full">
        <div
          className={cn(
            'transition-all duration-300 flex items-center gap-2',
            isSearchOpen
              ? 'opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto'
              : 'opacity-100',
          )}
        >
          <TaskCreateDialog onTaskCreated={onCreateTask}>
            <Button size="sm" className="h-8 gap-1 px-3">
              <Plus className="h-3.5 w-3.5" />
              <span className="font-medium">Tạo Task</span>
            </Button>
          </TaskCreateDialog>

          <PriorityManagerDialog>
            <Button variant="outline" size="sm" className="h-8 gap-1 px-3">
              <Settings className="h-3.5 w-3.5" />
              <span className="font-medium">Priority</span>
            </Button>
          </PriorityManagerDialog>
        </div>

        <div className="flex items-center gap-0.5">
          <TaskToolbarFilter
            selectedStatusIds={filters.statusIds}
            selectedPriorityIds={filters.priorityIds}
            onFilterChange={handleFilterMenuChange}
          />

          <TaskToolbarSort
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortChange={handleSortChange}
          />

          <TaskToolbarSearch
            isOpen={isSearchOpen}
            searchValue={filters.search ?? ''}
            inputRef={inputRef}
            onOpen={() => setIsSearchOpen(true)}
            onChange={handleSearch}
            onClose={() => {
              setFilters((prev) => ({ ...prev, search: '' }))
              setIsSearchOpen(false)
              onSearch?.('')
            }}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}
