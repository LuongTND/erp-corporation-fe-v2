// ─── Mock data ────────────────────────────────────────────────────────────────

const DEPTS = [
  { name: 'Engineering', score: 84.2 },
  { name: 'Product',     score: 79.5 },
  { name: 'Design',      score: 77.1 },
  { name: 'HR',          score: 72.6 },
  { name: 'Finance',     score: 68.3 },
  { name: 'Sales',       score: 65.8 },
]

const scoreColor = (s: number) =>
  s >= 75 ? '#5db872' : s >= 60 ? '#e8a55a' : '#c64545'

// ─── Component ────────────────────────────────────────────────────────────────

export function KpiDeptPerformance() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
      <h3 className="text-sm font-semibold text-[#141413] mb-5">Avg. Score by Department</h3>

      <div className="space-y-4">
        {DEPTS.map((dept) => {
          const color = scoreColor(dept.score)
          return (
            <div key={dept.name} className="flex items-center gap-3">
              <span className="text-sm text-[#6c6a64] w-24 shrink-0">{dept.name}</span>
              <div className="flex-1 bg-[#f5f0e8] rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full"
                  style={{ width: `${dept.score}%`, backgroundColor: color }}
                />
              </div>
              <span
                className="text-sm font-semibold w-10 text-right shrink-0"
                style={{ color }}
              >
                {dept.score}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
