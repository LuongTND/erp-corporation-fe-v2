import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Banknote,
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  Compass,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Network,
  Search,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Users,
  Users2,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ── Types ─────────────────────────────────────────────────────────────────────

type SubItem = { icon: LucideIcon; label: string; href: string }
type NavItem = {
  icon: LucideIcon
  label: string
  href: string
  badge?: number
  subItems?: SubItem[]
}

// ── Nav config ────────────────────────────────────────────────────────────────

const CORE_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.DASHBOARD },
  { icon: CheckSquare, label: 'My Tasks', href: ROUTES.TASK, badge: 9 },
]

const MODULE_ITEMS: NavItem[] = [
  { icon: MessageSquare, label: 'Chat', href: ROUTES.CHAT },
  {
    icon: Users,
    label: 'HR & Payroll',
    href: ROUTES.HR.DASHBOARD,
    subItems: [
      { icon: LayoutDashboard, label: 'Overview', href: ROUTES.HR.DASHBOARD },
      { icon: Users2, label: 'Employees', href: ROUTES.HR.EMPLOYEES },
      { icon: Calendar, label: 'Attendance', href: ROUTES.HR.ATTENDANCE },
      { icon: Banknote, label: 'Payroll', href: ROUTES.HR.PAYROLL },
      { icon: Target, label: 'KPI', href: ROUTES.HR.KPI },
      { icon: CalendarDays, label: 'Leave', href: ROUTES.HR.LEAVE },
      { icon: Network, label: 'Org Chart', href: ROUTES.HR.ORG_CHART },
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
  {
    icon: Shield,
    label: 'Admin',
    href: ROUTES.ADMIN.ACCOUNTS,
    subItems: [
      { icon: KeyRound, label: 'Roles', href: ROUTES.ADMIN.ACCOUNTS },
      { icon: Shield, label: 'Permissions', href: ROUTES.ADMIN.PERMISSIONS },
      { icon: Building2, label: 'Departments', href: ROUTES.ADMIN.DEPARTMENTS },
      { icon: Users2, label: 'Job Levels', href: ROUTES.ADMIN.JOB_LEVELS },
    ],
  },
]

// ── Collapsible nav item ───────────────────────────────────────────────────────

function CollapsibleNavItem({ item }: { item: NavItem }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = location.pathname.startsWith(item.href)
  const [open, setOpen] = useState(isActive)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={isActive}
            tooltip={item.label}
            className="cursor-pointer"
          >
            <item.icon />
            <span>{item.label}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems!.map((sub) => (
              <SidebarMenuSubItem key={sub.href}>
                <SidebarMenuSubButton
                  isActive={location.pathname === sub.href}
                  onClick={() => navigate(sub.href)}
                  className="cursor-pointer"
                >
                  <sub.icon />
                  <span>{sub.label}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

// ── User footer ───────────────────────────────────────────────────────────────

function UserFooter() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const handleLogout = () => {
    logout()
    navigate(ROUTES.PORTAL)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {initials}
          </span>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="truncate text-[13px] font-medium">{user?.name ?? 'My Account'}</span>
            <span className="truncate text-[11px] text-muted-foreground">{user?.email ?? ''}</span>
          </div>
          <ChevronRight className="ml-auto rotate-90" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── AppSidebar ────────────────────────────────────────────────────────────────

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  return (
    <Sidebar collapsible="icon">
      {/* Workspace header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="cursor-pointer">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                D
              </span>
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="truncate text-[13px] font-semibold">DigiFNB ERP</span>
                <span className="truncate text-[10px] text-muted-foreground">Corporation v2</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarInput
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8"
        />
      </SidebarHeader>

      <SidebarContent>
        {/* Core */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {CORE_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.href}
                    onClick={() => navigate(item.href)}
                    tooltip={item.label}
                    className="cursor-pointer"
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.badge != null && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Modules */}
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MODULE_ITEMS.map((item) =>
                item.subItems ? (
                  <CollapsibleNavItem key={item.href} item={item} />
                ) : (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={location.pathname === item.href}
                      onClick={() => navigate(item.href)}
                      tooltip={item.label}
                      className="cursor-pointer"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserFooter />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
