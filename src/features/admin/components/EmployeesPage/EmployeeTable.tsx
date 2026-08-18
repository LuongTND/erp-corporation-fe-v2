import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { UserSummaryResponse } from '../../types/admin.types'

const PAGE_SIZE_OPTIONS = [15, 50, 100] as const

const STATUS_LABELS: Record<string, string> = {
  Active: 'Đang làm',
  Official: 'Chính thức',
  Probation: 'Thử việc',
  Apprentice: 'Học việc',
  Suspended: 'Tạm nghỉ',
  MaternityLeave: 'Thai sản',
  Resigned: 'Đã nghỉ',
  Terminated: 'Chấm dứt HĐ',
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Active: 'default',
  Official: 'default',
  Probation: 'secondary',
  Apprentice: 'secondary',
  Suspended: 'outline',
  MaternityLeave: 'outline',
  Resigned: 'outline',
  Terminated: 'destructive',
}

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

interface EmployeeTableProps {
  employees: UserSummaryResponse[]
  isLoading: boolean
  pageSize: number
  totalCount: number
  currentPage: number
  totalPages: number
  start: number
  onRowClick: (id: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onStatusChange: (userId: string, newStatus: string) => void
  isUpdatingStatus: boolean
}

export function EmployeeTable({
  employees,
  isLoading,
  pageSize,
  totalCount,
  currentPage,
  totalPages,
  start,
  onRowClick,
  onPageChange,
  onPageSizeChange,
  onStatusChange,
  isUpdatingStatus,
}: EmployeeTableProps) {
  return (
    <div className="rounded-lg border bg-card flex flex-col overflow-hidden [&>[data-slot=table-container]]:overflow-y-auto [&>[data-slot=table-container]]:max-h-[calc(100vh-280px)]">
      <div className="contents">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-card">Nhân viên</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card">Mã NV</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card">Email</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card">Trạng thái</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize > 15 ? 15 : pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell />
                </TableRow>
              ))
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  Chưa có nhân viên nào
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="cursor-pointer" onClick={() => onRowClick(emp.id)}>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={emp.avatarUrl} alt={emp.fullName} />
                        <AvatarFallback className="text-xs">
                          {emp.fullName.split(' ').map(w => w[0]).slice(-2).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{emp.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums cursor-pointer" onClick={() => onRowClick(emp.id)}>
                    {emp.employeeCode}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground cursor-pointer" onClick={() => onRowClick(emp.id)}>
                    {emp.email}
                  </TableCell>
                  <TableCell className="cursor-pointer" onClick={() => onRowClick(emp.id)}>
                    <Badge variant={STATUS_VARIANT[emp.status] ?? 'outline'} className="text-xs">
                      {STATUS_LABELS[emp.status] ?? emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer"
                          disabled={isUpdatingStatus}
                          aria-label="Tuỳ chọn"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={4}>
                        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                          Đổi trạng thái
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {STATUS_OPTIONS.filter(o => o.value !== emp.status).map(o => (
                          <DropdownMenuItem
                            key={o.value}
                            className="cursor-pointer text-sm"
                            onClick={() => onStatusChange(emp.id, o.value)}
                          >
                            {o.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="shrink-0 border-t border-border px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
          {isLoading ? (
            <Skeleton className="h-3.5 w-44 inline-block" />
          ) : (
            `Hiển thị ${totalCount === 0 ? 0 : Math.min(start + 1, totalCount)}–${Math.min(start + pageSize, totalCount)} trong ${totalCount} nhân viên`
          )}
        </p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
            <span>Hiển thị</span>
            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
              <SelectTrigger className="h-7 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>/ trang</span>
          </div>

          {totalPages > 1 && (
            <PaginationContent className="gap-0.5">
              <PaginationItem>
                <PaginationPrevious
                  text="Trước"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={`h-7 text-xs cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-40' : ''}`}
                />
              </PaginationItem>

              {buildPageNumbers(currentPage, totalPages).map((item, idx) =>
                item === 'ellipsis' ? (
                  <PaginationItem key={`e-${idx}`}>
                    <PaginationEllipsis className="h-7 w-7" />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      isActive={item === currentPage}
                      onClick={() => onPageChange(item)}
                      className="h-7 w-7 text-xs cursor-pointer"
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  text="Sau"
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  className={`h-7 text-xs cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}`}
                />
              </PaginationItem>
            </PaginationContent>
          )}
        </div>
      </div>
    </div>
  )
}
