import { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { KpiStatCards } from '@/features/hr/components/kpi/KpiStatCards'
import { KpiScoreDistribution } from '@/features/hr/components/kpi/KpiScoreDistribution'
import { KpiDeptPerformance } from '@/features/hr/components/kpi/KpiDeptPerformance'
import { KpiReviewTable } from '@/features/hr/components/kpi/KpiReviewTable'

const CYCLES = ['Q2 2025', 'Q1 2025', 'Q4 2024', 'Q3 2024']

export default function KpiPage() {
  const [cycle, setCycle] = useState('Q2 2025')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf9f5' }}>
      <div className="max-w-7xl mx-auto p-8 space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#141413]">KPI & Performance</h1>
            <p className="text-sm text-[#8e8b82] mt-0.5">Track and evaluate employee performance metrics</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Select value={cycle} onValueChange={setCycle}>
              <SelectTrigger
                className="h-9 text-sm border font-medium rounded-lg px-3 cursor-pointer"
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#e6dfd8',
                  color: '#3d3d3a',
                  width: 130,
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CYCLES.map((c) => (
                  <SelectItem key={c} value={c} className="text-sm cursor-pointer">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              type="button"
              className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors duration-150 hover:opacity-90"
              style={{ backgroundColor: '#cc785c' }}
            >
              <Plus className="w-4 h-4" />
              Create Review Cycle
            </button>

            <button
              type="button"
              className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium border cursor-pointer transition-colors duration-150 hover:bg-[#f5f0e8]"
              style={{ borderColor: '#e6dfd8', color: '#3d3d3a', backgroundColor: '#fff' }}
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Section 1 — stat cards */}
        <KpiStatCards />

        {/* Section 2 — two-column charts */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-4">
          <KpiScoreDistribution />
          <KpiDeptPerformance />
        </div>

        {/* Section 3 — review table */}
        <KpiReviewTable />

      </div>
    </div>
  )
}
