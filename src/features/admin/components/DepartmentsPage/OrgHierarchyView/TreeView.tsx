import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, Crown, GitBranch, Minus, Network, Plus, RefreshCw, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { OrgChartTree } from '@/features/hr/components/OrgChartPage/OrgChartTree'
import { cn } from '@/lib/utils'
import { useDepartmentMembers, useUpdateDepartment } from '../../../hooks/use-departments'
import type { DepartmentTreeResponse } from '../../../types/admin.types'
import { MembersContent } from './MembersPanel'
import { DeptOrgCard } from './DeptOrgCard'
import { ChildrenList } from './ChildrenList'
import type { DeptNode, JobLevelOption } from './types'

interface TreeViewProps {
  readonly jobLevels: JobLevelOption[]
  readonly tree: DepartmentTreeResponse[] | undefined
  readonly isLoading: boolean
  readonly isError?: boolean
  readonly onRetry?: () => void
}

function findNode(node: DeptNode, id: string): DeptNode | null {
  if (node.id === id) return node
  for (const child of node.children) {
    const found = findNode(child as DeptNode, id)
    if (found) return found
  }
  return null
}

function buildPath(nodes: DeptNode[], targetId: string, path: string[] = []): string[] | null {
  for (const node of nodes) {
    const current = [...path, node.departmentName]
    if (node.id === targetId) return current
    const found = buildPath(node.children as DeptNode[], targetId, current)
    if (found) return found
  }
  return null
}

function renderDeptCard(props: Parameters<typeof DeptOrgCard>[0]) {
  return <DeptOrgCard {...props} />
}

