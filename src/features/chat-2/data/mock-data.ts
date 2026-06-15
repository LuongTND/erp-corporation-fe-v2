// ──────────────────────────────────────────────────────────────
// Mock Data cho Chat-2 Feature
// ──────────────────────────────────────────────────────────────
// Dữ liệu giả lập để phát triển và demo UI mà không cần backend.

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'file'
  reactions?: { emoji: string; userId: string }[]
  replyTo?: string
}

export interface ChatConversation {
  id: string
  name: string
  type: 'direct' | 'group'
  participants: string[]
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  avatar?: string
}

// ──────────────────────────────────────────────────────────────
// Mock Users
// ──────────────────────────────────────────────────────────────

export const MOCK_USERS: ChatUser[] = [
  { id: 'u1', name: 'Nguyễn Văn Anh', status: 'online' },
  { id: 'u2', name: 'Trần Thị Bảo', status: 'online' },
  { id: 'u3', name: 'Lê Minh Cường', status: 'away' },
  { id: 'u4', name: 'Phạm Hoàng Duy', status: 'offline' },
  { id: 'u5', name: 'Võ Thị Em', status: 'online' },
  { id: 'current', name: 'Tôi', status: 'online' },
]

// ──────────────────────────────────────────────────────────────
// Mock Conversations
// ──────────────────────────────────────────────────────────────

export const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    name: 'Nhóm Phát Triển',
    type: 'group',
    participants: ['u1', 'u2', 'u3', 'current'],
    lastMessage: 'Sprint review lúc 3h chiều nhé!',
    lastMessageTime: '2025-05-20T07:30:00Z',
    unreadCount: 3,
  },
  {
    id: 'conv-2',
    name: 'Trần Thị Bảo',
    type: 'direct',
    participants: ['u2', 'current'],
    lastMessage: 'Anh check lại API login giúp em nhé',
    lastMessageTime: '2025-05-20T06:45:00Z',
    unreadCount: 1,
  },
  {
    id: 'conv-3',
    name: 'Quản Lý Dự Án',
    type: 'group',
    participants: ['u1', 'u4', 'u5', 'current'],
    lastMessage: 'Deadline tuần này là thứ 6',
    lastMessageTime: '2025-05-19T15:00:00Z',
    unreadCount: 0,
  },
  {
    id: 'conv-4',
    name: 'Lê Minh Cường',
    type: 'direct',
    participants: ['u3', 'current'],
    lastMessage: 'OK em sẽ deploy lên staging',
    lastMessageTime: '2025-05-19T10:20:00Z',
    unreadCount: 0,
  },
  {
    id: 'conv-5',
    name: 'Phạm Hoàng Duy',
    type: 'direct',
    participants: ['u4', 'current'],
    lastMessage: 'Design mới update rồi anh ơi',
    lastMessageTime: '2025-05-18T16:30:00Z',
    unreadCount: 5,
  },
]

// ──────────────────────────────────────────────────────────────
// Mock Messages (cho conversation "Nhóm Phát Triển")
// ──────────────────────────────────────────────────────────────

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'u1',
    content: 'Chào mọi người, sprint mới bắt đầu rồi nhé!',
    timestamp: '2025-05-20T07:00:00Z',
    type: 'text',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'u2',
    content: 'Em đã update task trên board rồi ạ',
    timestamp: '2025-05-20T07:05:00Z',
    type: 'text',
    reactions: [{ emoji: '👍', userId: 'u1' }],
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'current',
    content: 'Mình sẽ hoàn thành phần auth trong tuần này',
    timestamp: '2025-05-20T07:10:00Z',
    type: 'text',
    reactions: [
      { emoji: '🔥', userId: 'u1' },
      { emoji: '💪', userId: 'u2' },
    ],
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: 'u3',
    content: 'API cho phần chat đã deploy lên dev server. Mọi người test giúp nhé!',
    timestamp: '2025-05-20T07:15:00Z',
    type: 'text',
  },
  {
    id: 'msg-5',
    conversationId: 'conv-1',
    senderId: 'u2',
    content: 'Sprint review lúc 3h chiều nhé!',
    timestamp: '2025-05-20T07:30:00Z',
    type: 'text',
    reactions: [
      { emoji: '✅', userId: 'current' },
      { emoji: '✅', userId: 'u1' },
      { emoji: '✅', userId: 'u3' },
    ],
  },
]

// ──────────────────────────────────────────────────────────────
// Helper Functions
// ──────────────────────────────────────────────────────────────

/** Lấy user theo ID */
export const getUserById = (id: string): ChatUser | undefined =>
  MOCK_USERS.find((u) => u.id === id)

/** Lấy messages theo conversation ID */
export const getMessagesByConversation = (conversationId: string): ChatMessage[] =>
  MOCK_MESSAGES.filter((m) => m.conversationId === conversationId)

/** Lấy tên hiển thị cho conversation */
export const getConversationDisplayName = (conv: ChatConversation): string => {
  if (conv.type === 'group') return conv.name
  const otherId = conv.participants.find((id) => id !== 'current')
  return getUserById(otherId || '')?.name || conv.name
}
