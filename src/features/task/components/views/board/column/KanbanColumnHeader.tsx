import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Column } from '@/features/task/types/task.types'
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
    <div className="flex items-center gap-2 h-9 px-3 rounded-t-lg">
      {/* Status dot */}
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: column.color || '#8e8b82' }}
      />

      {/* Title */}
      {isRenaming ? (
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="h-6 px-1 py-0 text-[11px] font-medium bg-white border-[#e6dfd8] focus-visible:ring-1 focus-visible:ring-[#cc785c]"
        />
      ) : (
        <span
          onClick={() => setIsRenaming(true)}
          className="text-[11px] font-medium uppercase tracking-[0.06em] cursor-text truncate"
          style={{ color: '#6c6a64' }}
        >
          {title}
        </span>
      )}

      {/* Count badge */}
      <span
        className="text-[11px] rounded-full px-[7px] py-px shrink-0"
        style={{ backgroundColor: '#e6dfd8', color: '#6c6a64' }}
      >
        {taskCount}
      </span>

      <div className="flex-1" />

      {/* Menu */}
      <div className={cn('transition-opacity duration-200', isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
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
