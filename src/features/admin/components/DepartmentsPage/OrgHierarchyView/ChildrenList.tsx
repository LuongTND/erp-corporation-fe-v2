import { GitBranch } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { DeptNode } from './types'

interface ChildrenListProps {
  readonly children: DeptNode[]
}

export function ChildrenList({ children }: ChildrenListProps) {
  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 gap-2 text-center">
        <GitBranch className="w-7 h-7 text-muted-foreground/30" />
        <p className="text-xs text-muted-foreground">Không có phòng con</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {children.map(child => (
        <div key={child.id} className="flex items-center gap-3 px-3 py-2.5 border-b hover:bg-muted/30 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1 rounded">
                {child.departmentCode}
              </span>
            </div>
            <p className="text-xs font-medium leading-snug">{child.departmentName}</p>
            {child.managerName && (
              <p className="text-[10px] text-muted-foreground mt-0.5">{child.managerName}</p>
            )}
          </div>
          {child.children.length > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 h-4 shrink-0 gap-0.5">
              <GitBranch className="w-2.5 h-2.5" />{child.children.length}
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}
