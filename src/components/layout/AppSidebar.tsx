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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { ROUTES } from '@/config/routes'
import {
  BarChart3,
  Building2,
  ChevronRight,
  KeyRound,
  LayoutGrid,
  MapPin,
  Network,
  ScrollText,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  UserCog,
  Users2,
  type LucideIcon,
} from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// ── Types ─────────────────────────────────────────────────────────────────────

type NavItem = { icon: LucideIcon; label: string; href: string }
type NavSection = { label: string; items: NavItem[] }

// ── Nav config ────────────────────────────────────────────────────────────────

const ADMIN_SECTIONS: NavSection[] = [
  {
    label: 'Tổ chức',
    items: [
      { icon: Building2, label: 'Phòng ban', href: ROUTES.ADMIN.DEPARTMENTS },
      { icon: ShoppingBag, label: 'Cửa hàng', href: ROUTES.ADMIN.STORES },
      { icon: MapPin, label: 'Khu vực', href: ROUTES.ADMIN.REGIONS },
      { icon: LayoutGrid, label: 'Quầy', href: ROUTES.ADMIN.COUNTERS },
    ],
  },
  {
    label: 'Nhân sự',
    items: [
      { icon: Network, label: 'Nhân sự', href: ROUTES.ADMIN.EMPLOYEES },
      { icon: Users2, label: 'Cấp bậc', href: ROUTES.ADMIN.JOB_LEVELS },
      { icon: UserCog, label: 'Loại nhân sự', href: ROUTES.ADMIN.EMPLOYEE_TYPES },
      { icon: SlidersHorizontal, label: 'Trường tùy chỉnh', href: ROUTES.ADMIN.CUSTOM_FIELDS },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { icon: KeyRound, label: 'Vai trò', href: ROUTES.ADMIN.ACCOUNTS },
      { icon: ScrollText, label: 'Nhật ký phân quyền', href: ROUTES.ADMIN.AUDIT_LOGS },
      { icon: BarChart3, label: 'KPI & Lương', href: ROUTES.ADMIN.KPI_ENTRIES },
      // ponytail: Phân cấp vai trò hidden — re-enable when backend supports parentRoleId
    ],
  },
  {
    label: 'Quản lý cửa hàng',
    items: [
      { icon: Store, label: 'Cửa hàng của tôi', href: ROUTES.STORE_MANAGER },
    ],
  },
]

// ── Collapsible section ───────────────────────────────────────────────────────

function NavSectionGroup({ section }: { section: NavSection }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobile, setOpenMobile, state } = useSidebar()
  const hasActive = section.items.some(i => location.pathname.startsWith(i.href))
  const [open, setOpen] = useLocalStorage(`sidebar-section-${section.label}`, true)

  const handleNavigate = (href: string) => {
    navigate(href)
    if (isMobile) setOpenMobile(false)
  }

  // collapsed icon mode — no accordion, just flat icons
  if (state === 'collapsed') {
    return (
      <SidebarGroup className="py-1">
        <SidebarGroupContent>
          <SidebarMenu>
            {section.items.map((item) => {
              const isActive = location.pathname.startsWith(item.href)
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
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/section">
      <SidebarGroup className="py-1">
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="flex w-full items-center justify-between cursor-pointer hover:text-foreground transition-colors [&>svg:last-child]:ml-auto">
            <span className={hasActive ? 'text-primary' : ''}>{section.label}</span>
            <ChevronRight
              aria-hidden="true"
              className="h-3 w-3 transition-transform duration-200 group-data-[state=open]/section:rotate-90 shrink-0"
            />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => {
                const isActive = location.pathname.startsWith(item.href)
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
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

// ── AppSidebar ────────────────────────────────────────────────────────────────

export function AppSidebar() {
  const location = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  useEffect(() => {
    if (isMobile) setOpenMobile(false)
  }, [location.pathname, isMobile, setOpenMobile])

  return (
    <Sidebar collapsible="icon">
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
        {ADMIN_SECTIONS.map((section) => (
          <NavSectionGroup key={section.label} section={section} />
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
