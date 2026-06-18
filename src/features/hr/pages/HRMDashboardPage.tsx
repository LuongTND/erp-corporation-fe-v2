import { Bell, Search } from 'lucide-react'
import { HRPageHeader } from '../components/HRPageHeader'
import { HRMDashboardInsightsRow } from '../components/dashboard/HRMDashboardInsightsRow'
import { HRMDashboardKpiSnapshot } from '../components/dashboard/HRMDashboardKpiSnapshot'
import { HRMDashboardPeopleRow } from '../components/dashboard/HRMDashboardPeopleRow'
import { HRMDashboardStatCards } from '../components/dashboard/HRMDashboardStatCards'

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HRMDashboardPage() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <HRPageHeader
        breadcrumbs={[
          { label: 'Modules' },
          { label: 'HR & Payroll', isActive: true },
        ]}
        trailingContent={(
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground bg-transparent transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
            >
              <Search className="h-3.5 w-3.5" />
              Search employees
            </button>
            <button
              type="button"
              className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
          </div>
        )}
      />

      <main className="max-w-7xl mx-auto p-8 space-y-6">
        <div>
          <h1
            className="text-[22px] font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'Lora, Georgia, serif', letterSpacing: '-0.3px' }}
          >
            HR &amp; Payroll Dashboard
          </h1>
          <p className="text-sm mt-0.5 text-muted-foreground">
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
