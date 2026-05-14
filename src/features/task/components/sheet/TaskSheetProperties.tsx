import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Flag,
  Tag as TagIcon,
  User,
} from 'lucide-react'
import type { ReactNode } from 'react'
import React, { useEffect, useState } from 'react'
import { taskPriorityService } from '../../services/task-priority.service'
import type { Column } from '../../types/task.types'
import type { TaskPriorityDto } from '../../types/priority.types'
import { TaskDatePicker } from './TaskSheetDatePicker'
import { AssigneeSelector, type UserOption } from './TaskSheetAssigneeSelector'

const MOCK_USERS: UserOption[] = [
  { value: 'hieudd', label: 'Hiếu Đức', initials: 'HD' },
  { value: 'quanghuy', label: 'Quang Huy', initials: 'QH' },
]

const createdAtFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

let cachedPriorities: TaskPriorityDto[] | null = null
let prioritiesLoadingPromise: Promise<TaskPriorityDto[]> | null = null

interface TaskSheetPropertiesProps {
  columns?: Column[]
  status: string
  setStatus: (value: string) => void
  priority: string
  setPriority: (value: string) => void
  assignee: string
  setAssignee: (value: string) => void
  tag: string
  setTag: (value: string) => void
  startDate: Date | undefined
  setStartDate: (value: Date | undefined) => void
  dueDate: Date | undefined
  setDueDate: (value: Date | undefined) => void
  createdAt: Date
}

