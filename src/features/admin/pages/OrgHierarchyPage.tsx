import { useCallback, useMemo, useState } from 'react'
import {
  Building2, ChevronRight, List, Minus, Network, Plus,
  Share2, Trash2, UserCog, Users,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { OrgChartTree, type RenderNodeProps } from '@/features/hr/components/orgchart/OrgChartTree'
import { cn } from '@/lib/utils'
import {
  useAddDepartmentMember,
  useDepartmentMembers,
  useDepartmentTree,
  useRemoveDepartmentMember,
  useUpdateDepartmentMember,
} from '../hooks/use-departments'
import { useJobLevels } from '../hooks/use-job-levels'
import type { DepartmentMemberResponse, DepartmentTreeResponse } from '../types/admin.types'

// ─── Shared types ─────────────────────────────────────────────

type JobLevelOption = { id: string; levelName: string }

// ─── Helpers ──────────────────────────────────────────────────

function groupByLevel(members: DepartmentMemberResponse[]) {
  const map = new Map<string, { levelName: string; order: number; items: DepartmentMemberResponse[] }>()
  for (const m of members) {
    const key = m.jobLevelId ?? '__none__'
    if (!map.has(key)) {
      map.set(key, { levelName: m.jobLevelName ?? 'Chưa phân cấp', order: m.jobLevelOrder ?? 999, items: [] })
    }
    map.get(key)!.items.push(m)
  }
  return [...map.values()].sort((a, b) => a.order - b.order)
}

function initials(name: string) {
  return name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
}

// ─── Member row ───────────────────────────────────────────────

function MemberRow({ member, departmentId, jobLevels }: {
  member: DepartmentMemberResponse
  departmentId: string
  jobLevels: JobLevelOption[]
}) {
  const updateMember = useUpdateDepartmentMember()
  const removeMember = useRemoveDepartmentMember()

  return (
    <div className="flex items-center gap-2.5 px-3 py-2 hover:bg-muted/40 transition-colors group">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={member.avatarUrl} alt={member.fullName} />
        <AvatarFallback className="text-[10px] font-medium">{initials(member.fullName)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium truncate leading-none">{member.fullName}</span>
          {member.isPrimary && (
            <span className="text-[9px] px-1 py-px rounded border text-muted-foreground shrink-0 leading-none">chính</span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground font-mono leading-none mt-0.5 block">{member.employeeCode}</span>
      </div>

      <Select
        value={member.jobLevelId ?? '__none__'}
        onValueChange={v => updateMember.mutate({
          userId: member.userId, departmentId,
          data: { jobLevelId: v === '__none__' ? null : v },
        })}
        disabled={updateMember.isPending}
      >
        <SelectTrigger className="h-6 w-32 text-[11px] border-dashed">
          <SelectValue placeholder="Chức vụ..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__" className="text-[11px] text-muted-foreground">— Chưa có —</SelectItem>
          {jobLevels.map(jl => (
            <SelectItem key={jl.id} value={jl.id} className="text-[11px]">{jl.levelName}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        type="button"
        onClick={() => {
          if (!confirm(`Xóa ${member.fullName} khỏi phòng ban?`)) return
          removeMember.mutate({ userId: member.userId, departmentId })
        }}
        disabled={removeMember.isPending}
        aria-label={`Xóa ${member.fullName}`}
        className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shrink-0 cursor-pointer disabled:opacity-40"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  )
}

// ─── Add member dialog ────────────────────────────────────────

function AddMemberDialog({ open, departmentId, onOpenChange, jobLevels }: {
  open: boolean
  departmentId: string
  onOpenChange: (v: boolean) => void
  jobLevels: JobLevelOption[]
}) {
  const [userId, setUserId] = useState('')
  const [jobLevelId, setJobLevelId] = useState('')
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0])
  const addMember = useAddDepartmentMember()

  const reset = () => { setUserId(''); setJobLevelId('') }

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset() }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">Thêm thành viên</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault()
            if (!userId.trim()) return
            addMember.mutate(
              { userId: userId.trim(), data: { departmentId, startDate, jobLevelId: jobLevelId || undefined } },
              { onSuccess: () => { onOpenChange(false); reset() } },
            )
          }}
          className="space-y-3 pt-1"
        >
          <div className="space-y-1">
            <Label htmlFor="uid" className="text-xs">User ID <span className="text-destructive">*</span></Label>
            <Input id="uid" value={userId} onChange={e => setUserId(e.target.value)}
              placeholder="UUID của user..." className="h-8 text-xs" required />
            <p className="text-[11px] text-muted-foreground">Lấy từ trang quản lý tài khoản.</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="jl" className="text-xs">Chức vụ</Label>
            <Select value={jobLevelId} onValueChange={setJobLevelId}>
              <SelectTrigger id="jl" className="h-8 text-xs"><SelectValue placeholder="Chọn chức vụ..." /></SelectTrigger>
              <SelectContent>
                {jobLevels.map(jl => <SelectItem key={jl.id} value={jl.id} className="text-xs">{jl.levelName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="sd" className="text-xs">Ngày bắt đầu <span className="text-destructive">*</span></Label>
            <Input id="sd" type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="h-8 text-xs" required />
          </div>
          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" size="sm" disabled={addMember.isPending || !userId.trim()}>
              {addMember.isPending ? 'Đang thêm...' : 'Thêm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Members content (shared between list panel + tree sheet) ─

function MembersContent({ dept, jobLevels }: {
  dept: DepartmentTreeResponse
  jobLevels: JobLevelOption[]
}) {
  const [addOpen, setAddOpen] = useState(false)
  const { data: members, isLoading } = useDepartmentMembers(dept.id)
  const grouped = groupByLevel(members ?? [])
  const total = members?.length ?? 0

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b shrink-0">
        <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs font-semibold truncate flex-1">{dept.departmentName}</span>
        <span className="text-[10px] font-mono text-muted-foreground shrink-0">{dept.departmentCode}</span>
        <Badge variant="secondary" className="text-[10px] px-1.5 h-4 shrink-0">{total}</Badge>
        <Button size="sm" className="h-6 px-2 text-[11px] gap-1 shrink-0" onClick={() => setAddOpen(true)}>
          <Plus className="w-3 h-3" />Thêm
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-2 space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                <div className="flex-1 space-y-1"><Skeleton className="h-3 w-28" /><Skeleton className="h-2.5 w-16" /></div>
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 gap-2 text-center">
            <UserCog className="w-7 h-7 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">Chưa có thành viên</p>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1 mt-1" onClick={() => setAddOpen(true)}>
              <Plus className="w-3 h-3" />Thêm ngay
            </Button>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.levelName}>
              <div className="px-3 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide bg-muted/30 border-b sticky top-0">
                {group.levelName} <span className="normal-case font-normal opacity-70">({group.items.length})</span>
              </div>
              {group.items.map(m => (
                <MemberRow key={m.userDepartmentId} member={m} departmentId={dept.id} jobLevels={jobLevels} />
              ))}
            </div>
          ))
        )}
      </div>

      <AddMemberDialog open={addOpen} departmentId={dept.id} onOpenChange={setAddOpen} jobLevels={jobLevels} />
    </>
  )
}

// ─── Left dept tree (list view) ───────────────────────────────

function DeptTreeNode({ dept, selectedId, onSelect, depth = 0 }: {
  dept: DepartmentTreeResponse
  selectedId: string | null
  onSelect: (d: DepartmentTreeResponse) => void
  depth?: number
}) {
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
          'hover:bg-muted/50 transition-colors',
          selectedId === dept.id && 'bg-primary/10 text-primary font-medium',
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
      {expanded && hasChildren && dept.children.map(c => (
        <DeptTreeNode key={c.id} dept={c} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
      ))}
    </div>
  )
}

// ─── List view ────────────────────────────────────────────────

function ListView({ jobLevels }: { jobLevels: JobLevelOption[] }) {
  const [selectedDept, setSelectedDept] = useState<DepartmentTreeResponse | null>(null)
  const [search, setSearch] = useState('')
  const { data: tree, isLoading } = useDepartmentTree()

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const filter = (nodes: DepartmentTreeResponse[]): DepartmentTreeResponse[] =>
      nodes.map(n => ({ ...n, children: filter(n.children) }))
        .filter(n => !q || n.departmentName.toLowerCase().includes(q) || n.departmentCode.toLowerCase().includes(q) || n.children.length > 0)
    return filter(tree ?? [])
  }, [tree, search])

  return (
    <div className="flex flex-1 gap-2 overflow-hidden">
      {/* Left */}
      <div className="w-56 shrink-0 flex flex-col bg-card border rounded-lg overflow-hidden">
        <div className="flex items-center gap-1.5 px-2.5 py-2 border-b shrink-0">
          <svg className="w-3 h-3 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm phòng ban..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-1">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6 w-full mb-0.5" />)
            : filtered.length === 0
              ? <p className="text-[11px] text-muted-foreground text-center py-6">Không tìm thấy</p>
              : filtered.map(d => <DeptTreeNode key={d.id} dept={d} selectedId={selectedDept?.id ?? null} onSelect={setSelectedDept} />)
          }
        </div>
      </div>

      {/* Right */}
      {selectedDept ? (
        <div className="flex-1 flex flex-col bg-card border rounded-lg overflow-hidden min-w-0">
          <MembersContent dept={selectedDept} jobLevels={jobLevels} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-card border rounded-lg border-dashed">
          <div className="text-center space-y-1.5">
            <Users className="w-8 h-8 text-muted-foreground/25 mx-auto" />
            <p className="text-xs text-muted-foreground">Chọn phòng ban để xem thành viên</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Tree view ────────────────────────────────────────────────

// Wrapper node since OrgChartTree needs single root
type DeptNode = DepartmentTreeResponse & { children: readonly DeptNode[] }

function DeptOrgCard({ node, selected, onSelect, isRoot }: RenderNodeProps<DeptNode>) {
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
      )}
    >
      <p className="text-[10px] font-mono text-muted-foreground mb-0.5 leading-none">{node.departmentCode}</p>
      <p className="text-xs font-semibold leading-snug line-clamp-2">{node.departmentName}</p>
      {node.managerName && (
        <p className="text-[10px] text-muted-foreground mt-1 truncate leading-none">{node.managerName}</p>
      )}
      <div className="flex items-center gap-1 mt-1.5">
        <Users className="w-2.5 h-2.5 text-muted-foreground/60" />
        <span className="text-[10px] text-muted-foreground/80">{node.children.length > 0 ? `${node.children.length} phòng con` : 'Không có phòng con'}</span>
      </div>
    </button>
  )
}

