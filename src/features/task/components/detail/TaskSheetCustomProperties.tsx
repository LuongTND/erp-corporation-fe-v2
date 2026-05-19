import { useEffect, useState } from 'react'
import { Check, ExternalLink, Hash, List, Plus, Tags, ToggleLeft, Trash2 } from 'lucide-react'
import type { CustomPropDef, CustomPropType, CustomPropValue } from '@/features/task/types/task.types'
import { customPropertyService } from '@/features/task/mocks/task.mock'

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bgHover: '#f5f0e8',
}

const TYPE_META: Record<CustomPropType, { label: string; icon: React.ElementType }> = {
  select:          { label: 'Lựa chọn',      icon: List },
  'multi-select':  { label: 'Nhiều lựa chọn', icon: Tags },
  number:          { label: 'Số',             icon: Hash },
  checkbox:        { label: 'Hộp kiểm',       icon: ToggleLeft },
  url:             { label: 'URL',             icon: ExternalLink },
}

function PropIcon({ type }: { type: CustomPropType }) {
  const Icon = TYPE_META[type].icon
  return <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: C.muted }} />
}

interface Props {
  taskId: string
}

export function TaskSheetCustomProperties({ taskId }: Props) {
  const [defs, setDefs] = useState<CustomPropDef[]>([])
  const [vals, setVals] = useState<CustomPropValue[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<CustomPropType>('select')
  const [newOptions, setNewOptions] = useState('')

  useEffect(() => {
    customPropertyService.getDefs().then(setDefs)
    if (taskId) customPropertyService.getValues(taskId).then(setVals)
  }, [taskId])

  const getValue = (defId: string) => vals.find((v) => v.defId === defId)?.value

  const handleChange = async (defId: string, value: string | number | boolean) => {
    await customPropertyService.setValue(taskId, defId, value)
    setVals((prev) => {
      const idx = prev.findIndex((v) => v.defId === defId)
      if (idx >= 0) { const next = [...prev]; next[idx] = { defId, value }; return next }
      return [...prev, { defId, value }]
    })
  }

  const handleAddDef = async () => {
    const name = newName.trim()
    if (!name) return
    const options = newType === 'select'
      ? newOptions.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined
    const def = await customPropertyService.createDef({ name, type: newType, options })
    setDefs((prev) => [...prev, def])
    setNewName('')
    setNewOptions('')
    setAddOpen(false)
  }

  const handleDeleteDef = async (id: string) => {
    await customPropertyService.deleteDef(id)
    setDefs((prev) => prev.filter((d) => d.id !== id))
    setVals((prev) => prev.filter((v) => v.defId !== id))
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: C.muted }}>
          Thuộc tính tùy chỉnh
        </p>
        <button
          type="button"
          onClick={() => setAddOpen((v) => !v)}
          className="flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded cursor-pointer transition-colors duration-[120ms]"
          style={{ color: C.accent }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
        >
          <Plus className="h-3 w-3" />
          Thêm field
        </button>
      </div>

      {/* Add property form */}
      {addOpen && (
        <div
          className="flex flex-col gap-2 p-3 rounded-lg"
          style={{ backgroundColor: C.bgHover, border: `0.5px solid ${C.border}` }}
        >
          <input
            autoFocus
            type="text"
            placeholder="Tên thuộc tính..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full text-[12px] bg-white px-2 py-1.5 rounded outline-none"
            style={{ border: `0.5px solid ${C.border}`, color: C.text }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddDef(); if (e.key === 'Escape') setAddOpen(false) }}
          />

          <div className="flex gap-1 flex-wrap">
            {(Object.keys(TYPE_META) as CustomPropType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setNewType(t)}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded cursor-pointer transition-colors duration-[100ms]"
                style={{
                  backgroundColor: newType === t ? C.accent : 'white',
                  color: newType === t ? 'white' : C.muted,
                  border: `0.5px solid ${newType === t ? C.accent : C.border}`,
                }}
              >
                {TYPE_META[t].label}
              </button>
            ))}
          </div>

          {(newType === 'select' || newType === 'multi-select') && (
            <input
              type="text"
              placeholder="Các lựa chọn, phân cách bởi dấu phẩy..."
              value={newOptions}
              onChange={(e) => setNewOptions(e.target.value)}
              className="w-full text-[12px] bg-white px-2 py-1.5 rounded outline-none"
              style={{ border: `0.5px solid ${C.border}`, color: C.text }}
            />
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddDef}
              disabled={!newName.trim()}
              className="flex-1 text-[12px] py-1 rounded cursor-pointer transition-colors duration-[100ms] text-white"
              style={{ backgroundColor: newName.trim() ? C.accent : C.border }}
            >
              Tạo
            </button>
            <button
              type="button"
              onClick={() => { setAddOpen(false); setNewName(''); setNewOptions('') }}
              className="text-[12px] px-3 py-1 rounded cursor-pointer transition-colors duration-[100ms]"
              style={{ color: C.muted, border: `0.5px solid ${C.border}` }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Property rows */}
      {defs.length === 0 && !addOpen && (
        <p className="text-[12px]" style={{ color: C.muted }}>Chưa có thuộc tính nào.</p>
      )}

      <div className="flex flex-col gap-1">
        {defs.map((def) => (
          <PropRow
            key={def.id}
            def={def}
            value={getValue(def.id)}
            onChange={(v) => handleChange(def.id, v)}
            onDelete={() => handleDeleteDef(def.id)}
          />
        ))}
      </div>
    </div>
  )
}

