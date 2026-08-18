import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import type { KPIItem, KPIStatus } from '../../types/employee.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const KPI_ITEMS: KPIItem[] = [
  { id: '1', metric: 'Tỷ lệ bàn giao đúng hạn',  target: '95%', actual: '98%', weight: '30%', score: 100, status: 'Achieved'    },
  { id: '2', metric: 'Buổi nghiên cứu người dùng',target: '8', actual: '7',   weight: '20%', score: 87,  status: 'Achieved'    },
  { id: '3', metric: 'Cập nhật Design System',    target: '4',  actual: '2',   weight: '20%', score: 50,  status: 'Missed'      },
  { id: '4', metric: 'Phối hợp liên phòng ban',   target: '10', actual: '8',   weight: '15%', score: 80,  status: 'In Progress' },
  { id: '5', metric: 'Điểm NPS nội bộ',           target: '8.5',actual: '8.2', weight: '15%', score: 96,  status: 'Achieved'    },
]

const OVERALL_SCORE = 84

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_VI: Record<KPIStatus, string> = {
  Achieved:    'Đạt',
  'In Progress':'Đang thực hiện',
  Missed:      'Không đạt',
}

const STATUS_BADGE: Record<KPIStatus, string> = {
  Achieved:    'bg-green-500/12 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  'In Progress':'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Missed:      'bg-destructive/12 text-destructive',
}

function scoreColorClass(score: number): { bar: string; text: string } {
  if (score >= 80) return { bar: 'bg-green-500', text: 'text-green-700 dark:text-green-400' }
  if (score >= 60) return { bar: 'bg-amber-400', text: 'text-amber-700 dark:text-amber-400' }
  return { bar: 'bg-destructive', text: 'text-destructive' }
}

// ─── SVG Donut ────────────────────────────────────────────────────────────────

function DonutChart({ score }: { readonly score: number }) {
  const radius = 52
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const { bar } = scoreColorClass(score)
  // SVG stroke needs a literal color; map class to value
  const strokeColor = score >= 80 ? '#22c55e' : score >= 60 ? '#fbbf24' : 'hsl(var(--destructive))'
  const textColor   = score >= 80 ? '#15803d' : score >= 60 ? '#b45309' : 'hsl(var(--destructive))'

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" aria-label={`KPI score: ${score} out of 100`}>
      {/* Track */}
      <circle cx="70" cy="70" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
      {/* Progress */}
      <circle
        cx="70" cy="70" r={radius}
        fill="none"
        stroke={strokeColor}
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
        fill={textColor}
        fontFamily="inherit"
      >
        {score}
      </text>
      <text
        x="70" y="84"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fill="hsl(var(--muted-foreground))"
        fontFamily="inherit"
      >
        / 100
      </text>
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KpiTab() {
  const { text: scoreText } = scoreColorClass(OVERALL_SCORE)
  const label = OVERALL_SCORE >= 80 ? 'Đạt mục tiêu' : OVERALL_SCORE >= 60 ? 'Cần cải thiện' : 'Nguy hiểm'
  const labelBg = OVERALL_SCORE >= 80
    ? 'bg-green-500/12 text-green-700 dark:bg-green-500/20 dark:text-green-400'
    : OVERALL_SCORE >= 60
      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
      : 'bg-destructive/12 text-destructive'

  return (
    <div className="space-y-6">
      {/* Overall score card */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <DonutChart score={OVERALL_SCORE} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
              Điểm tổng · Q2 2025
            </p>
            <p className={`text-4xl font-bold font-display ${scoreText}`}>
              {OVERALL_SCORE}
              <span className="text-xl font-normal text-muted-foreground"> / 100</span>
            </p>
            <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full mt-2 ${labelBg}`}>
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* KPI items table */}
      <div className="bg-card rounded-xl shadow-sm overflow-auto max-h-full min-h-0">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Chi tiết KPI — Q2 2025</h3>
        </div>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow className="bg-card hover:bg-card">
              {['Chỉ số', 'Mục tiêu', 'Thực tế', 'Trọng số', 'Điểm', 'Trạng thái'].map((h) => (
                <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {KPI_ITEMS.map((item) => {
              const { bar, text } = scoreColorClass(item.score)
              return (
                <TableRow key={item.id} className="hover:bg-card">
                  <TableCell className="text-sm font-medium text-foreground">{item.metric}</TableCell>
                  <TableCell className="text-sm text-foreground">{item.target}</TableCell>
                  <TableCell className="text-sm text-foreground">{item.actual}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.weight}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${bar}`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${text}`}>
                        {item.score}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[item.status]}`}>
                      {STATUS_VI[item.status]}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
