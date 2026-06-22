import type { AnalyticsStat, ContentEffectivenessRow, WeeklyCompletionData } from '../types/admin.types'

export const MOCK_ANALYTICS_STATS: AnalyticsStat[] = [
  { label: 'Tổng học viên đang học', value: 1842, delta: '+12.4%', deltaPositive: true },
  { label: 'Tỷ lệ hoàn thành TB', value: '71%', delta: '+5.2%', deltaPositive: true },
  { label: 'Điểm bài kiểm tra TB', value: '82.4', delta: '-1.1%', deltaPositive: false },
  { label: 'Số khoá học đã phát hành', value: 24, delta: '+3 tháng này', deltaPositive: true },
]

export const MOCK_CONTENT_EFFECTIVENESS: ContentEffectivenessRow[] = [
  { courseId: 'c-001', courseTitle: 'Strategic Leadership Fundamentals', category: 'Leadership', enrolledCount: 3842, completionRate: 72, avgScore: 86, avgWatchPercent: 88, dropoffRate: 12 },
  { courseId: 'c-002', courseTitle: 'GDPR & Data Privacy Compliance', category: 'Compliance', enrolledCount: 2190, completionRate: 88, avgScore: 91, avgWatchPercent: 94, dropoffRate: 6 },
  { courseId: 'c-003', courseTitle: 'React Advanced Patterns', category: 'Technical', enrolledCount: 5601, completionRate: 65, avgScore: 79, avgWatchPercent: 82, dropoffRate: 24 },
  { courseId: 'c-004', courseTitle: 'Effective Communication Skills', category: 'Soft Skills', enrolledCount: 4122, completionRate: 76, avgScore: 84, avgWatchPercent: 90, dropoffRate: 14 },
  { courseId: 'c-005', courseTitle: 'New Employee Onboarding', category: 'Onboarding', enrolledCount: 1820, completionRate: 91, avgScore: 93, avgWatchPercent: 96, dropoffRate: 4 },
  { courseId: 'c-006', courseTitle: 'ISO 27001 Information Security', category: 'Compliance', enrolledCount: 1340, completionRate: 79, avgScore: 82, avgWatchPercent: 85, dropoffRate: 11 },
  { courseId: 'c-007', courseTitle: 'Python for Business Data Analysis', category: 'Technical', enrolledCount: 6230, completionRate: 58, avgScore: 74, avgWatchPercent: 70, dropoffRate: 32 },
  { courseId: 'c-008', courseTitle: 'Conflict Resolution & Negotiation', category: 'Soft Skills', enrolledCount: 2980, completionRate: 70, avgScore: 80, avgWatchPercent: 87, dropoffRate: 18 },
]

export const MOCK_WEEKLY_COMPLETION: WeeklyCompletionData[] = [
  { week: 'T1', completed: 42, enrolled: 58 },
  { week: 'T2', completed: 55, enrolled: 72 },
  { week: 'T3', completed: 38, enrolled: 61 },
  { week: 'T4', completed: 67, enrolled: 80 },
  { week: 'T5', completed: 71, enrolled: 88 },
  { week: 'T6', completed: 49, enrolled: 65 },
  { week: 'T7', completed: 82, enrolled: 102 },
  { week: 'T8', completed: 76, enrolled: 94 },
]
