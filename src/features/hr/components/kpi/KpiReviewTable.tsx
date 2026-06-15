import { useState, useMemo } from 'react'
import {
  TrendingUp, TrendingDown, Minus, Eye, Bell, CheckCircle, Clock, Search,
  type LucideIcon,
} from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import type { KpiEmployee, KpiItem, ReviewStatus, ScoreTrend } from '../../types/kpi.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MGRS = {
  ENG: { name: 'Phạm Văn Đức', initials: 'PVĐ', comment: 'Demonstrated strong technical ownership this quarter. Consistently meets delivery targets and actively supports team members. Should focus on documenting architectural decisions more thoroughly for knowledge transfer.' },
  DES: { name: 'Võ Thị Kim', initials: 'VTK', comment: 'Produced high-quality design work with minimal revisions. Proactively aligned with product and engineering on design system consistency. Encourage more cross-department collaboration in Q3.' },
  HR:  { name: 'Nguyễn Thị Lan', initials: 'NTL', comment: 'Shows dedication to HR processes and employee wellbeing initiatives. Response time on HR tickets improved significantly. Needs to complete the advanced HR certification course as planned.' },
  PRD: { name: 'Trần Quốc Bảo', initials: 'TQB', comment: 'Excellent product instincts and stakeholder management. Roadmap delivery on track despite changing priorities. Leadership presence in cross-functional meetings has improved notably.' },
  FIN: { name: 'Lê Thị Hồng', initials: 'LTH', comment: 'Accurate and timely reporting with zero audit findings. Needs to engage more proactively with budget owners during planning cycles. Learning goals for Q2 were not fully completed.' },
}

