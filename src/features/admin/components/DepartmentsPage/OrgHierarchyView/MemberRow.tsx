import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { DepartmentMemberResponse } from '../../../types/admin.types'
import type { JobLevelOption } from './types'

function initials(name: string) {
  return name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
}

interface MemberRowProps {
  member: DepartmentMemberResponse
  jobLevels: JobLevelOption[]
  isManager?: boolean
  isUpdating: boolean
  isRemoving: boolean
  onLevelChange: (userId: string, jobLevelId: string | null) => void
  onRemove: (userId: string, fullName: string) => void
}

export function MemberRow({ member, jobLevels, isManager, isUpdating, isRemoving, onLevelChange, onRemove }: MemberRowProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2.5 px-3 py-2 hover:bg-muted/40 transition-colors group">
      <button
        type="button"
        onClick={() => navigate(`/admin/employees/${member.userId}`)}
        className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer text-left"
      >
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarImage src={member.avatarUrl} alt={member.fullName} />
          <AvatarFallback className="text-[10px] font-medium">{initials(member.fullName)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium truncate leading-none hover:text-primary transition-colors">{member.fullName}</span>
            {isManager && (
              <span className="text-[9px] px-1 py-px rounded border border-primary/40 text-primary/80 shrink-0 leading-none font-medium">TP</span>
            )}
            {member.isPrimary && (
              <span className="text-[9px] px-1 py-px rounded border text-muted-foreground shrink-0 leading-none">chính</span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono leading-none mt-0.5 block">{member.employeeCode}</span>
        </div>
      </button>

      <Select
        value={member.jobLevelId ?? '__none__'}
        onValueChange={v => onLevelChange(member.userId, v === '__none__' ? null : v)}
        disabled={isUpdating}
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
        onClick={() => onRemove(member.userId, member.fullName)}
        disabled={isRemoving}
        aria-label={`Xóa ${member.fullName}`}
        className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shrink-0 cursor-pointer disabled:opacity-40"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  )
}
