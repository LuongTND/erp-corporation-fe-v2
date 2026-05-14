import { MoreHorizontal, Pencil, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import type { Column } from '../../../types/task.types'

const COLUMN_COLORS = [
  { label: 'Default', value: '#6b7280' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Yellow', value: '#eab308' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Pink', value: '#ec4899' },
]

interface ColumnActionMenuProps {
  column: Column
  onRename: () => void
  onOpenChange: (isOpen: boolean) => void
  onColorChange?: (color: string) => void
}

export function ColumnActionMenu({
  column,
  onRename,
  onOpenChange,
  onColorChange,
}: ColumnActionMenuProps) {
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" sideOffset={8} className="w-[180px]">
        <DropdownMenuItem onClick={onRename} className="text-xs font-medium cursor-pointer">
          <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Sửa tiêu đề</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-xs font-medium text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          <span>Xóa cột</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">
          Màu sắc
        </DropdownMenuLabel>

        <div className="grid grid-cols-1 gap-1">
          {COLUMN_COLORS.map((colorItem) => (
            <DropdownMenuItem
              key={colorItem.value}
              onClick={() => onColorChange?.(colorItem.value)}
              className="flex items-center justify-between text-xs h-8 px-2 cursor-pointer focus:bg-accent"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm border border-black/10 dark:border-white/10"
                  style={{ backgroundColor: colorItem.value }}
                />
                <span className="font-medium">{colorItem.label}</span>
              </div>
              {column.color === colorItem.value && <Check className="h-3 w-3 text-primary" />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
