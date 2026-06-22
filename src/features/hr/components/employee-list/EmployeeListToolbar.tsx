import { Search, SlidersHorizontal, UserPlus } from 'lucide-react'

interface EmployeeListToolbarProps {
  total: number
  shown: number
  search: string
  onSearchChange: (value: string) => void
}

export function EmployeeListToolbar({ total, shown, search, onSearchChange }: EmployeeListToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1
          className="text-[22px] font-semibold tracking-tight text-foreground"
          style={{ fontFamily: 'Tiempos Headline, Copernicus, Georgia, serif', letterSpacing: '-0.3px', fontWeight: 400 }}
        >
          Employees
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {total} employees · {shown} shown
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name, ID, position..."
            className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <button
          type="button"
          className="flex h-10 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm text-foreground transition-colors hover:bg-muted/50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </button>

        <button
          type="button"
          className="flex h-10 cursor-pointer items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>
    </div>
  )
}
