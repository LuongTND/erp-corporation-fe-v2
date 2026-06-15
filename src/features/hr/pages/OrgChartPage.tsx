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

// Default expanded: levels 0, 1, 2  (CEO + VPs + dept heads)
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
    // Expand path to this node (simple: expand all)
    setExpandedIds(new Set(DEFAULT_EXPANDED))
  }, [])

  const zoomIn  = () => setScale(s => Math.min(2,   Math.round((s + 0.1) * 10) / 10))
  const zoomOut = () => setScale(s => Math.max(0.3, Math.round((s - 0.1) * 10) / 10))

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
      <div className="flex flex-col flex-1 p-6 gap-4 overflow-hidden">

        {/* Header toolbar */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 flex-wrap shrink-0">
          {/* Title */}
          <div className="flex items-center gap-2 mr-2">
            <Network className="w-5 h-5" style={{ color: '#cc785c' }} />
            <h1 className="text-xl font-semibold text-slate-900">Organization Chart</h1>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div
            className="flex items-center gap-2 h-9 px-3 rounded-lg border text-sm"
            style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc', width: 256 }}
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee or team..."
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm"
            />
          </div>

          {/* Dept filter */}
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger
              className="h-9 text-sm border rounded-lg cursor-pointer"
              style={{ borderColor: '#e2e8f0', color: '#475569', backgroundColor: '#fff', width: 160 }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPT_NAMES.map((d) => (
                <SelectItem key={d} value={d} className="text-sm cursor-pointer">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View mode toggle */}
          <div
            className="flex items-center rounded-lg overflow-hidden border"
            style={{ borderColor: '#e2e8f0' }}
          >
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className="h-9 w-9 flex items-center justify-center transition-colors cursor-pointer"
              style={{
                backgroundColor: viewMode === 'tree' ? '#fdf1eb' : '#fff',
                color: viewMode === 'tree' ? '#cc785c' : '#94a3b8',
              }}
              aria-label="Tree view"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="h-9 w-9 flex items-center justify-center transition-colors cursor-pointer border-l border-slate-200"
              style={{
                backgroundColor: viewMode === 'list' ? '#fdf1eb' : '#fff',
                color: viewMode === 'list' ? '#cc785c' : '#94a3b8',
              }}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom controls */}
          <div
            className="flex items-center rounded-lg overflow-hidden border"
            style={{ borderColor: '#e2e8f0' }}
          >
            <button
              type="button"
              onClick={zoomOut}
              className="h-9 w-9 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer text-slate-500"
              aria-label="Zoom out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-medium text-slate-600 px-2 min-w-[44px] text-center select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              className="h-9 w-9 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer text-slate-500 border-l border-slate-200"
              aria-label="Zoom in"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export */}
          <button
            type="button"
            className="flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium border cursor-pointer hover:bg-slate-50 transition-colors"
            style={{ borderColor: '#e2e8f0', color: '#475569' }}
          >
            <Download className="w-4 h-4" />
            Export PNG
          </button>

          {/* Edit Structure */}
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            className="flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium text-white cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: editMode ? '#e8a55a' : '#cc785c' }}
          >
            <Settings className="w-4 h-4" />
            {editMode ? 'Exit Edit' : 'Edit Structure'}
          </button>
        </div>

        {/* Edit mode banner */}
        {editMode && (
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium shrink-0"
            style={{ backgroundColor: '#fef9e7', border: '1px solid #e8a55a', color: '#9a6b2a' }}
          >
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#e8a55a', color: '#fff' }}
            >
              EDITING MODE
            </span>
            <span>Drag nodes to restructure. Add (+) or delete (×) leaf nodes.</span>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#5db872' }}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-semibold border cursor-pointer hover:bg-red-50 transition-colors"
              style={{ borderColor: '#fca5a5', color: '#ef4444' }}
            >
              Discard
            </button>
          </div>
        )}

        {/* Chart area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden relative">
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
