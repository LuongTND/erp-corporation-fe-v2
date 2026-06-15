import { cn } from '@/lib/utils'
import {
  Banknote,
  BarChart3,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  Compass,
  DollarSign,
  FolderOpen,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Network,
  Package,
  Search,
  Settings,
  Target,
  TrendingUp,
  Users,
  Users2,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type SubItem = { icon: LucideIcon; label: string; href: string }
type ModuleItem = {
  icon: LucideIcon
  label: string
  href: string
  badge?: number
  subItems?: SubItem[]
}

const CORE_ITEMS: ModuleItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard',  href: '/dashboard' },
  { icon: CheckSquare,     label: 'My Tasks',   href: '/task',     badge: 9 },
  { icon: Inbox,           label: 'Inbox',      href: '/inbox',    badge: 3 },
  { icon: Calendar,        label: 'Calendar',   href: '/calendar' },
]

const MODULE_ITEMS: ModuleItem[] = [
  { icon: MessageSquare, label: 'Chat',        href: '/chat' },
  { icon: Users2,        label: 'CRM',         href: '/crm' },
  { icon: DollarSign,    label: 'Finance',     href: '/finance' },
  {
    icon: Users,
    label: 'HR & Payroll',
    href: '/hr',
    subItems: [
      { icon: LayoutDashboard, label: 'Overview',    href: '/hr' },
      { icon: Users2,          label: 'Employees',  href: '/hr/employees' },
      { icon: Calendar,        label: 'Attendance', href: '/hr/attendance' },
      { icon: Banknote,        label: 'Payroll',    href: '/hr/payroll' },
      { icon: Target,          label: 'KPI',        href: '/hr/kpi' },
      { icon: CalendarDays,    label: 'Leave',      href: '/hr/leave' },
      { icon: Network,         label: 'Org Chart',  href: '/hr/org-chart' },
    ],
  },
  { icon: Package,       label: 'Inventory',   href: '/inventory' },
  { icon: FolderOpen,    label: 'Projects',    href: '/projects' },
  { icon: BarChart3,     label: 'Reports',     href: '/reports' },
  {
    icon: GraduationCap,
    label: 'LMS',
    href: '/lms',
    subItems: [
      { icon: BookOpen, label: 'My Courses', href: '/lms' },
      { icon: Compass, label: 'Explore', href: '/lms/explore' },
      { icon: TrendingUp, label: 'Progress', href: '/lms/progress' },
    ],
  },
]

function NavButton({
  icon: Icon,
  label,
  badge,
  active,
  depth = 0,
  onClick,
}: {
  icon: LucideIcon
  label: string
  href?: string
  badge?: number
  active: boolean
  depth?: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 h-8 rounded-md w-full text-[13px] font-normal transition-colors duration-[120ms] cursor-pointer',
        depth === 0 ? 'px-2 border-l-2' : 'pl-7 pr-2',
        active && depth === 0 ? 'border-l-2 pl-[6px]' : '',
        !active && depth === 0 ? 'border-transparent' : '',
      )}
      style={
        active
          ? { backgroundColor: 'rgba(232,120,74,0.15)', color: '#E8784A', borderColor: depth === 0 ? '#E8784A' : 'transparent' }
          : { color: depth > 0 ? '#666' : '#999' }
      }
      onMouseEnter={(e) => {
        if (!active) {
          ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.07)'
          ;(e.currentTarget as HTMLElement).style.color = '#E0E0E0'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
          ;(e.currentTarget as HTMLElement).style.color = depth > 0 ? '#666' : '#999'
        }
      }}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left truncate">{label}</span>
      {badge != null && (
        <span
          className="text-[10px] font-medium rounded-full px-1.5 py-px leading-none"
          style={{ backgroundColor: '#E8784A', color: '#fff' }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [modulesOpen, setModulesOpen] = useState(true)


  return (
    <aside
      className="flex flex-col h-screen shrink-0 overflow-hidden"
      style={{ width: 240, backgroundColor: '#191919' }}
    >
      {/* Workspace header */}
      <button
        type="button"
        className="flex items-center gap-2 h-[52px] px-3 w-full transition-colors duration-[120ms] rounded-md mx-1 hover:bg-white/[0.06] cursor-pointer"
        style={{ color: '#E0E0E0' }}
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-md shrink-0 text-white font-bold text-sm"
          style={{ backgroundColor: '#E8784A' }}
        >
          D
        </span>
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-[13px] font-semibold truncate w-full text-left" style={{ color: '#E0E0E0' }}>
            DigiFNB ERP
          </span>
          <span className="text-[10px] truncate w-full text-left" style={{ color: '#555' }}>
            Corporation v2
          </span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 shrink-0" style={{ color: '#555' }} />
      </button>

      {/* Search bar */}
      <div className="px-2 mb-1">
        <div
          className="flex items-center gap-2 h-[30px] px-2.5 rounded-md border text-[12px]"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderColor: 'rgba(255,255,255,0.08)',
            color: '#444',
          }}
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span>Search...</span>
        </div>
      </div>

      {/* Scrollable nav area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-1 mt-1" style={{ scrollbarWidth: 'none' }}>
        {/* Core nav */}
        <nav className="flex flex-col gap-0.5">
          {CORE_ITEMS.map((item) => (
            <NavButton
              key={item.href}
              {...item}
              active={location.pathname === item.href}
              onClick={() => navigate(item.href)}
            />
          ))}
        </nav>

        {/* Modules section */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setModulesOpen((v) => !v)}
            className="flex items-center gap-1 w-full px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] cursor-pointer transition-colors duration-[120ms]"
            style={{ color: '#444' }}
          >
            <ChevronDown
              className="h-3 w-3 shrink-0 transition-transform duration-200"
              style={{ transform: modulesOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
            />
            Modules
          </button>

          {modulesOpen && (
            <div className="flex flex-col gap-0.5 mt-0.5">
              {MODULE_ITEMS.map((item) => {
                const isModuleActive = item.subItems
                  ? location.pathname.startsWith(item.href)
                  : location.pathname === item.href
                const isExpanded = item.subItems && location.pathname.startsWith(item.href)

                return (
                  <div key={item.href}>
                    <NavButton
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      active={isModuleActive}
                      onClick={() => navigate(item.href)}
                    />
                    {isExpanded && item.subItems && (
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        {item.subItems.map((sub) => (
                          <NavButton
                            key={sub.href}
                            icon={sub.icon}
                            label={sub.label}
                            href={sub.href}
                            active={location.pathname === sub.href}
                            depth={1}
                            onClick={() => navigate(sub.href)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <button
        type="button"
        className="flex items-center gap-2 h-8 mx-1 px-2 rounded-md text-[13px] transition-colors duration-[120ms] cursor-pointer"
        style={{ color: '#555' }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'
          ;(e.currentTarget as HTMLElement).style.color = '#999'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
          ;(e.currentTarget as HTMLElement).style.color = '#555'
        }}
      >
        <Settings className="h-4 w-4 shrink-0" />
        <span>Settings</span>
      </button>

      {/* User row */}
      <div
        className="flex items-center gap-2 h-10 px-3 mt-1 mx-1 mb-1 rounded-md cursor-pointer transition-colors duration-[120ms]"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)' }}
      >
        <span
          className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0"
          style={{ backgroundColor: '#E8784A' }}
        >
          MT
        </span>
        <span className="text-[12px] flex-1 truncate" style={{ color: '#AAA' }}>
          My Account
        </span>
        <ChevronDown className="h-3 w-3 shrink-0" style={{ color: '#555' }} />
      </div>
    </aside>
  )
}
