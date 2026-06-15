import {
  Building2,
  Calendar,
  ChevronRight,
  Mail,
  MessageSquare,
  Phone,
  Users,
} from 'lucide-react'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import { DEPT_CONFIG, findPersonById, ORG_TREE } from './orgchart.data'
import type { OrgPerson } from './orgchart.types'

interface Props {
  person: OrgPerson | null
  open: boolean
  onClose: () => void
  onFocusNode: (id: string) => void
}

export function OrgChartSheet({ person, open, onClose, onFocusNode }: Props) {
  if (!person) return null

  const dept = DEPT_CONFIG[person.department] ?? DEPT_CONFIG['Engineering']
  const manager = person.reportsToId
    ? findPersonById(ORG_TREE, person.reportsToId)
    : null

  const INFO_ROWS = [
    { icon: Mail,      label: 'Email',     value: person.email },
    { icon: Phone,     label: 'Phone',     value: person.phone },
    { icon: Building2, label: 'Location',  value: person.location },
    { icon: Calendar,  label: 'Joined',    value: person.joinDate },
  ]

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent
        side="right"
        className="overflow-y-auto p-0"
        style={{ width: 360, maxWidth: '100vw' }}
      >
        {/* Header */}
        <SheetHeader className="p-5 border-b border-slate-100">
          <div className="flex items-start gap-4">
            {/* Avatar 80px */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
              style={{ backgroundColor: dept.avatarBg, color: dept.avatarText }}
            >
              {person.initials}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <SheetTitle className="text-base font-semibold text-slate-900 leading-tight">
                {person.name}
              </SheetTitle>
              <p className="text-sm text-slate-500 mt-0.5">{person.title}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {/* Dept badge */}
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: dept.badgeBg, color: dept.badgeText }}
                >
                  {person.department}
                </span>
                {/* Status */}
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#edfbf1] text-[#2d7a40]">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium text-white cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#cc785c' }}
            >
              View Full Profile
            </button>
            <button
              type="button"
              className="h-8 px-3 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Message
            </button>
            <button
              type="button"
              aria-label="Send email"
              className="h-8 w-8 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              <Mail className="w-3.5 h-3.5" />
            </button>
          </div>
        </SheetHeader>

        <div className="p-5 space-y-5">

          {/* Info list */}
          <div className="space-y-3">
            {INFO_ROWS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 leading-none mb-0.5">{label}</p>
                  <p className="text-sm text-slate-700 truncate">{value}</p>
                </div>
              </div>
            ))}

            {/* Reports to */}
            {manager && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 leading-none mb-0.5">Reports to</p>
                  <button
                    type="button"
                    onClick={() => { onFocusNode(manager.id); onClose() }}
                    className="text-sm font-medium cursor-pointer hover:underline text-left"
                    style={{ color: '#cc785c' }}
                  >
                    {manager.name}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Direct Reports */}
          {person.children.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Direct Reports ({person.children.length})
              </h4>
              <div className="space-y-1">
                {person.children.map((child) => {
                  const childDept = DEPT_CONFIG[child.department] ?? DEPT_CONFIG['Engineering']
                  return (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => { onFocusNode(child.id); onClose() }}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: childDept.avatarBg, color: childDept.avatarText }}
                      >
                        {child.initials}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{child.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{child.title}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
