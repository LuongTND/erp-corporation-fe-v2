import { ShoppingCart, DollarSign, Star, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { CustomerDashboardStat } from '../../types/customer-portal.types'

const ICONS = [ShoppingCart, DollarSign, Star, TrendingUp]

interface CustomerStatsRowProps {
  readonly stats: CustomerDashboardStat[]
}

export function CustomerStatsRow({ stats }: CustomerStatsRowProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = ICONS[index % ICONS.length]
        return (
          <Card key={stat.label} className="border-border/60 transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)] cursor-pointer group">
            <CardContent className="px-5 py-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground tracking-wide">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-350">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground/80">{stat.subtitle}</p>
                </div>
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-inner transition-transform duration-300 group-hover:rotate-6"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon className="h-5 w-5" style={{ color: stat.iconColor }} aria-hidden />
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
