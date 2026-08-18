import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { fmtDate, fmtVnd } from '@/lib/date'
import { ExternalLink, RefreshCw, XCircle } from 'lucide-react'
import type { EmploymentContractResponse } from '../../types/admin.types'

const CONTRACT_TYPE_LABELS: Record<string, string> = {
  Probation: 'Thử việc',
  FullTime: 'Toàn thời gian',
  PartTime: 'Bán thời gian',
  Seasonal: 'Thời vụ',
  Freelance: 'Freelance',
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Active: 'default',
  Expired: 'outline',
  Terminated: 'destructive',
  Renewed: 'secondary',
}

const STATUS_LABELS: Record<string, string> = {
  Active: 'Đang hiệu lực',
  Expired: 'Hết hạn',
  Terminated: 'Đã chấm dứt',
  Renewed: 'Đã gia hạn',
}


interface ContractTableProps {
  contracts: EmploymentContractResponse[]
  isLoading: boolean
  onRenew: (contract: EmploymentContractResponse) => void
  onTerminate: (contract: EmploymentContractResponse) => void
}

export function ContractTable({ contracts, isLoading, onRenew, onTerminate }: ContractTableProps) {
  return (
    <div className="rounded-lg border bg-card flex flex-col overflow-hidden [&>[data-slot=table-container]]:overflow-y-auto [&>[data-slot=table-container]]:max-h-[calc(100vh-320px)]">
      <div className="contents">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-card">Số HĐ</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card">Loại HĐ</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card">Trạng thái</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card">Ngày bắt đầu</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card">Ngày kết thúc</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card text-right">Lương/giờ</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                  Chưa có hợp đồng nào
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => (
                <TableRow key={contract.id} className="hover:bg-muted/40 transition-colors duration-150">
                  <TableCell className="font-mono text-sm font-medium">{contract.contractNumber}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {CONTRACT_TYPE_LABELS[contract.type] ?? contract.type}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[contract.status] ?? 'outline'}>
                      {STATUS_LABELS[contract.status] ?? contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">{fmtDate(contract.startDate)}</TableCell>
                  <TableCell className="text-sm tabular-nums">{fmtDate(contract.endDate)}</TableCell>
                  <TableCell className="text-sm tabular-nums text-right">{fmtVnd(contract.salary)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      {contract.fileUrl && (
                        <a
                          href={contract.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Xem file hợp đồng"
                          className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted transition-colors duration-150 cursor-pointer"
                          aria-label="Xem file hợp đồng"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        </a>
                      )}
                      {contract.status === 'Active' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 cursor-pointer"
                            title="Gia hạn"
                            onClick={() => onRenew(contract)}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 cursor-pointer text-destructive hover:text-destructive"
                            title="Chấm dứt"
                            onClick={() => onTerminate(contract)}
                          >
                            <XCircle className="h-3.5 w-3.5" />
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
    </div>
  )
}
