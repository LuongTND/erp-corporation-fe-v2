import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  UserPlus,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import { Badge } from '@/components/ui/badge'

// Recharts mock data
const REVENUE_DATA = [
  { month: 'T5', revenue: 320 },
  { month: 'T6', revenue: 410 },
  { month: 'T7', revenue: 380 },
  { month: 'T8', revenue: 480 },
  { month: 'T9', revenue: 510 },
  { month: 'T10', revenue: 520 },
]

const BEST_SELLERS_DATA = [
  { name: 'Siro Toschi', sales: 480 },
  { name: 'Bột Uji Matcha', sales: 390 },
  { name: 'Siro Pomona Đào', sales: 310 },
  { name: 'Sốt Socola Master', sales: 280 },
  { name: 'Mứt Dâu Ezmix', sales: 240 },
]

// Mock 5 recent orders
const RECENT_ORDERS = [
  { code: 'DH-8841', client: 'The Coffee House', amount: 2365000, status: 'pending', time: '10 phút trước' },
  { code: 'DH-8812', client: 'DingTea Đà Nẵng', amount: 1480000, status: 'shipping', time: '1 giờ trước' },
  { code: 'DH-8799', client: 'La Rose Bakery', amount: 935000, status: 'delivered', time: '3 giờ trước' },
  { code: 'DH-8791', client: 'Phúc Long Hà Nội', amount: 4120000, status: 'delivered', time: '1 ngày trước' },
  { code: 'DH-8750', client: 'Horeca Supply Store', amount: 3120000, status: 'cancelled', time: '2 ngày trước' },
]

