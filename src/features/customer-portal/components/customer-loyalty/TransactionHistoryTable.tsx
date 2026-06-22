import { Badge } from '@/components/ui/badge'
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
import type { LoyaltyTransaction } from '../../types/customer-portal.types'

type TransactionType = LoyaltyTransaction['type']

const TYPE_CONFIG: Record<TransactionType, { label: string; className: string; sign: '+' | '-' | '' }> = {
  earned: { label: 'Tích điểm', className: 'bg-[#EAF3DE] text-[#3B6D11] hover:bg-[#EAF3DE]', sign: '+' },
  bonus: { label: 'Điểm thưởng', className: 'bg-[#FEF6E4] text-[#B7770D] hover:bg-[#FEF6E4]', sign: '+' },
  redeemed: { label: 'Đổi điểm', className: 'bg-[#E8F4FD] text-[#1A6EA8] hover:bg-[#E8F4FD]', sign: '-' },
  expired: { label: 'Hết hạn', className: 'bg-[#F0F0EE] text-[#6B6B6B] hover:bg-[#F0F0EE]', sign: '-' },
}

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

interface TransactionHistoryTableProps {
  readonly transactions: LoyaltyTransaction[]
}

export function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Lịch sử tích điểm</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Đơn hàng</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead className="text-right">Giá trị đơn</TableHead>
              <TableHead className="text-right">Điểm</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const typeConfig = TYPE_CONFIG[tx.type]
              const isPositive = tx.points > 0
              return (
                <TableRow key={tx.id}>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString('vi-VN')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">{tx.description}</span>
                  </TableCell>
                  <TableCell>
                    {tx.orderNumber ? (
                      <span className="font-mono text-xs text-muted-foreground">{tx.orderNumber}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('border-0 text-xs font-medium', typeConfig.className)}>
                      {typeConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {tx.amount > 0 ? (
                      <span className="text-sm text-muted-foreground">{formatVND(tx.amount)}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        isPositive ? 'text-[#3B6D11]' : 'text-[#C0392B]'
                      )}
                    >
                      {typeConfig.sign}{Math.abs(tx.points).toLocaleString()} điểm
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
