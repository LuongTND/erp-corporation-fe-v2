import type { CustomFieldValueDto } from '../../types/user-detail.types'

interface Props {
  readonly customFields: CustomFieldValueDto[]
}

function FieldRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="border-b border-border pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <p className="text-sm text-foreground">{value || '—'}</p>
    </div>
  )
}

export function CustomFieldsSection({ customFields }: Props) {
  if (customFields.length === 0) return null

  const groups = customFields.reduce<Record<string, CustomFieldValueDto[]>>((acc, field) => {
    const key = field.group ?? 'Khác'
    ;(acc[key] ??= []).push(field)
    return acc
  }, {})

  return (
    <div className="bg-card rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Trường tùy chỉnh</h3>
      {Object.entries(groups).map(([groupName, fields]) => (
        <div key={groupName} className="mb-5 last:mb-0">
          {Object.keys(groups).length > 1 && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{groupName}</p>
          )}
          {fields.map(field => (
            <FieldRow key={field.definitionId} label={field.name} value={field.value} />
          ))}
        </div>
      ))}
    </div>
  )
}
