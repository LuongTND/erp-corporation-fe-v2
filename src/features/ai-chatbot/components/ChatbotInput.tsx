import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { Button } from '@/components/ui/button'

interface ChatbotInputProps {
  readonly onSend: (text: string) => void
  readonly disabled?: boolean
}

export function ChatbotInput({ onSend, disabled }: ChatbotInputProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus input when not disabled
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [disabled])

  const handleSend = () => {
    if (!content.trim() || disabled) return
    onSend(content.trim())
    setContent('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2 p-3 pt-0">
      <div className="relative flex-1 rounded-2xl border border-input bg-background focus-within:ring-1 focus-within:ring-ring">
        <TextareaAutosize
          ref={textareaRef}
          minRows={1}
          maxRows={5}
          placeholder="Nhập câu hỏi của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          className="flex w-full resize-none rounded-2xl bg-transparent px-4 py-3 pl-4 pr-12 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20"
        />
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled || !content.trim()}
          onClick={handleSend}
          className="absolute bottom-1 right-1 h-8 w-8 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
