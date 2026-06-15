import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import {
  LogOut,
  User as UserIcon,
  Settings,
  Sun,
  Moon,
  Monitor,
  Globe,
  Menu,
  Layers,
  LogIn,
  UserPlus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'

import { CurrentTime } from './CurrentTime'
import { NotificationPopover } from './NotificationPopover'

export function Header() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuth()

  console.log("isAuthenticated", isAuthenticated)

  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Avoid hydration mismatch for next-themes
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
    localStorage.setItem('i18nextLng', nextLang)
  }

  const handleLanguageChange = (lang: 'vi' | 'en') => {
    i18n.changeLanguage(lang)
    localStorage.setItem('i18nextLng', lang)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isEn = i18n.language === 'en'

  // User details fallback
  const displayName = user?.name || 'User'
  const displayEmail = user?.email || 'user@example.com'
  const userRole = user?.role || 'Guest'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Theme translation list
  const themeList = [
    { value: 'light', label: isEn ? 'Light' : 'Sáng', icon: Sun },
    { value: 'dark', label: isEn ? 'Dark' : 'Tối', icon: Moon },
    { value: 'system', label: isEn ? 'System' : 'Hệ thống', icon: Monitor },
  ]

  // Navigation Links
  const privateLinks = [
    { to: ROUTES.DASHBOARD, label: isEn ? 'Dashboard' : 'Bảng điều khiển' },
    { to: ROUTES.CHAT, label: isEn ? 'Chat' : 'Trò chuyện' },
    { to: ROUTES.TASK, label: isEn ? 'Tasks' : 'Công việc' },
  ]

  const publicLinks = [
    { href: '#features', label: t('landing-page.nav.features', 'Tính năng') },
    { href: '#solutions', label: t('landing-page.nav.solutions', 'Giải pháp') },
    { href: '#pricing', label: t('landing-page.nav.pricing', 'Bảng giá') },
    { href: '#about', label: t('landing-page.nav.about', 'Giới thiệu') },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex h-14 w-full items-center justify-between px-6">
        {/* --- LEFT AREA: LOGO & NAV LINKS --- */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LANDING} className="flex items-center gap-2 outline-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary">{t('brand.name_prefix', 'Digi')}</span>
              <span className="text-foreground">{t('brand.name_suffix', 'ERP')}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            {isAuthenticated
              ? privateLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md transition-colors ${isActive
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))
              : publicLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  {link.label}
                </a>
              ))}
          </nav>
        </div>

        {/* --- RIGHT AREA: UTILITIES & ACTIONS --- */}
        <div className="flex items-center gap-3">
          {/* Authenticated Utilities */}
          {isAuthenticated && (
            <>
              {/* Localized Clock */}
              <CurrentTime className="hidden sm:flex mr-1" />
              <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

              {/* Notification Popover */}
              <NotificationPopover />
            </>
          )}

          {/* Guest Action Quick Settings */}
          {!isAuthenticated && mounted && (
            <div className="hidden sm:flex items-center gap-1.5">
              {/* Quick Language Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                title={isEn ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}
              >
                <Globe className="h-5 w-5" />
              </Button>

              {/* Quick Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                title={isEn ? 'Toggle theme' : 'Chuyển đổi giao diện'}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          )}

          {/* User Auth Menu (Dropdown / Login-Signup buttons) */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border/80 p-0 hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                {/* User info header */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold leading-none text-foreground">{displayName}</p>
                      <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        {userRole}
                      </span>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground truncate pt-0.5">{displayEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>{isEn ? 'My Profile' : 'Hồ sơ cá nhân'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{isEn ? 'Settings' : 'Cài đặt'}</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                {/* Submenu for Theme Choice */}
                {mounted && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      {theme === 'dark' ? (
                        <Moon className="mr-2 h-4 w-4" />
                      ) : theme === 'light' ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Monitor className="mr-2 h-4 w-4" />
                      )}
                      <span>{isEn ? 'Appearance' : 'Giao diện'}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {themeList.map((t) => {
                        const Icon = t.icon
                        return (
                          <DropdownMenuItem
                            key={t.value}
                            onClick={() => setTheme(t.value)}
                            className={cn('cursor-pointer', theme === t.value && 'bg-accent font-semibold')}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{t.label}</span>
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}

                {/* Submenu for Language Choice */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <Globe className="mr-2 h-4 w-4" />
                    <span>{isEn ? 'Language' : 'Ngôn ngữ'}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => handleLanguageChange('vi')}
                      className={cn('cursor-pointer', i18n.language === 'vi' && 'bg-accent font-semibold')}
                    >
                      <span className="mr-2">🇻🇳</span>
                      <span>Tiếng Việt</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleLanguageChange('en')}
                      className={cn('cursor-pointer', i18n.language === 'en' && 'bg-accent font-semibold')}
                    >
                      <span className="mr-2">🇬🇧</span>
                      <span>English</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />

                {/* Logout Button */}
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isEn ? 'Logout' : 'Đăng xuất'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to={ROUTES.PORTAL}>
                  <LogIn className="h-4 w-4 mr-1.5" />
                  {isEn ? 'Login' : 'Đăng nhập'}
                </Link>
              </Button>
              <Button size="sm" asChild className="shadow-sm">
                <Link to={ROUTES.LOGIN}>
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  {isEn ? 'Sign Up' : 'Đăng ký'}
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden text-muted-foreground hover:text-foreground">
                <Menu className="h-5.5 w-5.5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-6">
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-6">
                  {/* Branding in mobile menu */}
                  <div className="flex items-center gap-2 border-b pb-4">
                    <Layers className="h-5 w-5 text-primary" />
                    <span className="text-md font-bold">DigiERP</span>
                  </div>

                  {/* Nav links */}
                  <nav className="flex flex-col gap-4 font-medium text-sm">
                    {isAuthenticated
                      ? privateLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="hover:text-primary transition-colors py-1"
                        >
                          {link.label}
                        </Link>
                      ))
                      : publicLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="hover:text-primary transition-colors py-1"
                        >
                          {link.label}
                        </a>
                      ))}
                  </nav>
                </div>

                {/* Mobile footer with settings */}
                <div className="space-y-4 border-t pt-4">
                  {mounted && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {isEn ? 'Theme' : 'Giao diện'}
                      </span>
                      <div className="flex gap-1">
                        {themeList.map((t) => (
                          <Button
                            key={t.value}
                            variant={theme === t.value ? 'default' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setTheme(t.value)}
                          >
                            <t.icon className="h-4 w-4" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {isEn ? 'Language' : 'Ngôn ngữ'}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant={i18n.language === 'vi' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 px-2.5 text-xs"
                        onClick={() => handleLanguageChange('vi')}
                      >
                        🇻🇳 VN
                      </Button>
                      <Button
                        variant={i18n.language === 'en' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 px-2.5 text-xs"
                        onClick={() => handleLanguageChange('en')}
                      >
                        🇬🇧 EN
                      </Button>
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="flex flex-col gap-2 pt-2">
                      <Button variant="outline" asChild onClick={() => setMobileMenuOpen(false)}>
                        <Link to={ROUTES.PORTAL}>{isEn ? 'Login' : 'Đăng nhập'}</Link>
                      </Button>
                      <Button asChild onClick={() => setMobileMenuOpen(false)}>
                        <Link to={ROUTES.LOGIN}>{isEn ? 'Sign Up' : 'Đăng ký'}</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
