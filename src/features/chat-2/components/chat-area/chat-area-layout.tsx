import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { ChatAreaHeader } from './chat-area-header'
import { ChatAreaContent } from './chat-area-content'
import { ChatAreaInput } from './chat-area-input'
import { RightSidebarDetails } from '../right-sidebar/right-sidebar-detail'
import { RightSidebarSearchDetail } from '../right-sidebar/right-sidebar-search-detail'

interface Props {
  typingUsers: any
  activeConversation?: any
  messages: any
  addReaction: any
  removeReaction: any
  sendMessage: any
  sendTypingIndicator: any
}

export function ChatAreaLayout({
  typingUsers,
  activeConversation,
  messages,
  addReaction,
  removeReaction,
  sendMessage,
  sendTypingIndicator,
}: Props) {
  const [activePanel, setActivePanel] = useState<'none' | 'info' | 'search'>('none')
  const toggleInfo = () => setActivePanel(p => p === 'info' ? 'none' : 'info')
  const toggleSearch = () => setActivePanel(p => p === 'search' ? 'none' : 'search')
  const closePanel = () => setActivePanel('none')
  const resetToInfo = () => setActivePanel('info')

  useEffect(() => {
    if (activeConversation?.id) {
      resetToInfo()
    }
  }, [activeConversation?.id])

  const [openReplyMessage, setOpenReplyMessage] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)

  return (
    <>
      <div className="flex h-full w-full overflow-hidden bg-background">
        <div className="flex-1 flex flex-col min-w-0 w-full h-full">
          <ChatAreaHeader
            activeConversation={activeConversation}
            activePanel={activePanel}
            onToggleInfo={toggleInfo}
            onToggleSearch={toggleSearch}
          />
          <ChatAreaContent
            typingUsers={typingUsers}
            activeConversation={activeConversation}
            messages={messages}
            addReaction={addReaction}
            removeReaction={removeReaction}
            setOpenReplyMessage={setOpenReplyMessage}
            setReplyingTo={setReplyingTo}
          />
          <ChatAreaInput
            onSendMessage={sendMessage}
            sendTypingIndicator={sendTypingIndicator}
            activeConversation={activeConversation}
            openReplyMessage={openReplyMessage}
            replyingToMessage={replyingTo}
            setOpenReplyMessage={setOpenReplyMessage}
            sendMessage={sendMessage}
          />
        </div>

        <div
          className={cn(
            'transition-all duration-300 ease-in-out border-l bg-background overflow-hidden',
            activePanel !== 'none'
              ? 'w-[320px] translate-x-0 opacity-100'
              : 'w-0 border-l-0 translate-x-full opacity-0',
          )}
        >
          <div className="w-[320px] h-full">
            {activePanel === 'info' && <RightSidebarDetails activeConversation={activeConversation} onClose={closePanel} />}
            {activePanel === 'search' && <RightSidebarSearchDetail activeConversation={activeConversation} onClose={closePanel} />}
          </div>
        </div>
      </div>
    </>
  )
}
