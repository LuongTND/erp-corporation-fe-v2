import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import type { KPIItem, KPIStatus } from '../../types/employee.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const KPI_ITEMS: KPIItem[] = [
  { id: '1', metric: 'Design Delivery Rate',    target: '95%', actual: '98%', weight: '30%', score: 100, status: 'Achieved'    },
  { id: '2', metric: 'User Research Sessions',  target: '8',   actual: '7',   weight: '20%', score: 87,  status: 'Achieved'    },
  { id: '3', metric: 'Design System Updates',   target: '4',   actual: '2',   weight: '20%', score: 50,  status: 'Missed'      },
  { id: '4', metric: 'Cross-team Collaboration',target: '10',  actual: '8',   weight: '15%', score: 80,  status: 'In Progress' },
  { id: '5', metric: 'Team NPS Score',          target: '8.5', actual: '8.2', weight: '15%', score: 96,  status: 'Achieved'    },
]

const OVERALL_SCORE = 84

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<KPIStatus, string> = {
  Achieved:    'bg-[#5db872]/10 text-[#2d7a40]',
  'In Progress':'bg-[#e8a55a]/10 text-[#9a6b2a]',
  Missed:      'bg-[#c64545]/10 text-[#c64545]',
}

function scoreColor(score: number) {
  if (score >= 80) return '#5db872'
  if (score >= 60) return '#e8a55a'
  return '#c64545'
}

// ─── SVG Donut ────────────────────────────────────────────────────────────────

function DonutChart({ score }: { readonly score: number }) {
  const radius = 52
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = scoreColor(score)

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" aria-label={`KPI score: ${score} out of 100`}>
      {/* Track */}
      <circle cx="70" cy="70" r={radius} fill="none" stroke="#efe9de" strokeWidth={strokeWidth} />
      {/* Progress */}
      <circle
        cx="70" cy="70" r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
      />
      {/* Score label */}
      <text
        x="70" y="64"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="28"
        fontWeight="700"
        fill={color}
        fontFamily="inherit"
      >
        {score}
      </text>
      <text
        x="70" y="84"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fill="#6c6a64"
        fontFamily="inherit"
      >
        / 100
      </text>
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KpiTab() {
  const color = scoreColor(OVERALL_SCORE)
  const label = OVERALL_SCORE >= 80 ? 'On Track' : OVERALL_SCORE >= 60 ? 'Needs Attention' : 'At Risk'

  return (
    <div className="space-y-6">
      {/* Overall score card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <DonutChart score={OVERALL_SCORE} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#6c6a64] mb-1">
              Overall Score · Q2 2025
            </p>
            <p className="text-4xl font-bold font-display" style={{ color }}>
              {OVERALL_SCORE}
              <span className="text-xl font-normal text-[#8e8b82]"> / 100</span>
            </p>
            <span
              className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full mt-2"
              style={{ backgroundColor: `${color}18`, color }}
            >
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* KPI items table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e6dfd8]">
          <h3 className="text-sm font-semibold text-[#141413]">KPI Breakdown — Q2 2025</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#faf9f5] hover:bg-[#faf9f5]">
              {['Metric', 'Target', 'Actual', 'Weight', 'Score', 'Status'].map((h) => (
                <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide text-[#6c6a64]">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {KPI_ITEMS.map((item) => (
              <TableRow key={item.id} className="hover:bg-[#faf9f5]">
                <TableCell className="text-sm font-medium text-[#141413]">{item.metric}</TableCell>
                <TableCell className="text-sm text-[#3d3d3a]">{item.target}</TableCell>
                <TableCell className="text-sm text-[#3d3d3a]">{item.actual}</TableCell>
                <TableCell className="text-sm text-[#6c6a64]">{item.weight}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#efe9de] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.score}%`, backgroundColor: scoreColor(item.score) }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: scoreColor(item.score) }}
                    >
                      {item.score}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[item.status]}`}>
                    {item.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
