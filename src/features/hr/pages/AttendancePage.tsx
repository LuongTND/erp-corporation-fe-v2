import { useState } from 'react'
import { Download, Upload, CalendarDays } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { AttendanceStatCards } from '../components/AttendancePage/AttendanceStatCards'
import { AttendanceTable } from '../components/AttendancePage/AttendanceTable'
import { AttendanceCalendarHeatmap } from '../components/AttendancePage/AttendanceCalendarHeatmap'
import { LateOvertimeCharts } from '../components/AttendancePage/LateOvertimeCharts'
import { ManualCorrectionTable } from '../components/AttendancePage/ManualCorrectionTable'

export default function AttendancePage() {
  const [calOpen, setCalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 4, 1))

  const monthLabel = selectedDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })

  return (
    <div className="h-full flex flex-col bg-background text-foreground">

      {/* Page header */}
      <header
        className="shrink-0 sticky top-0 z-10 flex items-center justify-between px-8 h-14 border-b bg-card border-border"
      >
        <h1 className="text-lg font-semibold text-foreground">Chấm công</h1>

        <div className="flex items-center gap-2.5">
          {/* Month picker */}
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-card text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                {monthLabel}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => { if (d) { setSelectedDate(d); setCalOpen(false) } }}
              />
            </PopoverContent>
          </Popover>

          {/* Department filter */}
          <Select defaultValue="all">
            <SelectTrigger
              className="w-[160px] h-9 text-sm border-border bg-card text-foreground cursor-pointer"
            >
              <SelectValue placeholder="Phòng ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phòng ban</SelectItem>
              <SelectItem value="product">Sản phẩm</SelectItem>
              <SelectItem value="engineering">Kỹ thuật</SelectItem>
              <SelectItem value="design">Thiết kế</SelectItem>
              <SelectItem value="hr">Nhân sự</SelectItem>
              <SelectItem value="finance">Tài chính</SelectItem>
              <SelectItem value="sales">Kinh doanh</SelectItem>
            </SelectContent>
          </Select>

          {/* Export */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>

          {/* Import */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Nhập bảng chấm công
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">

        {/* Section 1 — stat cards */}
        <div className="shrink-0"><AttendanceStatCards /></div>

        {/* Section 2 — table + calendar (65/35) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
          <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
            <AttendanceTable />
          </div>
          <AttendanceCalendarHeatmap />
        </div>

        {/* Section 3 — charts */}
        <div className="shrink-0"><LateOvertimeCharts /></div>

        {/* Section 4 — manual corrections */}
        <div className="shrink-0"><ManualCorrectionTable /></div>

      </div>
    </div>
  )
}
