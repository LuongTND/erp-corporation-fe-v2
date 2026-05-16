import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  CreditCard,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Users,
  Zap,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('landing')

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
  }

  const recentSales = [
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00' },
    { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00' },
    { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00' },
    { name: 'William Kim', email: 'will@email.com', amount: '+$99.00' },
    { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00' },
  ]

  return (
    <>
      <div className="flex h-screen w-full bg-zinc-50/50">
        {/* Sidebar (Desktop) */}
        <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white md:flex">
          <div className="flex h-14 items-center border-b border-zinc-200 px-4">
            <div className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
                <LayoutDashboard size={18} />
              </div>
              <span>Acme Inc</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition-all hover:text-zinc-900"
            >
              <LayoutDashboard size={18} /> Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900"
            >
              <CreditCard size={18} /> Đơn hàng
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Users size={18} /> Khách hàng
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Settings size={18} /> Cài đặt
            </a>
          </nav>
        </aside>

        {}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Navbar */}
          <header className="flex h-14 items-center gap-4 border-b border-zinc-200 bg-white px-4 lg:px-6">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => {}}>
              <Menu size={20} />
            </Button>
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="w-full bg-zinc-50 pl-8 md:max-w-xs lg:max-w-[300px]"
                  />
                </div>
              </form>
            </div>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell size={20} />
              <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-red-600"></span>
            </Button>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-zinc-300 bg-zinc-200">
              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
          </header>

          {}
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h2>
              <div className="flex items-center space-x-2">
                <Button>Tải báo cáo</Button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-500">
                    Tổng doanh thu
                  </CardTitle>
                  <span className="text-zinc-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-zinc-500">+20.1% so với tháng trước</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-500">Đăng ký mới</CardTitle>
                  <Users className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-zinc-500">+180.1% so với tháng trước</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-500">Đơn hàng</CardTitle>
                  <CreditCard className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-zinc-500">+19% so với tháng trước</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-500">
                    Lượt hoạt động
                  </CardTitle>
                  <Activity className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-zinc-500">+201 từ giờ trước</p>
                </CardContent>
              </Card>
            </div>

            {}
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Main Chart Area (Placeholder) */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Tổng quan</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed border-zinc-200 bg-zinc-50/50">
                    <span className="text-sm text-zinc-500">
                      Khu vực hiển thị Biểu đồ (Recharts)
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Sales List */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Giao dịch gần đây</CardTitle>
                  <p className="text-sm text-zinc-500">Bạn có 265 giao dịch trong tháng này.</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {recentSales.map((sale, index) => (
                      <div key={index} className="flex items-center">
                        <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-900">
                          {sale.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{sale.name}</p>
                          <p className="text-sm text-zinc-500">{sale.email}</p>
                        </div>
                        <div className="ml-auto font-medium">{sale.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
