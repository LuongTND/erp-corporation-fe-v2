import { BookOpen, Calendar, ChevronRight, Clock, Play, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { LMS_PALETTE } from '../shared/lms-palette'
import type { CourseInProgress, Deadline, RecommendedCourse } from '../../types/lms-dashboard.types'

interface DashboardProgressRingProps {
  readonly value: number
  readonly size?: number
}

export function DashboardProgressRing({ value, size = 68 }: DashboardProgressRingProps) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (value / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={`${LMS_PALETTE.primary}2E`} strokeWidth={5} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={LMS_PALETTE.primary}
        strokeWidth={5}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize="13"
        fontWeight="700"
        fill={LMS_PALETTE.primary}
        fontFamily="inherit"
      >
        {value}%
      </text>
    </svg>
  )
}

interface DashboardCourseProgressCardProps {
  readonly course: CourseInProgress
}

export function DashboardCourseProgressCard({ course }: DashboardCourseProgressCardProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border" style={{ backgroundColor: LMS_PALETTE.surfaceCard, borderColor: LMS_PALETTE.border }}>
      <div className="relative flex h-32 items-center justify-center" style={{ backgroundColor: `${course.accentColor}14` }}>
        <BookOpen className="h-9 w-9 opacity-50" style={{ color: course.accentColor }} aria-hidden="true" />
        <span
          className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ color: course.accentColor, backgroundColor: LMS_PALETTE.canvas }}
        >
          {course.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs font-semibold leading-snug" style={{ color: LMS_PALETTE.ink }}>{course.title}</p>
        <p className="text-[11px]" style={{ color: LMS_PALETTE.muted }}>{course.instructor}</p>

        <div className="mt-auto pt-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px]" style={{ color: LMS_PALETTE.mutedSoft }}>{course.timeLeft}</span>
            <span className="text-[10px] font-semibold" style={{ color: course.accentColor }}>{course.progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: LMS_PALETTE.surfaceCreamStrong }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${course.progress}%`, backgroundColor: course.accentColor }} />
          </div>
          <div className="mt-2.5 flex justify-end">
            <button
              type="button"
              className="flex min-h-[32px] cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ borderColor: course.accentColor, color: course.accentColor }}
              onClick={() => navigate(`/lms/course/${course.id}/learn`)}
              onMouseEnter={(event) => {
                ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = `${course.accentColor}14`
              }}
              onMouseLeave={(event) => {
                ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
              }}
            >
              <Play className="h-2.5 w-2.5" style={{ fill: course.accentColor }} aria-hidden="true" />
              Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DashboardDeadlineRowProps {
  readonly item: Deadline
  readonly last: boolean
}

export function DashboardDeadlineRow({ item, last }: DashboardDeadlineRowProps) {
  return (
    <div
      className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors duration-150"
      style={{ borderBottomColor: !last ? LMS_PALETTE.border : 'transparent', borderBottomWidth: !last ? 1 : 0 }}
      onMouseEnter={(event) => {
        ;(event.currentTarget as HTMLDivElement).style.backgroundColor = LMS_PALETTE.surfaceSoft
      }}
      onMouseLeave={(event) => {
        ;(event.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'
      }}
    >
      <Calendar className="h-4 w-4 shrink-0" style={{ color: LMS_PALETTE.amber }} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium" style={{ color: LMS_PALETTE.ink }}>{item.course}</p>
        <p className="truncate text-[11px]" style={{ color: LMS_PALETTE.muted }}>{item.lesson}</p>
      </div>
      <span
        className="shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={item.urgent ? { backgroundColor: `${LMS_PALETTE.error}14`, color: LMS_PALETTE.error } : { backgroundColor: `${LMS_PALETTE.amber}18`, color: LMS_PALETTE.warning }}
      >
        {item.dueLabel}
      </span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: LMS_PALETTE.mutedSoft }} aria-hidden="true" />
    </div>
  )
}

interface DashboardRecommendedCardProps {
  readonly course: RecommendedCourse
}

export function DashboardRecommendedCard({ course }: DashboardRecommendedCardProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border" style={{ backgroundColor: LMS_PALETTE.surfaceCard, borderColor: LMS_PALETTE.border }}>
      <div className="relative flex h-28 items-center justify-center" style={{ backgroundColor: `${course.accentColor}14` }}>
        <BookOpen className="h-8 w-8 opacity-50" style={{ color: course.accentColor }} aria-hidden="true" />
        <div className="absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between">
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ color: course.accentColor, backgroundColor: LMS_PALETTE.canvas }}>
            {course.category}
          </span>
          <span className="flex items-center gap-0.5 text-[11px] font-semibold" style={{ color: LMS_PALETTE.amber }}>
            <Star className="h-2.5 w-2.5" style={{ fill: LMS_PALETTE.amber }} strokeWidth={0} aria-hidden="true" />
            {course.rating}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs font-semibold" style={{ color: LMS_PALETTE.ink }}>{course.title}</p>
        <p className="flex-1 text-[11px] leading-relaxed" style={{ color: LMS_PALETTE.muted }}>{course.description}</p>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px]" style={{ color: LMS_PALETTE.mutedSoft }}>
            <Clock className="h-3 w-3" aria-hidden="true" />
            {course.duration}
          </span>
          <button
            type="button"
            className="cursor-pointer rounded-md px-3 py-1 text-[11px] font-semibold text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ backgroundColor: LMS_PALETTE.primary, color: LMS_PALETTE.onDark }}
            onClick={() => navigate('/lms/explore')}
            onMouseEnter={(event) => {
              ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.primaryActive
            }}
            onMouseLeave={(event) => {
              ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.primary
            }}
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  )
}
