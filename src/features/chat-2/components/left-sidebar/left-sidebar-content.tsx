'use client'
import { Search } from 'lucide-react'
import { ConversationItem } from './conversation-item'

const formatMessageTime = (t: any) => '12:00 PM'

interface ChatSidebarProps {
  activeConversationId: string | null
  onConversationSelect: (id: string) => void
  filteredConversations: any[]
}

export function LeftSideBarContent({
  filteredConversations,
  activeConversationId,
  onConversationSelect,
}: ChatSidebarProps) {
  // console.log('List Conversations: >>>>>', filteredConversations)

  // Data hiện tại
  //'/api/conversations'
  /*
  avatarUrl: undefined
  conversationId: "4e022491-07f8-4524-a828-be05679b3f9a"
  id: "4e022491-07f8-4524-a828-be05679b3f9a"
  lastMessageAtUtc: "2025-12-23T02:22:08.833691Z"
  name: "Nhóm Test"
  type: 1
  unreadCount: 0
  */

  //Cần thêm tin nhắn cuối cùng để hiển thị ra UI
  /*
  2 options 
  1. Truyền vào messageId -> FE tự call API để lấy
  2. BE trả về luôn tất cả thông tin của lastMessage này
  3. Thiếu hiển thị người nào nhắn cuối
  lastMessage: 
  */

  // Realtime notificate??
  // Click vào thì tắt hết thông báo hiện tại

  return (
    <>
      {/* LIST - Scrollable, takes remaining space */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1 p-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation: SidebarItemResponse) => {
              //Chưa có lastMessage
              const lastMessage = conversation.lastMessage?.content || 'Không có tin nhắn'
              const displayTime = conversation.lastMessageAtUtc
                ? formatMessageTime(conversation.lastMessageAtUtc)
                : 'Không xác định'

              return (
                <ConversationItem
                  id={conversation.id}
                  type={conversation.type}
                  name={conversation.name}
                  time={displayTime}
                  message={lastMessage}
                  avatarSrc={conversation.avatarUrl}
                  unreadCount={conversation.unreadCount || 0}
                  isActive={activeConversationId === conversation.conversationId}
                  isOnline={conversation.isOnline}
                  onClick={() => onConversationSelect(conversation.conversationId)}
                />
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              <Search className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm">Không tìm thấy hội thoại</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
