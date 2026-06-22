import { Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import type { CustomerLoyaltyProfile } from '../../types/customer-portal.types'
import { LOYALTY_TIERS } from '../../mocks/customer-loyalty.mock'
import { cn } from '@/lib/utils'

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)

interface LoyaltyTierCardProps {
  readonly profile: CustomerLoyaltyProfile
}

const TIER_STYLES: Record<string, {
  cardBg: string
  borderColor: string
  text: string
  trophy: string
  badgeBg: string
}> = {
  Bronze: {
    cardBg: 'bg-muted/50',
    borderColor: 'border-border/60',
    text: 'text-foreground',
    trophy: 'text-muted-foreground',
    badgeBg: 'bg-muted-foreground',
  },
  Silver: {
    cardBg: 'bg-muted/50',
    borderColor: 'border-border/60',
    text: 'text-foreground',
    trophy: 'text-muted-foreground',
    badgeBg: 'bg-muted-foreground',
  },
  Gold: {
    cardBg: 'bg-primary/10',
    borderColor: 'border-primary/25',
    text: 'text-primary',
    trophy: 'text-primary',
    badgeBg: 'bg-primary',
  },
  Platinum: {
    cardBg: 'bg-muted/50',
    borderColor: 'border-border/60',
    text: 'text-foreground',
    trophy: 'text-muted-foreground',
    badgeBg: 'bg-muted-foreground',
  },
}

export function LoyaltyTierCard({ profile }: LoyaltyTierCardProps) {
  const currentTierConfig = LOYALTY_TIERS.find((t) => t.tier === profile.currentTier)!
  const currentTierIndex = LOYALTY_TIERS.findIndex((t) => t.tier === profile.currentTier)
  const nextTierConfig = LOYALTY_TIERS[currentTierIndex + 1]

  const style = TIER_STYLES[profile.currentTier] || TIER_STYLES.Bronze

  const progressPercent = nextTierConfig
    ? Math.min(
        100,
        Math.round(
          ((profile.totalRevenue - currentTierConfig.minRevenue) /
            (nextTierConfig.minRevenue - currentTierConfig.minRevenue)) *
            100
        )
      )
    : 100

  return (
    <Card className="border-border/60 overflow-hidden shadow-md transition-shadow hover:shadow-lg">
      <CardContent className="flex flex-col gap-5 p-5">
        {/* Current tier banner */}
        <div
          className={cn(
            'flex items-center gap-4 rounded-2xl px-5 py-4 border transition-all duration-300 hover:brightness-105',
            style.cardBg,
            style.borderColor
          )}
        >
          <Trophy className={cn('h-11 w-11 shrink-0 transition-transform duration-300 hover:scale-110', style.trophy)} aria-hidden />
          <div>
            <p className={cn('text-2xl font-black tracking-tight', style.text)}>
              {profile.currentTier}
            </p>
            <p className="text-xs font-medium text-muted-foreground/80 mt-0.5">Hạng thành viên hiện tại</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-3xl font-black text-foreground tracking-tight">
              {profile.currentPoints.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-muted-foreground/80 mt-0.5">điểm tích lũy</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-center transition-colors hover:bg-muted/30">
            <p className="text-2xl font-bold text-primary">{currentTierConfig.discountRate}%</p>
            <p className="text-xs text-muted-foreground/90 mt-0.5 font-medium">Chiết khấu đơn hàng</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-center transition-colors hover:bg-muted/30">
            <p className="text-2xl font-bold text-primary">×{currentTierConfig.bonusRate}</p>
            <p className="text-xs text-muted-foreground/90 mt-0.5 font-medium">Hệ số điểm thưởng</p>
          </div>
        </div>

        {/* Tier progress */}
        {nextTierConfig ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className={cn('font-bold', style.text)}>
                {profile.currentTier}
              </span>
              <span className={cn('font-bold', TIER_STYLES[nextTierConfig.tier]?.text)}>
                {nextTierConfig.tier}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2.5 bg-muted" />
            <div className="mt-1.5 flex justify-between text-[10px] font-semibold text-muted-foreground/80">
              <span>{formatVND(profile.totalRevenue)}</span>
              <span>{progressPercent}%</span>
              <span>{formatVND(nextTierConfig.minRevenue)}</span>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Cần thêm{' '}
              <span className="font-semibold text-foreground">
                {formatVND(nextTierConfig.minRevenue - profile.totalRevenue)}
              </span>{' '}
              doanh thu để đạt hạng{' '}
              <span className={cn('font-semibold', TIER_STYLES[nextTierConfig.tier]?.text)}>
                {nextTierConfig.tier}
              </span>{' '}
              ({nextTierConfig.discountRate}% chiết khấu)
            </p>
          </div>
        ) : (
          <p className="text-center text-sm font-bold text-muted-foreground py-2">
            🏆 Bạn đang ở hạng cao nhất!
          </p>
        )}

        <Separator className="bg-border/60" />

        {/* All tiers overview */}
        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Bảng hạng thành viên</p>
          <div className="flex flex-col gap-2">
            {LOYALTY_TIERS.map((tier) => {
              const isCurrent = tier.tier === profile.currentTier
              const tierStyle = TIER_STYLES[tier.tier] || TIER_STYLES.Bronze
              return (
                <div
                  key={tier.tier}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-2.5 border transition-all duration-300',
                    isCurrent 
                      ? `${tierStyle.cardBg} ${tierStyle.borderColor} shadow-sm` 
                      : 'border-transparent hover:bg-muted/10'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Trophy className={cn('h-4 w-4', tierStyle.trophy)} aria-hidden />
                    <span className={cn('text-sm font-semibold', isCurrent ? tierStyle.text : 'text-foreground/90')}>
                      {tier.tier}
                    </span>
                    {isCurrent && (
                      <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-black text-white shadow-sm', tierStyle.badgeBg)}>
                        Bạn
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span>{tier.discountRate}% CK</span>
                    <span>×{tier.bonusRate} điểm</span>
                    <span className="text-right font-semibold text-foreground/80 w-24">
                      {tier.maxRevenue
                        ? `${(tier.minRevenue / 1e6).toFixed(0)}–${(tier.maxRevenue / 1e6).toFixed(0)}M`
                        : `>${(tier.minRevenue / 1e6).toFixed(0)}M`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

