import type { CustomerLoyaltyProfile, LoyaltyTierConfig, LoyaltyTransaction } from '../types/customer-portal.types'

export const LOYALTY_TIERS: LoyaltyTierConfig[] = [
  { tier: 'Bronze', minRevenue: 0, maxRevenue: 50000000, discountRate: 5, bonusRate: 1, color: '#CD7F32', bgColor: '#FDF3E3' },
  { tier: 'Silver', minRevenue: 50000000, maxRevenue: 150000000, discountRate: 7, bonusRate: 1.5, color: '#9E9E9E', bgColor: '#F5F5F5' },
  { tier: 'Gold', minRevenue: 150000000, maxRevenue: 350000000, discountRate: 10, bonusRate: 2, color: '#F5A623', bgColor: '#FFF8E7' },
  { tier: 'Platinum', minRevenue: 350000000, discountRate: 15, bonusRate: 3, color: '#5B4FCF', bgColor: '#F0EEFF' },
]

export const MOCK_CUSTOMER_LOYALTY: CustomerLoyaltyProfile = {
  currentTier: 'Gold',
  totalRevenue: 215000000,
  currentPoints: 4320,
  nextTierRevenue: 350000000,
  discountRate: 10,
}

export const MOCK_LOYALTY_TRANSACTIONS: LoyaltyTransaction[] = [
  { id: 'lt-001', date: '2024-10-01', description: 'Tích điểm đơn hàng', orderNumber: 'DH-2024-0891', amount: 11250000, points: 1125, type: 'earned' },
  { id: 'lt-002', date: '2024-10-08', description: 'Tích điểm đơn hàng', orderNumber: 'DH-2024-0924', amount: 8312500, points: 831, type: 'earned' },
  { id: 'lt-003', date: '2024-10-10', description: 'Bonus doanh số tháng 9', orderNumber: undefined, amount: 0, points: 500, type: 'bonus' },
  { id: 'lt-004', date: '2024-10-12', description: 'Tích điểm đơn hàng', orderNumber: 'DH-2024-0951', amount: 14040000, points: 1404, type: 'earned' },
  { id: 'lt-005', date: '2024-10-05', description: 'Đổi điểm giảm giá', orderNumber: 'DH-2024-0891', amount: 0, points: -500, type: 'redeemed' },
  { id: 'lt-006', date: '2024-09-30', description: 'Điểm thưởng Sự kiện Trung Thu', orderNumber: undefined, amount: 0, points: 300, type: 'bonus' },
  { id: 'lt-007', date: '2024-09-15', description: 'Tích điểm đơn hàng', orderNumber: 'DH-2024-0820', amount: 3500000, points: 350, type: 'earned' },
  { id: 'lt-008', date: '2024-08-31', description: 'Điểm hết hạn', orderNumber: undefined, amount: 0, points: -200, type: 'expired' },
]
