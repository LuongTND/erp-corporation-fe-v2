import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { ContentEffectivenessRow } from '../../types/admin.types'

// Completion rate mapped to a colour band
function completionClass(rate: number): string {
  if (rate >= 80) return 'text-[#3B6D11]'
  if (rate >= 60) return 'text-[#B7770D]'
  return 'text-[#C0392B]'
}

interface ContentEffectivenessTableProps {
  readonly rows: ContentEffectivenessRow[]
}

export function ContentEffectivenessTable({ rows }: ContentEffectivenessTableProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Hiệu quả Nội dung Đào tạo</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khoá học</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-right">Học viên</TableHead>
              <TableHead>Tỷ lệ hoàn thành</TableHead>
              <TableHead className="text-right">Điểm TB</TableHead>
              <TableHead>% Video đã xem TB</TableHead>
              <TableHead className="text-right">Dropout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.courseId}>
                <TableCell>
                  <p className="max-w-[200px] truncate text-sm font-medium text-foreground">
                    {row.courseTitle}
                  </p>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {row.category}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-sm text-foreground">
                    {row.enrolledCount.toLocaleString()}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={row.completionRate}
                      className="h-1.5 w-24"
                      aria-label={`${row.completionRate}% hoàn thành`}
                    />
                    <span className={cn('text-xs font-medium', completionClass(row.completionRate))}>
                      {row.completionRate}%
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-sm font-medium text-foreground">{row.avgScore}</span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={row.avgWatchPercent}
                      className="h-1.5 w-20"
                      aria-label={`${row.avgWatchPercent}% đã xem`}
                    />
                    <span className="text-xs text-muted-foreground">{row.avgWatchPercent}%</span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      row.dropoffRate > 20 ? 'text-[#C0392B]' : 'text-muted-foreground'
                    )}
                  >
                    {row.dropoffRate}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
