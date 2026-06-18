import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts'

// ─── Mock data ────────────────────────────────────────────────────────────────

const LATE_DATA = [
  { day: 'Mon', count: 4 },
  { day: 'Tue', count: 2 },
  { day: 'Wed', count: 7 },
  { day: 'Thu', count: 3 },
  { day: 'Fri', count: 5 },
]

const OT_DATA = [
  { date: 'May 1',  hours: 1.5 },
  { date: 'May 5',  hours: 2.0 },
  { date: 'May 8',  hours: 3.5 },
  { date: 'May 12', hours: 1.0 },
  { date: 'May 15', hours: 4.5 },
  { date: 'May 19', hours: 2.5 },
  { date: 'May 22', hours: 6.0 },
  { date: 'May 26', hours: 3.0 },
]

const LATE_AVERAGE = LATE_DATA.reduce((s, d) => s + d.count, 0) / LATE_DATA.length

const TOTAL_OT = OT_DATA.reduce((s, d) => s + d.hours, 0)

// ─── Component ────────────────────────────────────────────────────────────────

export function LateOvertimeCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Late arrivals */}
      <div className="bg-card rounded-xl shadow-sm p-5 text-muted-foreground">
        <h3 className="text-sm font-semibold text-foreground mb-4">Late Arrivals by Day</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={LATE_DATA} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.12} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: 8,
                fontSize: 12,
                color: 'oklch(var(--foreground))',
              }}
              cursor={{ fill: 'oklch(var(--muted) / 0.5)' }}
            />
            <ReferenceLine
              y={LATE_AVERAGE}
              stroke="currentColor"
              strokeOpacity={0.4}
              strokeDasharray="4 3"
              label={{ value: `Avg ${LATE_AVERAGE.toFixed(1)}`, fontSize: 10, fill: 'currentColor', position: 'right' }}
            />
            <Bar dataKey="count" fill="#e8a55a" radius={[4, 4, 0, 0]} name="Late arrivals" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Overtime hours */}
      <div className="bg-card rounded-xl shadow-sm p-5 text-muted-foreground">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Overtime Hours</h3>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/12 dark:bg-green-500/20 text-green-700 dark:text-green-400">
            Total OT: {TOTAL_OT.toFixed(0)}h this month
          </span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={OT_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="otFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#5db872" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#5db872" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.12} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: 8,
                fontSize: 12,
                color: 'oklch(var(--foreground))',
              }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="oklch(var(--primary))"
              strokeWidth={2}
              fill="url(#otFill)"
              name="OT hours"
              dot={{ fill: 'oklch(var(--primary))', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: 'oklch(var(--primary))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