function PropRow({
  def,
  value,
  onChange,
  onDelete,
}: {
  def: CustomPropDef
  value: string | number | boolean | undefined
  onChange: (v: string | number | boolean) => void
  onDelete: () => void
}) {
  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg group transition-colors duration-[120ms]"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
    >
      <PropIcon type={def.type} />
      <span className="w-24 shrink-0 text-[12px] truncate" style={{ color: C.muted }}>{def.name}</span>
      <div className="flex-1 min-w-0">
        <PropInput def={def} value={value} onChange={onChange} />
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded cursor-pointer transition-all duration-[120ms] shrink-0"
        style={{ color: C.muted }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = C.muted }}
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

function PropInput({
  def,
  value,
  onChange,
}: {
  def: CustomPropDef
  value: string | number | boolean | undefined
  onChange: (v: string | number | boolean) => void
}) {
  const baseInput = "w-full text-[12px] bg-transparent outline-none"

  if (def.type === 'checkbox') {
    const checked = Boolean(value)
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex items-center gap-1.5 cursor-pointer"
      >
        <span
          className="w-4 h-4 rounded flex items-center justify-center shrink-0"
          style={{
            backgroundColor: checked ? C.accent : 'transparent',
            border: `1.5px solid ${checked ? C.accent : C.border}`,
          }}
        >
          {checked && <Check className="h-2.5 w-2.5 text-white" />}
        </span>
        <span className="text-[12px]" style={{ color: checked ? C.text : C.muted }}>
          {checked ? 'Có' : 'Không'}
        </span>
      </button>
    )
  }

  if (def.type === 'multi-select') {
    const selected = value ? String(value).split(',').filter(Boolean) : []
    const options = def.options ?? []
    return (
      <div className="flex flex-wrap gap-1 py-0.5">
        {options.map((opt) => {
          const isSelected = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => {
                const next = isSelected
                  ? selected.filter((v) => v !== opt)
                  : [...selected, opt]
                onChange(next.join(','))
              }}
              className="text-[11px] px-1.5 py-0.5 rounded-full cursor-pointer transition-colors duration-[100ms]"
              style={{
                backgroundColor: isSelected ? C.accent : 'transparent',
                color: isSelected ? 'white' : C.muted,
                border: `0.5px solid ${isSelected ? C.accent : C.border}`,
              }}
            >
              {opt}
            </button>
          )
        })}
        {options.length === 0 && (
          <span className="text-[11px]" style={{ color: C.muted }}>Chưa có lựa chọn</span>
        )}
      </div>
    )
  }

  if (def.type === 'select') {
    return (
      <select
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseInput} cursor-pointer`}
        style={{ color: value ? C.text : C.muted }}
      >
        <option value="">—</option>
        {(def.options ?? []).map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  if (def.type === 'number') {
    return (
      <input
        type="number"
        value={value !== undefined ? String(value) : ''}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        placeholder="0"
        className={baseInput}
        style={{ color: C.text }}
      />
    )
  }

  // url
  return (
    <div className="flex items-center gap-1 min-w-0">
      <input
        type="url"
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className={`${baseInput} flex-1`}
        style={{ color: C.text }}
      />
      {value && (
        <a
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 cursor-pointer"
          style={{ color: C.accent }}
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  )
}
