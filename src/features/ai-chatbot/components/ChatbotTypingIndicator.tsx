import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ChatbotTypingIndicator() {
  return (
    <div className="flex w-full justify-start gap-3">
      <Avatar className="h-8 w-8 shrink-0 border border-border">
        <AvatarImage src="/assets/bot-avatar.png" alt="AI Assistant" />
        <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
          AI
        </AvatarFallback>
      </Avatar>

      <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-4 py-3.5">
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
      </div>
    </div>
  )
}
