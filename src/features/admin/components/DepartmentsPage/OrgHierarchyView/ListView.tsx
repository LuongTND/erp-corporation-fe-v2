import { useMemo, useState } from 'react'
import { AlertCircle, Plus, RefreshCw, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { DepartmentTreeResponse } from '../../../types/admin.types'
import { MembersContent } from './MembersPanel'
import { DeptTreeNode } from './DeptTreeNode'
import type { JobLevelOption } from './types'

interface ListViewProps {
  readonly jobLevels: JobLevelOption[]
  readonly tree: DepartmentTreeResponse[] | undefined
  readonly isLoading: boolean
  readonly isError?: boolean
  readonly onRetry?: () => void
}

export function ListView({ jobLevels, tree, isLoading, isError, onRetry }: ListViewProps) {
  const [selectedDept, setSelectedDept] = useState<DepartmentTreeResponse | null>(null)
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const filter = (nodes: DepartmentTreeResponse[]): DepartmentTreeResponse[] =>
      nodes.map(n => ({ ...n, children: filter(n.children) }))
        .filter(n => !q || n.departmentName.toLowerCase().includes(q) || n.departmentCode.toLowerCase().includes(q) || n.children.length > 0)
    return filter(tree ?? [])
  }, [tree, search])

  return (
    <div className="flex flex-col md:flex-row flex-1 gap-2 overflow-hidden">
      <div className="w-full md:w-56 md:shrink-0 flex flex-col bg-card border rounded-lg overflow-hidden">
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
            : isError
              ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-center px-2">
                  <AlertCircle className="w-5 h-5 text-destructive/60" />
                  <p className="text-[11px] text-muted-foreground">Không tải được phòng ban</p>
                  {onRetry && (
                    <Button variant="outline" size="sm" className="h-6 text-[11px] gap-1" onClick={() => onRetry()}>
                      <RefreshCw className="w-3 h-3" />Thử lại
                    </Button>
                  )}
                </div>
              )
              : filtered.length === 0
                ? <p className="text-[11px] text-muted-foreground text-center py-6">Không tìm thấy</p>
                : filtered.map(d => <DeptTreeNode key={d.id} dept={d} selectedId={selectedDept?.id ?? null} onSelect={setSelectedDept} />)
          }
        </div>
      </div>

      {selectedDept ? (
        <div className="flex-1 flex flex-col bg-card border rounded-lg overflow-hidden min-w-0">
          <div className="shrink-0 border-b flex items-center gap-2 px-3 h-9">
            <span className="text-xs font-medium flex-1 truncate">{selectedDept.departmentName}</span>
            <Button size="sm" className="h-6 px-2 text-[11px] gap-1 shrink-0" onClick={() => setAddOpen(true)}>
              <Plus className="w-3 h-3" />Thêm
            </Button>
          </div>
          <MembersContent dept={selectedDept} jobLevels={jobLevels} addOpen={addOpen} onAddOpenChange={setAddOpen} />
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
