import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface EmployeeListPaginationProps {
  page: number
  totalPages: number
  pageSize: number
  shownCount: number
  total: number
  onPageChange: (page: number) => void
}

export function EmployeeListPagination({
  page,
  totalPages,
  pageSize,
  shownCount,
  total,
  onPageChange,
}: EmployeeListPaginationProps) {
  const start = shownCount === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, shownCount)

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm" style={{ color: '#6B6B6B' }}>
        Showing {start}-{end} of {total} employees
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault()
                if (page > 1) onPageChange(page - 1)
              }}
              text="Prev"
              className="cursor-pointer text-xs"
            />
          </PaginationItem>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1).map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={pageNumber === page}
                onClick={(event) => {
                  event.preventDefault()
                  onPageChange(pageNumber)
                }}
                className="cursor-pointer text-xs"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault()
                if (page < totalPages) onPageChange(page + 1)
              }}
              text="Next"
              className="cursor-pointer text-xs"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
