import { useDraggable, useDroppable } from '@dnd-kit/core'
import { Building2, Edit2, GripVertical, Power, PowerOff, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { FlatRow } from './utils'

interface DeptRowProps {
  readonly row: FlatRow
  readonly isOver: boolean
  readonly isPending: boolean
  readonly parentName?: string
  readonly onEdit: () => void
  readonly onToggle: () => void
  readonly onDelete: () => void
}

export function DeptRow({ row, isOver, isPending, parentName, onEdit, onToggle, onDelete }: DeptRowProps) {
  const { setNodeRef: drop } = useDroppable({ id: row.node.id })
  const { attributes, listeners, setNodeRef: drag, isDragging } = useDraggable({ id: row.node.id })

  return (
    <tr ref={drop} className={cn(
      'border-b transition-all hover:bg-muted/30 group',
      isOver && !isDragging && 'bg-primary/5 ring-1 ring-inset ring-primary/30',
      isDragging && 'opacity-30',
      isPending && 'opacity-50',
    )}>
      <td className="py-2 pl-3 pr-2">
        <div className="flex items-center" style={{ paddingLeft: `${row.depth * 20}px` }}>
          <button
            ref={drag} type="button" {...attributes} {...listeners}
            title="Kéo để thay đổi phòng cha"
            className="mr-1.5 cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing shrink-0 opacity-20 group-hover:opacity-100 transition-opacity"
            aria-label="Kéo để thay đổi phòng cha"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <Building2 className="w-3 h-3 shrink-0 text-muted-foreground/50 mr-1.5" />
          <span className="text-sm font-medium truncate">{row.node.departmentName}</span>
        </div>
      </td>
      <td className="py-2 px-3 text-xs font-mono text-muted-foreground hidden sm:table-cell">{row.node.departmentCode}</td>
      <td className="py-2 px-3 text-xs text-muted-foreground hidden md:table-cell max-w-[160px] truncate">
        {parentName ?? <span className="text-muted-foreground/40">—</span>}
      </td>
      <td className="py-2 px-3 text-xs text-muted-foreground hidden lg:table-cell truncate max-w-[140px]">
        {row.node.managerName ?? <span className="text-muted-foreground/40">—</span>}
      </td>
      <td className="py-2 px-3 text-xs tabular-nums text-muted-foreground text-center hidden md:table-cell">
        {row.node.memberCount}
      </td>
      <td className="py-2 px-3">
        {row.node.isActive
          ? <Badge className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 dark:text-green-400 text-xs">Hoạt động</Badge>
          : <Badge variant="outline" className="text-xs text-muted-foreground border-dashed">Đã vô hiệu</Badge>}
      </td>
      <td className="py-2 px-3">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost" size="sm" className="h-8 w-8 p-0"
            onClick={onEdit}
            title={`Sửa ${row.node.departmentName}`}
            aria-label={`Sửa ${row.node.departmentName}`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost" size="sm"
            className={cn('h-8 w-8 p-0', row.node.isActive ? 'text-muted-foreground hover:text-destructive' : 'text-muted-foreground hover:text-green-600')}
            onClick={onToggle}
            title={row.node.isActive ? `Vô hiệu hóa ${row.node.departmentName}` : `Kích hoạt lại ${row.node.departmentName}`}
            aria-label={row.node.isActive ? `Vô hiệu hóa ${row.node.departmentName}` : `Kích hoạt lại ${row.node.departmentName}`}
          >
            {row.node.isActive ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            onClick={onDelete}
            title={`Xóa ${row.node.departmentName}`}
            aria-label={`Xóa ${row.node.departmentName}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  )
}
