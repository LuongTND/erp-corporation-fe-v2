import { GitBranch, Network, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { RenderNodeProps } from '@/features/hr/components/OrgChartPage/OrgChartTree'
import type { DeptNode } from './types'

export function DeptOrgCard({ node, selected, onSelect }: RenderNodeProps<DeptNode>) {
  if (node.id === '__root__') {
    return (
      <button
        type="button" onClick={onSelect}
        className="w-36 rounded-lg border-2 border-primary/30 bg-primary/5 px-3 py-2 text-center cursor-pointer hover:border-primary/60 transition-colors"
      >
        <Network className="w-4 h-4 text-primary mx-auto mb-1" />
        <p className="text-xs font-semibold text-primary leading-tight">{node.departmentName}</p>
      </button>
    )
  }

  return (
    <button
      type="button" onClick={onSelect}
      className={cn(
        'w-44 text-left rounded-lg border bg-card px-3 py-2.5 cursor-pointer',
        'hover:border-primary/50 hover:bg-muted/30 transition-all duration-150',
        selected && 'border-primary ring-1 ring-primary/20 bg-primary/5',
        !node.isActive && 'opacity-50 grayscale border-dashed',
      )}
    >
      <p className="text-[10px] font-mono text-muted-foreground mb-0.5 leading-none">{node.departmentCode}</p>
      <p className="text-xs font-semibold leading-snug line-clamp-2">{node.departmentName}</p>
      {node.managerName && (
        <div className="flex items-center gap-1 mt-1">
          <Avatar className="h-3.5 w-3.5 shrink-0">
            <AvatarImage src={node.managerAvatarUrl} alt={node.managerName} />
            <AvatarFallback className="text-[7px]">{node.managerName.split(' ').slice(-1)[0]?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className="text-[10px] text-muted-foreground truncate leading-none">{node.managerName}</p>
        </div>
      )}
      <div className="flex items-center gap-2 mt-1.5">
        <div className="flex items-center gap-1">
          <Users className="w-2.5 h-2.5 text-muted-foreground/60" />
          <span className="text-[10px] text-muted-foreground/80 tabular-nums">{node.memberCount}</span>
        </div>
        {node.children.length > 0 && (
          <div className="flex items-center gap-1">
            <GitBranch className="w-2.5 h-2.5 text-muted-foreground/60" />
            <span className="text-[10px] text-muted-foreground/80 tabular-nums">{node.children.length}</span>
          </div>
        )}
      </div>
    </button>
  )
}
