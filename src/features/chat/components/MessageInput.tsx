/**
 * MessageInput Component
 * Input field để soạn & gửi tin nhắn
 * - Handle Enter to send
 * - Show character count
 * - Disable khi đang gửi
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SendHorizontal } from 'lucide-react'

interface MessageInputProps {
  onSend: (content: string) => Promise<void>
  isSending: boolean
  disabled: boolean
}

export function MessageInput({
  onSend,
  isSending,
  disabled,
}: MessageInputProps) {
  const [content, setContent] = useState('')

  const handleSend = async () => {
    if (!content.trim() || disabled || isSending) return

    try {
      await onSend(content.trim())
      setContent('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn... (Shift+Enter để xuống dòng)"
          disabled={disabled || isSending}
          rows={3}
          className="flex-1 resize-none rounded-lg border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          onClick={handleSend}
          disabled={!content.trim() || disabled || isSending}
          size="icon"
          className="h-12 w-12"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {content.length} / 1000 ký tự
      </p>
    </div>
  )
}
