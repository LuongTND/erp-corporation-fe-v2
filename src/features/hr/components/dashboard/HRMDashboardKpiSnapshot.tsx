import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { departmentKpiData, getDepartmentKpiColor } from '../../types/hr-dashboard.types'

interface KpiLabelProps {
  x?: number
  y?: number
  width?: number
  value?: number
}

function KpiLabel({ x = 0, y = 0, width = 0, value = 0 }: KpiLabelProps) {
  return (
    <text
      x={x + width + 6}
      y={y + 9}
      fill={getDepartmentKpiColor(value)}
      fontSize={11}
      fontWeight={600}
      dominantBaseline="middle"
    >
      {value}%
    </text>
  )
}

export function HRMDashboardKpiSnapshot() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm" style={{ borderColor: '#F0EDE8' }}>
      <div className="mb-6 flex items-start justify-between">
        <h2 className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
          KPI Performance - Q2 2025
        </h2>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            On Track · 4 depts
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            At Risk · 2 depts
          </span>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
            Below Target · 1 dept
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={departmentKpiData.length * 46}>
        <BarChart
          data={departmentKpiData}
          layout="vertical"
          barCategoryGap="28%"
          margin={{ top: 0, right: 60, bottom: 0, left: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            type="category"
            dataKey="dept"
            tick={{ fontSize: 12, fill: '#475569' }}
            axisLine={false}
            tickLine={false}
            width={76}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null

              const rawValue = payload[0].value
              if (typeof rawValue !== 'number') return null

              return (
                <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs shadow-lg">
                  <span className="font-semibold" style={{ color: getDepartmentKpiColor(rawValue) }}>{rawValue}%</span>
                  <span className="ml-1 text-slate-500">completion</span>
                </div>
              )
            }}
          />
          <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
            {departmentKpiData.map((entry) => (
              <Cell key={entry.dept} fill={getDepartmentKpiColor(entry.pct)} />
            ))}
            <LabelList content={<KpiLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