const EMPLOYEES: KpiEmployee[] = [
  {
    id: 'EMP-0001', name: 'Nguyễn Văn An', initials: 'NVA',
    department: 'Engineering', position: 'Senior Engineer', manager: MGRS.ENG,
    reviewStatus: 'Completed', overallScore: 92, trend: 'up',
    kpisMet: 9, kpisTotal: 10, selfReviewSubmitted: true,
    subScores: { workQuality: 95, teamwork: 88, initiative: 90 },
    kpiItems: [
      { name: 'Task Delivery',     weight: 30, target: '95%',      actual: '98%',      achievement: 103, score: 30, maxScore: 30 },
      { name: 'Work Quality',      weight: 25, target: '≥ A grade', actual: 'A+',       achievement: 105, score: 25, maxScore: 25 },
      { name: 'Collaboration',     weight: 20, target: '80%',      actual: '85%',      achievement: 106, score: 20, maxScore: 20 },
      { name: 'Learning & Growth', weight: 15, target: '2 courses', actual: '1 course', achievement: 80,  score: 12, maxScore: 15 },
      { name: 'Innovation',        weight: 10, target: '3 ideas',  actual: '2 ideas',  achievement: 67,  score: 7,  maxScore: 10 },
    ],
    selfAssessment: "This quarter I focused on delivering the auth service and payment gateway ahead of schedule. I actively mentored 2 junior engineers. I believe I could improve on cross-team communication and should take on more leadership opportunities in Q3.",
  },
  {
    id: 'EMP-0017', name: 'Trần Thị Bích', initials: 'TTB',
    department: 'Engineering', position: 'Engineer', manager: MGRS.ENG,
    reviewStatus: 'In Progress', overallScore: 78, trend: 'up',
    kpisMet: 7, kpisTotal: 10, selfReviewSubmitted: true,
    subScores: { workQuality: 80, teamwork: 76, initiative: 74 },
    kpiItems: [
      { name: 'Task Delivery',     weight: 30, target: '90%',      actual: '92%',      achievement: 102, score: 30, maxScore: 30 },
      { name: 'Work Quality',      weight: 25, target: '85%',      actual: '82%',      achievement: 96,  score: 24, maxScore: 25 },
      { name: 'Collaboration',     weight: 20, target: '80%',      actual: '74%',      achievement: 93,  score: 18, maxScore: 20 },
      { name: 'Learning & Growth', weight: 15, target: '2 courses', actual: '1 course', achievement: 80,  score: 12, maxScore: 15 },
      { name: 'Innovation',        weight: 10, target: '2 ideas',  actual: '0 ideas',  achievement: 0,   score: 0,  maxScore: 10 },
    ],
    selfAssessment: "I completed all assigned sprint tasks and contributed to 2 major feature releases. I struggled with the new testing framework early in Q2 but have now caught up. Planning to complete AWS certification in Q3.",
  },
  {
    id: 'EMP-0031', name: 'Lê Minh Dũng', initials: 'LMD',
    department: 'Design', position: 'UI/UX Designer', manager: MGRS.DES,
    reviewStatus: 'Completed', overallScore: 85, trend: 'flat',
    kpisMet: 8, kpisTotal: 10, selfReviewSubmitted: true,
    subScores: { workQuality: 90, teamwork: 82, initiative: 80 },
    kpiItems: [
      { name: 'Task Delivery',     weight: 30, target: '90%',      actual: '93%',  achievement: 103, score: 30, maxScore: 30 },
      { name: 'Work Quality',      weight: 25, target: '85%',      actual: '88%',  achievement: 104, score: 25, maxScore: 25 },
      { name: 'Collaboration',     weight: 20, target: '80%',      actual: '79%',  achievement: 99,  score: 20, maxScore: 20 },
      { name: 'Learning & Growth', weight: 15, target: '2 courses', actual: '2 courses', achievement: 100, score: 15, maxScore: 15 },
      { name: 'Innovation',        weight: 10, target: '3 designs', actual: '2 designs', achievement: 67, score: 7, maxScore: 10 },
    ],
    selfAssessment: "Delivered the full redesign of the onboarding flow and mobile component library on time. I am satisfied with the design quality but want to spend more time on user research and usability testing in Q3.",
  },
  {
    id: 'EMP-0058', name: 'Phạm Hải Yến', initials: 'PHY',
    department: 'HR', position: 'HR Specialist', manager: MGRS.HR,
    reviewStatus: 'Pending Self Review', overallScore: 71, trend: 'down',
    kpisMet: 6, kpisTotal: 10, selfReviewSubmitted: false,
    subScores: { workQuality: 73, teamwork: 70, initiative: 65 },
    kpiItems: [
      { name: 'Task Delivery',     weight: 30, target: '90%',      actual: '84%',      achievement: 93,  score: 27, maxScore: 30 },
      { name: 'Work Quality',      weight: 25, target: '85%',      actual: '80%',      achievement: 94,  score: 23, maxScore: 25 },
      { name: 'Collaboration',     weight: 20, target: '75%',      actual: '72%',      achievement: 96,  score: 19, maxScore: 20 },
      { name: 'Learning & Growth', weight: 15, target: '1 cert',   actual: '0 certs',  achievement: 0,   score: 0,  maxScore: 15 },
      { name: 'Innovation',        weight: 10, target: '2 ideas',  actual: '1 idea',   achievement: 50,  score: 5,  maxScore: 10 },
    ],
    selfAssessment: '',
  },
  {
    id: 'EMP-0044', name: 'Đặng Thị Mai', initials: 'ĐTM',
    department: 'Product', position: 'Product Manager', manager: MGRS.PRD,
    reviewStatus: 'Completed', overallScore: 88, trend: 'up',
    kpisMet: 8, kpisTotal: 10, selfReviewSubmitted: true,
    subScores: { workQuality: 88, teamwork: 92, initiative: 85 },
    kpiItems: [
      { name: 'Task Delivery',     weight: 30, target: '90%',      actual: '93%',      achievement: 103, score: 30, maxScore: 30 },
      { name: 'Work Quality',      weight: 25, target: '85%',      actual: '87%',      achievement: 102, score: 25, maxScore: 25 },
      { name: 'Collaboration',     weight: 20, target: '85%',      actual: '90%',      achievement: 106, score: 20, maxScore: 20 },
      { name: 'Learning & Growth', weight: 15, target: '2 courses', actual: '1 course', achievement: 80,  score: 12, maxScore: 15 },
      { name: 'Innovation',        weight: 10, target: '4 features', actual: '2 features', achievement: 50, score: 5, maxScore: 10 },
    ],
    selfAssessment: "Led the Q2 roadmap execution with 3 major features shipped. Improved stakeholder alignment through weekly syncs. The discovery process for the B2B expansion needs more time investment — I plan to address this in Q3.",
  },
  {
    id: 'EMP-0072', name: 'Hoàng Văn Tú', initials: 'HVT',
    department: 'Finance', position: 'Accountant', manager: MGRS.FIN,
    reviewStatus: 'Not Started', overallScore: null, trend: 'flat',
    kpisMet: 0, kpisTotal: 10, selfReviewSubmitted: false,
    subScores: null,
    kpiItems: [],
    selfAssessment: '',
  },
  {
    id: 'EMP-0089', name: 'Vũ Thị Lan', initials: 'VTL',
    department: 'Design', position: 'Graphic Designer', manager: MGRS.DES,
    reviewStatus: 'In Progress', overallScore: 65, trend: 'down',
    kpisMet: 5, kpisTotal: 10, selfReviewSubmitted: true,
    subScores: { workQuality: 68, teamwork: 63, initiative: 60 },
    kpiItems: [
      { name: 'Task Delivery',     weight: 30, target: '90%',      actual: '78%',      achievement: 87,  score: 26, maxScore: 30 },
      { name: 'Work Quality',      weight: 25, target: '80%',      actual: '76%',      achievement: 95,  score: 23, maxScore: 25 },
      { name: 'Collaboration',     weight: 20, target: '75%',      actual: '68%',      achievement: 91,  score: 18, maxScore: 20 },
      { name: 'Learning & Growth', weight: 15, target: '2 courses', actual: '0 courses', achievement: 0, score: 0, maxScore: 15 },
      { name: 'Innovation',        weight: 10, target: '2 ideas',  actual: '0 ideas',  achievement: 0,   score: 0,  maxScore: 10 },
    ],
    selfAssessment: "I had a difficult quarter due to health issues in April which affected my output. I have recovered and am back on track. I request consideration of extenuating circumstances in my final evaluation.",
  },
  {
    id: 'EMP-0103', name: 'Bùi Minh Khoa', initials: 'BMK',
    department: 'Engineering', position: 'Senior Engineer', manager: MGRS.ENG,
    reviewStatus: 'Completed', overallScore: 94, trend: 'up',
    kpisMet: 10, kpisTotal: 10, selfReviewSubmitted: true,
    subScores: { workQuality: 96, teamwork: 92, initiative: 95 },
    kpiItems: [
      { name: 'Task Delivery',     weight: 30, target: '95%',      actual: '100%',     achievement: 105, score: 30, maxScore: 30 },
      { name: 'Work Quality',      weight: 25, target: '90%',      actual: '95%',      achievement: 106, score: 25, maxScore: 25 },
      { name: 'Collaboration',     weight: 20, target: '85%',      actual: '90%',      achievement: 106, score: 20, maxScore: 20 },
      { name: 'Learning & Growth', weight: 15, target: '2 courses', actual: '3 courses', achievement: 115, score: 15, maxScore: 15 },
      { name: 'Innovation',        weight: 10, target: '3 ideas',  actual: '4 ideas',  achievement: 133, score: 10, maxScore: 10 },
    ],
    selfAssessment: "This was my best quarter. Led the infrastructure migration to Kubernetes with zero downtime, completed 3 certifications, and mentored 4 junior engineers. Looking forward to expanding my scope as a tech lead in Q3.",
  },
]

