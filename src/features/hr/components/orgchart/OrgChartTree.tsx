import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

// ─── Generic render-node contract ────────────────────────────────────────────

export interface RenderNodeProps<TNode> {
  node: TNode
  isRoot: boolean
  selected: boolean
  isExpanded: boolean
  hasChildren: boolean
  onSelect: () => void
  onToggle: (event: React.MouseEvent) => void
  editMode: boolean
}

// ─── Recursive tree renderer ──────────────────────────────────────────────────

interface TreeNodeProps<TNode extends { id: string; children: readonly TNode[] }> {
  node: TNode
  isRoot?: boolean
  selectedId: string | null
  expandedIds: Set<string>
  onSelect: (node: TNode) => void
  onToggle: (id: string) => void
  editMode: boolean
  depth?: number
  renderNode: (props: RenderNodeProps<TNode>) => ReactNode
}

function TreeNode<TNode extends { id: string; children: readonly TNode[] }>({
  node,
  isRoot = false,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  editMode,
  depth = 0,
  renderNode,
}: TreeNodeProps<TNode>) {
  const isExpanded  = expandedIds.has(node.id)
  const isSelected  = selectedId === node.id
  const hasChildren = node.children.length > 0

  const gap = depth <= 1 ? 32 : 24

  return (
    <div className="flex flex-col items-center">
      {renderNode({
        node,
        isRoot,
        selected: isSelected,
        isExpanded,
        hasChildren,
        onSelect: () => onSelect(node),
        onToggle: (event) => { event.stopPropagation(); onToggle(node.id) },
        editMode,
      })}

      {isExpanded && hasChildren && (
        <div className="flex flex-col items-center">
          <div className="w-px bg-border" style={{ height: 24, marginTop: node.children.length ? 12 : 0 }} />

          <div className="flex items-start" style={{ gap }}>
            {node.children.map((child, index) => {
              const isFirst = index === 0
              const isLast  = index === node.children.length - 1
              const isOnly  = node.children.length === 1

              return (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="relative flex justify-center" style={{ height: 24, width: '100%', minWidth: isRoot ? 240 : 208 }}>
                    <div
                      className="absolute bg-border"
                      style={{ width: 1, height: 24, left: '50%', top: 0 }}
                    />
                    {!isOnly && !isFirst && (
                      <div
                        className="absolute bg-border"
                        style={{ height: 1, top: 0, left: 0, right: '50%' }}
                      />
                    )}
                    {!isOnly && !isLast && (
                      <div
                        className="absolute bg-border"
                        style={{ height: 1, top: 0, left: '50%', right: 0 }}
                      />
                    )}
                  </div>

                  <TreeNode
                    node={child}
                    selectedId={selectedId}
                    expandedIds={expandedIds}
                    onSelect={onSelect}
                    onToggle={onToggle}
                    editMode={editMode}
                    depth={depth + 1}
                    renderNode={renderNode}
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
  const dots = [
    { x: 50, y: 10, r: 4, c: '#cc785c' },
    { x: 15, y: 28, r: 3, c: '#cc785c' },
    { x: 50, y: 28, r: 3, c: '#5db872' },
    { x: 85, y: 28, r: 3, c: '#5db8a6' },
    { x: 7,  y: 46, r: 2.5, c: '#cc785c' },
    { x: 22, y: 46, r: 2.5, c: '#cc785c' },
    { x: 43, y: 46, r: 2.5, c: '#5db872' },
    { x: 57, y: 46, r: 2.5, c: '#8b5cf6' },
    { x: 78, y: 46, r: 2.5, c: '#5db8a6' },
    { x: 92, y: 46, r: 2.5, c: '#64748b' },
  ]

  const vw = 120, vh = 80
  const rectW = Math.min(vw, vw / scale) * 0.6
  const rectH = Math.min(vh, vh / scale) * 0.6
  const rectX = Math.max(0, Math.min(vw - rectW, vw * 0.5 - tx / 20 - rectW / 2))
  const rectY = Math.max(0, Math.min(vh - rectH, vh * 0.5 - ty / 20 - rectH / 2))

  return (
    <div className="absolute bottom-4 right-4 rounded-lg overflow-hidden border border-border bg-card shadow-md"
      style={{ width: 120, height: 80 }}
    >
      <svg width="120" height="80">
        <rect width="120" height="80" fill="transparent" />
        <line x1="50" y1="14" x2="50" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="15" y1="25" x2="85" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="15" y1="25" x2="15" y2="43" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="50" y1="25" x2="50" y2="43" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="85" y1="25" x2="85" y2="43" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        {dots.map((dot, index) => (
          <circle key={index} cx={dot.x} cy={dot.y} r={dot.r} fill={dot.c} opacity={0.8} />
        ))}
        <rect
          x={rectX} y={rectY} width={rectW} height={rectH}
          fill="oklch(var(--primary) / 0.12)"
          stroke="oklch(var(--primary))"
          strokeWidth="1"
          rx="2"
        />
      </svg>
      <p className="absolute bottom-0.5 left-0 right-0 text-center text-[8px] text-muted-foreground">
        {Math.round(scale * 100)}%
      </p>
    </div>
  )
}

// ─── OrgChartTree (pan + zoom container) ─────────────────────────────────────

interface OrgChartTreeProps<TNode extends { id: string; children: readonly TNode[] }> {
  tree: TNode
  renderNode: (props: RenderNodeProps<TNode>) => ReactNode
  selectedId: string | null
  expandedIds: Set<string>
  onSelect: (node: TNode) => void
  onToggle: (id: string) => void
  onZoomChange: (scale: number) => void
  scale: number
  editMode: boolean
  focusId?: string | null
}

export function OrgChartTree<TNode extends { id: string; children: readonly TNode[] }>({
  tree,
  renderNode,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  onZoomChange,
  scale,
  editMode,
  focusId,
}: OrgChartTreeProps<TNode>) {
  const [translate, setTranslate] = useState({ x: 0, y: 40 })
  const isDragging   = useRef(false)
  const lastMouse    = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (focusId) setTranslate({ x: 0, y: 40 })
  }, [focusId])

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('button, [role="button"]')) return
    isDragging.current = true
    lastMouse.current = { x: event.clientX, y: event.clientY }
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing'
  }, [])

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = event.clientX - lastMouse.current.x
    const dy = event.clientY - lastMouse.current.y
    lastMouse.current = { x: event.clientX, y: event.clientY }
    setTranslate(prev => ({ x: prev.x + dx, y: prev.y + dy }))
  }, [])

  const stopDrag = useCallback((_event: React.MouseEvent) => {
    isDragging.current = false
    if (containerRef.current) containerRef.current.style.cursor = 'grab'
  }, [])

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault()
    const delta = event.deltaY > 0 ? -0.08 : 0.08
    const next = Math.max(0.3, Math.min(2, scale + delta))
    onZoomChange(next)
  }, [scale, onZoomChange])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-xl"
      style={{
        cursor: 'grab',
        backgroundImage: 'radial-gradient(circle, oklch(var(--border)) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        minHeight: 500,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onWheel={handleWheel}
    >
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
          renderNode={renderNode}
        />
      </div>

      <MiniMap scale={scale} tx={translate.x} ty={translate.y} />
    </div>
  )
}
