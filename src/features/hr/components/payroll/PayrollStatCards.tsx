import { Banknote, MinusCircle, CheckCircle, Users, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatDef {
  label: string
  value: string
  subtext: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  subtextColor: string
  SubtextIcon?: LucideIcon
  progress?: number
}

const STATS: StatDef[] = [
  {
    label: 'Total Gross Pay',
    value: '₫280.5M',
    subtext: '+2.3% vs last month',
    icon: Banknote,
    iconBg: 'bg-[#cc785c]/10',
    iconColor: 'text-[#a9583e]',
    subtextColor: 'text-[#2d7a40]',
    SubtextIcon: TrendingUp,
  },
  {
    label: 'Total Deductions',
    value: '₫33.9M',
    subtext: 'Social, health & PIT',
    icon: MinusCircle,
    iconBg: 'bg-[#c64545]/10',
    iconColor: 'text-[#c64545]',
    subtextColor: 'text-[#8e8b82]',
  },
  {
    label: 'Total Net Pay',
    value: '₫246.6M',
    subtext: 'After all deductions',
    icon: CheckCircle,
    iconBg: 'bg-[#5db872]/10',
    iconColor: 'text-[#2d7a40]',
    subtextColor: 'text-[#8e8b82]',
  },
  {
    label: 'Employees Processed',
    value: '134 / 134',
    subtext: 'All employees included',
    icon: Users,
    iconBg: 'bg-[#cc785c]/10',
    iconColor: 'text-[#a9583e]',
    subtextColor: 'text-[#8e8b82]',
    progress: 100,
  },
]

export function PayrollStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8e8b82]">
              {stat.label}
            </p>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${stat.iconBg}`}>
              <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#141413] leading-none mb-2">{stat.value}</p>
          <div className={`flex items-center gap-1 text-xs ${stat.subtextColor}`}>
            {stat.SubtextIcon && <stat.SubtextIcon className="w-3 h-3" />}
            {stat.subtext}
          </div>
          {stat.progress !== undefined && (
            <div className="h-1 bg-[#f0ebe3] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#5db872] rounded-full"
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
