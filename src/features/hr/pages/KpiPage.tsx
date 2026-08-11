import { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { KpiStatCards } from '@/features/hr/components/KpiPage/KpiStatCards'
import { KpiScoreDistribution } from '@/features/hr/components/KpiPage/KpiScoreDistribution'
import { KpiDeptPerformance } from '@/features/hr/components/KpiPage/KpiDeptPerformance'
import { KpiReviewTable } from '@/features/hr/components/KpiPage/KpiReviewTable'

const CYCLES = ['Q2 2025', 'Q1 2025', 'Q4 2024', 'Q3 2024']

export default function KpiPage() {
  const [cycle, setCycle] = useState('Q2 2025')

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">

        {/* Page header */}
        <div className="shrink-0 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">KPI & Hiệu suất</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Theo dõi và đánh giá hiệu suất nhân viên</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Select value={cycle} onValueChange={setCycle}>
              <SelectTrigger
                className="h-9 w-[130px] text-sm border border-border font-medium rounded-lg px-3 cursor-pointer bg-card text-foreground"
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
              className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors duration-150 bg-primary hover:bg-primary/80"
            >
              <Plus className="w-4 h-4" />
              Tạo chu kỳ đánh giá
            </button>

            <button
              type="button"
              className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium border border-border cursor-pointer transition-colors duration-150 hover:bg-muted/50 bg-card text-foreground"
            >
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Section 1 — stat cards */}
        <div className="shrink-0"><KpiStatCards /></div>

        {/* Section 2 — two-column charts */}
        <div className="shrink-0 grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-4">
          <KpiScoreDistribution />
          <KpiDeptPerformance />
        </div>

        {/* Section 3 — review table */}
        <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
          <KpiReviewTable />
        </div>

      </div>
    </div>
  )
}
