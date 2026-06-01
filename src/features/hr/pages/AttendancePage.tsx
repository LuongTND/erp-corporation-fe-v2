import { useState } from 'react'
import { Download, Upload, CalendarDays } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { AttendanceStatCards } from '../components/attendance/AttendanceStatCards'
import { AttendanceTable } from '../components/attendance/AttendanceTable'
import { AttendanceCalendarHeatmap } from '../components/attendance/AttendanceCalendarHeatmap'
import { LateOvertimeCharts } from '../components/attendance/LateOvertimeCharts'
import { ManualCorrectionTable } from '../components/attendance/ManualCorrectionTable'

export default function AttendancePage() {
  const [calOpen, setCalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 4, 1))

  const monthLabel = selectedDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-full" style={{ backgroundColor: '#faf9f5' }}>

      {/* Page header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-8 h-14 border-b"
        style={{ backgroundColor: '#faf9f5', borderColor: '#e6dfd8' }}
      >
        <h1 className="text-lg font-semibold text-[#141413]">Attendance</h1>

        <div className="flex items-center gap-2.5">
          {/* Month picker */}
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-[#e6dfd8] bg-white text-[#3d3d3a] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
              >
                <CalendarDays className="w-4 h-4 text-[#8e8b82]" />
                {monthLabel}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => { if (d) { setSelectedDate(d); setCalOpen(false) } }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Department filter */}
          <Select defaultValue="all">
            <SelectTrigger
              className="w-[160px] h-9 text-sm border-[#e6dfd8] bg-white text-[#3d3d3a] cursor-pointer"
            >
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>

          {/* Export */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-[#e6dfd8] bg-white text-[#6c6a64] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>

          {/* Import */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-[#e6dfd8] bg-white text-[#6c6a64] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Import Timesheets
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-8 space-y-6">

        {/* Section 1 — stat cards */}
        <AttendanceStatCards />

        {/* Section 2 — table + calendar (65/35) */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
          <AttendanceTable />
          <AttendanceCalendarHeatmap />
        </div>

        {/* Section 3 — charts */}
        <LateOvertimeCharts />

        {/* Section 4 — manual corrections */}
        <ManualCorrectionTable />

      </main>
    </div>
  )
}
