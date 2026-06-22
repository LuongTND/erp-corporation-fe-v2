import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import type { CustomerOrder } from '../../types/customer-portal.types'

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

interface OrderProductListProps {
  readonly order: CustomerOrder
}

export function OrderProductList({ order }: OrderProductListProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-right">Số lượng</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">{product.name}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-muted-foreground">{product.sku}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-muted-foreground">
                    {formatVND(product.unitPrice)}/{product.unit}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-foreground">
                    {product.quantity} {product.unit}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-medium text-foreground">
                    {formatVND(product.totalPrice)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="ml-auto w-64 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tạm tính</span>
          <span className="text-foreground">{formatVND(order.totalAmount)}</span>
        </div>
        {order.discount > 0 && (
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-muted-foreground">Chiết khấu</span>
            <span className="text-[#3B6D11]">-{formatVND(order.discount)}</span>
          </div>
        )}
        <Separator className="my-2" />
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-foreground">Thành tiền</span>
          <span className="text-base font-bold text-primary">{formatVND(order.finalAmount)}</span>
        </div>
      </div>
    </div>
  )
}
