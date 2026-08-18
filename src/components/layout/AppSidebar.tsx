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
import { useAuthStore } from '@/stores/auth.store'
import { NAV_SECTIONS, type NavSection } from '@/config/nav'
import { ChevronRight } from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// ── Collapsible section ───────────────────────────────────────────────────────

function NavSectionGroup({ section }: { section: NavSection }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobile, setOpenMobile, state } = useSidebar()
  const hasActive = section.items.some(i => location.pathname.startsWith(i.href))
  const [open, setOpen] = useLocalStorage(`sidebar-section-${section.label}`, true)
  const didAutoOpen = useRef(false)

  // Auto-open section when navigating into it (e.g. direct URL, link from another page)
  useEffect(() => {
    if (hasActive && !open && !didAutoOpen.current) {
      setOpen(true)
      didAutoOpen.current = true
    }
    if (!hasActive) didAutoOpen.current = false
  }, [hasActive, open, setOpen])

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
  const hasPermission = useAuthStore((s) => s.hasPermission)

  useEffect(() => {
    if (isMobile) setOpenMobile(false)
  }, [location.pathname, isMobile, setOpenMobile])

  const visibleSections = useMemo(() =>
    NAV_SECTIONS
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => !item.permission || hasPermission(item.permission)),
      }))
      .filter((section) => section.items.length > 0),
    [hasPermission]
  )

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
        {visibleSections.map((section) => (
          <NavSectionGroup key={section.label} section={section} />
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
