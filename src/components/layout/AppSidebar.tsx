import { cn } from '@/lib/utils'
import {
  Banknote,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  Compass,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Network,
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
import { ROUTES } from '@/config/routes'

type SubItem = { icon: LucideIcon; label: string; href: string }
type ModuleItem = {
  icon: LucideIcon
  label: string
  href: string
  badge?: number
  subItems?: SubItem[]
}

const CORE_ITEMS: ModuleItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.DASHBOARD },
  { icon: CheckSquare,     label: 'My Tasks',  href: ROUTES.TASK, badge: 9 },
]

const MODULE_ITEMS: ModuleItem[] = [
  { icon: MessageSquare, label: 'Chat', href: ROUTES.CHAT },
  {
    icon: Users,
    label: 'HR & Payroll',
    href: ROUTES.HR.DASHBOARD,
    subItems: [
      { icon: LayoutDashboard, label: 'Overview',   href: ROUTES.HR.DASHBOARD },
      { icon: Users2,          label: 'Employees',  href: ROUTES.HR.EMPLOYEES },
      { icon: Calendar,        label: 'Attendance', href: ROUTES.HR.ATTENDANCE },
      { icon: Banknote,        label: 'Payroll',    href: ROUTES.HR.PAYROLL },
      { icon: Target,          label: 'KPI',        href: ROUTES.HR.KPI },
      { icon: CalendarDays,    label: 'Leave',      href: ROUTES.HR.LEAVE },
      { icon: Network,         label: 'Org Chart',  href: ROUTES.HR.ORG_CHART },
    ],
  },
  {
    icon: GraduationCap,
    label: 'LMS',
    href: ROUTES.LMS.DASHBOARD,
    subItems: [
      { icon: BookOpen, label: 'My Courses', href: ROUTES.LMS.DASHBOARD },
      { icon: Compass, label: 'Explore', href: ROUTES.LMS.EXPLORE },
      { icon: TrendingUp, label: 'Progress', href: ROUTES.LMS.PROGRESS },
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
        active
          ? (depth === 0 ? 'bg-primary/15 text-primary border-l-primary pl-[6px]' : 'bg-primary/15 text-primary')
          : (depth > 0 ? 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent' : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent border-transparent')
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left truncate">{label}</span>
      {badge != null && (
        <span
          className="text-[10px] font-medium rounded-full px-1.5 py-px leading-none bg-primary text-primary-foreground"
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
      className="flex flex-col h-full shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      style={{ width: 240 }}
    >
      {/* Workspace header */}
      <button
        type="button"
        className="flex items-center gap-2 h-[52px] px-3 w-full transition-colors duration-[120ms] rounded-md mx-1 hover:bg-sidebar-accent/50 cursor-pointer"
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-md shrink-0 text-white font-bold text-sm bg-primary"
        >
          D
        </span>
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-[13px] font-semibold truncate w-full text-left text-sidebar-foreground">
            DigiFNB ERP
          </span>
          <span className="text-[10px] truncate w-full text-left text-sidebar-foreground/50">
            Corporation v2
          </span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/45" />
      </button>

      {/* Search bar */}
      <div className="px-2 mb-1">
        <div
          className="flex items-center gap-2 h-[30px] px-2.5 rounded-md border text-[12px] bg-sidebar-accent/40 border-sidebar-border/60 text-sidebar-foreground/60"
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
            className="flex items-center gap-1 w-full px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] cursor-pointer transition-colors duration-[120ms] text-sidebar-foreground/40 hover:text-sidebar-foreground/60"
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
        className="flex items-center gap-2 h-8 mx-1 px-2 rounded-md text-[13px] transition-colors duration-[120ms] cursor-pointer text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
      >
        <Settings className="h-4 w-4 shrink-0" />
        <span>Settings</span>
      </button>

      {/* Divider */}
      <div className="h-px bg-sidebar-border mx-2 my-1" />

      {/* User row */}
      <div
        className="flex items-center gap-2 h-10 px-3 mx-1 mb-1 rounded-md cursor-pointer transition-colors duration-[120ms] hover:bg-sidebar-accent/50"
      >
        <span
          className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0 bg-primary"
        >
          MT
        </span>
        <span className="text-[12px] flex-1 truncate text-sidebar-foreground/75">
          My Account
        </span>
        <ChevronDown className="h-3 w-3 shrink-0 text-sidebar-foreground/45" />
      </div>
    </aside>
  )
}
