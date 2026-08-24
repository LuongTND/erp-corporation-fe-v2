import { useState } from 'react'
import { Building2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DepartmentTreeResponse } from '../../../types/admin.types'

interface DeptTreeNodeProps {
  readonly dept: DepartmentTreeResponse
  readonly selectedId: string | null
  readonly onSelect: (dept: DepartmentTreeResponse) => void
  readonly depth?: number
}

export function DeptTreeNode({ dept, selectedId, onSelect, depth = 0 }: DeptTreeNodeProps) {
  const [expanded, setExpanded] = useState(depth === 0)
  const hasChildren = dept.children.length > 0

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(dept)}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        className={cn(
          'w-full flex items-center gap-1 py-1.5 pr-2 text-xs text-left rounded-sm cursor-pointer',
          'hover:bg-muted/50 transition-colors border-l-2',
          selectedId === dept.id
            ? 'bg-primary/10 text-primary font-medium border-primary'
            : 'border-transparent',
        )}
      >
        {hasChildren ? (
          <span
            role="button" tabIndex={-1}
            onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
            className="shrink-0 p-0.5 hover:bg-muted rounded cursor-pointer"
          >
            <ChevronRight className={cn('w-3 h-3 text-muted-foreground transition-transform duration-150', expanded && 'rotate-90')} />
          </span>
        ) : <span className="w-4 shrink-0" />}
        <Building2 className="w-3 h-3 shrink-0 text-muted-foreground" />
        <span className="truncate flex-1">{dept.departmentName}</span>
        {hasChildren && <span className="text-[9px] text-muted-foreground tabular-nums">{dept.children.length}</span>}
      </button>
      {expanded && hasChildren && dept.children.map(child => (
        <DeptTreeNode key={child.id} dept={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
      ))}
    </div>
  )
}
