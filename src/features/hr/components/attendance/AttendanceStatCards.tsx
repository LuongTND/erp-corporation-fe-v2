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
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#8e8b82] uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-[#141413] leading-tight mt-0.5">{count}</p>
        <p className="text-xs text-[#8e8b82] mt-0.5">{subtext}</p>
      </div>
    </div>
  )
}

export function AttendanceStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<UserCheck className="w-5 h-5" />}
        iconColor="text-[#2d7a40]"
        iconBg="bg-[#5db872]/10"
        label="Present"
        count={118}
        subtext="of 134 total"
      />
      <StatCard
        icon={<Clock className="w-5 h-5" />}
        iconColor="text-[#9a6b2a]"
        iconBg="bg-[#e8a55a]/10"
        label="Late Check-in"
        count={9}
        subtext="after 08:15 AM"
      />
      <StatCard
        icon={<UserX className="w-5 h-5" />}
        iconColor="text-[#c64545]"
        iconBg="bg-[#c64545]/10"
        label="Absent"
        count={4}
        subtext="unexcused today"
      />
      <StatCard
        icon={<CalendarOff className="w-5 h-5" />}
        iconColor="text-[#357a70]"
        iconBg="bg-[#5db8a6]/10"
        label="On Leave"
        count={3}
        subtext="approved leave"
      />
    </div>
  )
}
