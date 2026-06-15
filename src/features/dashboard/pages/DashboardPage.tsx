import { Button } from '@/components/ui/button'
import {
    Activity,
    CreditCard,
    Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {

    const recentSales = [
        { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00' },
        { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00' },
        { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00' },
        { name: 'William Kim', email: 'will@email.com', amount: '+$99.00' },
        { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00' },
    ]

    return (
        <div className="flex h-screen flex-col bg-background text-foreground transition-colors duration-200">
            {/* <Header /> */}
            <div className="flex flex-1 overflow-hidden bg-muted/20">
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        <div className="mb-6 flex items-center justify-between space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                            <div className="flex items-center space-x-2">
                                <Button>Tải báo cáo</Button>
                            </div>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Tổng doanh thu
                                    </CardTitle>
                                    <span className="text-muted-foreground">
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
                                    <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Đăng ký mới</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+2350</div>
                                    <p className="text-xs text-muted-foreground">+180.1% so với tháng trước</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Đơn hàng</CardTitle>
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+12,234</div>
                                    <p className="text-xs text-muted-foreground">+19% so với tháng trước</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Lượt hoạt động
                                    </CardTitle>
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+573</div>
                                    <p className="text-xs text-muted-foreground">+201 từ giờ trước</p>
                                </CardContent>
                            </Card>
                        </div>

                        { }
                        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            {/* Main Chart Area (Placeholder) */}
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Tổng quan</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/20">
                                        <span className="text-sm text-muted-foreground">
                                            Khu vực hiển thị Biểu đồ (Recharts)
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Sales List */}
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Giao dịch gần đây</CardTitle>
                                    <p className="text-sm text-muted-foreground">Bạn có 265 giao dịch trong tháng này.</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {recentSales.map((sale, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
                                                    {sale.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                                                    <p className="text-sm text-muted-foreground">{sale.email}</p>
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
        </div>
    )
}
