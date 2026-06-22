import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

type StatusFilter = 'all' | OrderStatus

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

interface OrderTableProps {
  readonly orders: CustomerOrder[]
}

export function OrderTable({ orders }: OrderTableProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = orders.filter((order) => {
    const matchesSearch =
      !search.trim() || order.orderNumber.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          id="order-search"
          aria-label="Tìm kiếm đơn hàng"
          placeholder="Tìm mã đơn hàng..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-56 text-sm"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-44 text-sm" aria-label="Lọc trạng thái">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ xác nhận</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="processing">Đang xử lý</SelectItem>
            <SelectItem value="shipping">Đang giao</SelectItem>
            <SelectItem value="delivered">Đã giao</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
              <TableHead className="text-right">Chiết khấu</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => {
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
                    <span className="text-sm text-muted-foreground">
                      {order.products.length} sản phẩm
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('border-0 text-xs font-medium', statusConfig.className)}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-muted-foreground">
                      {formatVND(order.totalAmount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-[#3B6D11]">
                      -{formatVND(order.discount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-semibold text-foreground">
                      {formatVND(order.finalAmount)}
                    </span>
                  </TableCell>
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Tuỳ chọn đơn ${order.orderNumber}`}
                        >
                          <MoreHorizontal className="h-4 w-4" aria-hidden />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="gap-2"
                          onSelect={() => navigate(`${ROUTES.CUSTOMER_PORTAL.ORDERS}/${order.id}`)}
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden />
                          Xem chi tiết
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="flex justify-center py-14 text-sm text-muted-foreground">
            Không tìm thấy đơn hàng nào.
          </div>
        )}
      </div>
    </div>
  )
}
