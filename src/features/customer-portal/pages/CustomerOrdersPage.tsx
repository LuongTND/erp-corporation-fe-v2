import { useState } from 'react'
import { Search, Calendar, FileText, ArrowRight, RefreshCw, XCircle, FileDown, Eye, CheckCircle, Truck, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Mock 8 B2B Horeca Orders representing all statuses
const MOCK_ORDERS = [
  {
    id: 'ord-101',
    orderNumber: 'DH-2024-8841',
    createdAt: '2024-10-12T10:30:00Z',
    itemsCount: 5,
    totalAmount: 2365000,
    status: 'pending', // Chờ xử lý
    products: [
      { name: 'Siro Toschi Caramel 1000ml', quantity: 3, price: 270000, unit: 'Chai' },
      { name: 'Siro Pomona Đào Nhật Bản 1000ml', quantity: 2, price: 260000, unit: 'Chai' },
      { name: 'Bột Trà Xanh Uji Matcha 500g', quantity: 2, price: 320000, unit: 'Gói' },
      { name: 'Bột Sữa Thực Vật Master 1kg', quantity: 5, price: 95000, unit: 'Gói' },
      { name: 'Trân Châu Hoàng Kim Ezmix 3kg', quantity: 4, price: 85000, unit: 'Bao' },
    ],
    address: 'Hộ kinh doanh Coffee House, 123 Nguyễn Văn Linh, Q.7, TP.HCM',
    note: 'Giao giờ hành chính, liên hệ trước khi giao 15p.',
  },
  {
    id: 'ord-102',
    orderNumber: 'DH-2024-8812',
    createdAt: '2024-10-09T08:15:00Z',
    itemsCount: 3,
    totalAmount: 1480000,
    status: 'shipping', // Đang giao
    products: [
      { name: 'Sốt Master Chocolate Đậm Đặc 2L', quantity: 2, price: 210000, unit: 'Can' },
      { name: 'Mứt Dâu Tây Tây Nguyên Puree 1L', quantity: 4, price: 135000, unit: 'Chai' },
      { name: 'Trân Châu Hoàng Kim Ezmix 3kg', quantity: 6, price: 85000, unit: 'Bao' },
    ],
    address: 'Trà Sữa DingTea, 456 Hoàng Diệu, Q. Hải Châu, Đà Nẵng',
    note: 'Gọi quản lý trước khi giao.',
  },
  {
    id: 'ord-103',
    orderNumber: 'DH-2024-8799',
    createdAt: '2024-10-05T14:40:00Z',
    itemsCount: 2,
    totalAmount: 935000,
    status: 'delivered', // Hoàn thành
    products: [
      { name: 'Siro Toschi Caramel 1000ml', quantity: 2, price: 285000, unit: 'Chai' },
      { name: 'Siro Pomona Đào Nhật Bản 1000ml', quantity: 1, price: 265000, unit: 'Chai' },
    ],
    address: 'Tiệm Bánh & Trà La Rose, 789 Cách Mạng Tháng 8, Q.10, TP.HCM',
    note: '',
  },
  {
    id: 'ord-104',
    orderNumber: 'DH-2024-8750',
    createdAt: '2024-09-28T11:20:00Z',
    itemsCount: 4,
    totalAmount: 3120000,
    status: 'cancelled', // Đã hủy
    products: [
      { name: 'Bột Trà Xanh Uji Matcha 500g', quantity: 5, price: 320000, unit: 'Gói' },
      { name: 'Trà Đen Cổ Điển Số 9 Lộc Phát 1kg', quantity: 10, price: 120000, unit: 'Gói' },
      { name: 'Sốt Pomona Socola Trắng Lỏng 2kg', quantity: 1, price: 295000, unit: 'Chai' },
      { name: 'Đường Nước Trắng Hàn Quốc 25kg', quantity: 1, price: 450000, unit: 'Thùng' },
    ],
    address: 'Horeca Supply Store, 11 Lý Thường Kiệt, Q.11, TP.HCM',
    note: 'Khách hàng yêu cầu hủy vì đổi lịch khai trương.',
  },
  {
    id: 'ord-105',
    orderNumber: 'DH-2024-8711',
    createdAt: '2024-09-15T09:00:00Z',
    itemsCount: 1,
    totalAmount: 285000,
    status: 'delivered',
    products: [
      { name: 'Siro Toschi Caramel 1000ml', quantity: 1, price: 285000, unit: 'Chai' },
    ],
    address: 'Cà Phê Muối Chú Long, 22 Võ Văn Kiệt, Q.1, TP.HCM',
    note: '',
  },
  {
    id: 'ord-106',
    orderNumber: 'DH-2024-8692',
    createdAt: '2024-09-08T16:30:00Z',
    itemsCount: 3,
    totalAmount: 1845000,
    status: 'delivered',
    products: [
      { name: 'Siro Pomona Đào Nhật Bản 1000ml', quantity: 4, price: 260000, unit: 'Chai' },
      { name: 'Mứt Dâu Tây Tây Nguyên Puree 1L', quantity: 3, price: 135000, unit: 'Chai' },
      { name: 'Trà Đen Cổ Điển Số 9 Lộc Phát 1kg', quantity: 3, price: 120000, unit: 'Gói' },
    ],
    address: 'Hộ kinh doanh Coffee House, 123 Nguyễn Văn Linh, Q.7, TP.HCM',
    note: '',
  },
  {
    id: 'ord-107',
    orderNumber: 'DH-2024-8610',
    createdAt: '2024-08-30T10:10:00Z',
    itemsCount: 2,
    totalAmount: 760000,
    status: 'delivered',
    products: [
      { name: 'Bột Sữa Thực Vật Master 1kg', quantity: 4, price: 95000, unit: 'Gói' },
      { name: 'Trà Đen Cổ Điển Số 9 Lộc Phát 1kg', quantity: 3, price: 120000, unit: 'Gói' },
    ],
    address: 'Hộ kinh doanh Coffee House, 123 Nguyễn Văn Linh, Q.7, TP.HCM',
    note: '',
  },
  {
    id: 'ord-108',
    orderNumber: 'DH-2024-8550',
    createdAt: '2024-08-20T13:00:00Z',
    itemsCount: 5,
    totalAmount: 4320000,
    status: 'delivered',
    products: [
      { name: 'Bột Trà Xanh Uji Matcha 500g', quantity: 10, price: 320000, unit: 'Gói' },
      { name: 'Siro Toschi Caramel 1000ml', quantity: 2, price: 285000, unit: 'Chai' },
      { name: 'Sốt Master Chocolate Đậm Đặc 2L', quantity: 1, price: 210000, unit: 'Can' },
      { name: 'Thạch Dừa Hạt Lựu Master 3.2kg', quantity: 3, price: 110000, unit: 'Hộp' },
    ],
    address: 'Hộ kinh doanh Coffee House, 123 Nguyễn Văn Linh, Q.7, TP.HCM',
    note: '',
  },
]

// Status badge mapping based on index.css t-status-tokens
const STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Chờ xử lý', bg: 'var(--t-status-progress-bg)', text: 'var(--t-status-progress-text)' },
  shipping: { label: 'Đang giao', bg: 'var(--t-status-progress-bg)', text: 'var(--t-status-progress-text)' },
  delivered: { label: 'Hoàn thành', bg: 'var(--t-status-done-bg)', text: 'var(--t-status-done-text)' },
  cancelled: { label: 'Đã hủy', bg: 'var(--t-status-overdue-bg)', text: 'var(--t-status-overdue-text)' },
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [selectedOrder, setSelectedOrder] = useState<typeof MOCK_ORDERS[number] | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    // Simple date filter check
    let matchesDate = true
    if (startDate) {
      matchesDate = matchesDate && new Date(order.createdAt) >= new Date(startDate)
    }
    if (endDate) {
      matchesDate = matchesDate && new Date(order.createdAt) <= new Date(endDate + 'T23:59:59Z')
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const handleOpenDetail = (order: typeof MOCK_ORDERS[number]) => {
    setSelectedOrder(order)
    setDetailModalOpen(true)
  }

  const handleReorder = (orderNumber: string) => {
    toast.success(`Đã thêm toàn bộ sản phẩm của đơn ${orderNumber} vào giỏ hàng!`)
  }

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
    )
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: 'cancelled' } : null)
    }
    toast.info('Đã gửi yêu cầu hủy đơn hàng.')
  }

  const handleDownloadPDF = (orderNumber: string) => {
    toast.success(`Đang tải xuống hóa đơn PDF cho đơn ${orderNumber}...`)
  }

  // Helper to render horizontal timeline stepper
  const renderStepper = (status: string) => {
    const steps = [
      { id: 'pending', label: 'Đặt hàng', icon: ShoppingBag },
      { id: 'confirmed', label: 'Xác nhận', icon: CheckCircle },
      { id: 'shipping', label: 'Đang giao', icon: Truck },
      { id: 'delivered', label: 'Nhận hàng', icon: CheckCircle },
    ]

    const getStepStatus = (stepId: string) => {
      if (status === 'cancelled') return 'cancelled'
      if (status === 'delivered') return 'completed'
      if (status === 'shipping') {
        if (stepId === 'delivered') return 'next'
        return 'completed'
      }
      if (status === 'pending') {
        if (stepId === 'pending') return 'active'
        return 'next'
      }
      return 'completed'
    }

    return (
      <div className="flex items-center w-full justify-between py-4 px-2 bg-t-bg-hover/20 rounded-xl border border-t-border/40 my-3 overflow-x-auto">
        {steps.map((step, idx) => {
          const stepStatus = getStepStatus(step.id)
          const StepIcon = step.icon
          const isLast = idx === steps.length - 1

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center border text-xs font-bold transition-all shadow-sm',
                    stepStatus === 'completed' && 'bg-t-accent text-white border-t-accent',
                    stepStatus === 'active' && 'bg-t-accent-subtle text-t-accent border-t-accent animate-pulse',
                    stepStatus === 'next' && 'bg-t-bg-surface text-t-text-muted border-t-border',
                    stepStatus === 'cancelled' && 'bg-t-status-overdue-bg text-t-status-overdue-text border-t-status-overdue-text/30'
                  )}
                >
                  <StepIcon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold text-t-text-secondary">{step.label}</span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'h-0.5 w-full mx-2 border-t border-dashed',
                    stepStatus === 'completed' ? 'border-t-accent' : 'border-t-border'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Title */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Lịch sử đơn hàng</h1>
        <p className="text-xs text-t-text-muted mt-0.5 font-medium">
          Xem và quản lý tất cả đơn hàng pha chế Horeca sỉ của bạn
        </p>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl border border-t-border bg-t-bg-surface shadow-sm items-center">
        {/* Date From */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t-text-muted" />
          <Input
            type="date"
            placeholder="Từ ngày"
            className="pl-9 text-xs border-t-border focus:border-t-accent"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t-text-muted" />
          <Input
            type="date"
            placeholder="Đến ngày"
            className="pl-9 text-xs border-t-border focus:border-t-accent"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="shipping">Đang giao</SelectItem>
            <SelectItem value="delivered">Hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>

        {/* Order ID Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t-text-muted" />
          <Input
            type="text"
            placeholder="Mã đơn hàng (vd: 8841)..."
            className="pl-9 text-xs border-t-border focus:border-t-accent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-t-border bg-t-bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-t-text-primary border-collapse">
            <thead>
              <tr className="bg-t-bg-hover/40 border-b border-t-border font-bold text-t-text-secondary select-none">
                <th className="px-5 py-3">Mã đơn</th>
                <th className="px-5 py-3">Ngày đặt</th>
                <th className="px-5 py-3">Số SP</th>
                <th className="px-5 py-3">Tổng tiền</th>
                <th className="px-5 py-3 text-center">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending
                  return (
                    <tr
                      key={order.id}
                      onClick={() => handleOpenDetail(order)}
                      className="border-b border-t-border/50 hover:bg-t-bg-hover transition-colors duration-250 cursor-pointer select-none"
                    >
                      <td className="px-5 py-3.5 font-bold text-t-text-primary font-mono">{order.orderNumber}</td>
                      <td className="px-5 py-3.5 text-t-text-muted">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-5 py-3.5 text-t-text-secondary">{order.itemsCount} sản phẩm</td>
                      <td className="px-5 py-3.5 font-black text-t-accent">
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm border border-transparent"
                          style={{ backgroundColor: style.bg, color: style.text }}
                        >
                          {style.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-t-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg"
                          onClick={() => handleOpenDetail(order)}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-t-text-secondary hover:text-t-accent hover:bg-t-accent-subtle rounded-lg"
                          onClick={() => handleReorder(order.orderNumber)}
                          title="Đặt lại đơn này"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        {order.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-t-text-muted hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            onClick={() => handleCancelOrder(order.id)}
                            title="Hủy đơn"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-t-text-muted font-medium bg-t-bg-surface/50">
                    Chưa có đơn hàng nào khớp với tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-2xl border-border/60 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl bg-background/95">
          {selectedOrder && (
            <>
              <DialogHeader className="pb-2">
                <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                  Chi tiết đơn hàng {selectedOrder.orderNumber}
                </DialogTitle>
                <DialogDescription className="text-xs font-semibold text-t-text-muted/90">
                  Đặt lúc {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                </DialogDescription>
              </DialogHeader>

              {/* Stepper Timeline */}
              {renderStepper(selectedOrder.status)}

              {/* Stepper details */}
              <div className="flex flex-col gap-4 mt-2">
                <div>
                  <h4 className="text-xs font-bold text-t-text-secondary mb-1.5">Sản phẩm đã đặt</h4>
                  <div className="rounded-xl border border-t-border overflow-hidden max-h-[160px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-t-bg-hover font-bold text-t-text-secondary px-3 py-2 border-b border-t-border">
                          <th className="p-2">Tên nguyên liệu</th>
                          <th className="p-2 text-center">Số lượng</th>
                          <th className="p-2 text-right">Đơn giá sỉ</th>
                          <th className="p-2 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.products.map((p, idx) => (
                          <tr key={idx} className="border-b border-t-border/40 last:border-0 text-t-text-primary font-semibold">
                            <td className="p-2">{p.name}</td>
                            <td className="p-2 text-center">{p.quantity} {p.unit}</td>
                            <td className="p-2 text-right">{p.price.toLocaleString('vi-VN')}đ</td>
                            <td className="p-2 text-right font-bold text-t-accent">
                              {(p.price * p.quantity).toLocaleString('vi-VN')}đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <h5 className="font-bold text-t-text-secondary mb-1">Địa chỉ giao hàng</h5>
                    <p className="text-t-text-muted leading-relaxed">{selectedOrder.address}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-t-text-secondary mb-1">Ghi chú sỉ</h5>
                    <p className="text-t-text-muted leading-relaxed">
                      {selectedOrder.note || 'Không có ghi chú.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total calculations & footer */}
              <div className="flex justify-between items-center border-t border-t-border pt-4 mt-2">
                <span className="text-xs font-black text-t-text-primary uppercase">Tổng tiền sỉ</span>
                <span className="text-xl font-black text-t-accent tracking-tight">
                  {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadPDF(selectedOrder.orderNumber)}
                  className="rounded-xl border-t-border text-t-text-secondary hover:bg-t-bg-hover hover:text-t-text-primary gap-1.5 text-xs font-bold"
                >
                  <FileDown className="h-4 w-4" />
                  Tải hóa đơn PDF
                </Button>
                {selectedOrder.status === 'pending' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="rounded-xl gap-1.5 text-xs font-bold"
                  >
                    Hủy đơn sỉ
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => {
                    handleReorder(selectedOrder.orderNumber)
                    setDetailModalOpen(false)
                  }}
                  className="rounded-xl bg-t-accent hover:bg-t-accent/95 text-white gap-1.5 text-xs font-bold"
                >
                  Đặt lại đơn sỉ
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
