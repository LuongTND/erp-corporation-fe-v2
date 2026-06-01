import { ChevronDown, ChevronUp, Mail, Plus, Users, XCircle } from 'lucide-react'
import { useState } from 'react'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'
import { DEPT_CONFIG } from './orgchart.data'
import type { OrgPerson } from './orgchart.types'

interface Props {
  node: OrgPerson
  isRoot?: boolean
  selected: boolean
  onSelect: () => void
  isExpanded: boolean
  hasChildren: boolean
  onToggle: (e: React.MouseEvent) => void
  editMode?: boolean
  dropTarget?: boolean
}

export function OrgChartNode({
  node,
  isRoot = false,
  selected,
  onSelect,
  isExpanded,
  hasChildren,
  onToggle,
  editMode = false,
  dropTarget = false,
}: Props) {
  const dept = DEPT_CONFIG[node.department] ?? DEPT_CONFIG['Engineering']
  const [hovered, setHovered] = useState(false)

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative flex flex-col items-center">
        {/* Main card */}
        <div
          onClick={onSelect}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="rounded-xl cursor-pointer select-none transition-all duration-200"
          style={{
            width: isRoot ? 240 : 208,
            padding: 16,
            backgroundColor: isRoot ? dept.avatarBg : '#fff',
            border: dropTarget
              ? '2px solid #cc785c'
              : selected
              ? '2px solid #cc785c'
              : hovered
              ? '1.5px solid rgba(204,120,92,0.4)'
              : '1px solid #e2e8f0',
            boxShadow: hovered || selected
              ? '0 8px 24px rgba(0,0,0,0.12)'
              : '0 2px 8px rgba(0,0,0,0.07)',
            transform: hovered && !selected ? 'scale(1.03)' : 'scale(1)',
          }}
        >
          {/* Dept dot */}
          <div
            className="w-2 h-2 rounded-full mb-2"
            style={{ backgroundColor: dept.dot }}
          />

          {/* Avatar */}
          <div className="flex justify-center mb-2">
            <div
              className="rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                width: isRoot ? 56 : 48,
                height: isRoot ? 56 : 48,
                backgroundColor: dept.avatarBg,
                color: dept.avatarText,
              }}
            >
              {node.initials}
            </div>
          </div>

          {/* Name */}
          <p className="text-sm font-semibold text-slate-900 text-center truncate">
            {node.name}
          </p>

          {/* Title */}
          <p className="text-[11px] text-slate-500 text-center mt-0.5 truncate">
            {node.title}
          </p>

          {/* Dept badge */}
          <div className="flex justify-center mt-1.5">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: dept.badgeBg, color: dept.badgeText }}
            >
              {node.department}
            </span>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-400">
                {node.children.length} {node.children.length === 1 ? 'report' : 'reports'}
              </span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={`Email ${node.name}`}
                >
                  <Mail className="w-3 h-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{node.email}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Expand/collapse toggle */}
        {hasChildren && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm transition-colors cursor-pointer z-10"
            style={{
              border: isExpanded ? '1.5px solid #cc785c' : '1.5px solid #cbd5e1',
            }}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded
              ? <ChevronUp className="w-3 h-3" style={{ color: '#cc785c' }} />
              : <ChevronDown className="w-3 h-3 text-slate-400" />
            }
          </button>
        )}

        {/* Edit mode: Add node button on hover */}
        {editMode && hovered && (
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center shadow cursor-pointer transition-colors z-20"
            style={{ backgroundColor: '#5db872', marginBottom: hasChildren ? -24 : 0 }}
            aria-label="Add report"
            title="Add report"
          >
            <Plus className="w-3 h-3 text-white" />
          </button>
        )}

        {/* Edit mode: Delete for leaf nodes */}
        {editMode && node.children.length === 0 && hovered && (
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center cursor-pointer z-20"
            style={{ border: '1.5px solid #fca5a5' }}
            aria-label="Delete node"
            title="Delete node"
          >
            <XCircle className="w-3.5 h-3.5 text-red-400" />
          </button>
        )}

        {/* Edit mode: drag tooltip */}
        {dropTarget && (
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-white px-2 py-1 rounded z-30"
            style={{ backgroundColor: '#cc785c' }}
          >
            Move under {node.name.split(' ').slice(-1)[0]}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