// Mock low inventory warnings (< 10 units remaining)
const LOW_INVENTORY_ITEMS = [
  { name: 'Siro Toschi Caramel 1000ml', stock: 4, unit: 'Chai', brand: 'Toschi (Ý)' },
  { name: 'Bột Trà Xanh Uji Matcha 500g', stock: 2, unit: 'Gói', brand: 'Marukyu' },
  { name: 'Đường Nước Hàn Quốc Daesang', stock: 7, unit: 'Thùng', brand: 'Daesang' },
  { name: 'Trân Châu Hoàng Kim Ezmix 3kg', stock: 9, unit: 'Bao', brand: 'Ezmix' },
]

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Chờ xử lý', bg: 'var(--t-status-progress-bg)', text: 'var(--t-status-progress-text)' },
  shipping: { label: 'Đang giao', bg: 'var(--t-status-progress-bg)', text: 'var(--t-status-progress-text)' },
  delivered: { label: 'Hoàn thành', bg: 'var(--t-status-done-bg)', text: 'var(--t-status-done-text)' },
  cancelled: { label: 'Đã hủy', bg: 'var(--t-status-overdue-bg)', text: 'var(--t-status-overdue-text)' },
}

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">Tổng quan hoạt động B2B</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Theo dõi hiệu suất đặt hàng sỉ, doanh thu và cảnh báo tồn kho nguyên liệu F&B
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Cấu hình báo cáo</Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Tải báo cáo</Button>
        </div>
      </div>

      {/* Top KPI Cards (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Revenue */}
        <Card className="border-t-border/60 hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-t-text-secondary uppercase tracking-wider">Doanh thu tháng này</p>
              <p className="text-xl font-black text-t-text-primary tracking-tight">520.0Mđ</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                <ArrowUpRight className="h-3 w-3" />
                <span>+12.4% so với T9</span>
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <TrendingUp className="h-4.5 w-4.5" />
            </span>
          </CardContent>
        </Card>

        {/* Card 2: Orders count */}
        <Card className="border-t-border/60 hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-t-text-secondary uppercase tracking-wider">Đơn hàng sỉ</p>
              <p className="text-xl font-black text-t-text-primary tracking-tight">42 đơn hàng</p>
              <p className="text-[10px] text-t-text-muted font-bold">12 chờ xử lý, 8 đang giao</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <ShoppingBag className="h-4.5 w-4.5" />
            </span>
          </CardContent>
        </Card>

        {/* Card 3: Out of stock warnings */}
        <Card className="border-t-border/60 hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-t-text-secondary uppercase tracking-wider">Nguyên liệu sắp hết</p>
              <p className="text-xl font-black text-t-text-primary tracking-tight">4 sản phẩm</p>
              <div className="flex items-center gap-1 text-[10px] text-destructive font-bold">
                <AlertTriangle className="h-3 w-3" />
                <span>Dưới hạn mức cảnh báo</span>
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive shrink-0">
              <AlertTriangle className="h-4.5 w-4.5" />
            </span>
          </CardContent>
        </Card>

        {/* Card 4: New customers */}
        <Card className="border-t-border/60 hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-t-text-secondary uppercase tracking-wider">Đại lý/Đối tác mới</p>
              <p className="text-xl font-black text-t-text-primary tracking-tight">18 đối tác</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                <ArrowUpRight className="h-3 w-3" />
                <span>+3 đối tác tuần này</span>
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <UserPlus className="h-4.5 w-4.5" />
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart Left: Line Chart Revenue */}
        <Card className="border-t-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-t-text-secondary">
              Biểu đồ doanh thu sỉ 6 tháng gần nhất (Triệu VNĐ)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--t-border)" />
                <XAxis dataKey="month" stroke="var(--t-text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--t-text-muted)" fontSize={10} tickLine={false} />
                <Tooltip formatter={(value) => [`${value}Mđ`, 'Doanh thu']} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--t-accent)"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart Right: Bar Chart Best Sellers */}
        <Card className="border-t-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-t-text-secondary">
              Top 5 nguyên liệu bán chạy nhất tháng này (Số lượng)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BEST_SELLERS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--t-border)" />
                <XAxis dataKey="name" stroke="var(--t-text-muted)" fontSize={9} tickLine={false} />
                <YAxis stroke="var(--t-text-muted)" fontSize={10} tickLine={false} />
                <Tooltip formatter={(value) => [`${value} đơn vị`, 'Doanh số']} />
                <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                  {BEST_SELLERS_DATA.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={idx === 0 ? 'var(--t-accent)' : 'oklch(var(--primary) / 0.5)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom grid (Recent Orders & Low Inventory warnings) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Recent Orders - Col Span 3 */}
        <div className="lg:col-span-3 flex flex-col gap-3 p-5 rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-t-text-secondary">Đơn hàng mới nhất</h3>
            <Button variant="link" size="sm" className="text-primary hover:text-primary/95 text-xs font-bold flex items-center gap-0.5 p-0">
              Xem tất cả <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-muted-foreground font-bold border-b border-border/40 pb-2 select-none">
                  <th className="py-2 pr-2">Mã đơn</th>
                  <th className="py-2 pr-2">Đại lý</th>
                  <th className="py-2 pr-2">Tổng tiền</th>
                  <th className="py-2 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((ord) => {
                  const status = STATUS_LABELS[ord.status] || STATUS_LABELS.pending
                  return (
                    <tr key={ord.code} className="border-b border-border/20 last:border-0 text-foreground font-semibold">
                      <td className="py-3 font-mono font-bold text-foreground">{ord.code}</td>
                      <td className="py-3 pr-2 truncate max-w-[130px]">{ord.client}</td>
                      <td className="py-3 font-bold">{ord.amount.toLocaleString('vi-VN')}đ</td>
                      <td className="py-3 text-center">
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                          style={{ backgroundColor: status.bg, color: status.text }}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low inventory list - Col Span 2 */}
        <div className="lg:col-span-2 flex flex-col gap-3 p-5 rounded-2xl border border-border bg-card shadow-sm">
          <div className="pb-2 border-b border-border/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-t-text-secondary">Cảnh báo tồn kho sỉ</h3>
          </div>
          <div className="flex flex-col gap-2">
            {LOW_INVENTORY_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl border border-border/50 bg-muted/20">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                  <p className="text-[9px] text-muted-foreground font-medium mt-0.5">{item.brand}</p>
                </div>
                <span className="shrink-0 text-right">
                  <Badge className="bg-destructive/10 text-destructive border-none font-bold rounded-lg shadow-sm">
                    Còn {item.stock} {item.unit}
                  </Badge>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
