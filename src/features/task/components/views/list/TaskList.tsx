import type { Task, TaskStatusDto, Id, UpdateTaskRequest } from '@/features/task/types/task.types'
import * as React from 'react'
import { Calendar, ChevronDown, ChevronRight, Copy, Edit2, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TaskContextMenu } from '@/features/task/components/shared/TaskContextMenu'
import { useTaskActions } from '@/features/task/context/TaskActionsContext'

interface TaskListProps {
  tasks: Task[]
  statuses: TaskStatusDto[]
  onTaskClick?: (task: Task) => void
  searchQuery?: string
  onTaskMove?: (taskId: Id, newSectionKey: string) => void
  onTaskUpdate?: (taskId: string, data: UpdateTaskRequest) => Promise<unknown>
  groupBy?: 'status' | 'priority'
}

// ── Group configs ─────────────────────────────────────────────────────────────

type SectionGroup = {
  key: string
  label: string
  dot: string
  titleColor: string
  isDone?: boolean
}

const PRIORITY_GROUPS: SectionGroup[] = [
  { key: 'urgent', label: 'Khẩn cấp',        dot: 'var(--t-priority-high-text)', titleColor: 'oklch(var(--muted-foreground))' },
  { key: 'high',   label: 'Cao',              dot: 'var(--t-priority-high-text)', titleColor: 'oklch(var(--muted-foreground))' },
  { key: 'medium', label: 'Trung bình',       dot: 'var(--t-priority-med-text)', titleColor: 'oklch(var(--muted-foreground))' },
  { key: 'low',    label: 'Thấp',             dot: 'var(--t-priority-low-text)', titleColor: 'oklch(var(--muted-foreground))' },
  { key: 'none',   label: 'Không có ưu tiên', dot: 'oklch(var(--muted-foreground))', titleColor: 'oklch(var(--muted-foreground))' },
]

function getPriorityGroup(task: Task): string {
  const p = (task.priority ?? '').toLowerCase()
  if (p === 'urgent') return 'urgent'
  if (p === 'high') return 'high'
  if (p === 'medium') return 'medium'
  if (p === 'low') return 'low'
  return 'none'
}

// ── Priority badge ────────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority?: string }) {
  if (!priority) return null
  const p = priority.toLowerCase()

  let bg = 'oklch(var(--primary) / 0.1)', color = 'oklch(var(--primary))'
  if (p === 'high' || p === 'urgent') { bg = 'oklch(var(--destructive) / 0.1)'; color = 'oklch(var(--destructive))' }
  else if (p === 'medium') { bg = 'var(--t-priority-med-bg)'; color = 'var(--t-priority-med-text)' }

  return (
    <span
      className="text-[11px] font-medium rounded-full px-2 py-px leading-none capitalize"
      style={{ backgroundColor: bg, color }}
    >
      {priority}
    </span>
  )
}

// ── Due date chip ─────────────────────────────────────────────────────────────

function DueDateChip({ date }: { date?: string }) {
  if (!date) return null
  const d = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  const isToday = d.getTime() === today.getTime()
  const isOverdue = d < today

  let color = 'oklch(var(--muted-foreground))', bg = 'transparent', padding = '0'
  if (isToday)   { color = 'oklch(var(--primary))'; bg = 'oklch(var(--primary) / 0.1)'; padding = '2px 6px' }
  if (isOverdue) { color = 'oklch(var(--destructive))'; bg = 'oklch(var(--destructive) / 0.1)'; padding = '2px 6px' }

  const label = isToday
    ? 'Today'
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <span className="flex items-center gap-1 text-[11px] rounded" style={{ color, backgroundColor: bg, padding }}>
      <Calendar className="h-3 w-3 shrink-0" />
      {label}
    </span>
  )
}

// ── Draggable task row ────────────────────────────────────────────────────────

