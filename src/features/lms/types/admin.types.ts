// ── LMS Admin — Domain Types ───────────────────────────────────────────────

export type CourseStatus = 'draft' | 'published' | 'archived'
export type LearnerStatus = 'active' | 'inactive' | 'suspended'
export type EnrollmentStatus = 'enrolled' | 'completed' | 'dropped'
export type VideoStatus = 'processing' | 'ready' | 'error'
export type WebinarStatus = 'upcoming' | 'live' | 'ended' | 'cancelled'

// ── Admin Course ──────────────────────────────────────────────────────────

export interface AdminCourse {
  readonly id: string
  readonly title: string
  readonly category: string
  readonly instructor: string
  readonly status: CourseStatus
  readonly enrolledCount: number
  readonly completionRate: number
  readonly totalLessons: number
  readonly duration: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly isInternal: boolean
}

export interface CourseFormData {
  title: string
  category: string
  instructor: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  isInternal: boolean
  status: CourseStatus
}

// ── Video Asset ───────────────────────────────────────────────────────────

export interface VideoAsset {
  readonly id: string
  readonly title: string
  readonly courseId: string
  readonly courseName: string
  readonly duration: string
  readonly fileSize: string
  readonly status: VideoStatus
  readonly views: number
  readonly watchedPercent: number
  readonly uploadedAt: string
}

export interface VideoFormData {
  title: string
  courseId: string
  description: string
}

// ── Webinar ───────────────────────────────────────────────────────────────

export interface Webinar {
  readonly id: string
  readonly title: string
  readonly host: string
  readonly scheduledAt: string
  readonly durationMinutes: number
  readonly status: WebinarStatus
  readonly registeredCount: number
  readonly attendedCount: number
  readonly maxCapacity: number
  readonly isInternal: boolean
  readonly recordingUrl?: string
}

export interface WebinarFormData {
  title: string
  host: string
  scheduledAt: string
  durationMinutes: number
  maxCapacity: number
  isInternal: boolean
  description: string
}

// ── Learner ───────────────────────────────────────────────────────────────

export interface Learner {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly department: string
  readonly status: LearnerStatus
  readonly enrolledCourses: number
  readonly completedCourses: number
  readonly hoursLearned: number
  readonly lastActive: string
  readonly joinedAt: string
  readonly role: 'internal' | 'customer'
}

export interface LearnerEnrollment {
  readonly courseId: string
  readonly courseTitle: string
  readonly category: string
  readonly progress: number
  readonly status: EnrollmentStatus
  readonly enrolledAt: string
  readonly completedAt?: string
}

// ── Analytics ─────────────────────────────────────────────────────────────

export interface AnalyticsStat {
  readonly label: string
  readonly value: string | number
  readonly delta: string
  readonly deltaPositive: boolean
}

export interface ContentEffectivenessRow {
  readonly courseId: string
  readonly courseTitle: string
  readonly category: string
  readonly enrolledCount: number
  readonly completionRate: number
  readonly avgScore: number
  readonly avgWatchPercent: number
  readonly dropoffRate: number
}

export interface WeeklyCompletionData {
  readonly week: string
  readonly completed: number
  readonly enrolled: number
}
