import { lazy, Suspense } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, User, Menu, ShoppingBag, Award, Tag, MessageSquare, Home, Grid, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ROUTES } from '@/config/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/utils'

const ChatbotFloatingWidget = lazy(() =>
  import('@/features/ai-chatbot/components/ChatbotFloatingWidget').then((module) => ({
    default: module.ChatbotFloatingWidget,
  }))
)

export default function CustomerLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Nguyên liệu', path: ROUTES.CUSTOMER_PORTAL.CATALOG, icon: Grid },
    { label: 'Giỏ hàng', path: ROUTES.CUSTOMER_PORTAL.CART, icon: ShoppingCart },
    { label: 'Đơn hàng', path: ROUTES.CUSTOMER_PORTAL.ORDERS, icon: ShoppingBag },
    { label: 'Ưu đãi', path: ROUTES.CUSTOMER_PORTAL.PROMOTIONS, icon: Tag },
    { label: 'Thành viên', path: ROUTES.CUSTOMER_PORTAL.LOYALTY, icon: Award },
    { label: 'Trợ lý AI', path: ROUTES.CUSTOMER_PORTAL.AI_CHATBOT, icon: MessageSquare },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Customer Header Nav */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand/Logo */}
          <div className="flex items-center gap-6">
            <Link to={ROUTES.CUSTOMER_PORTAL.CATALOG} className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-primary">
                DigiFNB
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Portal
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User profile dropdown & actions */}
          <div className="flex items-center gap-4">
            {/* Quick order button */}
            <Button
              size="sm"
              className="hidden sm:flex bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90"
              onClick={() => navigate(ROUTES.CUSTOMER_PORTAL.ORDERS)}
            >
              Đặt hàng ngay
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border">
                  <Avatar className="h-8.5 w-8.5">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name || 'Customer'} />
                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                      {user?.name?.slice(0, 2).toUpperCase() || 'KH'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-foreground">{user?.name || 'Khách hàng'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(ROUTES.CUSTOMER_PORTAL.LOYALTY)}>
                  <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Điểm thưởng & Hạng thẻ</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(ROUTES.CUSTOMER_PORTAL.ORDERS)}>
                  <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Lịch sử mua hàng</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/80 font-medium">
            &copy; 2026 DigiFNB. Cổng thông tin Khách hàng tự phục vụ.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/75">
            <Link to="#" className="hover:text-foreground">Điều khoản</Link>
            <Link to="#" className="hover:text-foreground">Bảo mật</Link>
            <Link to="#" className="hover:text-foreground">Hỗ trợ</Link>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot widget is always present for support */}
      <Suspense fallback={null}>
        <ChatbotFloatingWidget />
      </Suspense>
    </div>
  )
}
