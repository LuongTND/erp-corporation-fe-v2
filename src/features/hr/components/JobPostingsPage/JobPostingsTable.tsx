import { CheckCircle, XCircle } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { type JobPostingSummary } from '../../types/recruitment.types'
import { CostStatusBadge } from './CostStatusBadge'

interface JobPostingsTableProps {
  postings: JobPostingSummary[]
  isLoading: boolean
  canApprove: boolean
  onApprove: (id: string) => void
  onReject: (id: string) => void
  isActing: boolean
}

export function JobPostingsTable({ postings, isLoading, canApprove, onApprove, onReject, isActing }: JobPostingsTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead className="w-[120px]">Kênh</TableHead>
            <TableHead className="w-[120px]">Phiếu</TableHead>
            <TableHead className="w-[120px] text-right">Chi phí</TableHead>
            <TableHead className="w-[160px]">Trạng thái CP</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : postings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                Chưa có tin tuyển dụng nào
              </TableCell>
            </TableRow>
          ) : (
            postings.map((p) => (
              <TableRow key={p.id} className="hover:bg-muted/40 transition-colors duration-150">
                <TableCell className="font-medium text-sm">{p.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {p.channel === 'PaidBoard' ? 'Kênh phí' : 'Facebook'}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{p.requestCode}</TableCell>
                <TableCell className="text-right text-sm">
                  {p.estimatedCost != null
                    ? p.estimatedCost.toLocaleString('vi-VN') + ' ₫'
                    : '—'}
                </TableCell>
                <TableCell><CostStatusBadge status={p.costStatus} /></TableCell>
                <TableCell>
                  {p.costStatus === 'PendingApproval' && canApprove && (
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 cursor-pointer"
                        title="Duyệt chi phí" disabled={isActing}
                        onClick={() => onApprove(p.id)}
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 cursor-pointer"
                        title="Từ chối chi phí" disabled={isActing}
                        onClick={() => onReject(p.id)}
                      >
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
