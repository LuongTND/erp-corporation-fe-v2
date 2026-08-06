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
      <div className="flex items-center gap-3 rounded-xl border border-foreground/20 bg-neutral-900 px-6 py-3 shadow-lg">
        <span className="text-sm font-medium text-card">
          {selectedCount} {selectedCount === 1 ? 'employee' : 'employees'} selected
        </span>
        <div className="h-5 w-px bg-foreground/25" />
        <button
          type="button"
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-foreground/25 px-3 text-xs font-medium text-card transition-colors hover:bg-foreground/10"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
        <button
          type="button"
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-foreground/25 px-3 text-xs font-medium text-card transition-colors hover:bg-foreground/10"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Assign Training
        </button>
        <button
          type="button"
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-foreground/25 px-3 text-xs font-medium text-card transition-colors hover:bg-foreground/10"
        >
          <Megaphone className="h-3.5 w-3.5" />
          Announcement
        </button>
        <button
          type="button"
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-destructive px-3 text-xs font-medium text-destructive transition-colors hover:bg-foreground/10"
        >
          <UserX className="h-3.5 w-3.5" />
          Deactivate
        </button>
        <button
          type="button"
          onClick={onClear}
          className="ml-1 cursor-pointer text-xs text-muted-foreground transition-colors hover:text-card"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