// ponytail: orchestrator — owns useUpdateDepartment + useDepartmentMembers for the selected dept
// in the tree sheet; DepartmentsPage does not manage these
export function TreeView({ jobLevels, tree, isLoading, isError, onRetry }: TreeViewProps) {
  const [scale, setScale] = useState(1)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'members' | 'children'>('members')
  const [addOpen, setAddOpen] = useState(false)
  const updateDept = useUpdateDepartment()
  const { data: deptMembers = [], isLoading: isMembersLoading } = useDepartmentMembers(selectedDeptId)

  const root = useMemo((): DeptNode | null => {
    const roots = (tree ?? []) as DeptNode[]
    if (roots.length === 0) return null
    if (roots.length === 1) return roots[0]
    return {
      id: '__root__',
      departmentName: 'Cơ cấu tổ chức',
      departmentCode: '',
      isActive: true,
      memberCount: 0,
      children: roots,
    }
  }, [tree])

  const selectedDept = useMemo(
    () => (selectedDeptId && root) ? findNode(root, selectedDeptId) ?? null : null,
    [root, selectedDeptId], // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(() => {
    if (!root) return
    const ids = new Set<string>()
    const collect = (n: DeptNode) => { ids.add(n.id); n.children.forEach(collect) }
    collect(root)
    setExpandedIds(ids)
  }, [root])

  const handleSelect = useCallback((node: DeptNode) => {
    if (node.id === '__root__') return
    setSelectedDeptId(node.id)
    setActiveTab('members')
    setAddOpen(false)
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

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card border rounded-lg border-dashed">
        <div className="text-center space-y-2">
          <AlertCircle className="w-7 h-7 text-destructive/60 mx-auto" />
          <p className="text-xs text-muted-foreground">Không tải được sơ đồ tổ chức</p>
          {onRetry && (
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => onRetry()}>
              <RefreshCw className="w-3.5 h-3.5" />Thử lại
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (!root) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card border rounded-lg border-dashed">
        <div className="text-center space-y-1.5">
          <Network className="w-8 h-8 text-muted-foreground/25 mx-auto" />
          <p className="text-xs text-muted-foreground">Chưa có phòng ban nào</p>
          <p className="text-[11px] text-muted-foreground/60">Tạo phòng ban đầu tiên trong tab Quản lý</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
        <div className="flex items-center rounded-md overflow-hidden border bg-card shadow-sm">
          <button
            type="button"
            aria-label="Thu nhỏ sơ đồ"
            onClick={() => setScale(s => Math.max(0.3, Math.round((s - 0.1) * 10) / 10))}
            className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer text-muted-foreground"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-medium text-muted-foreground px-1.5 min-w-[36px] text-center select-none tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            aria-label="Phóng to sơ đồ"
            onClick={() => setScale(s => Math.min(2, Math.round((s + 0.1) * 10) / 10))}
            className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer text-muted-foreground border-l"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground bg-card/80 backdrop-blur-sm border rounded px-2 py-1 shadow-sm">
          Click phòng ban để xem chi tiết · Cuộn để di chuyển · +/− để zoom
        </p>
      </div>

      <div className="flex-1 bg-card border rounded-lg overflow-hidden">
        <OrgChartTree
          tree={root as DeptNode}
          renderNode={renderDeptCard}
          selectedId={selectedDeptId}
          expandedIds={expandedIds}
          onSelect={handleSelect}
          onToggle={handleToggle}
          scale={scale}
          onZoomChange={setScale}
          editMode={false}
        />
      </div>

      <Sheet open={!!selectedDeptId} onOpenChange={open => { if (!open) { setSelectedDeptId(null); setAddOpen(false) } }}>
        <SheetContent side="right" className="w-[420px] p-0 flex flex-col gap-0">
          {selectedDept && (
            <>
              <div className="shrink-0 border-b">
                <SheetHeader className="px-3 pt-3 pb-2">
                  {(() => {
                    const pathSegments = root ? buildPath(root.id === '__root__' ? root.children as DeptNode[] : [root], selectedDept.id) : null
                    const parentPath = pathSegments && pathSegments.length > 1 ? pathSegments.slice(0, -1).join(' / ') : null
                    return parentPath ? (
                      <p className="text-[11px] text-muted-foreground truncate mb-1" title={parentPath}>{parentPath}</p>
                    ) : null
                  })()}
                  <SheetTitle className="text-sm font-semibold text-left leading-tight">
                    {selectedDept.departmentName}
                  </SheetTitle>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                      {selectedDept.departmentCode}
                    </span>
                    {selectedDept.isActive ? (
                      <Badge variant="outline" className="text-xs px-1.5 h-5 text-green-600 border-green-600/30 bg-green-500/5">
                        Hoạt động
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs px-1.5 h-5 text-muted-foreground border-dashed">
                        Đã vô hiệu
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        'h-7 px-2.5 text-xs gap-1 ml-auto',
                        selectedDept.isActive
                          ? 'text-destructive border-destructive/30 hover:bg-destructive/10'
                          : 'text-green-600 border-green-600/40 hover:bg-green-500/10',
                      )}
                      onClick={() => updateDept.mutate({
                        id: selectedDept.id,
                        data: {
                          departmentName: selectedDept.departmentName,
                          departmentCode: selectedDept.departmentCode,
                          parentDepartmentId: selectedDept.parentDepartmentId,
                          managerId: selectedDept.managerId,
                          isActive: !selectedDept.isActive,
                        },
                      })}
                      disabled={updateDept.isPending}
                    >
                      {updateDept.isPending ? 'Đang lưu...' : selectedDept.isActive ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                    </Button>
                  </div>
                </SheetHeader>
                <div className="px-3 pb-2.5 space-y-1">
                  <div className="flex items-center gap-2 min-h-[32px]">
                    <div className="flex items-center gap-1.5 w-[92px] shrink-0">
                      <Crown className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground">Trưởng phòng</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Select
                        value={selectedDept.managerId ?? '__none__'}
                        onValueChange={value => updateDept.mutate({
                          id: selectedDept.id,
                          data: {
                            departmentName: selectedDept.departmentName,
                            departmentCode: selectedDept.departmentCode,
                            parentDepartmentId: selectedDept.parentDepartmentId,
                            managerId: value === '__none__' ? undefined : value,
                            isActive: selectedDept.isActive,
                          },
                        })}
                        disabled={updateDept.isPending || isMembersLoading}
                      >
                        <SelectTrigger className="h-8 text-xs border-transparent bg-transparent shadow-none px-1.5 hover:bg-muted/60 hover:border-border/50 transition-colors focus:ring-0">
                          <SelectValue>
                            {isMembersLoading ? (
                              <span className="text-muted-foreground/50 italic">Đang tải...</span>
                            ) : selectedDept.managerId && selectedDept.managerName ? (
                              <div className="flex items-center gap-1.5">
                                <Avatar className="h-4 w-4 shrink-0">
                                  <AvatarImage src={selectedDept.managerAvatarUrl} alt={selectedDept.managerName} />
                                  <AvatarFallback className="text-[8px]">{selectedDept.managerName.split(' ').slice(-1)[0]?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{selectedDept.managerName}</span>
                              </div>
                            ) : <span className="text-muted-foreground/50 italic">Chưa có</span>}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent align="start" sideOffset={4}>
                          <SelectItem value="__none__">— Không có —</SelectItem>
                          {deptMembers.length === 0 && !isMembersLoading
                            ? <p className="text-xs text-muted-foreground px-3 py-2 italic">Thêm thành viên trước</p>
                            : deptMembers.map(m => (
                              <SelectItem key={m.userId} value={m.userId}>{m.fullName}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground px-1.5">Chỉ chọn được từ thành viên phòng ban</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-h-[28px]">
                    <div className="flex items-center gap-1.5 w-[92px] shrink-0">
                      <GitBranch className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground">Phòng con</span>
                    </div>
                    <span className="text-xs font-medium px-1.5">
                      {selectedDept.children.length > 0 ? selectedDept.children.length : <span className="text-muted-foreground/50">—</span>}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-b flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('members')}
                  className={cn(
                    'h-9 px-4 flex items-center gap-1.5 text-xs font-medium border-b-2 transition-colors cursor-pointer',
                    activeTab === 'members'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Users className="w-3 h-3" />
                  Thành viên
                  <span className={cn(
                    'text-xs rounded-full px-1.5 leading-4 tabular-nums',
                    activeTab === 'members' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                  )}>
                    {selectedDept.memberCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('children')}
                  className={cn(
                    'h-9 px-4 flex items-center gap-1.5 text-xs font-medium border-b-2 transition-colors cursor-pointer',
                    activeTab === 'children'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  <GitBranch className="w-3 h-3" />
                  Phòng con
                  <span className={cn(
                    'text-xs rounded-full px-1.5 leading-4 tabular-nums',
                    activeTab === 'children' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                  )}>
                    {selectedDept.children.length}
                  </span>
                </button>
                {activeTab === 'members' && (
                  <Button
                    size="sm"
                    className="h-7 px-2.5 text-xs gap-1 ml-auto mr-3 shrink-0"
                    onClick={() => setAddOpen(true)}
                  >
                    <Plus className="w-3 h-3" />Thêm
                  </Button>
                )}
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                {activeTab === 'members' ? (
                  <MembersContent dept={selectedDept} jobLevels={jobLevels} addOpen={addOpen} onAddOpenChange={setAddOpen} />
                ) : (
                  <ChildrenList children={selectedDept.children as DeptNode[]} />
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
