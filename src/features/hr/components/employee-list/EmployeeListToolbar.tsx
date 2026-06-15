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
          className="text-[22px] font-semibold tracking-tight"
          style={{ fontFamily: 'Tiempos Headline, Copernicus, Georgia, serif', color: '#141413', letterSpacing: '-0.3px', fontWeight: 400 }}
        >
          Employees
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: '#6c6a64' }}>
          {total} employees · {shown} shown
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: '#8e8b82' }}
          />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name, ID, position..."
            className="h-10 w-full rounded-md border pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-[#cc785c]/15"
            style={{ borderColor: '#e6dfd8', backgroundColor: '#faf9f5', color: '#141413', boxShadow: 'none' }}
          />
        </div>

        <button
          type="button"
          className="flex h-10 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm transition-colors hover:bg-[#f5f0e8]"
          style={{ borderColor: '#e6dfd8', color: '#141413', backgroundColor: '#faf9f5' }}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </button>

        <button
          type="button"
          className="flex h-10 cursor-pointer items-center gap-1.5 rounded-md px-4 text-sm font-medium text-white transition-colors hover:bg-[#a9583e]"
          style={{ backgroundColor: '#cc785c' }}
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>
    </div>
  )
}