// ─── Style helpers ────────────────────────────────────────────────────────────

const achievementColor = (pct: number) =>
  pct >= 100 ? '#2d7a40' : pct >= 75 ? '#9a6b2a' : '#c64545'

const getScoreLabel = (score: number) =>
  score >= 90 ? { label: 'Excellent Performance', color: '#2d7a40' } :
  score >= 75 ? { label: 'Good Performance',       color: '#2d7a40' } :
  score >= 60 ? { label: 'Meets Expectations',      color: '#a9583e' } :
  score >= 50 ? { label: 'Needs Improvement',       color: '#9a6b2a' } :
               { label: 'Unsatisfactory',            color: '#c64545' }

// ─── SVG ring helpers ─────────────────────────────────────────────────────────

function ScoreDonut({ score }: { score: number }) {
  const r = 50
  const circ = 2 * Math.PI * r
  return (
    <div className="relative w-[120px] h-[120px] shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f0ebe3" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r}
          fill="none" stroke="#cc785c" strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - score / 100)}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-[#141413] leading-none">{score}</p>
        <p className="text-[10px] text-[#8e8b82]">/100</p>
      </div>
    </div>
  )
}

function MiniDonut({ score, color }: { score: number; color: string }) {
  const r = 16
  const circ = 2 * Math.PI * r
  return (
    <div className="relative w-[44px] h-[44px]">
      <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#f0ebe3" strokeWidth="5" />
        <circle
          cx="22" cy="22" r={r}
          fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - score / 100)}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-[10px] font-bold" style={{ color }}>{score}</p>
      </div>
    </div>
  )
}

