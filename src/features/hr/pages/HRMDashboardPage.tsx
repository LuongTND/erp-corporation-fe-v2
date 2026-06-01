import { Bell, Search } from 'lucide-react'
import { HRPageHeader } from '../components/HRPageHeader'
import { HRMDashboardInsightsRow } from '../components/dashboard/HRMDashboardInsightsRow'
import { HRMDashboardKpiSnapshot } from '../components/dashboard/HRMDashboardKpiSnapshot'
import { HRMDashboardPeopleRow } from '../components/dashboard/HRMDashboardPeopleRow'
import { HRMDashboardStatCards } from '../components/dashboard/HRMDashboardStatCards'

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HRMDashboardPage() {
  return (
    <div className="min-h-full" style={{ backgroundColor: '#FAFAF8' }}>
      <HRPageHeader
        breadcrumbs={[
          { label: 'Modules' },
          { label: 'HR & Payroll', isActive: true },
        ]}
        trailingContent={(
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs font-medium transition-colors duration-150 hover:bg-white"
              style={{ borderColor: '#E8E8E6', color: '#6B6B6B', backgroundColor: 'transparent' }}
            >
              <Search className="h-3.5 w-3.5" />
              Search employees
            </button>
            <button
              type="button"
              className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-150 hover:bg-white"
              style={{ borderColor: '#E8E8E6' }}
            >
              <Bell className="h-4 w-4" style={{ color: '#6B6B6B' }} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#E8784A' }} />
            </button>
          </div>
        )}
      />

      <main className="max-w-7xl mx-auto p-8 space-y-6">
        <div>
          <h1
            className="text-[22px] font-semibold tracking-tight"
            style={{ fontFamily: 'Lora, Georgia, serif', color: '#1A1A1A', letterSpacing: '-0.3px' }}
          >
            HR &amp; Payroll Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#9A9A9A' }}>
            Overview · Week of 26 May 2025
          </p>
        </div>
        <HRMDashboardStatCards />
        <HRMDashboardInsightsRow />
        <HRMDashboardPeopleRow />
        <HRMDashboardKpiSnapshot />

      </main>
    </div>
  )
}
