import { useState } from 'react'
import { Plus, CornerDownLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface NewColumnBtnProps {
  onAddColumn: (title: string) => void
  isLoading?: boolean
}

export function NewColumnBtn({ onAddColumn, isLoading = false }: NewColumnBtnProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')

  const handleSubmit = () => {
    if (!title.trim() || isLoading) return
    onAddColumn(title)
    setTitle('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 shrink-0 justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground px-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Plus className="h-4 w-4" />
          Nhóm mới
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" side="bottom" className="w-[280px] p-1.5">
        <div className="flex items-center gap-1.5">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhóm mới"
            className="h-8 focus-visible:ring-1"
            autoFocus
          />
          <Button
            onClick={handleSubmit}
            size="sm"
            disabled={isLoading}
            className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white shrink-0 font-normal disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CornerDownLeft className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