export function TaskSheetProperties({
  columns,
  status,
  setStatus,
  priority,
  setPriority,
  assignee,
  setAssignee,
  tag,
  setTag,
  startDate,
  setStartDate,
  dueDate,
  setDueDate,
  createdAt,
}: TaskSheetPropertiesProps) {
  const [priorities, setPriorities] = useState<TaskPriorityDto[]>(cachedPriorities || [])
  const [isLoadingPriorities, setIsLoadingPriorities] = useState(false)
  const hasLoadedPrioritiesRef = React.useRef(false)

  const statusInfo = columns?.find((col) => String(col.id) === status)

  useEffect(() => {
    if (hasLoadedPrioritiesRef.current) return
    hasLoadedPrioritiesRef.current = true

    if (cachedPriorities) return

    if (prioritiesLoadingPromise) {
      setIsLoadingPriorities(true)
      prioritiesLoadingPromise
        .then((data) => {
          setPriorities(data)
          setIsLoadingPriorities(false)
        })
        .catch(() => setIsLoadingPriorities(false))
      return
    }

    setIsLoadingPriorities(true)
    const fetchPriorities = async (): Promise<TaskPriorityDto[]> => {
      try {
        const data = await taskPriorityService.getAllForDropdown()
        cachedPriorities = data
        prioritiesLoadingPromise = null
        setPriorities(data)
        setIsLoadingPriorities(false)
        return data
      } catch (error) {
        console.error('Failed to fetch priorities:', error)
        prioritiesLoadingPromise = null
        setIsLoadingPriorities(false)
        throw error
      }
    }
    prioritiesLoadingPromise = fetchPriorities()
  }, [])

  const getPriorityInfo = (val: string) => {
    if (!val) return null
    return (
      priorities.find((p) => p.id === val) ||
      priorities.find((p) => p.name === val) ||
      priorities.find((p) => p.code === val)
    )
  }
  const selectedPriority = getPriorityInfo(priority)

  const formatCreatedDate = (date: Date) => createdAtFormatter.format(date)

  const getGlassStyle = (color?: string) => {
    if (!color) return undefined
    if (color.startsWith('#')) {
      return {
        backgroundColor: `${color}26`,
        color: color,
        borderColor: `${color}33`,
      }
    }
    return { backgroundColor: color, color: '#fff' }
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* STATUS */}
      <PropertyRow icon={<CheckCircle2 className="h-4 w-4" />} label="Status">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger
            className={cn(
              'group w-fit min-w-[130px] border-none ring-0 focus:ring-0',
              'h-8 rounded-full px-3 text-xs font-medium transition-colors',
              'flex items-center justify-between gap-2',
              !statusInfo?.color && 'bg-secondary/40 text-secondary-foreground',
              '[&>svg:last-child]:hidden',
            )}
            style={getGlassStyle(statusInfo?.color)}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: statusInfo?.color }}
              />
              <SelectValue />
            </div>
            <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            sideOffset={4}
            className="bg-popover/95 backdrop-blur-xl border-white/10"
          >
            {columns?.map((col) => (
              <SelectItem key={col.id} value={String(col.id)}>
                {col.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PropertyRow>

      {/* PRIORITY */}
      <PropertyRow icon={<Flag className="h-4 w-4" />} label="Priority">
        <Select
          value={priority || 'none'}
          onValueChange={(val) => setPriority(val === 'none' ? '' : val)}
          disabled={isLoadingPriorities}
        >
          <SelectTrigger
            className={cn(
              'group w-fit min-w-[130px] h-8 rounded-full border-none px-3 text-xs font-medium transition-colors',
              'flex items-center justify-between gap-2',
              !selectedPriority?.color && 'bg-secondary/20 text-muted-foreground hover:bg-secondary/30',
              '[&>svg:last-child]:hidden',
            )}
            style={getGlassStyle(selectedPriority?.color)}
          >
            <div className="flex items-center gap-1">
              <SelectValue placeholder={isLoadingPriorities ? 'Loading...' : 'Set Priority'} />
            </div>
            <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            sideOffset={4}
            className="bg-popover/95 backdrop-blur-xl border-white/10"
          >
            <SelectItem value="none">No priority</SelectItem>
            {priorities.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PropertyRow>

      {/* ASSIGNEE */}
      <PropertyRow icon={<User className="h-4 w-4" />} label="Assignee">
        <div className="flex">
          <AssigneeSelector users={MOCK_USERS} value={assignee} onChange={setAssignee} />
        </div>
      </PropertyRow>

      {/* TAG */}
      <PropertyRow icon={<TagIcon className="h-4 w-4" />} label="Tag">
        <Input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Add tag"
          className={cn(
            'h-8 w-full max-w-[200px] border-none bg-transparent px-0 hover:bg-transparent focus:bg-transparent',
            'placeholder:text-muted-foreground/40 text-sm pl-1',
          )}
        />
      </PropertyRow>

      {/* DATES */}
      <PropertyRow icon={<Calendar className="h-4 w-4" />} label="Dates">
        <div
          className={cn(
            'rounded-full transition-colors w-fit',
            '[&_button]:bg-transparent [&_button]:border-none [&_button]:h-8 [&_button]:text-xs [&_button]:font-medium [&_button]:text-foreground [&_button]:hover:bg-white/10',
          )}
        >
          <TaskDatePicker
            startDate={startDate}
            dueDate={dueDate}
            onStartDateChange={setStartDate}
            onDueDateChange={setDueDate}
          />
        </div>
      </PropertyRow>

      {/* CREATED AT */}
      <PropertyRow icon={<Clock className="h-4 w-4" />} label="Date Created">
        <span className="text-xs text-muted-foreground/60 font-medium pl-1">
          {formatCreatedDate(createdAt)}
        </span>
      </PropertyRow>
    </div>
  )
}

function PropertyRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center min-h-[40px] group">
      <div className="w-[140px] flex-none flex items-center gap-2.5 text-sm text-muted-foreground px-1">
        <span className="opacity-40 group-hover:opacity-100 transition-opacity duration-300">
          {icon}
        </span>
        <span className="whitespace-normal font-medium opacity-60 group-hover:opacity-100 transition-opacity duration-300 text-[13px] leading-4">
          {label}
        </span>
      </div>
      <div className="flex-1 flex items-center overflow-hidden">{children}</div>
    </div>
  )
}
