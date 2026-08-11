import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { CustomFieldDefinitionResponse } from '../../types/admin.types'

interface OptionsPreviewProps {
  def: CustomFieldDefinitionResponse
}

export function OptionsPreview({ def }: OptionsPreviewProps) {
  const [expanded, setExpanded] = useState(false)
  if (!['Select', 'MultiSelect'].includes(def.fieldType)) return <span className="text-muted-foreground text-xs">—</span>
  const active = def.options.filter(o => o.isActive)
  if (active.length === 0) return <span className="text-muted-foreground text-xs">Chưa có lựa chọn</span>
  return (
    <button
      onClick={() => setExpanded(v => !v)}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      aria-expanded={expanded}
    >
      {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      {active.length} lựa chọn
      {expanded && (
        <span className="ml-1 text-foreground">
          ({active.slice(0, 3).map(o => o.label).join(', ')}{active.length > 3 ? '...' : ''})
        </span>
      )}
    </button>
  )
}
