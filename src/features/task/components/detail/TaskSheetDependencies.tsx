import { useEffect, useRef, useState } from 'react'
import { Link2, Plus, X } from 'lucide-react'
import type { TaskItemDto, DependencyType } from '@/features/task/types/task.types'
import { taskDependencyService, taskItemService } from '@/features/task/mocks/task.mock'

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bgHover: '#f5f0e8',
}

interface Props {
  taskId: string
}

type AddMode = 'blocks' | 'blocked_by' | null

function TaskChip({
  task,
  onRemove,
}: {
  task: TaskItemDto
  onRemove: () => void
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[12px] group"
      style={{ backgroundColor: C.bgHover, border: `0.5px solid ${C.border}` }}
    >
      {task.code && (
        <span className="font-medium shrink-0" style={{ color: C.muted }}>
          {task.code}
        </span>
      )}
      <span className="truncate" style={{ color: C.text }}>{task.title}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-auto shrink-0 opacity-50 group-hover:opacity-100 cursor-pointer transition-opacity duration-[120ms]"
        style={{ color: C.muted }}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

export function TaskSheetDependencies({ taskId }: Props) {
  const [blocks, setBlocks] = useState<TaskItemDto[]>([])
  const [blockedBy, setBlockedBy] = useState<TaskItemDto[]>([])
  const [allTasks, setAllTasks] = useState<TaskItemDto[]>([])
  const [addMode, setAddMode] = useState<AddMode>(null)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!taskId) return
    taskDependencyService.getByTaskId(taskId).then(({ blocks: b, blockedBy: bb }) => {
      setBlocks(b)
      setBlockedBy(bb)
    })
    taskItemService.getAll().then((r) => setAllTasks(r.items))
  }, [taskId])

  useEffect(() => {
    if (addMode) setTimeout(() => inputRef.current?.focus(), 50)
  }, [addMode])

  const excluded = new Set([taskId, ...blocks.map((t) => t.id), ...blockedBy.map((t) => t.id)])
  const filtered = allTasks
    .filter((t) => !excluded.has(t.id))
    .filter((t) =>
      search === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()),
    )
    .slice(0, 6)

  const handleAdd = async (toTask: TaskItemDto) => {
    if (!addMode) return
    await taskDependencyService.add(taskId, toTask.id, addMode)
    const { blocks: b, blockedBy: bb } = await taskDependencyService.getByTaskId(taskId)
    setBlocks(b)
    setBlockedBy(bb)
    setAddMode(null)
    setSearch('')
  }

  const handleRemove = async (toTaskId: string, type: DependencyType) => {
    await taskDependencyService.removeByTaskIds(taskId, toTaskId, type)
    const { blocks: b, blockedBy: bb } = await taskDependencyService.getByTaskId(taskId)
    setBlocks(b)
    setBlockedBy(bb)
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: C.muted }}>
        Phụ thuộc
      </p>

      {/* Blocks section */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium flex items-center gap-1.5" style={{ color: C.text }}>
            <Link2 className="h-3.5 w-3.5" style={{ color: C.accent }} />
            Chặn
          </span>
          <button
            type="button"
            onClick={() => setAddMode(addMode === 'blocks' ? null : 'blocks')}
            className="flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded cursor-pointer transition-colors duration-[120ms]"
            style={{ color: C.accent }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            <Plus className="h-3 w-3" />
            Thêm
          </button>
        </div>

        {blocks.map((t) => (
          <TaskChip key={t.id} task={t} onRemove={() => handleRemove(t.id, 'blocks')} />
        ))}

        {addMode === 'blocks' && (
          <SearchDropdown
            inputRef={inputRef}
            search={search}
            setSearch={setSearch}
            filtered={filtered}
            onSelect={handleAdd}
            onClose={() => { setAddMode(null); setSearch('') }}
          />
        )}
      </div>

      {/* Blocked by section */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium flex items-center gap-1.5" style={{ color: C.text }}>
            <Link2 className="h-3.5 w-3.5" style={{ color: '#ef4444' }} />
            Bị chặn bởi
          </span>
          <button
            type="button"
            onClick={() => setAddMode(addMode === 'blocked_by' ? null : 'blocked_by')}
            className="flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded cursor-pointer transition-colors duration-[120ms]"
            style={{ color: C.accent }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            <Plus className="h-3 w-3" />
            Thêm
          </button>
        </div>

        {blockedBy.map((t) => (
          <TaskChip key={t.id} task={t} onRemove={() => handleRemove(t.id, 'blocked_by')} />
        ))}

        {addMode === 'blocked_by' && (
          <SearchDropdown
            inputRef={inputRef}
            search={search}
            setSearch={setSearch}
            filtered={filtered}
            onSelect={handleAdd}
            onClose={() => { setAddMode(null); setSearch('') }}
          />
        )}
      </div>
    </div>
  )
}

function SearchDropdown({
  inputRef,
  search,
  setSearch,
  filtered,
  onSelect,
  onClose,
}: {
  inputRef: React.RefObject<HTMLInputElement>
  search: string
  setSearch: (v: string) => void
  filtered: TaskItemDto[]
  onSelect: (t: TaskItemDto) => void
  onClose: () => void
}) {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden" style={{ border: `0.5px solid ${C.border}` }}>
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm task..."
        className="px-2.5 py-1.5 text-[12px] bg-transparent outline-none"
        style={{ color: C.text, borderBottom: `0.5px solid ${C.border}` }}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
      />
      {filtered.length === 0 ? (
        <p className="px-2.5 py-2 text-[12px]" style={{ color: C.muted }}>Không tìm thấy task</p>
      ) : (
        filtered.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-left cursor-pointer transition-colors duration-[100ms]"
            style={{ color: C.text }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            <span className="text-[10px] font-medium shrink-0 px-1 py-0.5 rounded" style={{ backgroundColor: C.bgHover, color: C.muted }}>
              {t.code}
            </span>
            <span className="text-[12px] truncate">{t.title}</span>
          </button>
        ))
      )}
    </div>
  )
}
