import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Building2, GitBranch, List, Network } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DeptListView, OrgHierarchyView } from '../components/DepartmentsPage'

type ViewMode = 'list' | 'org-list' | 'org-tree'

const TABS: { id: ViewMode; label: string; icon: ReactNode; aria: string }[] = [
  { id: 'list', label: 'Danh sách phòng ban', icon: <List className="w-3.5 h-3.5" />, aria: 'Danh sách phòng ban' },
  { id: 'org-list', label: 'Cơ cấu · Danh sách', icon: <GitBranch className="w-3.5 h-3.5" />, aria: 'Cơ cấu dạng danh sách' },
  { id: 'org-tree', label: 'Sơ đồ tổ chức', icon: <Network className="w-3.5 h-3.5" />, aria: 'Sơ đồ tổ chức dạng cây' },
]

export default function DepartmentsPage() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('view')
  const view: ViewMode = raw === 'org-list' || raw === 'org-tree' ? raw : 'list'
  const setView = (v: ViewMode) => setParams(v === 'list' ? {} : { view: v })

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background text-foreground">
      <div className="flex items-center gap-3 px-4 border-b shrink-0 bg-card min-h-[52px]">
        <div className="flex items-center gap-2 py-3">
          <Building2 className="w-4 h-4 text-primary shrink-0" />
          <div>
            <h1 className="text-sm font-semibold leading-none">Phòng ban</h1>
            <p className="text-xs text-muted-foreground mt-0.5 leading-none">Quản lý phòng ban, cơ cấu tổ chức và thành viên</p>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center rounded-md overflow-hidden border">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id)}
              aria-label={tab.aria}
              className={cn(
                'h-8 px-3 flex items-center gap-1.5 text-xs transition-colors cursor-pointer whitespace-nowrap',
                i > 0 && 'border-l',
                view === tab.id
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'list'
          ? <DeptListView />
          : <OrgHierarchyView initialView={view === 'org-tree' ? 'tree' : 'list'} />
        }
      </div>
    </div>
  )
}
