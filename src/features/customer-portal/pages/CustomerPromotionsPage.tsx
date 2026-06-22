import { useState } from 'react'
import { Filter } from 'lucide-react'
import { PromotionCard } from '../components/customer-promotions/PromotionCard'
import { MOCK_CUSTOMER_PROMOTIONS } from '../mocks/customer-promotions.mock'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PromotionType } from '../types/customer-portal.types'

type FilterType = 'all' | PromotionType | 'used' | 'expired'

export default function CustomerPromotionsPage() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredPromotions = MOCK_CUSTOMER_PROMOTIONS.filter((promo) => {
    const isExpired = new Date(promo.expiresAt) < new Date()
    
    if (filter === 'all') return !promo.isUsed && !isExpired
    if (filter === 'used') return promo.isUsed
    if (filter === 'expired') return isExpired && !promo.isUsed
    
    return promo.type === filter && !promo.isUsed && !isExpired
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Ưu đãi của tôi</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Quản lý các mã giảm giá và ưu đãi đặc quyền dành cho bạn
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="rounded-full"
        >
          Khả dụng
        </Button>
        <Button
          variant={filter === 'discount' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('discount')}
          className="rounded-full"
        >
          Giảm giá
        </Button>
        <Button
          variant={filter === 'bundle' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('bundle')}
          className="rounded-full"
        >
          Mua kèm
        </Button>
        <Button
          variant={filter === 'gift' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('gift')}
          className="rounded-full"
        >
          Quà tặng
        </Button>
        <Button
          variant={filter === 'cashback' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('cashback')}
          className="rounded-full"
        >
          Hoàn tiền
        </Button>
        
        <div className="mx-2 h-4 w-px bg-border" />
        
        <Button
          variant={filter === 'used' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('used')}
          className="rounded-full text-muted-foreground"
        >
          Đã dùng
        </Button>
        <Button
          variant={filter === 'expired' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('expired')}
          className="rounded-full text-muted-foreground"
        >
          Hết hạn
        </Button>
      </div>

      {/* Grid */}
      {filteredPromotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promo) => (
            <PromotionCard key={promo.id} promotion={promo} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-3">
            <Filter className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-base font-medium text-foreground">Không có ưu đãi nào</p>
          <p className="text-sm text-muted-foreground">Thử thay đổi bộ lọc hoặc quay lại sau</p>
        </div>
      )}
    </div>
  )
}