function MiniRing({ met, total }: { met: number; total: number }) {
  const r = 8
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? met / total : 0
  return (
    <svg viewBox="0 0 20 20" className="w-5 h-5 -rotate-90 shrink-0">
      <circle cx="10" cy="10" r={r} fill="none" stroke="#f0ebe3" strokeWidth="2.5" />
      <circle
        cx="10" cy="10" r={r}
        fill="none" stroke="#5db872" strokeWidth="2.5"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Cell sub-components ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<ReviewStatus, string> = {
  'Completed':           'bg-[#5db872]/10 text-[#2d7a40]',
  'In Progress':         'bg-[#cc785c]/10 text-[#a9583e]',
  'Pending Self Review': 'bg-[#e8a55a]/10 text-[#9a6b2a]',
  'Not Started':         'bg-[#f0ebe3] text-[#8e8b82]',
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {status === 'In Progress' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#cc785c] animate-pulse shrink-0" />
      )}
      {status}
    </span>
  )
}

function ScoreBar({ score }: { score: number | null }) {
  if (score == null) return <span className="text-xs text-[#8e8b82]">—</span>
  const color = score >= 75 ? '#5db872' : score >= 50 ? '#e8a55a' : '#c64545'
  return (
    <div>
      <p className="text-sm font-semibold text-[#141413]">
        {score}<span className="text-xs text-[#8e8b82] font-normal">/100</span>
      </p>
      <div className="w-16 h-1.5 bg-[#f0ebe3] rounded-full mt-1 overflow-hidden">
        <div className="h-1.5 rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

const TREND_ICONS: Record<ScoreTrend, { Icon: LucideIcon; cls: string }> = {
  up:   { Icon: TrendingUp,   cls: 'text-[#2d7a40]' },
  down: { Icon: TrendingDown, cls: 'text-[#c64545]' },
  flat: { Icon: Minus,        cls: 'text-[#8e8b82]' },
}

// ─── KPI Detail Sheet body ────────────────────────────────────────────────────

function KpiDetailSheet({ emp }: { emp: KpiEmployee }) {
  if (emp.reviewStatus === 'Not Started') {
    return (
      <div className="py-12 text-center text-sm text-[#8e8b82]">
        Review not started yet.
      </div>
    )
  }

  const label = getScoreLabel(emp.overallScore ?? 0)

  return (
    <div className="space-y-5 py-4">

      {/* Score Summary */}
      <div className="p-5 rounded-xl bg-[#f5f0e8] border border-[#e6dfd8]">
        <div className="flex items-center gap-5">
          {emp.overallScore != null && <ScoreDonut score={emp.overallScore} />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold mb-4" style={{ color: label.color }}>
              {label.label}
            </p>
            {emp.subScores && (
              <div className="flex gap-5">
                {([
                  ['Work Quality', emp.subScores.workQuality, '#cc785c'],
                  ['Teamwork',     emp.subScores.teamwork,     '#5db872'],
                  ['Initiative',   emp.subScores.initiative,   '#5db8a6'],
                ] as [string, number, string][]).map(([name, score, color]) => (
                  <div key={name} className="flex flex-col items-center gap-1">
                    <MiniDonut score={score} color={color} />
                    <p className="text-[9px] text-[#8e8b82] text-center leading-tight">{name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Items */}
      {emp.kpiItems.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8e8b82] mb-2">
            KPI Breakdown
          </p>
          <div className="rounded-lg border border-[#f0ebe3] overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#faf9f5] border-b border-[#f0ebe3]">
                  <th className="text-left px-3 py-2 text-[#8e8b82] font-medium">KPI</th>
                  <th className="text-center px-2 py-2 text-[#8e8b82] font-medium">Wt.</th>
                  <th className="text-right px-2 py-2 text-[#8e8b82] font-medium">Target</th>
                  <th className="text-right px-2 py-2 text-[#8e8b82] font-medium">Actual</th>
                  <th className="text-right px-2 py-2 text-[#8e8b82] font-medium">Ach.</th>
                  <th className="text-right px-3 py-2 text-[#8e8b82] font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {emp.kpiItems.map((item: KpiItem, idx: number) => {
                  const achColor = achievementColor(item.achievement)
                  return (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-[#faf9f5]/60' : ''}>
                      <td className="px-3 py-2 text-[#3d3d3a] font-medium">{item.name}</td>
                      <td className="px-2 py-2 text-center">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f0ebe3] text-[#6c6a64] font-medium">
                          {item.weight}%
                        </span>
                      </td>
                      <td className="px-2 py-2 text-right text-[#6c6a64]">{item.target}</td>
                      <td className="px-2 py-2 text-right text-[#3d3d3a] font-medium">{item.actual}</td>
                      <td className="px-2 py-2 text-right">
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: `${achColor}18`, color: achColor }}
                        >
                          {item.achievement}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-[#3d3d3a]">
                        {item.score}/{item.maxScore}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manager Comments */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8e8b82] mb-2">
          Manager Comments
        </p>
        <div className="p-4 rounded-lg bg-white border border-[#e6dfd8]">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold bg-[#5db8a6]/15 text-[#357a70] shrink-0">
              {emp.manager.initials}
            </div>
            <p className="text-xs font-medium text-[#3d3d3a]">{emp.manager.name}</p>
            <span className="text-[10px] text-[#8e8b82]">· Manager</span>
          </div>
          <p className="text-sm text-[#6c6a64] leading-relaxed italic pl-4 border-l-[3px] border-[#cc785c]/50">
            {emp.manager.comment}
          </p>
        </div>
      </div>

      {/* Self Assessment */}
      {emp.selfReviewSubmitted && emp.selfAssessment && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8e8b82] mb-2">
            Self Assessment
          </p>
          <div className="p-4 rounded-lg border border-[#e8a55a]/25" style={{ backgroundColor: 'rgba(232,165,90,0.06)' }}>
            <p className="text-sm text-[#6c6a64] leading-relaxed italic pl-4 border-l-[3px] border-[#e8a55a]/60">
              {emp.selfAssessment}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-[#e6dfd8]">
        <button
          type="button"
          className="flex-1 py-2 text-sm font-medium rounded-lg bg-[#5db872] text-white hover:bg-[#4da862] transition-colors cursor-pointer"
        >
          Approve & Finalize
        </button>
        <button
          type="button"
          className="flex-1 py-2 text-sm font-medium rounded-lg border border-[#e8a55a] text-[#9a6b2a] hover:bg-[#e8a55a]/5 transition-colors cursor-pointer"
        >
          Request Revision
        </button>
        <button
          type="button"
          className="flex-1 py-2 text-sm font-medium rounded-lg border border-[#e6dfd8] text-[#6c6a64] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
        >
          Download PDF
        </button>
      </div>

    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function KpiReviewTable() {
  const [searchQuery, setSearchQuery]   = useState('')
  const [deptFilter, setDeptFilter]     = useState('all')
  const [scoreFilter, setScoreFilter]   = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedEmp, setSelectedEmp]   = useState<KpiEmployee | null>(null)

  const filtered = useMemo(() =>
    EMPLOYEES.filter((emp) => {
      const q = searchQuery.toLowerCase()
      const matchSearch = emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q)
      const matchDept   = deptFilter === 'all' || emp.department.toLowerCase() === deptFilter
      const matchStatus = statusFilter === 'all' || emp.reviewStatus === statusFilter
      const matchScore  = scoreFilter === 'all' || (() => {
        const s = emp.overallScore
        if (scoreFilter === 'excellent') return s != null && s >= 90
        if (scoreFilter === 'good')      return s != null && s >= 75 && s < 90
        if (scoreFilter === 'below')     return s != null && s < 60
        return true
      })()
      return matchSearch && matchDept && matchStatus && matchScore
    }),
    [searchQuery, deptFilter, scoreFilter, statusFilter],
  )

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* Filter row */}
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#f0ebe3] flex-wrap">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8e8b82]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or ID…"
              className="w-full pl-8 pr-3 h-8 rounded-lg border border-[#e6dfd8] text-sm text-[#3d3d3a] bg-white placeholder:text-[#8e8b82] outline-none focus:ring-1 focus:ring-[#cc785c]"
            />
          </div>

          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[140px] h-8 text-sm border-[#e6dfd8] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger className="w-[140px] h-8 text-sm border-[#e6dfd8] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="excellent">Excellent (≥90)</SelectItem>
              <SelectItem value="good">Good (75–89)</SelectItem>
              <SelectItem value="below">Below Target (&lt;60)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-8 text-sm border-[#e6dfd8] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Pending Self Review">Pending Self Review</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-[#f0ebe3]">
              <TableHead className="text-xs font-medium text-[#8e8b82] pl-5">Employee</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Manager</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Review Status</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Overall Score</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Trend</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">KPIs Met</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Self Review</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((emp) => {
              const trend = TREND_ICONS[emp.trend]
              return (
                <TableRow
                  key={emp.id}
                  onClick={() => setSelectedEmp(emp)}
                  className="border-[#f0ebe3] cursor-pointer hover:bg-[#faf9f5] transition-colors"
                >
                  {/* Employee */}
                  <TableCell className="pl-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold bg-[#cc785c]/15 text-[#a9583e] shrink-0">
                        {emp.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#141413] leading-tight">{emp.name}</p>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#f0ebe3] text-[#6c6a64]">
                          {emp.department}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Manager */}
                  <TableCell className="text-sm text-[#6c6a64]">{emp.manager.name}</TableCell>

                  {/* Review Status */}
                  <TableCell>
                    <StatusBadge status={emp.reviewStatus} />
                  </TableCell>

                  {/* Overall Score */}
                  <TableCell>
                    <ScoreBar score={emp.overallScore} />
                  </TableCell>

                  {/* Trend */}
                  <TableCell>
                    <trend.Icon className={`w-4 h-4 ${trend.cls}`} />
                  </TableCell>

                  {/* KPIs Met */}
                  <TableCell>
                    {emp.kpisTotal > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-[#3d3d3a]">{emp.kpisMet}/{emp.kpisTotal}</span>
                        <MiniRing met={emp.kpisMet} total={emp.kpisTotal} />
                      </div>
                    ) : (
                      <span className="text-xs text-[#8e8b82]">—</span>
                    )}
                  </TableCell>

                  {/* Self Review */}
                  <TableCell>
                    {emp.selfReviewSubmitted
                      ? <CheckCircle className="w-4 h-4 text-[#2d7a40]" />
                      : <Clock className="w-4 h-4 text-[#8e8b82]" />
                    }
                  </TableCell>

                  {/* Action */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedEmp(emp)}
                        className="p-1.5 rounded-md text-[#6c6a64] hover:bg-[#f5f0e8] hover:text-[#3d3d3a] transition-colors cursor-pointer"
                        aria-label="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded-md text-[#6c6a64] hover:bg-[#f5f0e8] hover:text-[#3d3d3a] transition-colors cursor-pointer"
                        aria-label="Send reminder"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedEmp} onOpenChange={(open) => { if (!open) setSelectedEmp(null) }}>
        <SheetContent className="sm:max-w-[560px] overflow-y-auto">
          <SheetHeader className="border-b border-[#e6dfd8] pb-4 mb-0">
            {selectedEmp && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold bg-[#cc785c]/15 text-[#a9583e] shrink-0">
                  {selectedEmp.initials}
                </div>
                <div>
                  <SheetTitle className="text-base font-semibold text-[#141413]">
                    {selectedEmp.name}
                  </SheetTitle>
                  <p className="text-xs text-[#8e8b82]">
                    {selectedEmp.position} · {selectedEmp.department}
                  </p>
                  <p className="text-[10px] font-medium text-[#cc785c] mt-0.5">Q2 2025 Review</p>
                </div>
              </div>
            )}
          </SheetHeader>
          {selectedEmp && <KpiDetailSheet emp={selectedEmp} />}
        </SheetContent>
      </Sheet>
    </>
  )
}
