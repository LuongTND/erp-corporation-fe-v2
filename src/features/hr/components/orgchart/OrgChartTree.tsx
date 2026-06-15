import { useCallback, useEffect, useRef, useState } from 'react'
import { OrgChartNode } from './OrgChartNode'
import type { OrgPerson } from './orgchart.types'

// ─── Recursive tree renderer ──────────────────────────────────────────────────

interface TreeNodeProps {
  node: OrgPerson
  isRoot?: boolean
  selectedId: string | null
  expandedIds: Set<string>
  onSelect: (node: OrgPerson) => void
  onToggle: (id: string) => void
  editMode: boolean
  depth?: number
}

function TreeNode({
  node,
  isRoot = false,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  editMode,
  depth = 0,
}: TreeNodeProps) {
  const isExpanded   = expandedIds.has(node.id)
  const isSelected   = selectedId === node.id
  const hasChildren  = node.children.length > 0

  const gap = depth <= 1 ? 32 : 24   // px gap between siblings

  return (
    <div className="flex flex-col items-center">
      <OrgChartNode
        node={node}
        isRoot={isRoot}
        selected={isSelected}
        onSelect={() => onSelect(node)}
        isExpanded={isExpanded}
        hasChildren={hasChildren}
        onToggle={(e) => { e.stopPropagation(); onToggle(node.id) }}
        editMode={editMode}
      />

      {/* Children group */}
      {isExpanded && hasChildren && (
        <div className="flex flex-col items-center">
          {/* Stem from parent down */}
          <div className="w-px bg-slate-200" style={{ height: 24, marginTop: node.children.length ? 12 : 0 }} />

          {/* Horizontal + vertical connectors + children */}
          <div className="flex items-start" style={{ gap }}>
            {node.children.map((child, i) => {
              const isFirst = i === 0
              const isLast  = i === node.children.length - 1
              const isOnly  = node.children.length === 1

              return (
                <div key={child.id} className="flex flex-col items-center">
                  {/* Connector stem above each child */}
                  <div className="relative flex justify-center" style={{ height: 24, width: '100%', minWidth: isRoot ? 240 : 208 }}>
                    {/* vertical segment */}
                    <div
                      className="absolute bg-slate-200"
                      style={{ width: 1, height: 24, left: '50%', top: 0 }}
                    />
                    {/* horizontal left arm */}
                    {!isOnly && !isFirst && (
                      <div
                        className="absolute bg-slate-200"
                        style={{ height: 1, top: 0, left: 0, right: '50%' }}
                      />
                    )}
                    {/* horizontal right arm */}
                    {!isOnly && !isLast && (
                      <div
                        className="absolute bg-slate-200"
                        style={{ height: 1, top: 0, left: '50%', right: 0 }}
                      />
                    )}
                  </div>

                  {/* Recursive child */}
                  <TreeNode
                    node={child}
                    selectedId={selectedId}
                    expandedIds={expandedIds}
                    onSelect={onSelect}
                    onToggle={onToggle}
                    editMode={editMode}
                    depth={depth + 1}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MiniMap ──────────────────────────────────────────────────────────────────

function MiniMap({ scale, tx, ty }: { scale: number; tx: number; ty: number }) {
  // Mini dots representing approximate node positions (hardcoded layout)
  const dots = [
    // CEO
    { x: 50, y: 10, r: 4, c: '#cc785c' },
    // VPs
    { x: 15, y: 28, r: 3, c: '#cc785c' },
    { x: 50, y: 28, r: 3, c: '#5db872' },
    { x: 85, y: 28, r: 3, c: '#5db8a6' },
    // Dept heads
    { x: 7,  y: 46, r: 2.5, c: '#cc785c' },
    { x: 22, y: 46, r: 2.5, c: '#cc785c' },
    { x: 43, y: 46, r: 2.5, c: '#5db872' },
    { x: 57, y: 46, r: 2.5, c: '#8b5cf6' },
    { x: 78, y: 46, r: 2.5, c: '#5db8a6' },
    { x: 92, y: 46, r: 2.5, c: '#64748b' },
  ]

  // Viewport rect: invert transform to get visible area hint
  const vw = 120, vh = 80
  const rectW = Math.min(vw, vw / scale) * 0.6
  const rectH = Math.min(vh, vh / scale) * 0.6
  const rectX = Math.max(0, Math.min(vw - rectW, vw * 0.5 - tx / 20 - rectW / 2))
  const rectY = Math.max(0, Math.min(vh - rectH, vh * 0.5 - ty / 20 - rectH / 2))

  return (
    <div
      className="absolute bottom-4 right-4 rounded-lg overflow-hidden"
      style={{
        width: 120, height: 80,
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <svg width="120" height="80">
        {/* Tree background */}
        <rect width="120" height="80" fill="#f8fafc" />
        {/* Connector lines sketch */}
        <line x1="50" y1="14" x2="50" y2="25" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="15" y1="25" x2="85" y2="25" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="15" y1="25" x2="15" y2="43" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="50" y1="25" x2="50" y2="43" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="85" y1="25" x2="85" y2="43" stroke="#e2e8f0" strokeWidth="1" />
        {/* Node dots */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity={0.8} />
        ))}
        {/* Viewport rect */}
        <rect
          x={rectX} y={rectY} width={rectW} height={rectH}
          fill="rgba(204,120,92,0.12)"
          stroke="#cc785c"
          strokeWidth="1"
          rx="2"
        />
      </svg>
      <p className="absolute bottom-0.5 left-0 right-0 text-center text-[8px] text-slate-400">
        {Math.round(scale * 100)}%
      </p>
    </div>
  )
}

// ─── OrgChartTree (pan + zoom container) ─────────────────────────────────────

interface OrgChartTreeProps {
  selectedId: string | null
  expandedIds: Set<string>
  onSelect: (node: OrgPerson) => void
  onToggle: (id: string) => void
  onZoomChange: (scale: number) => void
  scale: number
  editMode: boolean
  tree: OrgPerson
  focusId?: string | null
}

export function OrgChartTree({
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  onZoomChange,
  scale,
  editMode,
  tree,
  focusId,
}: OrgChartTreeProps) {
  const [translate, setTranslate] = useState({ x: 0, y: 40 })
  const isDragging   = useRef(false)
  const lastMouse    = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-reset translate when focusId changes
  useEffect(() => {
    if (focusId) {
      setTranslate({ x: 0, y: 40 })
    }
  }, [focusId])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Don't start drag if clicking a button/interactive element
    if ((e.target as HTMLElement).closest('button, [role="button"]')) return
    isDragging.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing'
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastMouse.current.x
    const dy = e.clientY - lastMouse.current.y
    lastMouse.current = { x: e.clientX, y: e.clientY }
    setTranslate(prev => ({ x: prev.x + dx, y: prev.y + dy }))
  }, [])

  const stopDrag = useCallback((_e: React.MouseEvent) => {
    isDragging.current = false
    if (containerRef.current) containerRef.current.style.cursor = 'grab'
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.08 : 0.08
    const next = Math.max(0.3, Math.min(2, scale + delta))
    onZoomChange(next)
  }, [scale, onZoomChange])

  return (
    <div
      ref={containerRef}
      className="relative w-full flex-1 overflow-hidden rounded-xl"
      style={{
        cursor: 'grab',
        // Dot grid
        backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundColor: '#f8fafc',
        minHeight: 500,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onWheel={handleWheel}
    >
      {/* Transformed tree */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: 0,
          transform: `translate(calc(-50% + ${translate.x}px), ${translate.y}px) scale(${scale})`,
          transformOrigin: 'top center',
          transition: isDragging.current ? 'none' : undefined,
        }}
      >
        <TreeNode
          node={tree}
          isRoot
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggle={onToggle}
          editMode={editMode}
          depth={0}
        />
      </div>

      {/* MiniMap */}
      <MiniMap scale={scale} tx={translate.x} ty={translate.y} />
    </div>
  )
}
