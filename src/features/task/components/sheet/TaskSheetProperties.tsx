import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar,
  CheckCircle2,
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
  { value: 'hieudd',   label: 'Hiếu Đức',  initials: 'HD' },
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexAlpha(hex: string, alpha: number): string {
  if (!hex?.startsWith('#')) return 'transparent'
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0')
  return `${hex}${a}`
}

// ── Property row ──────────────────────────────────────────────────────────────

function PropertyRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex items-center min-h-[34px] -mx-4 px-4 rounded-md transition-colors duration-[120ms]"
      style={{ backgroundColor: hovered ? '#f5f0e8' : 'transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-[120px] flex-none flex items-center gap-2 text-[12px]"
        style={{ color: '#8e8b82' }}
      >
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex-1 flex items-center min-w-0">{children}</div>
    </div>
  )
}

// ── Status pill ───────────────────────────────────────────────────────────────

function StatusPill({ color, label }: { color?: string; label: string }) {
  const bg  = color ? hexAlpha(color, 0.12) : '#f5f0e8'
  const txt = color || '#6c6a64'
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px] font-medium" style={{ backgroundColor: bg, color: txt }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: txt }} />
      {label}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

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
  const hasLoadedRef = React.useRef(false)

  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true
    if (cachedPriorities) return

    if (prioritiesLoadingPromise) {
      setIsLoadingPriorities(true)
      prioritiesLoadingPromise
        .then((d) => { setPriorities(d); setIsLoadingPriorities(false) })
        .catch(() => setIsLoadingPriorities(false))
      return
    }

    setIsLoadingPriorities(true)
    const fetch = async (): Promise<TaskPriorityDto[]> => {
      try {
        const d = await taskPriorityService.getAllForDropdown()
        cachedPriorities = d
        prioritiesLoadingPromise = null
        setPriorities(d)
        setIsLoadingPriorities(false)
        return d
      } catch {
        prioritiesLoadingPromise = null
        setIsLoadingPriorities(false)
        throw new Error('Failed to load priorities')
      }
    }
    prioritiesLoadingPromise = fetch()
  }, [])

  const statusInfo    = columns?.find((c) => String(c.id) === status)
  const selectedPri   = priorities.find((p) => p.id === priority || p.name === priority || p.code === priority)

  return (
    <div className="flex flex-col gap-0.5">
      {/* STATUS */}
      <PropertyRow icon={<CheckCircle2 className="h-3.5 w-3.5 shrink-0" />} label="Trạng thái">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger
            className="h-auto w-fit border-none shadow-none ring-0 focus:ring-0 focus-visible:ring-0 p-0 gap-0 [&>svg]:hidden cursor-pointer"
          >
            <SelectValue>
              {statusInfo
                ? <StatusPill color={statusInfo.color} label={statusInfo.title} />
                : <span className="text-[12px]" style={{ color: '#8e8b82' }}>Chọn trạng thái</span>
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="start"
            sideOffset={4}
            className="min-w-[160px] p-1 [&_[data-highlighted]]:bg-[#f5f0e8] [&_[data-highlighted]]:text-[#141413]"
            style={{ backgroundColor: '#FFFFFF', border: '0.5px solid #e6dfd8', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
          >
            {columns?.map((col) => (
              <SelectItem
                key={col.id}
                value={String(col.id)}
                className="text-[13px] rounded-md cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col.color || '#8e8b82' }} />
                  {col.title}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PropertyRow>

      {/* PRIORITY */}
      <PropertyRow icon={<Flag className="h-3.5 w-3.5 shrink-0" />} label="Độ ưu tiên">
        <Select
          value={priority || 'none'}
          onValueChange={(v) => setPriority(v === 'none' ? '' : v)}
          disabled={isLoadingPriorities}
        >
          <SelectTrigger
            className="h-auto w-fit border-none shadow-none ring-0 focus:ring-0 focus-visible:ring-0 p-0 gap-0 [&>svg]:hidden cursor-pointer"
          >
            <SelectValue>
              {selectedPri
                ? <StatusPill color={selectedPri.color} label={selectedPri.name} />
                : <span className="text-[12px]" style={{ color: '#8e8b82' }}>
                    {isLoadingPriorities ? 'Đang tải...' : 'Chọn độ ưu tiên'}
                  </span>
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="start"
            sideOffset={4}
            className="min-w-[160px] p-1 [&_[data-highlighted]]:bg-[#f5f0e8] [&_[data-highlighted]]:text-[#141413]"
            style={{ backgroundColor: '#FFFFFF', border: '0.5px solid #e6dfd8', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
          >
            <SelectItem value="none" className="text-[13px] rounded-md cursor-pointer">
              <span style={{ color: '#8e8b82' }}>Không có ưu tiên</span>
            </SelectItem>
            {priorities.map((p) => (
              <SelectItem key={p.id} value={p.id} className="text-[13px] rounded-md cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  {p.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PropertyRow>

      {/* ASSIGNEE */}
      <PropertyRow icon={<User className="h-3.5 w-3.5 shrink-0" />} label="Người thực hiện">
        <AssigneeSelector users={MOCK_USERS} value={assignee} onChange={setAssignee} />
      </PropertyRow>

      {/* TAG */}
      <PropertyRow icon={<TagIcon className="h-3.5 w-3.5 shrink-0" />} label="Nhãn">
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Thêm nhãn..."
          className="w-full bg-transparent border-none outline-none text-[12px]"
          style={{ color: '#141413' }}
        />
      </PropertyRow>

      {/* DATES */}
      <PropertyRow icon={<Calendar className="h-3.5 w-3.5 shrink-0" />} label="Ngày đến hạn">
        <TaskDatePicker
          startDate={startDate}
          dueDate={dueDate}
          onStartDateChange={setStartDate}
          onDueDateChange={setDueDate}
        />
      </PropertyRow>

      {/* CREATED */}
      <PropertyRow icon={<Clock className="h-3.5 w-3.5 shrink-0" />} label="Created">
        <span className="text-[12px]" style={{ color: '#8e8b82' }}>
          {createdAtFormatter.format(createdAt)}
        </span>
      </PropertyRow>
    </div>
  )
}
