import { Star, TrendingUp, TrendingDown } from 'lucide-react'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function CompletionRing({ pct }: { pct: number }) {
  const r = 32
  const circ = 2 * Math.PI * r
  return (
    <div className="relative w-[76px] h-[76px] shrink-0">
      <svg viewBox="0 0 76 76" className="w-full h-full -rotate-90">
        <circle cx="38" cy="38" r={r} fill="none" stroke="oklch(var(--border))" strokeWidth="7" />
        <circle
          cx="38" cy="38" r={r}
          fill="none" stroke="oklch(var(--primary))" strokeWidth="7"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-[15px] font-bold text-foreground">{pct}%</p>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KpiStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Review Completion */}
      <div className="bg-card rounded-xl shadow-sm p-5 flex items-center gap-4">
        <CompletionRing pct={73} />
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Review Completion
          </p>
          <p className="text-2xl font-bold text-foreground leading-none mt-1">73%</p>
          <p className="text-xs text-muted-foreground mt-1">98 / 134 reviewed</p>
        </div>
      </div>

      {/* Avg. Performance Score */}
      <div className="bg-card rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Avg. Performance Score
          </p>
          <Star className="w-4 h-4 shrink-0 text-amber-500" style={{ fill: 'currentColor' }} />
        </div>
        <div className="flex items-baseline gap-1">
          <p className="text-3xl font-bold text-foreground">82.4</p>
          <p className="text-sm text-muted-foreground">/100</p>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-green-700 dark:text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span>+4.2 vs last quarter</span>
        </div>
      </div>

      {/* Exceeds Target */}
      <div className="bg-card rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Exceeds Target
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/12 dark:bg-green-500/20 shrink-0">
            <TrendingUp className="w-4 h-4 text-green-700 dark:text-green-400" />
          </span>
        </div>
        <p className="text-2xl font-bold text-foreground leading-none">42</p>
        <p className="text-xs text-muted-foreground mt-1">31.3% of reviewed</p>
      </div>

      {/* Below Target */}
      <div className="bg-card rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Below Target
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-destructive/12 shrink-0">
            <TrendingDown className="w-4 h-4 text-destructive" />
          </span>
        </div>
        <p className="text-2xl font-bold text-foreground leading-none">18</p>
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mt-1">Need attention</p>
      </div>

    </div>
  )
}
