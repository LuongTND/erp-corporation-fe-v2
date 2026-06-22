import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config/routes'
import { OrderTrackingTimeline } from '../components/customer-order-detail/OrderTrackingTimeline'
import { OrderProductList } from '../components/customer-order-detail/OrderProductList'
import { MOCK_CUSTOMER_ORDERS } from '../mocks/customer-orders.mock'
import type { OrderStatus } from '../types/customer-portal.types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Chờ xác nhận', className: 'bg-[var(--t-status-progress-bg)] text-[var(--t-status-progress-text)] hover:brightness-95' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-[var(--t-status-progress-bg)] text-[var(--t-status-progress-text)] hover:brightness-95' },
  processing: { label: 'Đang xử lý', className: 'bg-[var(--t-status-progress-bg)] text-[var(--t-status-progress-text)] hover:brightness-95' },
  shipping: { label: 'Đang giao', className: 'bg-[var(--t-status-progress-bg)] text-[var(--t-status-progress-text)] hover:brightness-95' },
  delivered: { label: 'Đã giao', className: 'bg-[var(--t-status-done-bg)] text-[var(--t-status-done-text)] hover:brightness-95' },
  cancelled: { label: 'Đã hủy', className: 'bg-[var(--t-status-overdue-bg)] text-[var(--t-status-overdue-text)] hover:brightness-95' },
}

export default function CustomerOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const order = MOCK_CUSTOMER_ORDERS.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <p className="text-base font-medium text-foreground">Không tìm thấy đơn hàng</p>
        <Button variant="outline" onClick={() => navigate(ROUTES.CUSTOMER_PORTAL.ORDERS)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden />
          Về danh sách đơn hàng
        </Button>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[order.status]

  // Simulate timestamps for the tracking steps
  const timestamps: Partial<Record<OrderStatus, string>> = {
    pending: order.createdAt,
    confirmed: order.status !== 'pending' ? order.createdAt : undefined,
    processing: ['processing', 'shipping', 'delivered'].includes(order.status)
      ? order.updatedAt
      : undefined,
    shipping: ['shipping', 'delivered'].includes(order.status) ? order.updatedAt : undefined,
    delivered: order.status === 'delivered' ? order.deliveryDate : undefined,
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back button + header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate(ROUTES.CUSTOMER_PORTAL.ORDERS)}
          aria-label="Quay lại"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground font-mono">
              {order.orderNumber}
            </h1>
            <Badge className={cn('border-0 text-xs font-medium', statusConfig.className)}>
              {statusConfig.label}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Tạo lúc {new Date(order.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Tracking + Products */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Tracking timeline */}
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Theo dõi đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTrackingTimeline currentStatus={order.status} timestamps={timestamps} />
            </CardContent>
          </Card>

          {/* Product list */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Sản phẩm ({order.products.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderProductList order={order} />
            </CardContent>
          </Card>
        </div>

        {/* Right: Order info */}
        <div className="flex flex-col gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <p className="text-sm text-foreground">{order.shippingAddress}</p>
              </div>
              {order.deliveryDate && (
                <div>
                  <p className="text-xs text-muted-foreground">Ngày giao hàng</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(order.deliveryDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              )}
              {order.note && (
                <div>
                  <p className="text-xs text-muted-foreground">Ghi chú</p>
                  <p className="text-sm text-foreground">{order.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="border-border">
            <CardContent className="flex flex-col gap-2 pt-4">
              <p className="text-sm font-medium text-foreground">Cần hỗ trợ?</p>
              <p className="text-xs text-muted-foreground">
                Liên hệ nhân viên chăm sóc khách hàng nếu bạn có vấn đề với đơn hàng.
              </p>
              <Button variant="outline" size="sm" className="mt-1 gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                Chat với AI hỗ trợ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
