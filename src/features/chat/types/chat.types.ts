/**
 * Chat Feature Types
 * Định nghĩa tất cả types liên quan đến chat
 */

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: User
  content: string
  timestamp: Date
  attachments?: Attachment[]
  isEdited: boolean
  reactions?: Reaction[]
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

export interface Reaction {
  emoji: string
  users: string[]
}

export interface Conversation {
  id: string
  title: string
  type: 'direct' | 'group'
  participants: User[]
  lastMessage?: Message
  lastMessageTime?: Date
  unreadCount: number
  avatar?: string
}

export interface SendMessagePayload {
  conversationId: string
  content: string
  attachments?: File[]
}

export interface UpdateMessagePayload {
  messageId: string
  conversationId: string
  content: string
}
