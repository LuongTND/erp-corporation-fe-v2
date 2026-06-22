import { useState, useEffect } from 'react'
import { Copy, CheckCheck, Gift, Percent, Package, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { CustomerPromotion, PromotionType } from '../../types/customer-portal.types'

const TYPE_CONFIG: Record<PromotionType, { label: string; Icon: typeof Gift; iconColor: string; bgColor: string }> = {
  discount: { label: 'Giảm giá', Icon: Percent, iconColor: '#E8784A', bgColor: 'rgba(232,120,74,0.12)' },
  bundle: { label: 'Mua kèm', Icon: Package, iconColor: '#1A6EA8', bgColor: '#E8F4FD' },
  gift: { label: 'Tặng quà', Icon: Gift, iconColor: '#B7770D', bgColor: '#FEF6E4' },
  cashback: { label: 'Hoàn tiền', Icon: DollarSign, iconColor: '#3B6D11', bgColor: '#EAF3DE' },
}

function useCountdown(expiresAt: string) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('Đã hết hạn'); return }
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      if (days > 0) setTimeLeft(`Còn ${days}n ${hours}h`)
      else setTimeLeft(`Còn ${hours}h ${minutes}p`)
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [expiresAt])

  return timeLeft
}

interface PromotionCardProps {
  readonly promotion: CustomerPromotion
}

export function PromotionCard({ promotion }: PromotionCardProps) {
  const [copied, setCopied] = useState(false)
  const timeLeft = useCountdown(promotion.expiresAt)
  const typeConfig = TYPE_CONFIG[promotion.type]
  const Icon = typeConfig.Icon

  const handleCopy = () => {
    navigator.clipboard.writeText(promotion.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const isExpired = new Date(promotion.expiresAt) < new Date()

  return (
    <Card
      className={cn(
        'border-border transition-opacity',
        (promotion.isUsed || isExpired) && 'opacity-60'
      )}
    >
      <CardContent className="flex flex-col gap-3 p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: typeConfig.bgColor }}
            >
              <Icon className="h-4 w-4" style={{ color: typeConfig.iconColor }} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-snug">{promotion.title}</p>
              <Badge variant="secondary" className="mt-0.5 text-[10px]">
                {typeConfig.label}
              </Badge>
            </div>
          </div>
          {promotion.isPersonalized && (
            <Badge className="shrink-0 border-0 bg-primary/10 text-[10px] text-primary hover:bg-primary/10">
              Cá nhân hóa
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">{promotion.description}</p>

        {/* Min order */}
        {promotion.minOrderValue && (
          <p className="text-[11px] text-muted-foreground">
            Đơn tối thiểu:{' '}
            <span className="font-medium text-foreground">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                promotion.minOrderValue
              )}
            </span>
          </p>
        )}

        {/* Countdown */}
        <p
          className={cn(
            'text-[11px] font-medium',
            isExpired ? 'text-[#C0392B]' : 'text-[#B7770D]'
          )}
        >
          {isExpired ? 'Đã hết hạn' : timeLeft}
        </p>

        {/* Code + Copy button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-md border border-dashed border-border bg-muted/40 px-3 py-1.5 text-center font-mono text-sm font-bold tracking-widest text-primary">
            {promotion.code}
          </div>
          {!promotion.isUsed && !isExpired && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1"
              onClick={handleCopy}
              aria-label={`Sao chép mã ${promotion.code}`}
            >
              {copied ? (
                <>
                  <CheckCheck className="h-3.5 w-3.5 text-[#3B6D11]" aria-hidden />
                  <span className="text-[#3B6D11]">Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  Sao chép
                </>
              )}
            </Button>
          )}
          {promotion.isUsed && (
            <Badge className="border-0 bg-[#F0F0EE] text-xs text-[#6B6B6B] hover:bg-[#F0F0EE]">
              Đã dùng
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
