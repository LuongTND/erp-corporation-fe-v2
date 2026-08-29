interface FieldCellProps {
  readonly label: string
  readonly value?: string
  readonly fullWidth?: boolean
}

export function FieldCell({ label, value, fullWidth }: FieldCellProps) {
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm text-foreground">{value || '—'}</p>
    </div>
  )
}
