import { useState, useMemo, useEffect } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown, Plus } from 'lucide-react'
import { format } from 'date-fns'
import type { Task, Column, TaskItemDto } from '@/features/task/types/task.types'
import type { TaskPriorityDto } from '@/features/task/types/priority.types'
import { taskPriorityService } from '@/features/task/mocks/task.mock'
import { TaskCreateDialog } from '../board/dialogs/TaskCreateDialog'

const C = {
  bg: '#FFFFFF',
  bgHover: '#f5f0e8',
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
} as const

function hexAlpha(hex: string, alpha: number) {
  if (!hex?.startsWith('#')) return 'transparent'
  return `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
}

function StatusPill({ color, label }: { color?: string; label: string }) {
  const bg = color ? hexAlpha(color, 0.12) : '#f5f0e8'
  const txt = color || '#6c6a64'
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
      style={{ backgroundColor: bg, color: txt }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: txt }} />
      {label}
    </span>
  )
}

function UserAvatar({ name, size = 20 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <span
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38, backgroundColor: C.accent }}
    >
      {initials}
    </span>
  )
}

type SortField = 'title' | 'status' | 'priority' | 'dueDate'
type SortDir = 'asc' | 'desc'

let cachedTablePriorities: TaskPriorityDto[] | null = null

interface TaskTableProps {
  tasks: Task[]
  columns: Column[]
  searchQuery?: string
  onTaskClick: (task: Task) => void
  onTaskCreated?: (task?: TaskItemDto) => void
}

export function TaskTable({
  tasks,
  columns,
  searchQuery = '',
  onTaskClick,
  onTaskCreated,
}: TaskTableProps) {
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [priorities, setPriorities] = useState<TaskPriorityDto[]>(
    cachedTablePriorities ?? [],
  )

  useEffect(() => {
    if (cachedTablePriorities) return
    taskPriorityService
      .getAllForDropdown()
      .then((data) => {
        cachedTablePriorities = data
        setPriorities(data)
      })
      .catch(() => {})
  }, [])

  const priorityMap = useMemo(() => {
    const map = new Map<string, TaskPriorityDto>()
    priorities.forEach((p) => {
      map.set(p.id, p)
      map.set(p.name, p)
      if (p.code) map.set(p.code, p)
    })
    return map
  }, [priorities])

  const columnMap = useMemo(() => {
    const map = new Map<string, Column>()
    columns.forEach((c) => map.set(String(c.id), c))
    return map
  }, [columns])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const displayedTasks = useMemo(() => {
    let list = tasks
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.code?.toLowerCase().includes(q) ||
          t.assignee?.toLowerCase().includes(q),
      )
    }
    return [...list].sort((a, b) => {
      let cmp = 0
      if (sortField === 'title') cmp = (a.title || '').localeCompare(b.title || '')
      else if (sortField === 'status') cmp = (a.status || '').localeCompare(b.status || '')
      else if (sortField === 'priority') cmp = (a.priority || '').localeCompare(b.priority || '')
      else if (sortField === 'dueDate') {
        const aD = a.dueDate || a.date || ''
        const bD = b.dueDate || b.date || ''
        cmp = aD > bD ? 1 : aD < bD ? -1 : 0
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [tasks, searchQuery, sortField, sortDir])

  const allSelected =
    displayedTasks.length > 0 &&
    displayedTasks.every((t) => selectedIds.has(String(t.id)))

  const toggleAll = () => {
    setSelectedIds(
      allSelected ? new Set() : new Set(displayedTasks.map((t) => String(t.id))),
    )
  }

  const toggleOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-3 w-3 opacity-30 shrink-0" />
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3 w-3 shrink-0" style={{ color: C.accent }} />
    ) : (
      <ArrowDown className="h-3 w-3 shrink-0" style={{ color: C.accent }} />
    )
  }

  const ColHeader = ({
    field,
    label,
    width,
  }: {
    field: SortField
    label: string
    width?: number
  }) => (
    <th
      className="text-left font-normal px-3 py-2 select-none whitespace-nowrap cursor-pointer"
      style={{
        width,
        color: C.muted,
        fontSize: 12,
        borderRight: `0.5px solid ${C.border}`,
      }}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  )

  const selectedCount = selectedIds.size
  const today = new Date(new Date().setHours(0, 0, 0, 0))

  return (
    <div className="flex flex-col">
      {/* Bulk action bar */}
      {selectedCount > 0 && (
        <div
          className="flex items-center gap-3 px-5 py-2 text-[12px] shrink-0"
          style={{
            backgroundColor: hexAlpha(C.accent, 0.07),
            borderBottom: `0.5px solid ${C.border}`,
          }}
        >
          <span style={{ color: C.accent, fontWeight: 500 }}>
            {selectedCount} task đã chọn
          </span>
          <span
            style={{
              display: 'inline-block',
              width: '0.5px',
              height: 12,
              backgroundColor: C.border,
            }}
          />
          <button
            type="button"
            className="cursor-pointer hover:underline"
            style={{ color: C.muted }}
          >
            Đổi trạng thái
          </button>
          <button
            type="button"
            className="cursor-pointer hover:underline"
            style={{ color: C.muted }}
          >
            Giao cho
          </button>
          <button
            type="button"
            className="cursor-pointer hover:underline"
            style={{ color: '#dc2626' }}
            onClick={() => setSelectedIds(new Set())}
          >
            Bỏ chọn
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 680 }}>
          <thead>
            <tr
              style={{
                backgroundColor: C.bg,
                borderBottom: `0.5px solid ${C.border}`,
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <th
                className="w-10 px-3 py-2"
                style={{ borderRight: `0.5px solid ${C.border}` }}
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="cursor-pointer"
                  style={{ accentColor: C.accent }}
                />
              </th>
              <ColHeader field="title" label="Tiêu đề" />
              <ColHeader field="status" label="Trạng thái" width={144} />
              <ColHeader field="priority" label="Ưu tiên" width={120} />
              <th
                className="text-left font-normal px-3 py-2 whitespace-nowrap"
                style={{
                  width: 130,
                  color: C.muted,
                  fontSize: 12,
                  borderRight: `0.5px solid ${C.border}`,
                }}
              >
                Người thực hiện
              </th>
              <ColHeader field="dueDate" label="Đến hạn" width={110} />
              <th
                className="text-left font-normal px-3 py-2 whitespace-nowrap"
                style={{ width: 80, color: C.muted, fontSize: 12 }}
              >
                Giờ TT
              </th>
            </tr>
          </thead>

          <tbody>
            {displayedTasks.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-16 text-[13px]"
                  style={{ color: C.muted }}
                >
                  Không có task nào
                </td>
              </tr>
            )}

            {displayedTasks.map((task) => {
              const taskId = String(task.id)
              const isSelected = selectedIds.has(taskId)
              const col = columnMap.get(String(task.columnId))
              const pri =
                priorityMap.get(task.priorityId || '') ||
                priorityMap.get(task.priority || '')
              const dueDate = task.dueDate || task.date
              const isOverdue = dueDate && new Date(dueDate) < today

              return (
                <tr
                  key={taskId}
                  style={{
                    backgroundColor: isSelected ? hexAlpha(C.accent, 0.05) : 'transparent',
                    borderBottom: `0.5px solid ${C.border}`,
                    cursor: 'pointer',
                    transition: 'background-color 100ms',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = C.bgHover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isSelected
                      ? hexAlpha(C.accent, 0.05)
                      : 'transparent'
                  }}
                  onClick={() => onTaskClick(task)}
                >
                  {/* Checkbox */}
                  <td
                    className="w-10 px-3 py-2.5"
                    style={{ borderRight: `0.5px solid ${C.border}` }}
                    onClick={(e) => toggleOne(taskId, e)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="cursor-pointer"
                      style={{ accentColor: C.accent }}
                    />
                  </td>

                  {/* Title */}
                  <td
                    className="px-3 py-2.5"
                    style={{ borderRight: `0.5px solid ${C.border}` }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-medium" style={{ color: C.text }}>
                        {task.title}
                      </span>
                      {task.code && (
                        <span className="text-[11px]" style={{ color: C.muted }}>
                          {task.code}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td
                    className="px-3 py-2.5"
                    style={{ borderRight: `0.5px solid ${C.border}` }}
                  >
                    {col ? (
                      <StatusPill color={col.color} label={col.title} />
                    ) : task.status ? (
                      <StatusPill label={task.status} />
                    ) : (
                      <span style={{ color: C.muted, fontSize: 12 }}>—</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td
                    className="px-3 py-2.5"
                    style={{ borderRight: `0.5px solid ${C.border}` }}
                  >
                    {pri ? (
                      <StatusPill color={pri.color} label={pri.name} />
                    ) : task.priority ? (
                      <StatusPill label={task.priority} />
                    ) : (
                      <span style={{ color: C.muted, fontSize: 12 }}>—</span>
                    )}
                  </td>

                  {/* Assignee */}
                  <td
                    className="px-3 py-2.5"
                    style={{ borderRight: `0.5px solid ${C.border}` }}
                  >
                    {task.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <UserAvatar name={task.assignee} size={20} />
                        <span
                          className="text-[12px] truncate max-w-[80px]"
                          style={{ color: C.text }}
                        >
                          {task.assignee}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: C.muted, fontSize: 12 }}>—</span>
                    )}
                  </td>

                  {/* Due date */}
                  <td
                    className="px-3 py-2.5"
                    style={{ borderRight: `0.5px solid ${C.border}` }}
                  >
                    {dueDate ? (
                      <span
                        className="text-[12px]"
                        style={{ color: isOverdue ? '#d97706' : C.text }}
                      >
                        {format(new Date(dueDate), 'dd/MM/yyyy')}
                      </span>
                    ) : (
                      <span style={{ color: C.muted, fontSize: 12 }}>—</span>
                    )}
                  </td>

                  {/* Est. hours */}
                  <td className="px-3 py-2.5">
                    <span className="text-[12px]" style={{ color: C.muted }}>
                      {task.estimatedHours != null ? `${task.estimatedHours}h` : '—'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Add new task row */}
        <TaskCreateDialog onTaskCreated={onTaskCreated}>
          <button
            type="button"
            className="flex items-center gap-2 w-full px-5 py-2.5 text-[12px] cursor-pointer transition-colors duration-[120ms]"
            style={{ color: C.muted, borderBottom: `0.5px solid ${C.border}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = C.bgHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm task mới
          </button>
        </TaskCreateDialog>
      </div>
    </div>
  )
}
