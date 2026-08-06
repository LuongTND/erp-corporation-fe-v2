import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Sun, Moon, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/routes'
import logoBahung from '@/assets/logo/logo-bahung.png'

export function PublicHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex h-14 items-center justify-between px-6">
        <Link to={ROUTES.LANDING} className="flex items-center gap-2 outline-none">
          <img src={logoBahung} alt="Ba Hưng" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-1.5">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Chuyển đổi giao diện"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link to={ROUTES.LOGIN}>
              <LogIn className="mr-1.5 h-4 w-4" />
              Đăng nhập
            </Link>
          </Button>

          <Button size="sm" asChild className="shadow-sm">
            <Link to={ROUTES.LOGIN}>
              <UserPlus className="mr-1.5 h-4 w-4" />
              Đăng ký
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
