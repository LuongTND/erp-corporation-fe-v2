import { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChatbotPanel } from './ChatbotPanel'
import { cn } from '@/lib/utils'

export function ChatbotFloatingWidget() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary/20 transition-all duration-300 hover:scale-105 active:scale-95 z-50',
            open 
              ? 'bg-background hover:bg-muted text-foreground' 
              : 'bg-primary text-primary-foreground hover:bg-primary/95'
          )}
          size="icon"
          aria-label={open ? 'Đóng Chatbot' : 'Mở Chatbot'}
        >
          {open ? (
            <X className="h-6 w-6 transition-transform duration-300" />
          ) : (
            <div className="relative flex items-center justify-center transition-transform duration-300">
              <MessageSquare className="h-6 w-6 fill-current" />
              {/* Pulse ripple effect */}
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary border border-background"></span>
              </span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        side="top" 
        align="end" 
        sideOffset={16}
        className="w-[380px] p-0 h-[600px] max-h-[80vh] flex shadow-2xl rounded-2xl overflow-hidden border-border/60 bg-background"
      >
        <ChatbotPanel onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}


