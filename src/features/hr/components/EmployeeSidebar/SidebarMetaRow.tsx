interface SidebarMetaRowProps {
  readonly label: string
  readonly value: string
  readonly mono?: boolean
}

export function SidebarMetaRow({ label, value, mono }: SidebarMetaRowProps) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <span className={`flex-1 text-foreground break-all min-w-0 ${mono ? 'font-mono' : ''}`}>{value || '—'}</span>
    </div>
  )
}
