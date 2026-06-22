import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WeeklyCompletionData } from '../../types/admin.types'

interface CompletionRateChartProps {
  readonly data: WeeklyCompletionData[]
}

export function CompletionRateChart({ data }: CompletionRateChartProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Đăng ký & Hoàn thành theo Tuần</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            barCategoryGap="30%"
            barGap={3}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: 'oklch(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'oklch(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'oklch(var(--foreground))',
              }}
              cursor={{ fill: 'oklch(var(--muted)/0.5)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            />
            <Bar
              dataKey="enrolled"
              name="Đã đăng ký"
              fill="oklch(var(--primary)/0.3)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="completed"
              name="Hoàn thành"
              fill="oklch(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
