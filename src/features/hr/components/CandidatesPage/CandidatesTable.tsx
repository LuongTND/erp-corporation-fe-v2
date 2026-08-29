import { CheckCircle, Filter, XCircle, ClipboardList, ArrowRight, Eye } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SOURCE_CHANNEL_LABELS, type CandidateSummary } from '../../types/recruitment.types'
import { CandidateStageBadge } from './CandidateStageBadge'

interface CandidatePermissions {
  canScreen: boolean
  canAssign: boolean
  canEvaluate: boolean
  canHire: boolean
  canReject: boolean
}

interface CandidatesTableProps {
  candidates: CandidateSummary[]
  isLoading: boolean
  permissions: CandidatePermissions
  onViewDetail: (id: string) => void
  onScreen: (id: string) => void
  onAssignStore: (id: string) => void
  onAssignProduction: (id: string) => void
  onEvaluate: (id: string) => void
  onHire: (id: string) => void
  onReject: (id: string) => void
  isActing: boolean
}

export function CandidatesTable({
  candidates,
  isLoading,
  permissions,
  onViewDetail,
  onScreen,
  onAssignStore,
  onAssignProduction,
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
            <TableHead>Kênh</TableHead>
            <TableHead>Phiếu</TableHead>
            <TableHead className="w-[140px]">Giai đoạn</TableHead>
            <TableHead className="w-[60px] text-center">Điểm</TableHead>
            <TableHead className="w-[180px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((__, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center text-muted-foreground text-sm">
                Chưa có ứng viên nào
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((c) => (
              <TableRow key={c.id} className="hover:bg-muted/40 transition-colors duration-150">
                <TableCell className="font-medium text-sm">
                  <div>{c.fullName}</div>
                  {c.email && <div className="text-xs text-muted-foreground">{c.email}</div>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.phone ?? '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {c.sourceChannel ? SOURCE_CHANNEL_LABELS[c.sourceChannel] : '—'}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{c.requestCode}</TableCell>
                <TableCell><CandidateStageBadge stage={c.stage} /></TableCell>
                <TableCell className="text-center text-sm">
                  {c.evaluationScore != null ? c.evaluationScore : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7 cursor-pointer"
                      title="Xem chi tiết"
                      onClick={() => onViewDetail(c.id)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    {c.stage === 'New' && permissions.canScreen && (
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 cursor-pointer"
                        title="Sơ loại" disabled={isActing}
                        onClick={() => onScreen(c.id)}
                      >
                        <Filter className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {c.stage === 'Screening' && permissions.canAssign && (
                      <>
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 cursor-pointer"
                          title="→ PV cửa hàng" disabled={isActing}
                          onClick={() => onAssignStore(c.id)}
                        >
                          <ArrowRight className="h-3.5 w-3.5 text-violet-500" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 cursor-pointer"
                          title="→ PV sản xuất" disabled={isActing}
                          onClick={() => onAssignProduction(c.id)}
                        >
                          <ArrowRight className="h-3.5 w-3.5 text-orange-500" />
                        </Button>
                      </>
                    )}
                    {(c.stage === 'StoreInterview' || c.stage === 'ProductionInterview') && permissions.canEvaluate && (
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 cursor-pointer"
                        title="Đánh giá" disabled={isActing}
                        onClick={() => onEvaluate(c.id)}
                      >
                        <ClipboardList className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {(c.stage === 'StoreInterview' || c.stage === 'ProductionInterview') && permissions.canHire && (
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 cursor-pointer"
                        title="Tuyển dụng" disabled={isActing}
                        onClick={() => onHire(c.id)}
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      </Button>
                    )}
                    {c.stage !== 'Hired' && c.stage !== 'Rejected' && permissions.canReject && (
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 cursor-pointer"
                        title="Từ chối" disabled={isActing}
                        onClick={() => onReject(c.id)}
                      >
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      </Button>
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
