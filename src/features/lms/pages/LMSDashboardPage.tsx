import {
  DashboardCourseProgressCard,
  DashboardDeadlineRow,
  DashboardProgressRing,
  DashboardRecommendedCard,
} from '../components/dashboard/DashboardCards'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { LMS_PALETTE } from '../components/shared/lms-palette'
import {
  LMS_DASHBOARD_COURSES_IN_PROGRESS,
  LMS_DASHBOARD_DEADLINES,
  LMS_DASHBOARD_RECOMMENDED,
  LMS_DASHBOARD_STATS,
} from '../mocks/lms-dashboard.mock'
import { useNavigate } from 'react-router-dom'

export default function LMSDashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ backgroundColor: LMS_PALETTE.canvas }}>
      <DashboardHeader />

      <main className="mx-auto max-w-7xl space-y-5 px-8 py-6">
        <button
          type="button"
          onClick={() => navigate('/lms/progress')}
          className="flex w-full items-center justify-between rounded-xl border px-6 py-5 text-left transition-opacity duration-150 hover:opacity-95"
          style={{ backgroundColor: LMS_PALETTE.surfaceCard, borderColor: LMS_PALETTE.border }}
        >
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: LMS_PALETTE.ink }}>Good morning, Alex</h1>
            <p className="mt-1 text-sm" style={{ color: LMS_PALETTE.muted }}>
              You have <span className="font-semibold" style={{ color: LMS_PALETTE.primary }}>3 lessons</span> left this week to meet your goal.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <DashboardProgressRing value={65} />
            <div>
              <p className="text-xs font-semibold" style={{ color: LMS_PALETTE.ink }}>Weekly Goal</p>
              <p className="mt-0.5 text-xs" style={{ color: LMS_PALETTE.mutedSoft }}>4/7 hrs completed</p>
            </div>
          </div>
        </button>

        <div className="grid grid-cols-4 gap-3">
          {LMS_DASHBOARD_STATS.map(({ label, value, icon: Icon, iconColor, bgColor }) => (
            <div key={label} className="flex items-center gap-3 rounded-lg border px-4 py-4" style={{ backgroundColor: LMS_PALETTE.surfaceCard, borderColor: LMS_PALETTE.border }}>
              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: bgColor }}>
                <Icon className="h-[18px] w-[18px]" style={{ color: iconColor }} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[22px] font-bold leading-none" style={{ color: LMS_PALETTE.ink }}>{value}</p>
                <p className="mt-0.5 text-[11px]" style={{ color: LMS_PALETTE.muted }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-5">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold" style={{ color: LMS_PALETTE.ink }}>Continue Learning</h2>
              <button type="button" onClick={() => navigate('/lms/progress')} className="cursor-pointer text-xs font-medium transition-opacity duration-150 hover:opacity-75" style={{ color: LMS_PALETTE.primary }}>
                View all →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {LMS_DASHBOARD_COURSES_IN_PROGRESS.map((course) => (
                <DashboardCourseProgressCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold" style={{ color: LMS_PALETTE.ink }}>Upcoming Deadlines</h2>
            <div className="overflow-hidden rounded-xl border" style={{ backgroundColor: LMS_PALETTE.surfaceCard, borderColor: LMS_PALETTE.border }}>
              {LMS_DASHBOARD_DEADLINES.map((item, index) => (
                <DashboardDeadlineRow key={item.id} item={item} last={index === LMS_DASHBOARD_DEADLINES.length - 1} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: LMS_PALETTE.ink }}>Recommended For You</h2>
            <button type="button" className="cursor-pointer text-xs font-medium transition-opacity duration-150 hover:opacity-75" style={{ color: LMS_PALETTE.primary }}>
              Explore Catalog →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {LMS_DASHBOARD_RECOMMENDED.map((course) => (
              <DashboardRecommendedCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
