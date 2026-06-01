import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

// ─── Mock data ────────────────────────────────────────────────────────────────

const DEPT_DATA = [
  { dept: 'Engineering', baseSalary: 82, allowances: 9,   overtime: 5.5, bonus: 5   },
  { dept: 'Design',      baseSalary: 54, allowances: 6,   overtime: 1.2, bonus: 3   },
  { dept: 'HR',          baseSalary: 38, allowances: 4,   overtime: 0.3, bonus: 2   },
  { dept: 'Product',     baseSalary: 62, allowances: 7,   overtime: 3.0, bonus: 4   },
  { dept: 'Finance',     baseSalary: 30, allowances: 3,   overtime: 0.5, bonus: 1.5 },
]

const SEGMENT_COLORS = {
  baseSalary: '#cc785c',
  allowances: '#5db872',
  overtime:   '#e8a55a',
  bonus:      '#5db8a6',
}

const SEGMENT_LABELS: Record<keyof typeof SEGMENT_COLORS, string> = {
  baseSalary: 'Base Salary',
  allowances: 'Allowances',
  overtime:   'Overtime',
  bonus:      'Bonus',
}

const PIE_DATA = [
  { name: 'Base Salary', value: 266 },
  { name: 'Allowances',  value: 29  },
  { name: 'Overtime',    value: 10.5 },
  { name: 'Bonus',       value: 15.5 },
]

const PIE_COLORS = Object.values(SEGMENT_COLORS)

// ─── Component ────────────────────────────────────────────────────────────────

export function PayrollBreakdownChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-[#141413] mb-5">Pay Components Breakdown</h3>

      <div className="grid grid-cols-[1fr_220px] gap-6 items-center">
        {/* Stacked bar chart */}
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={DEPT_DATA} barSize={36} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe3" vertical={false} />
            <XAxis
              dataKey="dept"
              tick={{ fontSize: 11, fill: '#8e8b82' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#8e8b82' }}
              axisLine={false}
              tickLine={false}
              unit="M"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e6dfd8',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(val: number) => [`₫${val.toFixed(1)}M`]}
            />
            <Bar dataKey="baseSalary" stackId="a" fill={SEGMENT_COLORS.baseSalary} name="Base Salary" radius={[0, 0, 4, 4]} />
            <Bar dataKey="allowances" stackId="a" fill={SEGMENT_COLORS.allowances} name="Allowances" />
            <Bar dataKey="overtime"   stackId="a" fill={SEGMENT_COLORS.overtime}   name="Overtime" />
            <Bar dataKey="bonus"      stackId="a" fill={SEGMENT_COLORS.bonus}      name="Bonus" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Donut chart */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-[180px] h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {PIE_DATA.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e6dfd8',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(val: number) => [`₫${val.toFixed(1)}M`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] text-[#8e8b82]">Total</p>
              <p className="text-sm font-bold text-[#141413]">₫321M</p>
            </div>
          </div>
          <p className="text-[10px] text-[#8e8b82] text-center">All departments</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[#f0ebe3]">
        {(Object.entries(SEGMENT_COLORS) as [keyof typeof SEGMENT_COLORS, string][]).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
            <span className="text-xs text-[#6c6a64]">{SEGMENT_LABELS[key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
