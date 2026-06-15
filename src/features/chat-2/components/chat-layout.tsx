import React, { useState } from 'react'
import LeftSideBarLayout from './left-sidebar/left-sidebar-layout'
import { ChatAreaLayout } from './chat-area/chat-area-layout'
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  getMessagesByConversation,
} from '../data/mock-data'

const ChatLayout: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    MOCK_CONVERSATIONS[0]?.id ?? null,
  )

  const isChatConnected = true
  const isNotiConnected = true

  // Lấy conversation đang active
  const activeConversation =
    MOCK_CONVERSATIONS.find((c) => c.id === selectedConversationId) || {}

  // Lấy messages cho conversation đang active
  const messages = selectedConversationId
    ? getMessagesByConversation(selectedConversationId)
    : []

  const typingUsers: any[] = []

  const sendMessage = async () => {}
  const sendTypingIndicator = async () => {}
  const addReaction = async () => {}
  const removeReaction = async () => {}

  return (
    <div className="flex h-full w-full overflow-hidden">
      <LeftSideBarLayout
        conversations={MOCK_CONVERSATIONS}
        activeConversationId={selectedConversationId}
        onConversationSelect={setSelectedConversationId}
        isConnected={isChatConnected}
      />

      <main className="flex-1 flex min-w-0 bg-background relative">
        <ChatAreaLayout
          activeConversation={activeConversation}
          messages={messages}
          addReaction={addReaction}
          removeReaction={removeReaction}
          sendMessage={sendMessage}
          sendTypingIndicator={sendTypingIndicator}
          typingUsers={typingUsers}
        />

        {!isNotiConnected && (
          <div
            className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-500"
            title="Notification Disconnected"
          />
        )}
      </main>
    </div>
  )
}

export default ChatLayout
