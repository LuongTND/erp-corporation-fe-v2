import { leaveRequestData, recentHireData } from '../../types/hr-dashboard.types'

export function HRMDashboardPeopleRow() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: '#F0EDE8' }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>New Employees</h2>
          <a href="#" className="cursor-pointer text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700">
            View all
          </a>
        </div>
        <div className="max-h-72 space-y-3 overflow-y-auto pr-0.5">
          {recentHireData.map((hire) => (
            <div key={hire.initials} className="group flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                {hire.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" style={{ color: '#1A1A1A' }}>{hire.name}</p>
                <p className="truncate text-xs" style={{ color: '#9A9A9A' }}>{hire.position}</p>
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
              >
                {hire.dept}
              </span>
              <span className="ml-1 shrink-0 text-xs" style={{ color: '#9A9A9A' }}>{hire.joinDate}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: '#F0EDE8' }}>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>Pending Leave Requests</h2>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            {leaveRequestData.length}
          </span>
        </div>
        <div className="space-y-3">
          {leaveRequestData.map((request) => (
            <div key={request.initials} className="flex items-start gap-2.5">
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
              >
                {request.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{request.name}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${request.typeStyle}`}>
                    {request.type}
                  </span>
                </div>
                <p className="mt-0.5 text-xs" style={{ color: '#9A9A9A' }}>{request.dates}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  className="h-6 cursor-pointer rounded-md bg-emerald-500 px-2 text-xs font-medium text-white transition-colors hover:bg-emerald-600"
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="h-6 cursor-pointer rounded-md border border-red-200 px-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
