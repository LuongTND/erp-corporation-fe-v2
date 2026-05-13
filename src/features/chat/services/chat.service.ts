/**
 * Chat Service
 * Xử lý tất cả API calls liên quan đến chat
 * Pattern: RESTful API calls qua axios
 */

import axios from '@/lib/axios'
import type {
  Conversation,
  Message,
  SendMessagePayload,
  UpdateMessagePayload,
} from '../types/chat.types'

const API_BASE = '/api/chat'

export const chatService = {
  // Conversations
  getConversations: () =>
    axios.get<Conversation[]>(`${API_BASE}/conversations`),

  getConversationById: (id: string) =>
    axios.get<Conversation>(`${API_BASE}/conversations/${id}`),

  createConversation: (data: { title: string; participantIds: string[] }) =>
    axios.post<Conversation>(`${API_BASE}/conversations`, data),

  // Messages
  getMessages: (conversationId: string, pagination?: { skip: number; take: number }) =>
    axios.get<Message[]>(`${API_BASE}/conversations/${conversationId}/messages`, {
      params: pagination,
    }),

  sendMessage: (payload: SendMessagePayload) =>
    axios.post<Message>(`${API_BASE}/messages`, payload),

  updateMessage: (payload: UpdateMessagePayload) =>
    axios.put<Message>(`${API_BASE}/messages/${payload.messageId}`, {
      content: payload.content,
    }),

  deleteMessage: (messageId: string) =>
    axios.delete(`${API_BASE}/messages/${messageId}`),

  // Reactions
  addReaction: (messageId: string, emoji: string) =>
    axios.post(`${API_BASE}/messages/${messageId}/reactions`, { emoji }),

  removeReaction: (messageId: string, emoji: string) =>
    axios.delete(`${API_BASE}/messages/${messageId}/reactions/${emoji}`),

  // Search
  searchMessages: (conversationId: string, query: string) =>
    axios.get<Message[]>(`${API_BASE}/conversations/${conversationId}/search`, {
      params: { q: query },
    }),
}
