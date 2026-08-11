interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface Props {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

export function CustomTooltip({ active, payload, label }: Props) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
      <p className="mb-1.5 font-medium text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ₫{p.value.toFixed(1)}M
        </p>
      ))}
    </div>
  )
}
