import { BookOpen, Download, Megaphone, UserX } from 'lucide-react'

interface EmployeeBulkActionBarProps {
  selectedCount: number
  onClear: () => void
}

export function EmployeeBulkActionBar({ selectedCount, onClear }: EmployeeBulkActionBarProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-xl border bg-[#181715] px-6 py-3 shadow-lg" style={{ borderColor: '#252320' }}>
        <span className="text-sm font-medium" style={{ color: '#faf9f5' }}>
          {selectedCount} {selectedCount === 1 ? 'employee' : 'employees'} selected
        </span>
        <div className="h-5 w-px bg-[#3d3d3a]" />
        <button
          type="button"
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-[#252320]"
          style={{ borderColor: '#3d3d3a', color: '#faf9f5' }}
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
        <button
          type="button"
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-[#252320]"
          style={{ borderColor: '#3d3d3a', color: '#faf9f5' }}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Assign Training
        </button>
        <button
          type="button"
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-[#252320]"
          style={{ borderColor: '#3d3d3a', color: '#faf9f5' }}
        >
          <Megaphone className="h-3.5 w-3.5" />
          Announcement
        </button>
        <button
          type="button"
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-[#252320]"
          style={{ borderColor: '#c64545', color: '#c64545' }}
        >
          <UserX className="h-3.5 w-3.5" />
          Deactivate
        </button>
        <button
          type="button"
          onClick={onClear}
          className="ml-1 cursor-pointer text-xs transition-colors hover:text-[#faf9f5]"
          style={{ color: '#a09d96' }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
