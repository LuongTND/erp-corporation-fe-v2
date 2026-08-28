import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import type { SalaryRecord } from '../../types/salary.types'

interface MyPayrollTabProps {
  readonly current?: SalaryRecord
  readonly isLoading: boolean
}

function formatVnd(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export function MyPayrollTab({ current, isLoading }: MyPayrollTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Lương hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          {current ? (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">
                {formatVnd(current.hourlyRate)}
                <span className="text-sm font-normal text-muted-foreground ml-1">/giờ</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Hiệu lực từ {new Date(current.effectiveFrom).toLocaleDateString('vi-VN')}
              </p>
              {current.reason && (
                <p className="text-xs text-muted-foreground">Lý do: {current.reason}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có thông tin lương.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
