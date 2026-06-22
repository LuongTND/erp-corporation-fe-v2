import { useNavigate } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/routes'
import type { CustomerLoyaltyProfile, LoyaltyTierConfig } from '../../types/customer-portal.types'

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)

interface CustomerLoyaltyProgressProps {
  readonly profile: CustomerLoyaltyProfile
  readonly tierConfig: LoyaltyTierConfig
  readonly nextTierConfig?: LoyaltyTierConfig
}

export function CustomerLoyaltyProgress({
  profile,
  tierConfig,
  nextTierConfig,
}: CustomerLoyaltyProgressProps) {
  const navigate = useNavigate()

  const progressPercent = nextTierConfig
    ? Math.min(
        100,
        Math.round(
          ((profile.totalRevenue - tierConfig.minRevenue) /
            (nextTierConfig.minRevenue - tierConfig.minRevenue)) *
            100
        )
      )
    : 100

  const remaining = nextTierConfig
    ? nextTierConfig.minRevenue - profile.totalRevenue
    : 0

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Doanh số tích lũy</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary"
          onClick={() => navigate(ROUTES.CUSTOMER_PORTAL.LOYALTY)}
        >
          Chi tiết
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Current tier badge */}
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-3"
          style={{ backgroundColor: tierConfig.bgColor }}
        >
          <Trophy className="h-6 w-6 shrink-0" style={{ color: tierConfig.color }} aria-hidden />
          <div className="min-w-0">
            <p className="text-sm font-bold" style={{ color: tierConfig.color }}>
              {profile.currentTier}
            </p>
            <p className="text-xs text-muted-foreground">
              Chiết khấu {tierConfig.discountRate}% · Hệ số điểm ×{tierConfig.bonusRate}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-semibold text-foreground">{profile.currentPoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">điểm</p>
          </div>
        </div>

        {/* Progress to next tier */}
        {nextTierConfig && (
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatVND(profile.totalRevenue)}</span>
              <span>
                Còn {formatVND(remaining)} đến{' '}
                <span className="font-semibold" style={{ color: nextTierConfig.color }}>
                  {nextTierConfig.tier}
                </span>
              </span>
              <span>{formatVND(nextTierConfig.minRevenue)}</span>
            </div>
            <Progress
              value={progressPercent}
              className="h-2.5"
              aria-label={`Tiến trình ${progressPercent}% đến tier ${nextTierConfig.tier}`}
            />
          </div>
        )}

        {!nextTierConfig && (
          <p className="text-center text-sm font-medium text-muted-foreground">
            🏆 Bạn đã đạt tier cao nhất — Platinum!
          </p>
        )}
      </CardContent>
    </Card>
  )
}
