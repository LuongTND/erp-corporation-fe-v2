import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface InfoSectionProps {
  readonly title: string
  readonly subtitle?: string
  readonly children: React.ReactNode
  readonly collapsible?: boolean
}

export function InfoSection({ title, subtitle, children, collapsible }: InfoSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border-b border-border last:border-0 py-6">
      <div className="flex items-start gap-2 mb-4">
        {collapsible && (
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {open && children}
    </div>
  )
}
