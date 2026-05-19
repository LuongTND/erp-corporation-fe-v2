import { useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { TaskStatusDto } from '@/features/task/types/task.types'
import type { TaskPriorityDto } from '@/features/task/types/priority.types'

const C = {
  bg: '#FFFFFF',
  bgHover: '#f5f0e8',
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
} as const

interface TaskFilterBarProps {
  statuses: TaskStatusDto[]
  priorities: TaskPriorityDto[]
  selectedStatusIds: string[]
  selectedPriorityIds: string[]
  onStatusChange: (ids: string[]) => void
  onPriorityChange: (ids: string[]) => void
  searchQuery?: string
  onSearchChange?: (q: string) => void
}

export function TaskFilterBar({
  statuses,
  priorities,
  selectedStatusIds,
  selectedPriorityIds,
  onStatusChange,
  onPriorityChange,
  searchQuery = '',
  onSearchChange,
}: TaskFilterBarProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)

  const hasFilters = selectedStatusIds.length > 0 || selectedPriorityIds.length > 0

  const removeStatus = (id: string) =>
    onStatusChange(selectedStatusIds.filter((x) => x !== id))

  const removePriority = (id: string) =>
    onPriorityChange(selectedPriorityIds.filter((x) => x !== id))

  const toggleStatus = (id: string) =>
    onStatusChange(
      selectedStatusIds.includes(id)
        ? selectedStatusIds.filter((x) => x !== id)
        : [...selectedStatusIds, id],
    )

  const togglePriority = (id: string) =>
    onPriorityChange(
      selectedPriorityIds.includes(id)
        ? selectedPriorityIds.filter((x) => x !== id)
        : [...selectedPriorityIds, id],
    )

  const clearAll = () => {
    onStatusChange([])
    onPriorityChange([])
  }

  const statusMap = Object.fromEntries(statuses.map((s) => [s.id, s]))
  const priorityMap = Object.fromEntries(priorities.map((p) => [p.id, p]))

  const activeStatuses = statuses.filter((s) => s.isActive)
  const activePriorities = priorities
    .filter((p) => p.isActive)
    .sort((a, b) => b.level - a.level)

  return (
    <div
      className="flex items-center gap-2 px-5 py-2 overflow-x-auto shrink-0"
      style={{
        backgroundColor: '#faf9f5',
        borderBottom: `0.5px solid ${C.border}`,
        minHeight: 42,
      }}
    >
      {/* Inline search */}
      <div
        className="flex items-center gap-1 shrink-0 rounded"
        style={{ border: `0.5px solid ${C.border}`, backgroundColor: C.bg }}
      >
        <Search className="h-3 w-3 ml-1.5 shrink-0" style={{ color: C.muted }} />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="text-[12px] bg-transparent outline-none h-6 w-28 pr-1"
          style={{ color: C.text }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange?.('')}
            className="mr-1 cursor-pointer shrink-0"
            style={{ color: C.muted }}
          >
            <X className="h-2.5 w-2.5" />
          </button>
        )}
      </div>

      {/* Status chips */}
      {selectedStatusIds.map((id) => {
        const status = statusMap[id]
        if (!status) return null
        return (
          <span
            key={id}
            className="inline-flex items-center gap-1.5 pl-2 pr-1 py-0.5 rounded text-[12px] whitespace-nowrap shrink-0"
            style={{
              backgroundColor: C.bg,
              border: `0.5px solid ${C.border}`,
              color: C.text,
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: status.color }}
            />
            <span className="text-[11px]" style={{ color: C.muted }}>
              Trạng thái:
            </span>
            {status.name}
            <button
              type="button"
              onClick={() => removeStatus(id)}
              className="ml-0.5 cursor-pointer rounded p-0.5 transition-colors duration-[120ms]"
              style={{ color: C.muted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.border
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        )
      })}

      {/* Priority chips */}
      {selectedPriorityIds.map((id) => {
        const priority = priorityMap[id]
        if (!priority) return null
        return (
          <span
            key={id}
            className="inline-flex items-center gap-1.5 pl-2 pr-1 py-0.5 rounded text-[12px] whitespace-nowrap shrink-0"
            style={{
              backgroundColor: C.bg,
              border: `0.5px solid ${C.border}`,
              color: C.text,
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: priority.color }}
            />
            <span className="text-[11px]" style={{ color: C.muted }}>
              Ưu tiên:
            </span>
            {priority.name}
            <button
              type="button"
              onClick={() => removePriority(id)}
              className="ml-0.5 cursor-pointer rounded p-0.5 transition-colors duration-[120ms]"
              style={{ color: C.muted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.border
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        )
      })}

      {/* Add filter popover */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] cursor-pointer transition-colors duration-[120ms] shrink-0"
            style={{ color: C.muted, border: `0.5px dashed ${C.border}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = C.bgHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <Plus className="h-3 w-3" />
            Thêm bộ lọc
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="p-2 w-60"
          style={{
            backgroundColor: C.bg,
            border: `0.5px solid ${C.border}`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          {/* Status */}
          <p
            className="px-2 pt-1 pb-0.5 text-[11px] font-medium uppercase tracking-[0.06em]"
            style={{ color: C.muted }}
          >
            Trạng thái
          </p>
          {activeStatuses.map((s) => {
            const active = selectedStatusIds.includes(s.id)
            return (
              <button
                key={s.id}
                type="button"
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-[13px] cursor-pointer transition-colors duration-[120ms]"
                style={{
                  backgroundColor: active ? '#f5f0e8' : 'transparent',
                  color: C.text,
                }}
                onClick={() => toggleStatus(s.id)}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = '#f5f0e8'
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                {s.name}
                {active && (
                  <span className="ml-auto text-[11px]" style={{ color: C.accent }}>
                    ✓
                  </span>
                )}
              </button>
            )
          })}

          <div
            className="my-1.5"
            style={{ height: '0.5px', backgroundColor: C.border }}
          />

          {/* Priority */}
          <p
            className="px-2 pb-0.5 text-[11px] font-medium uppercase tracking-[0.06em]"
            style={{ color: C.muted }}
          >
            Độ ưu tiên
          </p>
          {activePriorities.map((p) => {
            const active = selectedPriorityIds.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-[13px] cursor-pointer transition-colors duration-[120ms]"
                style={{
                  backgroundColor: active ? '#f5f0e8' : 'transparent',
                  color: C.text,
                }}
                onClick={() => togglePriority(p.id)}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = '#f5f0e8'
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                {p.name}
                {active && (
                  <span className="ml-auto text-[11px]" style={{ color: C.accent }}>
                    ✓
                  </span>
                )}
              </button>
            )
          })}

          {hasFilters && (
            <>
              <div
                className="my-1.5"
                style={{ height: '0.5px', backgroundColor: C.border }}
              />
              <button
                type="button"
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-[12px] cursor-pointer transition-colors duration-[120ms]"
                style={{ color: '#dc2626' }}
                onClick={clearAll}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fee2e2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Xóa tất cả bộ lọc
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>

      {/* Clear all shortcut */}
      {hasFilters && (
        <button
          type="button"
          className="ml-auto inline-flex items-center gap-1 text-[12px] cursor-pointer transition-colors duration-[120ms] shrink-0"
          style={{ color: C.muted }}
          onClick={clearAll}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#dc2626'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = C.muted
          }}
        >
          <X className="h-3 w-3" />
          Xóa lọc
        </button>
      )}
    </div>
  )
}
