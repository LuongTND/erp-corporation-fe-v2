import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Copy, ExternalLink, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTaskActions } from '@/features/task/context/TaskActionsContext'
import type { Task } from '@/features/task/types/task.types'

export function TaskContextMenu({ task, children }: { task: Task; children: ReactNode }) {
  const { onOpen, onDuplicate, onArchive } = useTaskActions()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48 p-1">
        <ContextMenuItem
          className="cursor-pointer text-[13px] gap-2"
          onClick={() => onOpen(task)}
        >
          <ExternalLink className="h-3.5 w-3.5 opacity-60 shrink-0" />
          Mở chi tiết
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          className="cursor-pointer text-[13px] gap-2"
          onClick={() => onDuplicate(task)}
        >
          <Copy className="h-3.5 w-3.5 opacity-60 shrink-0" />
          Nhân bản
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          variant="destructive"
          className="cursor-pointer text-[13px] gap-2"
          onClick={() => onArchive(String(task.id))}
        >
          <Trash2 className="h-3.5 w-3.5 shrink-0" />
          Xóa task
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
