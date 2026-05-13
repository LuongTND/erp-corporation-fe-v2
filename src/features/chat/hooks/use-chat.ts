/**
 * useChat Hook
 * Custom hook để fetch danh sách conversations
 * Sử dụng React Query để cache & sync dữ liệu
 */

import { useQuery } from '@tanstack/react-query'
import { chatService } from '../services/chat.service'

export function useChat() {
  // Fetch tất cả conversations
  const conversationsQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatService.getConversations(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Fetch single conversation
  const getConversation = (id: string) =>
    useQuery({
      queryKey: ['conversation', id],
      queryFn: () => chatService.getConversationById(id),
      enabled: !!id,
      staleTime: 1000 * 60, // 1 minute
    })

  return {
    conversations: conversationsQuery.data?.data ?? [],
    isLoading: conversationsQuery.isLoading,
    isError: conversationsQuery.isError,
    error: conversationsQuery.error,
    getConversation,
  }
}
