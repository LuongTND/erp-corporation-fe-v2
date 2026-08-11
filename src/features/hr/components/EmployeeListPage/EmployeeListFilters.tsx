import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { EmployeeListView } from '../../types/employee-list.types'

interface DeptOption { id: string; name: string }

interface EmployeeListFiltersProps {
  departments: DeptOption[]
  activeDeptId: string | undefined
  onDeptChange: (id: string | undefined) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  view: EmployeeListView
  onViewChange: (view: EmployeeListView) => void
}

export function EmployeeListFilters({
  departments,
  activeDeptId,
  onDeptChange,
  statusFilter,
  onStatusFilterChange,
  view,
  onViewChange,
}: EmployeeListFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          key="all"
          type="button"
          onClick={() => onDeptChange(undefined)}
          className={cn(
            'h-7 cursor-pointer rounded-full border px-3 text-xs font-medium transition-colors',
            activeDeptId === undefined
              ? 'border-border bg-muted text-foreground'
              : 'border-transparent bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground',
          )}
        >
          Tất cả
        </button>
        {departments.map((dept) => (
          <button
            key={dept.id}
            type="button"
            onClick={() => onDeptChange(dept.id)}
            className={cn(
              'h-7 cursor-pointer rounded-full border px-3 text-xs font-medium transition-colors',
              activeDeptId === dept.id
                ? 'border-border bg-muted text-foreground'
                : 'border-transparent bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground',
            )}
          >
            {dept.name}
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-8 w-36 cursor-pointer border-border bg-card text-xs text-foreground">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent className="border-border bg-card text-foreground">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="Active">Đang làm</SelectItem>
            <SelectItem value="Official">Chính thức</SelectItem>
            <SelectItem value="Probation">Thử việc</SelectItem>
            <SelectItem value="Apprentice">Học việc</SelectItem>
            <SelectItem value="Suspended">Tạm nghỉ</SelectItem>
            <SelectItem value="MaternityLeave">Thai sản</SelectItem>
            <SelectItem value="Resigned">Đã nghỉ</SelectItem>
            <SelectItem value="Terminated">Chấm dứt HĐ</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center overflow-hidden rounded-md border border-border bg-card">
          <button
            type="button"
            onClick={() => onViewChange('table')}
            aria-label="Dạng bảng"
            className={cn(
              'flex h-8 w-8 cursor-pointer items-center justify-center transition-colors',
              view === 'table' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50',
            )}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            aria-label="Dạng lưới"
            className={cn(
              'flex h-8 w-8 cursor-pointer items-center justify-center border-l border-border transition-colors',
              view === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50',
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
