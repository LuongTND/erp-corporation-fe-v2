import { UserCheck, UserX, FileText } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CANDIDATE_STAGE_LABELS } from '../../types/recruitment.types'
import type { CandidateSummary } from '../../types/recruitment.types'

const STAGE_COLORS: Record<string, string> = {
  New: 'bg-muted text-muted-foreground',
  Screening: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  StoreInterview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  ProductionInterview: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  Offer: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Hired: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

interface CandidatesTableProps {
  candidates: CandidateSummary[]
  isLoading: boolean
  canEvaluate: boolean
  onEvaluate: (candidate: CandidateSummary) => void
  onHire: (id: string) => void
  onReject: (id: string) => void
  isActing: boolean
}

export function CandidatesTable({
  candidates,
  isLoading,
  canEvaluate,
  onEvaluate,
  onHire,
  onReject,
  isActing,
}: CandidatesTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead>Họ tên</TableHead>
            <TableHead>SĐT</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[140px]">Giai đoạn</TableHead>
            <TableHead className="w-[80px] text-center">Điểm</TableHead>
            <TableHead className="w-[120px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                Chưa có ứng viên nào
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((candidate) => (
              <TableRow key={candidate.id} className="hover:bg-muted/40 transition-colors duration-150">
                <TableCell className="font-medium text-sm">{candidate.fullName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{candidate.phone ?? '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{candidate.email ?? '—'}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium border-0 ${STAGE_COLORS[candidate.stage] ?? ''}`}
                  >
                    {CANDIDATE_STAGE_LABELS[candidate.stage]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-sm">
                  {candidate.evaluationScore != null ? candidate.evaluationScore : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    {candidate.cvUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 cursor-pointer"
                        title="Xem CV"
                        asChild
                      >
                        <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                    {canEvaluate && candidate.stage !== 'Hired' && candidate.stage !== 'Rejected' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer"
                          title="Đánh giá"
                          disabled={isActing}
                          onClick={() => onEvaluate(candidate)}
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer text-green-600 hover:text-green-700"
                          title="Tuyển dụng"
                          disabled={isActing}
                          onClick={() => onHire(candidate.id)}
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer text-red-600 hover:text-red-700"
                          title="Từ chối"
                          disabled={isActing}
                          onClick={() => onReject(candidate.id)}
                        >
                          <UserX className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
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
