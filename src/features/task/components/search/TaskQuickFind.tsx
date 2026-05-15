import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import type { Task } from '../../types/task.types'
import { useTaskActions } from '../../context/TaskActionsContext'

interface TaskQuickFindProps {
  tasks: Task[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

function priorityDot(priority?: string): string {
  const p = (priority ?? '').toLowerCase()
  if (p === 'urgent') return '#ef4444'
  if (p === 'high') return '#f97316'
  if (p === 'medium') return '#f59e0b'
  return '#94a3b8'
}

function statusLabel(status?: string): string {
  if (!status) return ''
  const s = status.toLowerCase()
  if (s.includes('progress')) return 'In Progress'
  if (s.includes('review')) return 'In Review'
  if (s.includes('done') || s.includes('complete')) return 'Done'
  return 'To Do'
}

export function TaskQuickFind({ tasks, open, onOpenChange }: TaskQuickFindProps) {
  const { onOpen } = useTaskActions()

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Tìm nhanh" description="Tìm task nhanh">
      <Command className="rounded-xl">
        <CommandInput placeholder="Tìm task theo tên, mã, trạng thái..." />
        <CommandList className="max-h-80">
          <CommandEmpty>
            <span className="text-[13px]" style={{ color: '#8e8b82' }}>
              Không tìm thấy task nào.
            </span>
          </CommandEmpty>
          <CommandGroup heading="Công việc">
            {tasks.map((task) => (
              <CommandItem
                key={String(task.id)}
                value={`${task.title} ${task.description ?? ''} ${task.code ?? ''} ${task.status ?? ''} ${task.assignee ?? ''} ${task.priority ?? ''}`}
                onSelect={() => {
                  onOpen(task)
                  onOpenChange(false)
                }}
                className="flex items-center gap-2 cursor-pointer py-2 px-2 rounded-lg"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: priorityDot(task.priority) }}
                />
                <span className="flex-1 text-[13px] truncate" style={{ color: '#141413' }}>
                  {task.title}
                </span>
                {task.code && (
                  <span className="text-[11px] shrink-0" style={{ color: '#8e8b82' }}>
                    {task.code}
                  </span>
                )}
                {task.status && (
                  <CommandShortcut className="text-[11px] shrink-0">
                    {statusLabel(task.status)}
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>

        {/* Footer hint */}
        <div
          className="flex items-center gap-3 px-3 py-2 text-[11px] shrink-0"
          style={{ borderTop: '0.5px solid #e6dfd8', color: '#8e8b82' }}
        >
          <span><kbd className="px-1 py-0.5 rounded text-[10px]" style={{ backgroundColor: '#f5f0e8' }}>↑↓</kbd> điều hướng</span>
          <span><kbd className="px-1 py-0.5 rounded text-[10px]" style={{ backgroundColor: '#f5f0e8' }}>↵</kbd> mở</span>
          <span><kbd className="px-1 py-0.5 rounded text-[10px]" style={{ backgroundColor: '#f5f0e8' }}>Esc</kbd> đóng</span>
        </div>
      </Command>
    </CommandDialog>
  )
}
