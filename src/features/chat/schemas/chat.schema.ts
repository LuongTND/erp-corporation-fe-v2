/**
 * Schema validation cho chat forms
 */

import { z } from 'zod'

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  content: z.string().min(1, 'Message content is required').max(1000),
})

export const createConversationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  participantIds: z.array(z.string()).min(1, 'At least one participant is required'),
})

export type SendMessageSchemaType = z.infer<typeof sendMessageSchema>
export type CreateConversationSchemaType = z.infer<typeof createConversationSchema>