function renderDeptCard(props: RenderNodeProps<DeptNode>) {
  return <DeptOrgCard {...props} />
}

function TreeView({ jobLevels }: { jobLevels: JobLevelOption[] }) {
  const [scale, setScale] = useState(1)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['__root__']))
  const [selectedDept, setSelectedDept] = useState<DepartmentTreeResponse | null>(null)
  const { data: tree, isLoading } = useDepartmentTree()

  const root = useMemo((): DeptNode => ({
    id: '__root__',
    departmentName: 'Cơ cấu tổ chức',
    departmentCode: '',
    isActive: true,
    children: (tree ?? []) as DeptNode[],
  }), [tree])

  const handleSelect = useCallback((node: DeptNode) => {
    if (node.id === '__root__') return
    setSelectedDept(node)
  }, [])

  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card border rounded-lg">
        <Skeleton className="w-40 h-12 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center rounded-md overflow-hidden border bg-card shadow-sm">
        <button type="button" onClick={() => setScale(s => Math.max(0.3, Math.round((s - 0.1) * 10) / 10))}
          className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer text-muted-foreground">
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-[10px] font-medium text-muted-foreground px-1.5 min-w-[36px] text-center select-none tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <button type="button" onClick={() => setScale(s => Math.min(2, Math.round((s + 0.1) * 10) / 10))}
          className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer text-muted-foreground border-l">
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 bg-card border rounded-lg overflow-hidden">
        <OrgChartTree
          tree={root}
          renderNode={renderDeptCard}
          selectedId={selectedDept?.id ?? null}
          expandedIds={expandedIds}
          onSelect={handleSelect}
          onToggle={handleToggle}
          scale={scale}
          onZoomChange={setScale}
          editMode={false}
        />
      </div>

      {/* Sheet for selected dept */}
      <Sheet open={!!selectedDept} onOpenChange={open => !open && setSelectedDept(null)}>
        <SheetContent side="right" className="w-96 p-0 flex flex-col gap-0">
          {selectedDept && (
            <>
              <SheetHeader className="px-3 py-2 border-b shrink-0">
                <SheetTitle className="text-sm font-semibold">{selectedDept.departmentName}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 flex flex-col overflow-hidden">
                <MembersContent dept={selectedDept} jobLevels={jobLevels} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function OrgHierarchyPage() {
  const [view, setView] = useState<'list' | 'tree'>('list')

  const { data: jobLevelsData } = useJobLevels({ Top: 100, NeedTotalCount: false })
  const jobLevels: JobLevelOption[] = useMemo(() =>
    (jobLevelsData?.items ?? [])
      .filter(jl => !jl.isDeleted)
      .sort((a, b) => a.levelOrder - b.levelOrder)
      .map(jl => ({ id: jl.id, levelName: jl.levelName })),
    [jobLevelsData],
  )

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 h-11 border-b shrink-0 bg-card">
        <Network className="w-3.5 h-3.5 text-muted-foreground" />
        <h1 className="text-xs font-semibold">Cơ cấu tổ chức</h1>
        <div className="flex-1" />
        {/* View toggle */}
        <div className="flex items-center rounded-md overflow-hidden border">
          <button
            type="button" onClick={() => setView('list')}
            aria-label="Danh sách"
            className={cn(
              'h-7 w-7 flex items-center justify-center transition-colors cursor-pointer',
              view === 'list' ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground hover:bg-muted/50',
            )}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button" onClick={() => setView('tree')}
            aria-label="Sơ đồ cây"
            className={cn(
              'h-7 w-7 flex items-center justify-center transition-colors cursor-pointer border-l',
              view === 'tree' ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground hover:bg-muted/50',
            )}
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 p-2 overflow-hidden">
        {view === 'list'
          ? <ListView jobLevels={jobLevels} />
          : <TreeView jobLevels={jobLevels} />
        }
      </div>
    </div>
  )
}
