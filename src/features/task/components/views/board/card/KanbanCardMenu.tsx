import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Copy,
  Eye,
  ExternalLink,
  Layout,
  Link as LinkIcon,
  List,
  type LucideIcon,
  MessageSquare,
  MoreHorizontal,
  Smile,
  Star,
  Trash2,
  ArrowRight,
} from 'lucide-react'
import { useTaskActions } from '@/features/task/context/TaskActionsContext'
import type { Task } from '@/features/task/types/task.types'

interface MenuItemProps {
  icon: LucideIcon
  label: string
  shortcut?: string
  destructive?: boolean
  onClick?: () => void
}

function MenuItem({ icon: Icon, label, shortcut, destructive, onClick }: MenuItemProps) {
  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      className={cn(
        'text-xs font-medium px-2 py-1.5 cursor-pointer focus:bg-accent/50',
        destructive && 'text-red-600 focus:text-red-700 focus:bg-red-50',
      )}
    >
      <Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
      <span className={cn(destructive && 'font-semibold')}>{label}</span>
      {shortcut && (
        <DropdownMenuShortcut className="text-[10px] ml-auto">{shortcut}</DropdownMenuShortcut>
      )}
    </DropdownMenuItem>
  )
}

export function TaskMenuActions({ task }: { task?: Task }) {
  const { onOpen, onDuplicate, onArchive } = useTaskActions()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 -mr-1 -mt-1 opacity-0 group-hover/card:opacity-100 transition-opacity data-[state=open]:opacity-100 focus:opacity-100"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-48 shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuGroup>
          <MenuItem icon={ExternalLink} label="Mở chi tiết" onClick={() => task && onOpen(task)} />
          <MenuItem icon={Star} label="Add to Favorites" />
          <MenuItem icon={Smile} label="Edit icon" />
          <MenuItem icon={List} label="Edit property" />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <MenuItem icon={Layout} label="Layout" />
          <MenuItem icon={Eye} label="Property visibility" />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-xs font-medium px-2 py-1.5 cursor-pointer">
              <ExternalLink className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              <span>Open in</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-32">
              <MenuItem icon={ExternalLink} label="New Tab" />
              <MenuItem icon={Layout} label="Side Peek" />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <MenuItem icon={MessageSquare} label="Comment" shortcut="?+M" />
          <MenuItem icon={LinkIcon} label="Copy link" />
          <MenuItem
            icon={Copy}
            label="Nhân bản"
            shortcut="⌘D"
            onClick={() => task && onDuplicate(task)}
          />
          <MenuItem icon={ArrowRight} label="Move to" shortcut="?+P" />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <MenuItem
          icon={Trash2}
          label="Xóa task"
          shortcut="Del"
          destructive
          onClick={() => task && onArchive(String(task.id))}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
