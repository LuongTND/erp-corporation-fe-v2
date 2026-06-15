import { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Column } from '../../../types/task.types'
import { ColumnActionMenu } from './KanbanColumnMenu'

interface ColumnHeaderProps {
  column: Column
  taskCount: number
  onTitleChange?: (columnId: string, newTitle: string) => void
  onColorChange?: (columnId: string, color: string) => void
}

export function ColumnHeader({
  column,
  taskCount,
  onTitleChange,
  onColorChange,
}: ColumnHeaderProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [title, setTitle] = useState(column.title)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isRenaming])

  const handleSave = () => {
    setIsRenaming(false)
    if (!title.trim()) {
      setTitle(column.title)
      return
    }
    if (title.trim() !== column.title && onTitleChange) {
      onTitleChange(column.id as string, title.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') {
      setIsRenaming(false)
      setTitle(column.title)
    }
  }

  return (
    <div className="h-10 px-3 py-2 flex items-center justify-between border-b border-border/50 bg-background/20 backdrop-blur-sm rounded-t-xl">
      <div className="flex items-center gap-1 flex-1 min-w-0">
        {isRenaming ? (
          <Input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-6 px-1 py-0 text-sm font-bold bg-background border-primary/50 focus-visible:ring-1 focus-visible:ring-primary"
          />
        ) : (
          <h3
            onClick={() => setIsRenaming(true)}
            className="font-bold text-sm text-foreground tracking-tight capitalize truncate max-w-[150px] cursor-text hover:bg-muted/50 rounded px-1 transition-colors"
          >
            {title}
          </h3>
        )}

        <Badge
          variant="secondary"
          className="ml-1 px-1.5 py-0 h-5 text-[10px] font-mono font-normal shrink-0"
        >
          {taskCount}
        </Badge>
      </div>

      <div
        className={cn(
          'flex items-center transition-opacity duration-200',
          isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        )}
      >
        <ColumnActionMenu
          column={column}
          onRename={() => setIsRenaming(true)}
          onOpenChange={setIsMenuOpen}
          onColorChange={(color) => onColorChange?.(column.id as string, color)}
        />
      </div>
    </div>
  )
}
