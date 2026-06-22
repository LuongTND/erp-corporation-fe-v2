// ── Customer Portal Domain Types ──────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

export type PromotionType = 'discount' | 'bundle' | 'gift' | 'cashback'

// ── Order ─────────────────────────────────────────────────────────────────

export interface OrderProduct {
  readonly id: string
  readonly name: string
  readonly sku: string
  readonly quantity: number
  readonly unitPrice: number
  readonly totalPrice: number
  readonly unit: string
}

export interface OrderTrackingStep {
  readonly status: OrderStatus
  readonly label: string
  readonly description: string
  readonly timestamp?: string
  readonly completed: boolean
  readonly current: boolean
}

export interface CustomerOrder {
  readonly id: string
  readonly orderNumber: string
  readonly status: OrderStatus
  readonly createdAt: string
  readonly updatedAt: string
  readonly deliveryDate?: string
  readonly products: readonly OrderProduct[]
  readonly totalAmount: number
  readonly discount: number
  readonly finalAmount: number
  readonly note?: string
  readonly shippingAddress: string
}

export interface CreateOrderFormData {
  products: {
    productId: string
    quantity: number
  }[]
  shippingAddress: string
  note?: string
}

// ── Loyalty ───────────────────────────────────────────────────────────────

export interface LoyaltyTierConfig {
  readonly tier: LoyaltyTier
  readonly minRevenue: number
  readonly maxRevenue?: number
  readonly discountRate: number
  readonly bonusRate: number
  readonly color: string
  readonly bgColor: string
}

export interface LoyaltyTransaction {
  readonly id: string
  readonly date: string
  readonly description: string
  readonly orderNumber?: string
  readonly amount: number
  readonly points: number
  readonly type: 'earned' | 'redeemed' | 'bonus' | 'expired'
}

export interface CustomerLoyaltyProfile {
  readonly currentTier: LoyaltyTier
  readonly totalRevenue: number
  readonly currentPoints: number
  readonly nextTierRevenue?: number
  readonly discountRate: number
}

// ── Promotion ─────────────────────────────────────────────────────────────

export interface CustomerPromotion {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly type: PromotionType
  readonly discountValue: number
  readonly discountType: 'percent' | 'fixed'
  readonly minOrderValue?: number
  readonly expiresAt: string
  readonly isPersonalized: boolean
  readonly isUsed: boolean
  readonly code: string
}

// ── Dashboard ─────────────────────────────────────────────────────────────

export interface CustomerDashboardStat {
  readonly label: string
  readonly value: string | number
  readonly subtitle: string
  readonly iconColor: string
  readonly bgColor: string
}
