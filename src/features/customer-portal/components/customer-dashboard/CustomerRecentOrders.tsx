import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config/routes'
import type { CustomerOrder, OrderStatus } from '../../types/customer-portal.types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Chờ xác nhận', className: 'bg-[#F0F0EE] text-[#6B6B6B] hover:bg-[#F0F0EE]' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-[#E8F4FD] text-[#1A6EA8] hover:bg-[#E8F4FD]' },
  processing: { label: 'Đang xử lý', className: 'bg-[#FEF6E4] text-[#B7770D] hover:bg-[#FEF6E4]' },
  shipping: { label: 'Đang giao', className: 'bg-[#EDF4FF] text-[#2563EB] hover:bg-[#EDF4FF]' },
  delivered: { label: 'Đã giao', className: 'bg-[#EAF3DE] text-[#3B6D11] hover:bg-[#EAF3DE]' },
  cancelled: { label: 'Đã hủy', className: 'bg-[#FDECEA] text-[#C0392B] hover:bg-[#FDECEA]' },
}

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

interface CustomerRecentOrdersProps {
  readonly orders: CustomerOrder[]
}

export function CustomerRecentOrders({ orders }: CustomerRecentOrdersProps) {
  const navigate = useNavigate()
  const recent = orders.slice(0, 5)

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Đơn hàng gần đây</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-primary hover:text-primary"
          onClick={() => navigate(ROUTES.CUSTOMER_PORTAL.ORDERS)}
        >
          Xem tất cả
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status]
              return (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`${ROUTES.CUSTOMER_PORTAL.ORDERS}/${order.id}`)}
                >
                  <TableCell>
                    <span className="font-mono text-sm font-medium text-foreground">
                      {order.orderNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('border-0 text-xs font-medium', statusConfig.className)}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-medium text-foreground">
                      {formatVND(order.finalAmount)}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
