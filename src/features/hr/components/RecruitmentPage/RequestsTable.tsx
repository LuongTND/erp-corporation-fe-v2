import { useNavigate } from 'react-router-dom'
import { Eye, Send } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/config/routes'
import { RequestStatusBadge } from './RequestStatusBadge'
import type { RecruitmentRequestSummary } from '../../types/recruitment.types'

interface RequestsTableProps {
  requests: RecruitmentRequestSummary[]
  isLoading: boolean
  onSubmit: (id: string) => void
  isSubmitting: boolean
}

export function RequestsTable({ requests, isLoading, onSubmit, isSubmitting }: RequestsTableProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead className="w-[120px]">Mã phiếu</TableHead>
            <TableHead>Vị trí</TableHead>
            <TableHead>Khối</TableHead>
            <TableHead className="w-[80px] text-center">SL</TableHead>
            <TableHead>Đơn vị</TableHead>
            <TableHead className="w-[120px]">Trạng thái</TableHead>
            <TableHead>Người tạo</TableHead>
            <TableHead className="w-[80px] text-center">UV</TableHead>
            <TableHead className="w-[100px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 9 }).map((__, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="py-12 text-center text-muted-foreground text-sm">
                Chưa có phiếu đề xuất nào
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow
                key={request.id}
                className="hover:bg-muted/40 transition-colors duration-150 cursor-pointer"
                onClick={() => navigate(ROUTES.HR.RECRUITMENT_DETAIL.replace(':id', request.id))}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{request.code}</TableCell>
                <TableCell className="font-medium text-sm">{request.jobPositionName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {request.context === 'Store' ? 'Cửa hàng' : 'Sản xuất'}
                </TableCell>
                <TableCell className="text-center text-sm font-semibold">{request.quantity}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {request.storeName ?? request.departmentName ?? '—'}
                </TableCell>
                <TableCell>
                  <RequestStatusBadge status={request.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{request.createdByName}</TableCell>
                <TableCell className="text-center text-sm">{request.candidateCount}</TableCell>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-center gap-1 justify-end">
                    {request.status === 'Draft' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 cursor-pointer"
                        title="Nộp phiếu"
                        disabled={isSubmitting}
                        onClick={() => onSubmit(request.id)}
                      >
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 cursor-pointer"
                      title="Xem chi tiết"
                      onClick={() => navigate(ROUTES.HR.RECRUITMENT_DETAIL.replace(':id', request.id))}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
