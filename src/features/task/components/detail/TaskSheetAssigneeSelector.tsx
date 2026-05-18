import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'

export interface UserOption {
  value: string
  label: string
  initials: string
  avatarUrl?: string
}

interface AssigneeSelectorProps {
  users: UserOption[]
  value: string
  onChange: (value: string) => void
}

function UserAvatar({ user, size = 20 }: { user: UserOption; size?: number }) {
  return (
    <span
      className="rounded-full flex items-center justify-center text-white shrink-0 font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.42, backgroundColor: '#cc785c' }}
    >
      {user.initials}
    </span>
  )
}

export function AssigneeSelector({ users, value, onChange }: AssigneeSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const ref = React.useRef<HTMLDivElement>(null)

  const selectedUser = users.find((u) => u.value === value)
  const filtered = users.filter((u) =>
    u.label.toLowerCase().includes(search.toLowerCase()),
  )

  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler, true)
    return () => document.removeEventListener('mousedown', handler, true)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 cursor-pointer rounded pl-0 pr-2 py-0.5 transition-colors duration-[120ms]"
        style={{ color: selectedUser ? '#141413' : '#8e8b82' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0e8' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
      >
        {selectedUser ? (
          <>
            <UserAvatar user={selectedUser} size={18} />
            <span className="text-[12px]">{selectedUser.label}</span>
          </>
        ) : (
          <span className="text-[12px]">Unassigned</span>
        )}
        <ChevronDown className="h-3 w-3 shrink-0" style={{ color: '#8e8b82' }} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 z-50 rounded-lg overflow-hidden"
          style={{
            width: 200,
            backgroundColor: '#FFFFFF',
            border: '0.5px solid #e6dfd8',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          {/* Search */}
          <div style={{ borderBottom: '0.5px solid #e6dfd8' }} className="px-2 py-1.5">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search person…"
              className="w-full bg-transparent border-none outline-none text-[12px]"
              style={{ color: '#141413' }}
            />
          </div>

          {/* List */}
          <div className="py-1 max-h-[200px] overflow-y-auto">
            {/* Unassign option */}
            <button
              type="button"
              className="w-full flex items-center gap-2 px-2 py-1.5 text-[13px] cursor-pointer transition-colors duration-[120ms]"
              style={{ color: '#8e8b82' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0e8' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
              onClick={() => { onChange(''); setOpen(false); setSearch('') }}
            >
              <span
                className="w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0"
                style={{ borderColor: '#e6dfd8' }}
              />
              <span>Unassigned</span>
              {!value && <Check className="ml-auto h-3.5 w-3.5" style={{ color: '#cc785c' }} />}
            </button>

            {filtered.length === 0 && (
              <p className="px-2 py-3 text-center text-[12px]" style={{ color: '#8e8b82' }}>
                No person found.
              </p>
            )}

            {filtered.map((user) => (
              <button
                key={user.value}
                type="button"
                className="w-full flex items-center gap-2 px-2 py-1.5 text-[13px] cursor-pointer transition-colors duration-[120ms]"
                style={{ color: '#141413' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0e8' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                onClick={() => {
                  onChange(user.value === value ? '' : user.value)
                  setOpen(false)
                  setSearch('')
                }}
              >
                <UserAvatar user={user} size={18} />
                <span>{user.label}</span>
                {value === user.value && (
                  <Check className="ml-auto h-3.5 w-3.5" style={{ color: '#cc785c' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
