import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '../types/ai-chatbot.types'

interface ChatbotMessageProps {
  readonly message: ChatMessage
}

export function ChatbotMessage({ message }: ChatbotMessageProps) {
  const isBot = message.role === 'bot'

  return (
    <div className={cn('flex w-full gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300', isBot ? 'justify-start' : 'justify-end')}>
      {isBot && (
        <Avatar className="h-8 w-8 shrink-0 border border-border">
          <AvatarImage src="/assets/bot-avatar.png" alt="AI Assistant" />
          <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
            AI
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'relative max-w-[80%] rounded-2xl px-4 py-2.5 text-sm border',
          isBot
            ? 'rounded-tl-sm bg-muted border-border/60 text-foreground'
            : 'rounded-tr-sm bg-primary border-primary text-primary-foreground font-medium shadow-sm'
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <span
          className={cn(
            'mt-1 block text-[10px] opacity-70',
            isBot ? 'text-muted-foreground text-left' : 'text-primary-foreground/85 text-right'
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  )
}

