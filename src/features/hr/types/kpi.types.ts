export type ReviewStatus = 'Completed' | 'In Progress' | 'Pending Self Review' | 'Not Started'
export type ScoreTrend = 'up' | 'down' | 'flat'

export interface KpiItem {
  name: string
  weight: number
  target: string
  actual: string
  achievement: number
  score: number
  maxScore: number
}

export interface KpiEmployee {
  id: string
  name: string
  initials: string
  department: string
  position: string
  manager: { name: string; initials: string; comment: string }
  reviewStatus: ReviewStatus
  overallScore: number | null
  trend: ScoreTrend
  kpisMet: number
  kpisTotal: number
  selfReviewSubmitted: boolean
  subScores: { workQuality: number; teamwork: number; initiative: number } | null
  kpiItems: KpiItem[]
  selfAssessment: string
}
