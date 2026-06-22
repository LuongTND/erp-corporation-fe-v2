import { LoyaltyTierCard } from '../components/customer-loyalty/LoyaltyTierCard'
import { TransactionHistoryTable } from '../components/customer-loyalty/TransactionHistoryTable'
import { MOCK_CUSTOMER_LOYALTY, MOCK_LOYALTY_TRANSACTIONS } from '../mocks/customer-loyalty.mock'

export default function CustomerLoyaltyPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Hạng thành viên & Điểm thưởng</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Theo dõi tiến trình hạng thành viên và lịch sử điểm thưởng của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tier overview */}
        <div className="lg:col-span-1">
          <LoyaltyTierCard profile={MOCK_CUSTOMER_LOYALTY} />
        </div>

        {/* Right: Transactions */}
        <div className="lg:col-span-2">
          <TransactionHistoryTable transactions={MOCK_LOYALTY_TRANSACTIONS} />
        </div>
      </div>
    </div>
  )
}
