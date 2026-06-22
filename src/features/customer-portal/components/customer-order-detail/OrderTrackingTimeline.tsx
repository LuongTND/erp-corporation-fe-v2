import { Check, Circle, Clock, Package, Truck, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrderStatus, OrderTrackingStep } from '../../types/customer-portal.types'

const ALL_STEPS: { status: OrderStatus; label: string; description: string; Icon: typeof Check }[] = [
  { status: 'pending', label: 'Chờ xác nhận', description: 'Đơn hàng đang chờ xác nhận từ đội ngũ Sales', Icon: Clock },
  { status: 'confirmed', label: 'Đã xác nhận', description: 'Đơn hàng đã được xác nhận và đưa vào hệ thống', Icon: Check },
  { status: 'processing', label: 'Đang xử lý', description: 'Đang chuẩn bị hàng hoá và đóng gói', Icon: Package },
  { status: 'shipping', label: 'Đang giao hàng', description: 'Hàng hoá đang trên đường giao đến bạn', Icon: Truck },
  { status: 'delivered', label: 'Đã giao thành công', description: 'Đơn hàng đã được giao thành công', Icon: Check },
]

const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipping', 'delivered']

function buildSteps(currentStatus: OrderStatus, timestamps: Partial<Record<OrderStatus, string>>): OrderTrackingStep[] {
  if (currentStatus === 'cancelled') {
    return [
      {
        status: 'cancelled',
        label: 'Đơn hàng đã bị huỷ',
        description: 'Đơn hàng này đã bị hủy',
        timestamp: timestamps['cancelled'],
        completed: true,
        current: true,
      },
    ]
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus)

  return ALL_STEPS.map((step, index) => ({
    status: step.status,
    label: step.label,
    description: step.description,
    timestamp: timestamps[step.status],
    completed: index <= currentIndex,
    current: index === currentIndex,
  }))
}

interface OrderTrackingTimelineProps {
  readonly currentStatus: OrderStatus
  readonly timestamps?: Partial<Record<OrderStatus, string>>
}

export function OrderTrackingTimeline({ currentStatus, timestamps = {} }: OrderTrackingTimelineProps) {
  const steps = buildSteps(currentStatus, timestamps)

  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-[#FDECEA] bg-[#FDECEA]/60 px-4 py-4">
        <XCircle className="h-5 w-5 shrink-0 text-[#C0392B]" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-[#C0392B]">Đơn hàng đã bị huỷ</p>
          <p className="text-xs text-muted-foreground">Vui lòng liên hệ nhân viên nếu có thắc mắc.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const Icon = ALL_STEPS[index]?.Icon ?? Circle

        return (
          <div key={step.status} className="flex gap-4">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  step.completed
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              {!isLast && (
                <div
                  className={cn(
                    'mt-1 w-0.5 flex-1',
                    step.completed ? 'bg-primary' : 'bg-border'
                  )}
                  style={{ minHeight: '32px' }}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn('pb-6 pt-0.5 min-w-0', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-sm font-medium',
                  step.current ? 'text-primary' : step.completed ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
                {step.current && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Hiện tại
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
              {step.timestamp && (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {new Date(step.timestamp).toLocaleString('vi-VN')}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
