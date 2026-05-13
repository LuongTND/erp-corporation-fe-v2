/**
 * MessageList Component
 * Hiển thị danh sách messages trong conversation
 * - Scroll to bottom khi có message mới
 * - Format timestamp
 * - Phân biệt own/other messages
 */

import { useEffect, useRef } from 'react'
import type { Message } from '../types/chat.types'
import { formatDistanceToNow } from 'date-fns'
import { viLocale } from 'date-fns/locale'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
  isLoading: boolean
}

export function MessageList({
  messages,
  currentUserId,
  isLoading,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Không có tin nhắn nào
        </div>
      ) : (
        messages.map((message) => {
          const isOwn = message.senderId === currentUserId

          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {!isOwn && (
                  <p className="text-sm font-semibold">{message.sender.name}</p>
                )}
                <p className="break-words">{message.content}</p>
                <p className="mt-1 text-xs opacity-70">
                  {formatDistanceToNow(new Date(message.timestamp), {
                    addSuffix: true,
                    locale: viLocale,
                  })}
                </p>
              </div>
            </div>
          )
        })
      )}
      <div ref={endRef} />
    </div>
  )
}
