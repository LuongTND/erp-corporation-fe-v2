/**
 * useMessages Hook
 * Custom hook để fetch & manage messages trong một conversation
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { chatService } from '../services/chat.service'
import type { SendMessagePayload, UpdateMessagePayload } from '../types/chat.types'

export function useMessages(conversationId: string | null) {
  const queryClient = useQueryClient()

  // Fetch messages
  const messagesQuery = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () =>
      conversationId
        ? chatService.getMessages(conversationId, { skip: 0, take: 50 })
        : Promise.resolve(null),
    enabled: !!conversationId,
    staleTime: 1000 * 30, // 30 seconds
  })

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      chatService.sendMessage(payload),
    onSuccess: () => {
      // Invalidate & refetch messages
      queryClient.invalidateQueries({
        queryKey: ['messages', conversationId],
      })
    },
  })

  // Update message mutation
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateMessagePayload) =>
      chatService.updateMessage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages', conversationId],
      })
    },
  })

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: (messageId: string) =>
      chatService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages', conversationId],
      })
    },
  })

  return {
    messages: messagesQuery.data?.data ?? [],
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    // Mutations
    sendMessage: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,
    updateMessage: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteMessage: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}
