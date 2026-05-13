/**
 * ChatWindow Component
 * Layout chính cho chat
 * - Conversation list (sidebar)
 * - Message window
 * - Message input
 */

import { useState } from 'react'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { useChat } from '../hooks/use-chat'
import { useMessages } from '../hooks/use-messages'
import type { Conversation } from '../types/chat.types'

interface ChatWindowProps {
  currentUserId: string
}

export function ChatWindow({ currentUserId }: ChatWindowProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const { conversations, isLoading: isLoadingConversations } = useChat()
  const {
    messages,
    isLoading: isLoadingMessages,
    sendMessage,
    isSending,
  } = useMessages(selectedConversation?.id ?? null)

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return

    await sendMessage({
      conversationId: selectedConversation.id,
      content,
    })
  }

  return (
    <div className="grid h-full grid-cols-3 gap-4">
      {/* Conversation List */}
      <div className="col-span-1 border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Tin nhắn</h2>
        </div>
        <div className="space-y-1 overflow-y-auto">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center p-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <p className="font-medium">{conversation.title}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {conversation.lastMessage?.content || 'No messages'}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Window */}
      <div className="col-span-2 flex flex-col bg-background">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="border-b bg-card p-4">
              <h3 className="font-semibold">{selectedConversation.title}</h3>
              <p className="text-xs text-muted-foreground">
                {selectedConversation.participants.length} thành viên
              </p>
            </div>

            {/* Messages */}
            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              isLoading={isLoadingMessages}
            />

            {/* Input */}
            <MessageInput
              onSend={handleSendMessage}
              isSending={isSending}
              disabled={!selectedConversation}
            />
          </>
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Chọn một conversation để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  )
}
