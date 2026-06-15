import type { ReactNode } from 'react'
import { Bell, ChevronDown } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  isActive?: boolean
}

interface HRPageHeaderProps {
  breadcrumbs: ReadonlyArray<BreadcrumbItem>
  trailingContent?: ReactNode
}

export function HRPageHeader({ breadcrumbs, trailingContent }: HRPageHeaderProps) {
  return (
    <header
      className="sticky top-0 z-10 flex h-14 items-center justify-between border-b px-8 bg-background border-border"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.label} className="flex items-center gap-2">
            {index > 0 && <ChevronDown className="h-3 w-3 -rotate-90" />}
            <span className={breadcrumb.isActive ? "text-foreground font-medium" : ""}>
              {breadcrumb.label}
            </span>
          </div>
        ))}
      </div>

      {trailingContent ?? (
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
      )}
    </header>
  )
}
