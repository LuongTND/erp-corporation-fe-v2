import { Clock, TrendingUp, Briefcase, DollarSign, FileText, Users, ArrowRight, GitBranch } from 'lucide-react'
import { fmtDateTime } from '@/lib/date'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import type { WorkHistoryItem, WorkHistoryChangeType } from '../../types/work-history.types'

interface WorkHistoryTabProps {
  readonly items: WorkHistoryItem[]
  readonly isLoading: boolean
  readonly changeType: WorkHistoryChangeType | undefined
  readonly onChangeTypeFilter: (v: WorkHistoryChangeType | undefined) => void
}

const CHANGE_TYPE_OPTIONS: { value: WorkHistoryChangeType | 'all'; label: string }[] = [
  { value: 'all',          label: 'Tất cả' },
  { value: 'Status',       label: 'Trạng thái' },
  { value: 'JobLevel',     label: 'Chức danh' },
  { value: 'Department',   label: 'Phòng ban' },
  { value: 'Salary',       label: 'Lương' },
  { value: 'ContractType', label: 'Loại hợp đồng' },
  { value: 'Manager',      label: 'Quản lý' },
]

const META: Record<WorkHistoryChangeType, { icon: React.ElementType; bg: string; text: string; dot: string }> = {
  Status:       { icon: TrendingUp,  bg: 'bg-blue-500/10',   text: 'text-blue-600 dark:text-blue-400',   dot: 'bg-blue-500' },
  JobLevel:     { icon: Briefcase,   bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
  Department:   { icon: GitBranch,   bg: 'bg-teal-500/10',   text: 'text-teal-600 dark:text-teal-400',   dot: 'bg-teal-500' },
  Salary:       { icon: DollarSign,  bg: 'bg-green-500/10',  text: 'text-green-600 dark:text-green-400',  dot: 'bg-green-500' },
  ContractType: { icon: FileText,    bg: 'bg-amber-500/10',  text: 'text-amber-600 dark:text-amber-400',  dot: 'bg-amber-500' },
  Manager:      { icon: Users,       bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', dot: 'bg-indigo-500' },
}


function fmtValue(changeType: WorkHistoryChangeType, value: string | null): string | null {
  if (!value) return null
  if (changeType === 'Salary') {
    const n = parseFloat(value)
    return isNaN(n) ? value : n.toLocaleString('vi-VN') + ' ₫'
  }
  return value
}

export function WorkHistoryTab({ items, isLoading, changeType, onChangeTypeFilter }: WorkHistoryTabProps) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Lịch sử thay đổi</h3>
          {!isLoading && items.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">{items.length} sự kiện</p>
          )}
        </div>
        <Select
          value={changeType ?? 'all'}
          onValueChange={(v) => onChangeTypeFilter(v === 'all' ? undefined : v as WorkHistoryChangeType)}
        >
          <SelectTrigger className="h-8 w-44 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" sideOffset={4}>
            {CHANGE_TYPE_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl border border-border bg-card animate-pulse">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 pt-0.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-3 w-20 shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl border border-dashed border-border animate-in fade-in duration-300">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Clock className="w-4.5 h-4.5 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">Chưa có lịch sử thay đổi.</p>
        </div>
      )}

      {/* Timeline */}
      {!isLoading && items.length > 0 && (
        <ol className="relative pl-6 border-l border-border/60 space-y-1">
          {items.map((item, idx) => {
            const m = META[item.changeType]
            const Icon = m?.icon ?? Clock
            const oldFmt = fmtValue(item.changeType, item.oldValue)
            const newFmt = fmtValue(item.changeType, item.newValue)

            return (
              <li
                key={item.id}
                className="relative pb-6 animate-in fade-in slide-in-from-left-2 duration-300"
                style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
              >
                {/* Dot on line */}
                <span className={`absolute -left-[1.4rem] top-3 flex items-center justify-center w-5 h-5 rounded-full border-2 border-background shadow-sm ${m?.bg ?? 'bg-muted'}`}>
                  <Icon className={`w-2.5 h-2.5 ${m?.text ?? 'text-muted-foreground'}`} />
                </span>

                {/* Card */}
                <div className="ml-2 group rounded-xl border border-border bg-card px-4 py-3 transition-shadow duration-200 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${m?.bg ?? 'bg-muted'} ${m?.text ?? 'text-muted-foreground'}`}>
                        {item.changeTypeLabel}
                      </span>
                    </div>
                    <time className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">
                      {fmtDateTime(item.changedAt)}
                    </time>
                  </div>

                  {(oldFmt || newFmt) && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs">
                      {oldFmt ? (
                        <span className="text-muted-foreground line-through opacity-60">{oldFmt}</span>
                      ) : (
                        <span className="text-muted-foreground opacity-40 italic">Chưa có</span>
                      )}
                      <ArrowRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                      <span className="font-medium text-foreground">{newFmt ?? '—'}</span>
                    </div>
                  )}

                  {item.note && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground italic border-l-2 border-border pl-2">
                      {item.note}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
