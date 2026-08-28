import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit2, GripVertical, Shield, Trash2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { RoleResponse } from '../../types/admin.types'
import { SCOPE_TYPE_LABELS } from '../../types/admin.types'
import { cn } from '@/lib/utils'

interface Props {
  role: RoleResponse
  isDragDisabled: boolean
  onEdit: (role: RoleResponse) => void
  onDelete: (role: RoleResponse) => void
  onPermissions: (role: RoleResponse) => void
  onUsers: (role: RoleResponse) => void
}

function DescriptionCell({ text }: { text?: string }) {
  if (!text) return <span className="text-muted-foreground/40">—</span>
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="block truncate cursor-default max-w-[180px]">{text}</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{text}</TooltipContent>
    </Tooltip>
  )
}

export function SortableRoleRow({ role, isDragDisabled, onEdit, onDelete, onPermissions, onUsers }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: role.id,
    disabled: isDragDisabled,
  })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn('group', isDragging && 'opacity-40 ring-2 ring-inset ring-primary/30 bg-muted/50')}
    >
      <TableCell className="w-8 pr-0">
        {!isDragDisabled && (
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded text-muted-foreground/40 hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Kéo để sắp xếp vai trò ${role.roleName}`}
            tabIndex={0}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
      </TableCell>

      <TableCell className="font-medium">{role.roleName}</TableCell>
      <TableCell className="hidden md:table-cell text-sm">{role.displayName ?? <span className="text-muted-foreground/40">—</span>}</TableCell>
      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
        <DescriptionCell text={role.description} />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="flex flex-wrap gap-1">
          {role.isSystemRole
            ? <Badge variant="secondary">Hệ thống</Badge>
            : <Badge variant="outline">Tùy chỉnh</Badge>}
          <Badge variant="outline" className="text-[10px] text-muted-foreground font-normal">
            {SCOPE_TYPE_LABELS[role.defaultDataScope]}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{role.permissions.length}</TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onPermissions(role)}
                  disabled={role.isSystemRole}
                  aria-label={`Phân quyền cho ${role.roleName}`}
                >
                  <Shield className="h-3.5 w-3.5 mr-1" />
                  Quyền
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {role.isSystemRole ? 'Role hệ thống không thể chỉnh sửa quyền' : 'Phân quyền cho vai trò'}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onUsers(role)}
                  disabled={role.isSystemRole}
                  aria-label={`Gán người dùng vào ${role.roleName}`}
                >
                  <Users className="h-3.5 w-3.5 mr-1" />
                  Users
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {role.isSystemRole ? 'Role hệ thống không thể chỉnh sửa' : 'Gán người dùng vào vai trò'}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => onEdit(role)}
                  disabled={role.isSystemRole}
                  aria-label={`Chỉnh sửa ${role.roleName}`}
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
              </span>
            </TooltipTrigger>
            {role.isSystemRole && <TooltipContent>Role hệ thống không thể chỉnh sửa</TooltipContent>}
          </Tooltip>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={() => onDelete(role)}
            disabled={role.isSystemRole}
            aria-label={`Xóa ${role.roleName}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
