import { Clock, CheckCircle, Calendar, Users, Activity } from 'lucide-react'

const ON_LEAVE_AVATARS = [
  { initials: 'PHY', className: 'bg-primary' },
  { initials: 'LMD', className: 'bg-teal-500' },
]

export function LeaveStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

      {/* Pending Approval */}
      <div className="bg-card rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Pending Approval
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/15 shrink-0">
            <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          </span>
        </div>
        <p className="text-3xl font-bold text-foreground leading-none mb-1.5">4</p>
        <p className="text-[11px] font-medium text-destructive">Requires your action</p>
      </div>

      {/* Approved This Month */}
      <div className="bg-card rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Approved This Month
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/12 dark:bg-green-500/20 shrink-0">
            <CheckCircle className="w-4 h-4 text-green-700 dark:text-green-400" />
          </span>
        </div>
        <p className="text-3xl font-bold text-foreground leading-none mb-1.5">12</p>
        <p className="text-[11px] text-muted-foreground">across all departments</p>
      </div>

      {/* Annual Leave Avg. Remaining */}
      <div className="bg-card rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Annual Leave Avg.
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 shrink-0">
            <Calendar className="w-4 h-4 text-primary/80" />
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <p className="text-3xl font-bold text-foreground leading-none">8.4</p>
          <p className="text-sm text-muted-foreground">days left</p>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div className="h-1.5 rounded-full bg-primary" style={{ width: '70%' }} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">avg of 12 days total</p>
      </div>

      {/* On Leave Today */}
      <div className="bg-card rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            On Leave Today
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal-500/15 shrink-0">
            <Users className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          </span>
        </div>
        <p className="text-3xl font-bold text-foreground leading-none mb-2">2</p>
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {ON_LEAVE_AVATARS.map((a, i) => (
              <div
                key={a.initials}
                className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-semibold text-white ${a.className}`}
                style={{ marginLeft: i === 0 ? 0 : -6 }}
              >
                {a.initials[0]}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">PHY, LMD</p>
        </div>
      </div>

      {/* Sick Leave This Month */}
      <div className="bg-card rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Sick Leave Month
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-destructive/12 shrink-0">
            <Activity className="w-4 h-4 text-destructive" />
          </span>
        </div>
        <p className="text-3xl font-bold text-foreground leading-none mb-1.5">3</p>
        <p className="text-[11px] text-muted-foreground">vs <span className="font-medium text-destructive">12</span> last month</p>
      </div>

    </div>
  )
}
