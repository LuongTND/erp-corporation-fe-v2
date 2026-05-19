import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import type { Ref } from 'react'

interface TaskToolbarSearchProps {
  isOpen: boolean
  searchValue: string
  inputRef: Ref<HTMLInputElement>
  onOpen: () => void
  onChange: (value: string) => void
  onClose: () => void
}

export function TaskToolbarSearch({
  isOpen,
  searchValue,
  inputRef,
  onOpen,
  onChange,
  onClose,
}: TaskToolbarSearchProps) {
  const iconSize = 'h-4 w-4'

  return (
    <div
      className={cn(
        'relative flex items-center h-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-md',
        isOpen ? 'w-[200px] sm:w-[260px] bg-muted/50' : 'w-8',
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onOpen}
            className={cn(
              'absolute left-0 top-0 h-8 w-8 flex items-center justify-center cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
              isOpen
                ? 'text-muted-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent rounded-md',
            )}
          >
            <Search className={iconSize} />
          </div>
        </TooltipTrigger>
        {!isOpen && <TooltipContent side="bottom">Tìm kiếm</TooltipContent>}
      </Tooltip>

      <Input
        ref={inputRef}
        value={searchValue}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => !searchValue && onClose()}
        placeholder="Tìm kiếm..."
        className={cn(
          'h-8 border-none shadow-none bg-transparent transition-all duration-500',
          'focus-visible:ring-0 focus-visible:ring-offset-0',
          isOpen ? 'w-full pl-8 pr-8 opacity-100' : 'w-0 p-0 opacity-0 pointer-events-none',
        )}
      />

      {isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 h-8 w-8 hover:bg-transparent text-muted-foreground hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          onClick={onClose}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
