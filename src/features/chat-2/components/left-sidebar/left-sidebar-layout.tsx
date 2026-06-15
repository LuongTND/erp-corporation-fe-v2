'use client'

import { useState, useMemo } from 'react';
import { LeftSideBarContent } from './left-sidebar-content'
import { LeftSideBarHeader } from './left-sidebar-header'


interface ChatSidebarProps {
  activeConversationId: string | null
  onConversationSelect: (id: string) => void
  conversations: any[]
  isConnected:boolean
}

export default function LeftSideBarLayout({
  activeConversationId,
  onConversationSelect,
  conversations,
  isConnected
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = useMemo(() => {
    if (!searchTerm) return conversations
    const lowerTerm = searchTerm.toLowerCase()
    return conversations.filter(
      (chat) =>
        chat?.name?.toLowerCase().includes(lowerTerm)
    )
  }, [searchTerm, conversations])

  return (
    <aside className="w-[320px] flex flex-col border-r bg-background shrink-0">
      <LeftSideBarHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <LeftSideBarContent
        filteredConversations={filteredConversations}
        activeConversationId={activeConversationId}
        onConversationSelect={onConversationSelect}
      />
    </aside>
  )
}
