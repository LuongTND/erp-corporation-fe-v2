import { LayoutGrid, List } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  EmployeeListDepartment,
  EmployeeListView,
} from '../../types/employee-list.types'

interface EmployeeListFiltersProps {
  departments: ReadonlyArray<'All' | EmployeeListDepartment>
  activeDept: 'All' | EmployeeListDepartment
  onDeptChange: (department: 'All' | EmployeeListDepartment) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  view: EmployeeListView
  onViewChange: (view: EmployeeListView) => void
}

export function EmployeeListFilters({
  departments,
  activeDept,
  onDeptChange,
  statusFilter,
  onStatusFilterChange,
  view,
  onViewChange,
}: EmployeeListFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {departments.map((department) => (
          <button
            key={department}
            type="button"
            onClick={() => onDeptChange(department)}
            className="h-7 cursor-pointer rounded-full border px-3 text-xs font-medium transition-colors"
            style={
              activeDept === department
                ? { backgroundColor: '#efe9de', color: '#141413', borderColor: '#e6dfd8' }
                : { backgroundColor: 'transparent', color: '#6c6a64', borderColor: 'transparent' }
            }
          >
            {department}
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-8 w-36 cursor-pointer border-[#e6dfd8] bg-[#faf9f5] text-xs text-[#141413]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="border-[#e6dfd8] bg-[#faf9f5] text-[#141413]">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on-leave">On Leave</SelectItem>
            <SelectItem value="probation">Probation</SelectItem>
            <SelectItem value="resigned">Resigned</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center overflow-hidden rounded-md border" style={{ borderColor: '#e6dfd8', backgroundColor: '#faf9f5' }}>
          <button
            type="button"
            onClick={() => onViewChange('table')}
            aria-label="Table view"
            className="flex h-8 w-8 cursor-pointer items-center justify-center transition-colors"
            style={{ backgroundColor: view === 'table' ? '#efe9de' : '#faf9f5', color: view === 'table' ? '#141413' : '#8e8b82' }}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            aria-label="Grid view"
            className="flex h-8 w-8 cursor-pointer items-center justify-center border-l transition-colors"
            style={{
              borderColor: '#e6dfd8',
              backgroundColor: view === 'grid' ? '#efe9de' : '#faf9f5',
              color: view === 'grid' ? '#141413' : '#8e8b82',
            }}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