function DraggableTaskRow({ task, onClick, onToggleDone, isDone = false }: { task: Task; onClick?: (t: Task) => void; onToggleDone?: (task: Task) => void; isDone?: boolean }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })
  const { onDuplicate, onArchive } = useTaskActions()
  const [hovered, setHovered] = React.useState(false)
  const done = isDone

  return (
    <TaskContextMenu task={task}>
    <div
      ref={setNodeRef}
      {...attributes}
      role="row"
      className="flex items-center h-11 px-2 rounded-md cursor-pointer group relative"
      style={{
        borderBottom: '0.5px solid oklch(var(--border))',
        backgroundColor: hovered ? 'oklch(var(--muted) / 0.5)' : 'transparent',
        transition: 'background 120ms ease',
        opacity: isDragging ? 0.35 : 1,
      }}
      onClick={() => { if (!isDragging) onClick?.(task) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        className="flex flex-col gap-[3px] mr-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[120ms] cursor-grab active:cursor-grabbing touch-none"
        style={{ width: 8, minWidth: 8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
      </div>

      {/* Checkbox */}
      <button
        type="button"
        aria-label="Hoàn thành task"
        className="w-4 h-4 rounded-full border shrink-0 mr-3 flex items-center justify-center cursor-pointer transition-colors duration-200"
        style={{
          borderColor: done ? 'var(--t-status-done-text)' : hovered ? 'oklch(var(--primary))' : 'oklch(var(--border))',
          backgroundColor: done ? 'var(--t-status-done-text)' : 'transparent',
        }}
        onClick={(e) => { e.stopPropagation(); onToggleDone?.(task) }}
      >
        {done && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className="flex-1 text-[13px] truncate"
        style={{
          color: done ? 'oklch(var(--muted-foreground))' : 'oklch(var(--foreground))',
          textDecoration: done ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </span>

      {/* Meta */}
      <div className="flex items-center gap-1.5 ml-3 shrink-0">
        {task.assignee && (
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0 bg-primary"
            title={task.assignee}
          >
            {task.assignee.charAt(0).toUpperCase()}
          </span>
        )}
        <DueDateChip date={task.date} />
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Action buttons (hover) */}
      {hovered && !isDragging && (
        <div className="flex items-center gap-0.5 ml-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label="Edit task"
            className="w-[22px] h-[22px] rounded flex items-center justify-center cursor-pointer transition-colors duration-[120ms]"
            style={{ color: 'oklch(var(--muted-foreground))' }}
            onClick={(e) => { e.stopPropagation(); onClick?.(task) }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'oklch(var(--border))' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More options"
                className="w-[22px] h-[22px] rounded flex items-center justify-center cursor-pointer transition-colors duration-[120ms]"
                style={{ color: 'oklch(var(--muted-foreground))' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'oklch(var(--border))' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 text-[13px]">
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => onDuplicate(task)}
              >
                <Copy className="h-3.5 w-3.5 opacity-60 shrink-0" />
                Nhân bản
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-red-600 focus:text-red-700 focus:bg-red-50"
                onClick={() => onArchive(String(task.id))}
              >
                <Trash2 className="h-3.5 w-3.5 shrink-0" />
                Xóa task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
    </TaskContextMenu>
  )
}

// ── Drag overlay card ─────────────────────────────────────────────────────────

function DragCard({ task }: { task: Task }) {
  return (
    <div
      className="flex items-center gap-2 h-11 px-3 rounded-md text-[13px]"
      style={{
        backgroundColor: 'oklch(var(--card))',
        border: '0.5px solid oklch(var(--border))',
        boxShadow: '0 8px 20px rgba(0,0,0,0.14)',
        color: 'oklch(var(--foreground))',
        width: 360,
        cursor: 'grabbing',
      }}
    >
      <span className="flex-1 truncate">{task.title}</span>
      {task.priority && (
        <span className="w-2 h-2 rounded-full shrink-0 bg-muted-foreground" />
      )}
    </div>
  )
}

// ── Droppable section (for status grouping) ───────────────────────────────────

function DroppableSection({
  group,
  items,
  expanded,
  onToggle,
  onTaskClick,
  onToggleDone,
  isDraggingAny,
}: {
  group: SectionGroup
  items: Task[]
  expanded: boolean
  onToggle: () => void
  onTaskClick?: (task: Task) => void
  onToggleDone?: (task: Task) => void
  isDraggingAny: boolean
  isDone?: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id: group.key })
  const [headerHovered, setHeaderHovered] = React.useState(false)

  return (
    <div
      ref={setNodeRef}
      className="mb-4 rounded-lg transition-colors duration-150"
      style={{
        backgroundColor: isOver ? 'var(--t-accent-subtle)' : 'transparent',
        outline: isOver ? '1.5px dashed oklch(var(--primary) / 0.35)' : '1.5px solid transparent',
      }}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex items-center gap-2 w-full h-8 px-2 rounded-md cursor-pointer"
        style={{ transition: 'background 120ms ease', backgroundColor: headerHovered ? 'rgba(0,0,0,0.02)' : 'transparent' }}
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
      >
        {expanded
          ? <ChevronDown className="h-[13px] w-[13px] shrink-0 text-muted-foreground" />
          : <ChevronRight className="h-[13px] w-[13px] shrink-0 text-muted-foreground" />
        }
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: group.dot }} />
        <span className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: group.titleColor }}>
          {group.label}
        </span>
        <span
          className="text-[11px] rounded-full px-[7px] py-px bg-muted text-muted-foreground"
        >
          {items.length}
        </span>

        {headerHovered && (
          <div className="flex items-center gap-0.5 ml-auto" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="w-6 h-6 rounded flex items-center justify-center cursor-pointer hover:bg-border transition-colors text-muted-foreground"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}
      </button>

      {!expanded && isDraggingAny && (
        <div
          className="mx-2 h-8 rounded-md flex items-center justify-center text-[11px] mt-0.5"
          style={{
            border: '1px dashed oklch(var(--primary) / 0.4)',
            color: isOver ? 'oklch(var(--primary))' : 'oklch(var(--muted-foreground))',
            backgroundColor: isOver ? 'var(--t-accent-subtle)' : 'transparent',
          }}
        >
          Thả vào đây
        </div>
      )}

      {expanded && (
        <div className="mt-1">
          {items.map((task) => (
            <DraggableTaskRow key={String(task.id)} task={task} onClick={onTaskClick} onToggleDone={onToggleDone} isDone={group.isDone} />
          ))}
          <AddTaskRow />
        </div>
      )}
    </div>
  )
}

// ── Static section (for priority grouping — no cross-group DnD) ───────────────

function StaticSection({
  group,
  items,
  expanded,
  onToggle,
  onTaskClick,
  onToggleDone,
}: {
  group: SectionGroup
  items: Task[]
  expanded: boolean
  onToggle: () => void
  onTaskClick?: (task: Task) => void
  onToggleDone?: (task: Task) => void
}) {
  const [headerHovered, setHeaderHovered] = React.useState(false)

  return (
    <div className="mb-4 rounded-lg">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex items-center gap-2 w-full h-8 px-2 rounded-md cursor-pointer"
        style={{ transition: 'background 120ms ease', backgroundColor: headerHovered ? 'rgba(0,0,0,0.02)' : 'transparent' }}
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
      >
        {expanded
          ? <ChevronDown className="h-[13px] w-[13px] shrink-0 text-muted-foreground" />
          : <ChevronRight className="h-[13px] w-[13px] shrink-0 text-muted-foreground" />
        }
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: group.dot }} />
        <span className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: group.titleColor }}>
          {group.label}
        </span>
        <span
          className="text-[11px] rounded-full px-[7px] py-px bg-muted text-muted-foreground"
        >
          {items.length}
        </span>
      </button>

      {expanded && (
        <div className="mt-1">
          {items.map((task) => (
            <DraggableTaskRow key={String(task.id)} task={task} onClick={onTaskClick} onToggleDone={onToggleDone} isDone={group.isDone} />
          ))}
          <AddTaskRow />
        </div>
      )}
    </div>
  )
}

// ── Add task row ──────────────────────────────────────────────────────────────

function AddTaskRow() {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div
      className="flex items-center gap-2 h-9 px-2 rounded-md cursor-pointer"
      style={{
        color: hovered ? 'oklch(var(--foreground))' : 'oklch(var(--muted-foreground))',
        backgroundColor: hovered ? 'oklch(var(--muted) / 0.5)' : 'transparent',
        transition: 'all 120ms ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Plus className="h-3.5 w-3.5" />
      <span className="text-[13px]">Thêm task</span>
    </div>
  )
}

// ── Main TaskList ─────────────────────────────────────────────────────────────

export function TaskList({
  tasks,
  statuses,
  onTaskClick,
  searchQuery = '',
  onTaskMove,
  groupBy = 'status',
}: TaskListProps) {
  const DONE_CODES = new Set(['Done', 'Cancelled'])

  const statusGroups = React.useMemo<SectionGroup[]>(() =>
    statuses
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((s) => ({
        key: s.id,
        label: s.name,
        dot: s.color,
        titleColor: 'oklch(var(--muted-foreground))',
        isDone: DONE_CODES.has(s.code),
      })),
    [statuses],
  )

  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(['urgent', 'high', 'medium', 'low', 'none']),
  )

  // expand status sections when they arrive from API
  React.useEffect(() => {
    if (statusGroups.length > 0) {
      setExpandedSections((prev) => new Set([...prev, ...statusGroups.map((g) => g.key)]))
    }
  }, [statusGroups])

  const [activeTask, setActiveTask] = React.useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const filteredTasks = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return tasks
    return tasks.filter((task) =>
      [task.title, task.description, task.tag, task.code, task.assignee, task.status, task.priority]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [tasks, searchQuery])

  const grouped = React.useMemo(() => {
    const groups = groupBy === 'priority' ? PRIORITY_GROUPS : statusGroups
    const getKey = groupBy === 'priority'
      ? getPriorityGroup
      : (task: Task) => String(task.columnId)
    const map = new Map<string, Task[]>()
    groups.forEach((g) => map.set(g.key, []))
    filteredTasks.forEach((task) => {
      const key = getKey(task)
      const bucket = map.get(key)
      if (bucket) bucket.push(task)
      else map.set(key, [task])
    })
    return map
  }, [filteredTasks, groupBy, statusGroups])

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined
    setActiveTask(task ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over || !onTaskMove || groupBy === 'priority') return

    const task = active.data.current?.task as Task | undefined
    if (!task) return

    const currentSection = String(task.columnId)
    const targetSection = String(over.id)

    if (currentSection !== targetSection) {
      onTaskMove(task.id, targetSection)
      setExpandedSections((prev) => new Set([...prev, targetSection]))
    }
  }

  const isDraggingAny = activeTask !== null
  const activeGroups = groupBy === 'priority' ? PRIORITY_GROUPS : statusGroups

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="w-full">
        {activeGroups.map((group) => {
          const items = grouped.get(group.key) ?? []
          const expanded = expandedSections.has(group.key)

          if (groupBy === 'priority') {
            return (
              <StaticSection
                key={group.key}
                group={group}
                items={items}
                expanded={expanded}
                onToggle={() => toggleSection(group.key)}
                onTaskClick={onTaskClick}
              />
            )
          }

          return (
            <DroppableSection
              key={group.key}
              group={group}
              items={items}
              expanded={expanded}
              onToggle={() => toggleSection(group.key)}
              onTaskClick={onTaskClick}
              isDraggingAny={isDraggingAny}
            />
          )
        })}

        {filteredTasks.length === 0 && (
          <div
            className="flex items-center justify-center h-24 text-[13px] text-muted-foreground"
          >
            Không tìm thấy task nào.
          </div>
        )}
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeTask ? <DragCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
