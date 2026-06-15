import { Clock, CheckCircle, Calendar, Users, Activity } from 'lucide-react'

const ON_LEAVE_AVATARS = [
  { initials: 'PHY', color: '#cc785c' },
  { initials: 'LMD', color: '#5db8a6' },
]

export function LeaveStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

      {/* Pending Approval */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8e8b82]">
            Pending Approval
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#e8a55a]/10 shrink-0">
            <Clock className="w-4 h-4 text-[#9a6b2a]" />
          </span>
        </div>
        <p className="text-3xl font-bold text-[#141413] leading-none mb-1.5">4</p>
        <p className="text-[11px] font-medium text-[#c64545]">Requires your action</p>
      </div>

      {/* Approved This Month */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8e8b82]">
            Approved This Month
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#5db872]/10 shrink-0">
            <CheckCircle className="w-4 h-4 text-[#2d7a40]" />
          </span>
        </div>
        <p className="text-3xl font-bold text-[#141413] leading-none mb-1.5">12</p>
        <p className="text-[11px] text-[#8e8b82]">across all departments</p>
      </div>

      {/* Annual Leave Avg. Remaining */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8e8b82]">
            Annual Leave Avg.
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#cc785c]/10 shrink-0">
            <Calendar className="w-4 h-4 text-[#a9583e]" />
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <p className="text-3xl font-bold text-[#141413] leading-none">8.4</p>
          <p className="text-sm text-[#8e8b82]">days left</p>
        </div>
        <div className="w-full bg-[#f0ebe3] rounded-full h-1.5 overflow-hidden">
          <div className="h-1.5 rounded-full bg-[#cc785c]" style={{ width: '70%' }} />
        </div>
        <p className="text-[10px] text-[#8e8b82] mt-1">avg of 12 days total</p>
      </div>

      {/* On Leave Today */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8e8b82]">
            On Leave Today
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#5db8a6]/10 shrink-0">
            <Users className="w-4 h-4 text-[#357a70]" />
          </span>
        </div>
        <p className="text-3xl font-bold text-[#141413] leading-none mb-2">2</p>
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {ON_LEAVE_AVATARS.map((a, i) => (
              <div
                key={a.initials}
                className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-semibold text-white"
                style={{ backgroundColor: a.color, marginLeft: i === 0 ? 0 : -6 }}
              >
                {a.initials[0]}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#6c6a64]">PHY, LMD</p>
        </div>
      </div>

      {/* Sick Leave This Month */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8e8b82]">
            Sick Leave Month
          </p>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#c64545]/10 shrink-0">
            <Activity className="w-4 h-4 text-[#c64545]" />
          </span>
        </div>
        <p className="text-3xl font-bold text-[#141413] leading-none mb-1.5">3</p>
        <p className="text-[11px] text-[#8e8b82]">vs <span className="font-medium text-[#9e3535]">12</span> last month</p>
      </div>

    </div>
  )
}
