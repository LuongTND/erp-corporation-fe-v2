import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  attendanceOverviewData,
  departmentHeadcountData,
  totalHeadcount,
} from '../../types/hr-dashboard.types'

interface AttendanceTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function AttendanceTooltip({ active, payload, label }: AttendanceTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="min-w-[120px] rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-slate-700">{label}</p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-500">{item.name}</span>
          </div>
          <span className="text-xs font-medium text-slate-800">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export function HRMDashboardInsightsRow() {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-3 rounded-xl border bg-white p-6 shadow-sm" style={{ borderColor: '#F0EDE8' }}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>Attendance This Week</h2>
          <span className="text-xs" style={{ color: '#9A9A9A' }}>19-24 May 2025</span>
        </div>

        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={attendanceOverviewData} barGap={3} barCategoryGap="32%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
            <Tooltip content={<AttendanceTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
            <Bar dataKey="present" name="Present" fill="#6366f1" radius={[3, 3, 0, 0]} />
            <Bar dataKey="absent" name="Absent/Leave" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-xs" style={{ color: '#6B6B6B' }}>
              Present <strong style={{ color: '#1A1A1A' }}>799</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-xs" style={{ color: '#6B6B6B' }}>
              Late <strong style={{ color: '#1A1A1A' }}>24</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="text-xs" style={{ color: '#6B6B6B' }}>
              Absent <strong style={{ color: '#1A1A1A' }}>51</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="col-span-2 rounded-xl border bg-white p-6 shadow-sm" style={{ borderColor: '#F0EDE8' }}>
        <h2 className="mb-4 text-sm font-semibold" style={{ color: '#1A1A1A' }}>Headcount by Department</h2>

        <div className="relative flex justify-center">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={departmentHeadcountData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={2}
                strokeWidth={0}
              >
                {departmentHeadcountData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: '#0F172A' }}>{totalHeadcount}</span>
            <span className="text-xs" style={{ color: '#9A9A9A' }}>Employees</span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {departmentHeadcountData.map((department) => (
            <div key={department.name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: department.color }} />
              <span className="flex-1 truncate text-sm" style={{ color: '#3d3d3a' }}>{department.name}</span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
              >
                {department.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
