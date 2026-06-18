import { UserCheck, Clock, UserX, CalendarOff } from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  iconColor: string
  iconBg: string
  label: string
  count: number
  subtext: string
}

function StatCard({ icon, iconColor, iconBg, label, count, subtext }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm p-5 flex items-start gap-4">
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-foreground leading-tight mt-0.5">{count}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>
      </div>
    </div>
  )
}

export function AttendanceStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<UserCheck className="w-5 h-5" />}
        iconColor="text-green-700 dark:text-green-400"
        iconBg="bg-green-500/12 dark:bg-green-500/20"
        label="Present"
        count={118}
        subtext="of 134 total"
      />
      <StatCard
        icon={<Clock className="w-5 h-5" />}
        iconColor="text-amber-700 dark:text-amber-400"
        iconBg="bg-amber-500/15"
        label="Late Check-in"
        count={9}
        subtext="after 08:15 AM"
      />
      <StatCard
        icon={<UserX className="w-5 h-5" />}
        iconColor="text-destructive"
        iconBg="bg-destructive/12"
        label="Absent"
        count={4}
        subtext="unexcused today"
      />
      <StatCard
        icon={<CalendarOff className="w-5 h-5" />}
        iconColor="text-teal-700 dark:text-teal-400"
        iconBg="bg-teal-500/15"
        label="On Leave"
        count={3}
        subtext="approved leave"
      />
    </div>
  )
}
