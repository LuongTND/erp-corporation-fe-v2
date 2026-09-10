import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useUsersSearch, useRoles } from '@/features/admin/hooks/use-roles'

interface Props {
  approverType: string
  value: string | undefined
  onChange: (id: string | undefined) => void
  readOnly?: boolean
  className?: string
}

export function ApproverPicker({ approverType, value, onChange, readOnly, className }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data: users = [] } = useUsersSearch(search)
  const { data: roles = [] } = useRoles()

  if (approverType === 'OrgUnitManager') return null

  if (approverType === 'SpecificUser') {
    const activeUsers = users.filter(u => u.status === 'Active')
    const selected = activeUsers.find(u => u.id === value) ?? users.find(u => u.id === value)
    const label = selected ? selected.fullName : 'Chọn nhân viên...'

    if (readOnly) {
      return (
        <span className={cn('text-xs text-muted-foreground shrink-0 max-w-36 truncate', className)} title={selected?.fullName}>
          {selected?.fullName ?? '—'}
        </span>
      )
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('h-7 text-xs justify-between font-normal w-44 shrink-0', className)}
          >
            <span className="truncate">{label}</span>
            <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <Command>
            <CommandInput placeholder="Tìm nhân viên..." value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>Không tìm thấy.</CommandEmpty>
              <CommandGroup>
                {activeUsers.map(u => (
                  <CommandItem key={u.id} value={u.id} onSelect={(id) => { onChange(id === value ? undefined : id); setOpen(false) }}>
                    <Check className={cn('mr-2 h-3.5 w-3.5', value === u.id ? 'opacity-100' : 'opacity-0')} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm truncate">{u.fullName}</span>
                      <span className="text-xs text-muted-foreground">{u.employeeCode}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  // Role
  const filteredRoles = search
    ? roles.filter(r => (r.displayName ?? r.roleName).toLowerCase().includes(search.toLowerCase()))
    : roles
  const selectedRole = roles.find(r => r.id === value)
  const roleLabel = selectedRole ? (selectedRole.displayName ?? selectedRole.roleName) : null

  if (readOnly) {
    return (
      <span className={cn('text-xs text-muted-foreground shrink-0 max-w-36 truncate', className)} title={roleLabel ?? undefined}>
        {roleLabel ?? '—'}
      </span>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('h-7 text-xs justify-between font-normal w-44 shrink-0', className)}
        >
          <span className="truncate">{roleLabel ?? 'Chọn vai trò...'}</span>
          <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Tìm vai trò..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>Không tìm thấy.</CommandEmpty>
            <CommandGroup>
              {filteredRoles.map(r => (
                <CommandItem key={r.id} value={r.id} onSelect={(id) => { onChange(id === value ? undefined : id); setOpen(false) }}>
                  <Check className={cn('mr-2 h-3.5 w-3.5', value === r.id ? 'opacity-100' : 'opacity-0')} />
                  {r.displayName ?? r.roleName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
