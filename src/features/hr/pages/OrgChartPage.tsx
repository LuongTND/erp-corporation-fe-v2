import { useCallback, useState } from 'react'
import {
  Download,
  List,
  Minus,
  Network,
  Plus,
  Search,
  Settings,
  Share2,
} from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { OrgChartTree } from '@/features/hr/components/orgchart/OrgChartTree'
import { OrgChartSheet } from '@/features/hr/components/orgchart/OrgChartSheet'
import { DEPT_NAMES, ORG_TREE } from '@/features/hr/components/orgchart/orgchart.data'
import type { OrgPerson } from '@/features/hr/components/orgchart/orgchart.types'
import { cn } from '@/lib/utils'

const DEFAULT_EXPANDED = new Set([
  'ceo',
  'vp-eng', 'vp-sales', 'vp-people',
  'head-backend', 'head-frontend', 'sales-mgr', 'mktg-mgr', 'hr-mgr', 'finance-mgr',
])

export default function OrgChartPage() {
  const [scale,        setScale]        = useState(1)
  const [expandedIds,  setExpandedIds]  = useState<Set<string>>(new Set(DEFAULT_EXPANDED))
  const [selectedNode, setSelectedNode] = useState<OrgPerson | null>(null)
  const [sheetOpen,    setSheetOpen]    = useState(false)
  const [editMode,     setEditMode]     = useState(false)
  const [viewMode,     setViewMode]     = useState<'tree' | 'list'>('tree')
  const [dept,         setDept]         = useState('All Departments')
  const [search,       setSearch]       = useState('')
  const [focusId,      setFocusId]      = useState<string | null>(null)

  const handleSelect = useCallback((node: OrgPerson) => {
    setSelectedNode(node)
    setSheetOpen(true)
  }, [])

  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const handleFocusNode = useCallback((id: string) => {
    setFocusId(id)
    setExpandedIds(new Set(DEFAULT_EXPANDED))
  }, [])

  const zoomIn  = () => setScale(s => Math.min(2,   Math.round((s + 0.1) * 10) / 10))
  const zoomOut = () => setScale(s => Math.max(0.3, Math.round((s - 0.1) * 10) / 10))

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <div className="flex flex-col flex-1 p-6 gap-4 overflow-hidden">

        {/* Header toolbar */}
        <div className="bg-card rounded-xl shadow-sm p-4 flex items-center gap-3 flex-wrap shrink-0 border border-border">
          {/* Title */}
          <div className="flex items-center gap-2 mr-2">
            <Network className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Organization Chart</h1>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-muted/40 text-sm w-64">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee or team..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>

          {/* Dept filter */}
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="h-9 w-40 text-sm border-border text-muted-foreground bg-card cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPT_NAMES.map((d) => (
                <SelectItem key={d} value={d} className="text-sm cursor-pointer">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View mode toggle */}
          <div className="flex items-center rounded-lg overflow-hidden border border-border">
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className={cn(
                'h-9 w-9 flex items-center justify-center transition-colors cursor-pointer',
                viewMode === 'tree' ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground',
              )}
              aria-label="Tree view"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'h-9 w-9 flex items-center justify-center transition-colors cursor-pointer border-l border-border',
                viewMode === 'list' ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground',
              )}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center rounded-lg overflow-hidden border border-border">
            <button
              type="button"
              onClick={zoomOut}
              className="h-9 w-9 flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer text-muted-foreground"
              aria-label="Zoom out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-medium text-muted-foreground px-2 min-w-[44px] text-center select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              className="h-9 w-9 flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer text-muted-foreground border-l border-border"
              aria-label="Zoom in"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export */}
          <button
            type="button"
            className="flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium border border-border text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PNG
          </button>

          {/* Edit Structure */}
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            className={cn(
              'flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium text-primary-foreground cursor-pointer transition-opacity hover:opacity-90',
              editMode ? 'bg-primary/70' : 'bg-primary',
            )}
          >
            <Settings className="w-4 h-4" />
            {editMode ? 'Exit Edit' : 'Edit Structure'}
          </button>
        </div>

        {/* Edit mode banner */}
        {editMode && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium shrink-0 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500 text-white">
              EDITING MODE
            </span>
            <span>Drag nodes to restructure. Add (+) or delete (×) leaf nodes.</span>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-semibold text-white cursor-pointer transition-opacity hover:opacity-90 bg-green-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-semibold border border-destructive/40 text-destructive cursor-pointer hover:bg-destructive/10 transition-colors"
            >
              Discard
            </button>
          </div>
        )}

        {/* Chart area */}
        <div className="flex-1 bg-card rounded-xl shadow-sm overflow-hidden relative border border-border">
          <OrgChartTree
            tree={ORG_TREE}
            selectedId={selectedNode?.id ?? null}
            expandedIds={expandedIds}
            onSelect={handleSelect}
            onToggle={handleToggle}
            scale={scale}
            onZoomChange={setScale}
            editMode={editMode}
            focusId={focusId}
          />
        </div>
      </div>

      {/* Detail sheet */}
      <OrgChartSheet
        person={selectedNode}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onFocusNode={handleFocusNode}
      />
    </div>
  )
}
