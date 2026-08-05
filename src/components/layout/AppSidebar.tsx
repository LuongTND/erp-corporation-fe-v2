import logoBahung from '@/assets/logo/logo-bahung.png'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { ROUTES } from '@/config/routes'
import {
  Building2,
  ChevronRight,
  KeyRound,
  Network,
  Shield,
  Users2,
  type LucideIcon,
} from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
  // ponytail: all core items hidden while focusing on admin module
  // { icon: LayoutDashboard, label: 'Bảng điều khiển', href: ROUTES.DASHBOARD },
  // { icon: CheckSquare, label: 'Công việc', href: ROUTES.TASK, badge: 9 },
]

const MODULE_ITEMS: NavItem[] = [
  // ponytail: non-admin modules hidden while admin API is in development
  // { icon: MessageSquare, label: 'Trò chuyện', href: ROUTES.CHAT },
  // { icon: Users, label: 'Nhân sự & Lương', href: ROUTES.HR.DASHBOARD, subItems: [...] },
  // { icon: GraduationCap, label: 'Đào tạo', href: ROUTES.LMS.DASHBOARD, subItems: [...] },
  {
    icon: Shield,
    label: 'Quản trị',
    href: ROUTES.ADMIN.ACCOUNTS,
    subItems: [
      { icon: KeyRound, label: 'Vai trò', href: ROUTES.ADMIN.ACCOUNTS },
      // ponytail: Quyền hạn merged into Vai trò tab
      { icon: Building2, label: 'Phòng ban', href: ROUTES.ADMIN.DEPARTMENTS },
      { icon: Users2, label: 'Cấp bậc', href: ROUTES.ADMIN.JOB_LEVELS },
      // { icon: Network, label: 'Phân cấp vai trò', href: ROUTES.ADMIN.ROLE_HIERARCHY }, // ponytail: hidden — hardcoded data, re-enable when backend supports parentRoleId
      // ponytail: Cơ cấu tổ chức merged into Phòng ban tab
    ],
  },
]

// ── Collapsible nav item ───────────────────────────────────────────────────────

function CollapsibleNavItem({ item }: { item: NavItem }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobile, setOpenMobile } = useSidebar()
  const isActive = location.pathname.startsWith(item.href)
  const [open, setOpen] = useLocalStorage(`sidebar-group-${item.href}`, isActive)

  const handleNavigate = (href: string) => {
    navigate(href)
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={isActive}
            tooltip={item.label}
            aria-current={isActive ? 'page' : undefined}
            className="cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          >
            <item.icon aria-hidden="true" />
            <span>{item.label}</span>
            <ChevronRight
              aria-hidden="true"
              className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems!.map((sub) => {
              const subActive = location.pathname === sub.href
              return (
                <SidebarMenuSubItem key={sub.href}>
                  <SidebarMenuSubButton
                    isActive={subActive}
                    onClick={() => handleNavigate(sub.href)}
                    aria-current={subActive ? 'page' : undefined}
                    className="cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  >
                    <sub.icon aria-hidden="true" />
                    <span>{sub.label}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

// ── AppSidebar ────────────────────────────────────────────────────────────────

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobile, setOpenMobile } = useSidebar()

  // Close mobile drawer on route change
  useEffect(() => {
    if (isMobile) setOpenMobile(false)
  }, [location.pathname, isMobile, setOpenMobile])

  const handleNavigate = (href: string) => {
    navigate(href)
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon">
      {/* Workspace header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="cursor-pointer">
              <img
                src={logoBahung}
                alt="Ba Hưng logo"
                className="h-8 w-8 shrink-0 rounded-md object-contain"
              />
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="truncate text-[13px] font-semibold">Ba Hưng</span>
                <span className="truncate text-[10px] text-muted-foreground">HRM & LMS</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Core */}
        {CORE_ITEMS.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {CORE_ITEMS.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => handleNavigate(item.href)}
                        tooltip={item.label}
                        aria-current={isActive ? 'page' : undefined}
                        className="cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                      >
                        <item.icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.badge != null && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Modules */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {MODULE_ITEMS.map((item) =>
                item.subItems ? (
                  <CollapsibleNavItem key={item.href} item={item} />
                ) : (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={location.pathname === item.href}
                      onClick={() => handleNavigate(item.href)}
                      tooltip={item.label}
                      aria-current={location.pathname === item.href ? 'page' : undefined}
                      className="cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                    >
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
