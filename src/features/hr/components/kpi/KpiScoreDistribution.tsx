// ─── Mock data ────────────────────────────────────────────────────────────────

const BANDS = [
  { label: 'Excellent',      range: '90–100', count: 18, color: '#5db872' },
  { label: 'Good',           range: '75–89',  count: 34, color: '#5db8a6' },
  { label: 'Meets Target',   range: '60–74',  count: 28, color: '#cc785c' },
  { label: 'Improvement',    range: '40–59',  count: 12, color: '#e8a55a' },
  { label: 'Unsatisfactory', range: '<40',    count: 6,  color: '#c64545' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function KpiScoreDistribution() {
  const maxCount = Math.max(...BANDS.map((b) => b.count))
  const total = BANDS.reduce((s, b) => s + b.count, 0)

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-foreground">Score Distribution</h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {total} reviewed
        </span>
      </div>

      <div className="space-y-4">
        {BANDS.map((band) => (
          <div key={band.label} className="flex items-center gap-3">
            <div className="w-[120px] shrink-0">
              <p className="text-xs font-medium text-foreground">{band.label}</p>
              <p className="text-[10px] text-muted-foreground">{band.range}</p>
            </div>
            <div className="flex-1 bg-muted/50 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full transition-all"
                style={{
                  width: `${(band.count / maxCount) * 100}%`,
                  backgroundColor: band.color,
                }}
              />
            </div>
            <span className="text-xs font-semibold text-foreground w-6 text-right shrink-0">
              {band.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
