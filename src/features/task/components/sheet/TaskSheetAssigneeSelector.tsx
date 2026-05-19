import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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

export function AssigneeSelector({ users, value, onChange }: AssigneeSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const selectedUser = users.find((u) => u.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-8 w-fit justify-start p-1 px-2 font-normal -ml-2 transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            !selectedUser ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                {selectedUser.avatarUrl && <AvatarImage src={selectedUser.avatarUrl} />}
                <AvatarFallback className="text-[9px]">{selectedUser.initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{selectedUser.label}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Unassigned</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandList>
            <CommandEmpty>No person found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.value}
                  value={user.label}
                  onSelect={() => {
                    onChange(user.value === value ? '' : user.value)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Avatar className="h-5 w-5">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                    <AvatarFallback className="text-[9px]">{user.initials}</AvatarFallback>
                  </Avatar>
                  <span>{user.label}</span>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === user.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
